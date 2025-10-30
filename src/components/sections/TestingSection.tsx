import React, { useState, useRef } from "react";
import type { TestingSectionData, UnitId, LessonId } from "../../types/data";
import type { RealTurtleInstance } from "../../lib/turtleRenderer";
import styles from "./Section.module.css";
import ContentRenderer from "../content_blocks/ContentRenderer";
import CodeEditor from "../CodeEditor";
import { useTestingLogic, TestResult } from "../../hooks/useTestingLogic";
import {
  useTurtleTesting,
  TurtleTestResult,
} from "../../hooks/useTurtleTesting";
import { useTurtleExecution } from "../../hooks/useTurtleExecution";
import { useInteractiveExample } from "../../hooks/useInteractiveExample";
import { useDraftCode } from "../../hooks/useDraftCode";
import TurtleTestResults from "./TurtleTestResults";
import LoadingSpinner from "../LoadingSpinner";

interface TestingSectionProps {
  section: TestingSectionData;
  unitId: UnitId;
  lessonId: LessonId;
  lessonPath?: string;
}

// Helper function to resolve relative image paths
const resolveImagePath = (imagePath: string, lessonPath?: string): string => {
  // If path is already absolute (starts with / or http), return as-is
  if (imagePath.startsWith("/") || imagePath.startsWith("http")) {
    return imagePath;
  }

  // Extract unit directory from lesson path (e.g., "07_loops_advanced/lessons/99_test" -> "07_loops_advanced")
  if (lessonPath) {
    const unitDir = lessonPath.split("/")[0];
    return `/thoughtful-python/data/${unitDir}/${imagePath}`;
  }

  // Fallback: return relative path as-is (will likely fail, but better than crashing)
  return imagePath;
};

const TestResultsDisplay: React.FC<{
  results: TestResult[];
  totalTestCases: number;
}> = ({ results, totalTestCases }) => {
  const allPassed = results.every((r) => r.passed);
  const failedTest = results.find((r) => !r.passed);

  return (
    <div className={styles.resultsList}>
      {/* Summary message for failures - shown at top */}
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

      {/* Success message - shown at bottom after table */}
      {allPassed && (
        <div className={styles.testSuccess} style={{ marginTop: "1rem" }}>
          <h4>🎉 All tests passed!</h4>
          <p>Your solution correctly handles all test cases.</p>
        </div>
      )}
    </div>
  );
};

