import { useState, useCallback, useMemo } from "react";
import type {
  UnitId,
  LessonId,
  SectionId,
  InputParam,
  CoverageTableRow,
  PredictionTableRow,
  SavedCoverageState,
  SavedPredictionState,
  TestMode,
} from "../types/data";
import { usePyodide } from "../contexts/PyodideContext";
import { useProgressActions } from "../stores/progressStore";
// useSectionProgress is no longer needed

type SectionMode = "coverage" | "prediction";

interface UseInteractiveTableLogicProps {
  unitId: UnitId;
  lessonId: LessonId;
  sectionId: SectionId;
  mode: SectionMode;
  testMode: TestMode;
  functionCode: string;
  functionToTest: string;
  columns: InputParam[];
  rows: (CoverageTableRow | PredictionTableRow)[];
}

type TableState = SavedCoverageState | SavedPredictionState;

export const useInteractiveTableLogic = ({
  unitId,
  lessonId,
  sectionId,
  mode,
  testMode,
  functionCode,
  functionToTest,
  columns,
  rows,
}: UseInteractiveTableLogicProps) => {
  const {
    runPythonCode,
    isLoading: isPyodideLoading,
    error: pyodideError,
  } = usePyodide();
  const { incrementAttemptCounter } = useProgressActions();

  const initialState = useMemo((): TableState => {
    if (mode === "coverage") {
      const initialChallengeStates: SavedCoverageState["challengeStates"] = {};
      rows.forEach((row, rowIndex) => {
        const coverageRow = row as CoverageTableRow;
        const initialInputs: { [paramName: string]: string } = {};

        columns.forEach((param) => {
          // Check if this parameter has a fixed value in the row
          if (coverageRow.fixedInputs[param.variableName] !== undefined) {
            const fixedValue = coverageRow.fixedInputs[param.variableName];
            // For booleans, store as "True" or "False" to match Python/dropdown values
            if (param.variableType === "boolean") {
              initialInputs[param.variableName] = fixedValue ? "True" : "False";
            } else {
              initialInputs[param.variableName] = String(fixedValue);
            }
          } else {
            // Default to empty string for editable inputs
            initialInputs[param.variableName] = "";
          }
        });

        initialChallengeStates[rowIndex] = {
          inputs: initialInputs,
          actualOutput: null,
          isCorrect: null,
        };
      });
      return { challengeStates: initialChallengeStates };
    } else {
      const initialPredictions: SavedPredictionState["predictions"] = {};
      rows.forEach((_, rowIndex) => {
        initialPredictions[rowIndex] = {
          userAnswer: "",
          actualOutput: null,
          isCorrect: null,
        };
      });
      return { predictions: initialPredictions };
    }
  }, [rows, columns, mode]);

  // Replace useSectionProgress with a simple useState
  const [state, setState] = useState<TableState>(initialState);
  const [runningStates, setRunningStates] = useState<{
    [rowIndex: number]: boolean;
  }>({});

  const runRow = useCallback(
    async (rowIndex: number) => {
      setRunningStates((prev) => ({ ...prev, [rowIndex]: true }));

      const row = rows[rowIndex];
      let inputs: any[];
      let userValue: string;

      if (mode === "coverage") {
        const challengeState = (state as SavedCoverageState).challengeStates?.[
          rowIndex
        ];
        inputs = columns.map((col) => {
          const rawValue = challengeState?.inputs?.[col.variableName] || "";
          if (col.variableType === "number") return parseFloat(rawValue) || 0;
          if (col.variableType === "boolean") {
            // Convert string representation to actual boolean
            // Accept "True"/"true"/"1" as true, "False"/"false"/"0" as false
            const lowerValue = rawValue.toString().toLowerCase().trim();
            return lowerValue === "true" || lowerValue === "1";
          }
          return rawValue;
        });
        userValue = (row as CoverageTableRow).expectedOutput;
      } else {
        inputs = (row as PredictionTableRow).inputs;
        userValue =
          (state as SavedPredictionState).predictions?.[rowIndex]?.userAnswer ??
          "";
      }

      let actualOutput: string | null = null;
      let isCorrect = false;

      try {
        const functionCall = `${functionToTest}(${inputs
          .map((val) => {
            // For booleans, use Python's True/False instead of JSON's true/false
            if (typeof val === "boolean") {
              return val ? "True" : "False";
            }
            return JSON.stringify(val);
          })
          .join(", ")})`;

        let script: string;
        if (testMode === "function") {
          // Functions return values - need to print them to capture output
          script = `${functionCode}\n\nprint(${functionCall})`;
        } else {
          // Procedures print internally - just call them
          script = `${functionCode}\n\n${functionCall}`;
        }

        const result = await runPythonCode(script);

        // Format output based on execution result
        if (result.success) {
          actualOutput = result.stdout.trim() || "None";
        } else {
          // Show error message for failed execution
          actualOutput = `Error: ${result.error?.message || "Unknown error"}`;
        }

        // Check correctness: must be successful execution and match user value
        isCorrect = result.success && actualOutput === userValue.trim();
      } catch (err) {
        actualOutput =
          err instanceof Error
            ? `Error: ${err.message}`
            : `Error: ${String(err)}`;
        isCorrect = false;
      } finally {
        // Increment attempt counter if the result is incorrect
        if (!isCorrect) {
          incrementAttemptCounter(unitId, lessonId, sectionId);
        }

        setState((prev) => {
          if (mode === "coverage") {
            const prevStates =
              (prev as SavedCoverageState)?.challengeStates || {};
            return {
              ...prev,
              challengeStates: {
                ...prevStates,
                [rowIndex]: {
                  ...prevStates[rowIndex],
                  actualOutput,
                  isCorrect,
                },
              },
            };
          } else {
            const prevPreds = (prev as SavedPredictionState)?.predictions || {};
            return {
              ...prev,
              predictions: {
                ...prevPreds,
                [rowIndex]: { ...prevPreds[rowIndex], actualOutput, isCorrect },
              },
            };
          }
        });
        setRunningStates((prev) => ({ ...prev, [rowIndex]: false }));
      }
    },
    [
      rows,
      mode,
      state,
      testMode,
      functionToTest,
      functionCode,
      runPythonCode,
      setState,
      columns,
      incrementAttemptCounter,
      unitId,
      lessonId,
      sectionId,
    ]
  );

  const handleUserInputChange = useCallback(
    (rowIndex: number, value: string, paramName?: string) => {
      setState((prevState) => {
        const currentState = prevState || initialState;

        if (mode === "coverage" && paramName) {
          // Defensive check: Skip if this is a fixed input
          const coverageRow = rows[rowIndex] as CoverageTableRow;
          if (coverageRow.fixedInputs[paramName] !== undefined) {
            return prevState;
          }

          const prevCoverageState = currentState as SavedCoverageState;
          const existingStates = prevCoverageState.challengeStates || {};
          const currentRow =
            existingStates[rowIndex] ||
            (initialState as SavedCoverageState).challengeStates[rowIndex];

          return {
            ...prevCoverageState,
            challengeStates: {
              ...existingStates,
              [rowIndex]: {
                ...currentRow,
                inputs: {
                  ...(currentRow.inputs || {}),
                  [paramName]: value,
                },
                actualOutput: null,
                isCorrect: null,
              },
            },
          };
        }

        if (mode === "prediction") {
          const prevPredictionState = currentState as SavedPredictionState;
          const existingPreds = prevPredictionState.predictions || {};
          const currentPred =
            existingPreds[rowIndex] ||
            (initialState as SavedPredictionState).predictions[rowIndex];

          return {
            ...prevPredictionState,
            predictions: {
              ...existingPreds,
              [rowIndex]: {
                ...currentPred,
                userAnswer: value,
                actualOutput: null,
                isCorrect: null,
              },
            },
          };
        }

        return currentState;
      });
    },
    [mode, setState, initialState, rows]
  );

  // Validation: Check if each row is ready to run
  const rowReadyStates = useMemo(() => {
    const readyStates: { [rowIndex: number]: boolean } = {};

    rows.forEach((row, rowIndex) => {
      if (mode === "coverage") {
        const challengeState = (state as SavedCoverageState).challengeStates?.[
          rowIndex
        ];
        if (!challengeState) {
          readyStates[rowIndex] = false;
          return;
        }

        // Check all non-fixed inputs have values
        const coverageRow = row as CoverageTableRow;
        const allInputsFilled = columns.every((param) => {
          // If it's a fixed input, skip validation (it's always filled)
          if (coverageRow.fixedInputs[param.variableName] !== undefined) {
            return true;
          }
          // Check if the input has a non-empty value
          const value = challengeState.inputs?.[param.variableName];
          return value !== undefined && value !== null && value.trim() !== "";
        });

        readyStates[rowIndex] = allInputsFilled;
      } else {
        // Prediction mode: check if user has entered a prediction
        const prediction = (state as SavedPredictionState).predictions?.[
          rowIndex
        ];
        const userAnswer = prediction?.userAnswer ?? "";
        readyStates[rowIndex] = userAnswer.trim() !== "";
      }
    });

    return readyStates;
  }, [mode, state, rows, columns]);

  return {
    savedState: state, // Renamed for consistency in consuming components
    runningStates,
    rowReadyStates, // New: validation states for each row
    isLoading: isPyodideLoading,
    pyodideError,
    handleUserInputChange,
    runRow,
  };
};
