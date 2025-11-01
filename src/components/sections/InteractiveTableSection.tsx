import React, { useMemo, useEffect } from "react";
import type {
  CoverageSectionData,
  PredictionSectionData,
  InputParam,
  LessonId,
  UnitId,
  SavedCoverageState,
  SavedPredictionState,
} from "../../types/data";
import styles from "./Section.module.css";
import tableStyles from "./CoverageSection.module.css";
import { useInteractiveTableLogic } from "../../hooks/useInteractiveTableLogic";
import CodeEditor from "../CodeEditor";
import BaseSectionWrapper from "./BaseSectionWrapper";
import { useProgressActions } from "../../stores/progressStore";

type InteractiveTableSectionProps =
  | {
      mode: "coverage";
      section: CoverageSectionData;
      unitId: UnitId;
      lessonId: LessonId;
    }
  | {
      mode: "prediction";
      section: PredictionSectionData;
      unitId: UnitId;
      lessonId: LessonId;
    };

/**
 * Unified component for Coverage and Prediction sections.
 * These section types share the same interactive table structure and logic,
 * differing only in:
 * - Coverage: User fills inputs to match expected outputs
 * - Prediction: User predicts outputs for given inputs
 */
const InteractiveTableSection: React.FC<InteractiveTableSectionProps> = (
  props
) => {
  const { mode, section, unitId, lessonId } = props;
  const { completeSection } = useProgressActions();

  // Get the table data based on mode
  const tableData =
    mode === "coverage"
      ? (section as CoverageSectionData).coverageTable
      : (section as PredictionSectionData).predictionTable;

  const {
    savedState,
    runningStates,
    rowReadyStates,
    isLoading,
    pyodideError,
    handleUserInputChange,
    runRow,
  } = useInteractiveTableLogic({
    unitId,
    lessonId,
    sectionId: section.id,
    mode,
    testMode: section.testMode,
    functionCode: section.example.initialCode,
    functionToTest: section.functionToTest,
    columns: tableData.columns,
    rows: tableData.rows,
  });

  // Get the state data based on mode
  const stateData =
    mode === "coverage"
      ? (savedState as SavedCoverageState).challengeStates
      : (savedState as SavedPredictionState).predictions;

  const completedCount = useMemo(() => {
    return Object.values(stateData).filter((s) => s.isCorrect).length;
  }, [stateData]);

  const totalChallenges = tableData.rows.length;
  const progressPercent =
    totalChallenges > 0 ? (completedCount / totalChallenges) * 100 : 0;

  const isComplete = totalChallenges > 0 && completedCount === totalChallenges;

  useEffect(() => {
    if (isComplete) {
      completeSection(unitId, lessonId, section.id);
    }
  }, [isComplete, unitId, lessonId, section.id, completeSection]);

  // Instruction text based on mode
  const instructionText =
    mode === "coverage"
      ? 'For each "Expected Output" below, fill in the input fields and click "Run" to see if the code produces that exact output.'
      : 'For each row of inputs below, predict what the code will output and enter it in the "Your Prediction" column.';

  // Progress text based on mode
  const progressText =
    mode === "coverage"
      ? `${completedCount} / ${totalChallenges} challenges completed`
      : `${completedCount} / ${totalChallenges} predictions correct`;

  return (
    <BaseSectionWrapper
      sectionId={section.id}
      title={section.title}
      content={section.content}
    >
      <div className={tableStyles.coverageCodeDisplayContainer}>
        <div className={styles.exampleContainer}>
          <h4 className={tableStyles.coverageCodeDisplayTitle}>
            Code to Analyze:
          </h4>
          <CodeEditor
            value={section.example.initialCode}
            onChange={() => {}}
            readOnly={true}
            minHeight="50px"
          />
          <div className={tableStyles.coverageInstruction}>
            <p>{instructionText}</p>
          </div>

          <div className={tableStyles.coverageTableContainer}>
            <table className={tableStyles.coverageTable}>
              <thead>
                <tr>
                  {mode === "coverage" ? (
                    // Coverage mode: Input columns are editable
                    <>
                      {tableData.columns.map((param) => (
                        <th key={param.variableName}>
                          Input: {param.variableName}
                        </th>
                      ))}
                      <th>Expected Output</th>
                      <th>Actual Output</th>
                      <th>Action</th>
                    </>
                  ) : (
                    // Prediction mode: Input columns are read-only display
                    <>
                      {tableData.columns.map((col, index) => (
                        <th key={index}>{col.variableName}</th>
                      ))}
                      <th>Your Prediction</th>
                      <th>Actual Output</th>
                      <th>Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {mode === "coverage"
                  ? // Coverage mode: render editable input cells
                    (section as CoverageSectionData).coverageTable.rows.map(
                      (challenge, rowIndex) => {
                        const state = stateData[rowIndex];
                        const isRunning = runningStates[rowIndex] || false;
                        const rowClass =
                          state?.isCorrect === true
                            ? tableStyles.correctRow
                            : state?.isCorrect === false
                              ? tableStyles.incorrectRow
                              : "";

                        return (
                          <tr key={rowIndex} className={rowClass}>
                            {tableData.columns.map((param: InputParam) => {
                              const isFixed =
                                challenge.fixedInputs[param.variableName] !==
                                undefined;
                              const inputClass = isFixed
                                ? `${tableStyles.coverageInput} ${tableStyles.fixedInput}`
                                : tableStyles.coverageInput;

                              return (
                                <td key={param.variableName}>
                                  {param.variableType === "boolean" ? (
                                    <select
                                      className={inputClass}
                                      value={
                                        state?.inputs[param.variableName] ?? ""
                                      }
                                      onChange={(e) =>
                                        handleUserInputChange(
                                          rowIndex,
                                          e.target.value,
                                          param.variableName
                                        )
                                      }
                                      disabled={
                                        isRunning || isLoading || isFixed
                                      }
                                    >
                                      <option value="">Select...</option>
                                      <option value="True">True</option>
                                      <option value="False">False</option>
                                    </select>
                                  ) : (
                                    <input
                                      type={
                                        param.variableType === "number"
                                          ? "number"
                                          : "text"
                                      }
                                      className={inputClass}
                                      value={
                                        state?.inputs[param.variableName] ?? ""
                                      }
                                      onChange={(e) =>
                                        handleUserInputChange(
                                          rowIndex,
                                          e.target.value,
                                          param.variableName
                                        )
                                      }
                                      disabled={
                                        isRunning || isLoading || isFixed
                                      }
                                      readOnly={isFixed}
                                    />
                                  )}
                                </td>
                              );
                            })}
                            <td className={tableStyles.expectedOutputCell}>
                              <pre>{challenge.expectedOutput}</pre>
                            </td>
                            <td
                              className={`${tableStyles.actualOutputCell} ${
                                state?.isCorrect === false
                                  ? tableStyles.incorrect
                                  : ""
                              }`}
                            >
                              <pre>{state?.actualOutput ?? ""}</pre>
                            </td>
                            <td className={tableStyles.actionCell}>
                              <button
                                onClick={() => runRow(rowIndex)}
                                disabled={
                                  isRunning ||
                                  isLoading ||
                                  !!pyodideError ||
                                  !rowReadyStates[rowIndex]
                                }
                                className={tableStyles.coverageRunButton}
                              >
                                {isRunning ? "Running..." : "Run"}
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    )
                  : // Prediction mode: render fixed input display + prediction input
                    (section as PredictionSectionData).predictionTable.rows.map(
                      (row, rowIndex) => {
                        const rowState = stateData[rowIndex];
                        const isRunning = runningStates[rowIndex];
                        const rowClass =
                          rowState?.isCorrect === true
                            ? tableStyles.correctRow
                            : rowState?.isCorrect === false
                              ? tableStyles.incorrectRow
                              : "";

                        return (
                          <tr key={rowIndex} className={rowClass}>
                            {row.inputs.map((inputVal, inputIndex) => (
                              <td key={`input-${inputIndex}`}>
                                {String(inputVal)}
                              </td>
                            ))}
                            <td>
                              <input
                                type="text"
                                className={tableStyles.coverageInput}
                                value={rowState?.userAnswer ?? ""}
                                onChange={(e) =>
                                  handleUserInputChange(
                                    rowIndex,
                                    e.target.value
                                  )
                                }
                                placeholder="Predict the output"
                                disabled={isRunning || isLoading}
                              />
                            </td>
                            <td
                              className={`${tableStyles.actualOutputCell} ${
                                rowState?.isCorrect === false
                                  ? tableStyles.incorrect
                                  : ""
                              }`}
                            >
                              <pre>{rowState?.actualOutput ?? " "}</pre>
                            </td>
                            <td className={tableStyles.actionCell}>
                              <button
                                onClick={() => runRow(rowIndex)}
                                disabled={
                                  isRunning ||
                                  isLoading ||
                                  !!pyodideError ||
                                  !rowReadyStates[rowIndex]
                                }
                                className={tableStyles.coverageRunButton}
                              >
                                {isRunning ? "Running..." : "Run"}
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    )}
              </tbody>
            </table>
          </div>

          <div className={tableStyles.coverageProgress}>
            <div className={styles.progressBar}>
              <div
                className={
                  isComplete ? styles.progressFillComplete : styles.progressFill
                }
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>{progressText}</span>
          </div>
        </div>
      </div>
    </BaseSectionWrapper>
  );
};

export default InteractiveTableSection;