const TestingSection: React.FC<TestingSectionProps> = ({
  section,
  unitId,
  lessonId,
  lessonPath,
}) => {
  // Persistent draft code management
  const [code, setCode] = useDraftCode(
    unitId,
    lessonId,
    section.id,
    section.example.initialCode
  );

  const [lastAction, setLastAction] = useState<"run" | "test" | null>(null);
  const turtleCanvasRef = useRef<HTMLDivElement>(null);
  const [turtleInstance, setTurtleInstance] =
    useState<RealTurtleInstance | null>(null);

  // Detect if this is a visual turtle test
  const isVisualTurtleTest =
    section.example.visualization === "turtle" &&
    section.testCases.some((tc) => tc.referenceImage);

  // Hook for turtle execution (for "Run Code" button on visual turtle tests)
  const {
    runTurtleCode,
    stopExecution,
    isLoading: isRunningTurtle,
    error: turtleRunError,
  } = useTurtleExecution({
    canvasRef: turtleCanvasRef,
    unitId,
    lessonId,
    sectionId: section.id,
    autoCompleteOnRun: false,
    onTurtleInstanceReady: setTurtleInstance,
  });

  // Hook for console-based "Run Code" functionality
  const {
    runCode,
    isLoading: isRunningCode,
    output: runOutput,
    error: runError,
  } = useInteractiveExample({
    unitId,
    lessonId,
    sectionId: section.id,
    autoComplete: false, // Don't auto-complete on run for testing sections
  });

  // Resolve relative image paths in test cases
  const resolvedTestCases = section.testCases.map((tc) => ({
    ...tc,
    referenceImage: tc.referenceImage
      ? resolveImagePath(tc.referenceImage, lessonPath)
      : undefined,
  }));

  // Hook for visual turtle tests
  const turtleTestingHook = useTurtleTesting({
    unitId,
    lessonId,
    sectionId: section.id,
    testCases: resolvedTestCases,
    visualThreshold: section.visualThreshold,
    turtleInstance,
    runTurtleCode,
    functionToTest: section.functionToTest,
  });

  // Hook for regular (console-based) tests
  const regularTestingHook = useTestingLogic({
    unitId,
    lessonId,
    sectionId: section.id,
    testMode: section.testMode,
    functionToTest: section.functionToTest,
    testCases: section.testCases,
  });

  // Use the appropriate testing hook based on test type
  const {
    runTests,
    testResults,
    isLoading: isRunningTests,
    error: testError,
  } = isVisualTurtleTest ? turtleTestingHook : regularTestingHook;

  // Check if tests have passed (only for testing sections)
  const testsHavePassed =
    testResults && testResults.every((result) => result.passed);

  const handleRunCode = () => {
    setLastAction("run");
    if (isVisualTurtleTest) {
      runTurtleCode(code);
    } else {
      runCode(code);
    }
  };

  const handleRunTests = () => {
    setLastAction("test");
    runTests(code);
  };

  const isLoading = isRunningCode || isRunningTests || isRunningTurtle;

  return (
    <section id={section.id} className={styles.section}>
      <h2 className={styles.title}>{section.title}</h2>
      <div className={styles.content}>
        <ContentRenderer content={section.content} />
      </div>

      <div className={styles.exampleContainer}>
        <div className={styles.editorArea}>
          <h4>Your Solution:</h4>
          <CodeEditor
            value={code}
            onChange={setCode}
            readOnly={isLoading}
            minHeight="200px"
          />
          <div className={styles.editorControls}>
            <button
              onClick={handleRunCode}
              disabled={isLoading}
              className={styles.runButton}
            >
              {isVisualTurtleTest && isRunningTurtle
                ? "Executing..."
                : isRunningCode
                  ? "Running..."
                  : "Run Code"}
            </button>
            <button
              onClick={handleRunTests}
              disabled={isLoading}
              className={styles.testButton}
            >
              {isRunningTests ? "Testing..." : "Run Tests"}
            </button>
            {isVisualTurtleTest && (
              <button
                onClick={stopExecution}
                disabled={!isLoading}
                className={styles.runButton}
              >
                Stop
              </button>
            )}
          </div>
        </div>

        <div className={styles.resultsArea}>
          <h4>Output:</h4>
          {isLoading && !isVisualTurtleTest && (
            <LoadingSpinner message="Executing..." />
          )}

          {/* Error display for visual turtle tests - shown ABOVE canvas */}
          {isVisualTurtleTest && (turtleRunError || testError) && (
            <div className={styles.errorFeedback}>
              <pre>{turtleRunError || testError}</pre>
            </div>
          )}

          {/* Side-by-side layout for visual turtle tests */}
          {isVisualTurtleTest && (
            <TurtleTestResults
              results={testResults as TurtleTestResult[] | null}
              threshold={section.visualThreshold || 0.95}
              testCases={resolvedTestCases}
              turtleCanvasRef={turtleCanvasRef}
              lessonPath={lessonPath}
              isRunningTests={isRunningTests}
            />
          )}

          {/* Regular console output for non-turtle tests */}
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

          {lastAction === "test" && testError && !isVisualTurtleTest && (
            <div className={styles.errorFeedback}>
              <pre>{testError}</pre>
            </div>
          )}

          {lastAction === "test" && testResults && !isVisualTurtleTest && (
            <TestResultsDisplay
              results={testResults as TestResult[]}
              totalTestCases={section.testCases.length}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default TestingSection;
