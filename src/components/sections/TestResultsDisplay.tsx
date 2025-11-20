import React from "react";
import type { TestResult } from "../../hooks/useTestingLogic";
import type { TurtleTestResult } from "../../hooks/useTurtleTesting";
import type { TestCase } from "../../types/data";
import type { LastAction } from "../../hooks/useTestableSection";
import { useTurtleTestDisplay } from "../../hooks/useTurtleTestDisplay";
import TurtleTestAccordion from "./TurtleTestAccordion";
import TurtleSideBySideView from "./TurtleSideBySideView";
import TurtleFinalMessage from "./TurtleFinalMessage";
import styles from "./Section.module.css";

// ============================================================================
// Console Test Results Display (table format)
// ============================================================================

interface ConsoleTestResultsProps {
  results: TestResult[];
}

/**
 * Displays console test results in a table format.
 * Used by TestingSection, ParsonsSection, and other testing-related sections.
 */
export const ConsoleTestResults: React.FC<ConsoleTestResultsProps> = ({
  results,
}) => {
  const allPassed = results.every((r) => r.passed);

  return (
    <div className={styles.resultsList}>
      {/* Summary message for failures */}
      {!allPassed && (
        <div className={styles.testFailure} style={{ marginBottom: "1rem" }}>
          <h4>Almost there!</h4>
          <p>Test {results.length} failed. Fix the issue and try again!</p>
        </div>
      )}

      {/* Test results table */}
      <table className={styles.testResultsTable}>
        <thead>
          <tr>
            <th style={{ width: "60px" }}>Test</th>
            <th>Description</th>
            <th style={{ width: "80px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, idx) => (
            <React.Fragment key={idx}>
              <tr
                className={result.passed ? styles.passedRow : styles.failedRow}
              >
                <td style={{ textAlign: "center" }}>{idx + 1}</td>
                <td>{result.description}</td>
                <td style={{ textAlign: "center", fontSize: "1.2em" }}>
                  {result.passed ? "✓" : "✗"}
                </td>
              </tr>
              {/* Expanded details for failed test */}
              {!result.passed && (
                <tr className={styles.failedDetailsRow}>
                  <td colSpan={3}>
                    <div className={styles.failedDetails}>
                      <table className={styles.failedDetailsTable}>
                        <thead>
                          <tr>
                            {result.input && <th>Input</th>}
                            <th>Expected</th>
                            <th>Your Result</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {result.input && (
                              <td>
                                <code>{JSON.stringify(result.input)}</code>
                              </td>
                            )}
                            <td>
                              <code>
                                {Array.isArray(result.expected)
                                  ? result.expected.join("\n")
                                  : typeof result.expected === "string"
                                    ? result.expected
                                    : JSON.stringify(result.expected)}
                              </code>
                            </td>
                            <td>
                              <code>
                                {Array.isArray(result.actual)
                                  ? result.actual.join("\n")
                                  : typeof result.actual === "string"
                                    ? result.actual
                                    : JSON.stringify(result.actual)}
                              </code>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================================================
// Turtle Test Results Display (accordion with side-by-side view)
// ============================================================================

interface TurtleTestResultsProps {
  results: TurtleTestResult[] | null;
  threshold: number;
  testCases: TestCase[];
  turtleCanvasRef: React.RefObject<HTMLDivElement>;
  lessonPath?: string;
  isRunningTests: boolean;
}

/**
 * Displays turtle test results with accordion and side-by-side image comparison.
 * Shows progressive accordion of completed tests and a side-by-side view during execution.
 */
export const TurtleTestResults: React.FC<TurtleTestResultsProps> = ({
  results,
  threshold: _threshold,
  testCases,
  turtleCanvasRef,
  lessonPath,
  isRunningTests,
}) => {
  const {
    visualTestCases,
    testsComplete,
    allPassed,
    showSideBySide,
    displayedTestInfo,
    accordionResults,
  } = useTurtleTestDisplay({
    results,
    testCases,
    isRunningTests,
    lessonPath,
  });

  const getCurrentTestNumber = (): number => {
    if (!displayedTestInfo) return 1;
    if (displayedTestInfo.resultIndex !== null) {
      return displayedTestInfo.resultIndex + 1;
    }
    return results ? results.length + 1 : 1;
  };

  const currentTestNumber = getCurrentTestNumber();
  const showProgressLabel = visualTestCases.length > 1;

  return (
    <div>
      {/* Accordion for tests */}
      <TurtleTestAccordion
        results={accordionResults}
        testsComplete={testsComplete}
      />

      {/* Side-by-side layout - only shown during test execution */}
      {displayedTestInfo && (
        <div style={{ display: showSideBySide ? "block" : "none" }}>
          <TurtleSideBySideView
            referenceImage={displayedTestInfo.referenceImage}
            description={displayedTestInfo.description}
            currentTestNumber={currentTestNumber}
            totalTests={visualTestCases.length}
            turtleCanvasRef={turtleCanvasRef}
            showProgressLabel={showProgressLabel}
          />
        </div>
      )}

      {/* Final message - only show after tests complete */}
      {testsComplete && (
        <TurtleFinalMessage
          allPassed={allPassed}
          totalTests={visualTestCases.length}
          failedTestNumber={results?.length}
        />
      )}
    </div>
  );
};

// ============================================================================
// Test Results Area (full output area with header, errors, and results)
// ============================================================================

interface TestResultsAreaProps {
  lastAction: LastAction;
  // Run output
  runOutput: string;
  runError: Error | null;
  // Test results
  testResults: TestResult[] | TurtleTestResult[] | null;
  testError: string | null;
  // Turtle-specific
  isVisualTurtleTest: boolean;
  turtleRunError: string | null;
  turtleCanvasRef: React.RefObject<HTMLDivElement>;
  resolvedTestCases: TestCase[];
  isRunningTests: boolean;
  visualThreshold: number;
  lessonPath?: string;
}

/**
 * Shared output area component for testable sections.
 * Displays "Output:" header, errors, run output, and test results.
 * Only shows results from the last action (run or test).
 */
export const TestResultsArea: React.FC<TestResultsAreaProps> = ({
  lastAction,
  runOutput,
  runError,
  testResults,
  testError,
  isVisualTurtleTest,
  turtleRunError,
  turtleCanvasRef,
  resolvedTestCases,
  isRunningTests,
  visualThreshold,
  lessonPath,
}) => {
  return (
    <div className={styles.resultsArea}>
      <h4>Output:</h4>

      {/* Error display for visual turtle tests */}
      {isVisualTurtleTest && (turtleRunError || testError) && (
        <div className={styles.errorFeedback}>
          <pre>{turtleRunError || testError}</pre>
        </div>
      )}

      {/* Visual turtle results (canvas shown for both run and test) */}
      {isVisualTurtleTest && (
        <TurtleTestResults
          results={
            lastAction === "test"
              ? (testResults as TurtleTestResult[] | null)
              : null
          }
          threshold={visualThreshold}
          testCases={resolvedTestCases}
          turtleCanvasRef={turtleCanvasRef}
          lessonPath={lessonPath}
          isRunningTests={isRunningTests}
        />
      )}

      {/* Console output for "Run Code" (non-turtle) */}
      {lastAction === "run" &&
        (runOutput || runError) &&
        !isVisualTurtleTest && (
          <div className={styles.outputArea}>
            <pre
              className={`${styles.outputPre} ${
                runError ? styles.errorOutput : ""
              }`}
            >
              {runError ? runError.message : runOutput}
            </pre>
          </div>
        )}

      {/* Console test error display */}
      {lastAction === "test" && testError && !isVisualTurtleTest && (
        <div className={styles.errorFeedback}>
          <pre>{testError}</pre>
        </div>
      )}

      {/* Console test results display */}
      {lastAction === "test" && testResults && !isVisualTurtleTest && (
        <ConsoleTestResults results={testResults as TestResult[]} />
      )}
    </div>
  );
};
