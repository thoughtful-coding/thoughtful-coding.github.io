import { useState, useCallback } from "react";
import type {
  UnitId,
  LessonId,
  SectionId,
  PredictionTableRow,
  SavedPredictionState,
  TestMode,
} from "../types/data";
import { usePyodide } from "../contexts/PyodideContext";
import { useSectionProgress } from "./useSectionProgress";

interface UsePredictionLogicProps {
  unitId: UnitId;
  lessonId: LessonId;
  sectionId: SectionId;
  testMode: TestMode;
  functionCode: string;
  predictionRows: PredictionTableRow[];
  libraryCode?: string;
}

export const usePredictionLogic = ({
  unitId,
  lessonId,
  sectionId,
  testMode,
  functionCode,
  predictionRows,
  libraryCode,
}: UsePredictionLogicProps) => {
  const {
    runPythonCode,
    isLoading: isPyodideLoading,
    error: pyodideError,
  } = usePyodide();
  const storageKey = `predictionState_${unitId}_${lessonId}_${sectionId}`;

  const checkCompletion = useCallback(
    (state: SavedPredictionState): boolean => {
      if (predictionRows.length === 0) return false;
      return predictionRows.every(
        (_, index) => state.predictions[index]?.isCorrect === true
      );
    },
    [predictionRows]
  );

  const [savedState, setSavedState, isSectionComplete] =
    useSectionProgress<SavedPredictionState>(
      unitId,
      lessonId,
      sectionId,
      storageKey,
      { predictions: {} },
      checkCompletion
    );

  const [runningStates, setRunningStates] = useState<{
    [rowIndex: number]: boolean;
  }>({});

  const handlePredictionChange = useCallback(
    (rowIndex: number, newValue: string) => {
      setSavedState((prev) => ({
        ...prev,
        predictions: {
          ...prev.predictions,
          [rowIndex]: {
            ...(prev.predictions[rowIndex] || {
              isCorrect: null,
              actualOutput: null,
            }),
            userAnswer: newValue,
            isCorrect: null, // Reset correctness on change
            actualOutput: null,
          },
        },
      }));
    },
    [setSavedState]
  );

  const runPrediction = useCallback(
    async (rowIndex: number) => {
      setRunningStates((prev) => ({ ...prev, [rowIndex]: true }));
      const row = predictionRows[rowIndex];
      const userPrediction = savedState.predictions[rowIndex]?.userAnswer ?? "";

      let actualOutput: string | null = null;
      let isCorrect = false;

      try {
        const functionNameMatch = functionCode.match(/def\s+(\w+)/);
        if (!functionNameMatch)
          throw new Error("Could not parse function name.");
        const functionName = functionNameMatch[1];

        const functionCall = `${functionName}(${row.inputs
          .map((val) => JSON.stringify(val))
          .join(", ")})`;

        let script: string;
        if (testMode === "procedure") {
          // For procedures: wrap the function call in print() to capture stdout
          script = `${functionCode}\n\nprint(${functionCall})`;
        } else {
          // For functions: capture return value directly
          script = `${functionCode}\n\n${functionCall}`;
        }

        const result = await runPythonCode(script, libraryCode);

        // Format output based on execution result
        if (result.success) {
          actualOutput = result.stdout.trim() || "None";
        } else {
          // Show error message for failed execution
          actualOutput = `Error: ${result.error?.message || "Unknown error"}`;
        }

        // Check correctness: must be successful execution and match prediction
        isCorrect = result.success && actualOutput === userPrediction.trim();
      } catch (err) {
        actualOutput =
          err instanceof Error
            ? `Error: ${err.message}`
            : `Error: ${String(err)}`;
        isCorrect = false;
      } finally {
        setSavedState((prev) => ({
          ...prev,
          predictions: {
            ...prev.predictions,
            [rowIndex]: {
              ...prev.predictions[rowIndex],
              isCorrect,
              actualOutput,
            },
          },
        }));
        setRunningStates((prev) => ({ ...prev, [rowIndex]: false }));
      }
    },
    [
      predictionRows,
      savedState.predictions,
      testMode,
      functionCode,
      runPythonCode,
      setSavedState,
    ]
  );

  return {
    predictions: savedState.predictions,
    isSectionComplete,
    runningStates,
    isLoading: isPyodideLoading,
    pyodideError,
    handlePredictionChange,
    runPrediction,
  };
};
