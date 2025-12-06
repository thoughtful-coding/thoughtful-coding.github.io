import React from "react";
import type { TestingSectionData, UnitId, LessonId, CourseId } from "../../types/data";
import styles from "./Section.module.css";
import ContentRenderer from "../content_blocks/ContentRenderer";
import CodeEditor from "../CodeEditor";
import { useDraftCode } from "../../hooks/useDraftCode";
import { useTestableSection } from "../../hooks/useTestableSection";
import { TestResultsArea } from "./TestResultsDisplay";
import LoadingSpinner from "../LoadingSpinner";

interface TestingSectionProps {
  section: TestingSectionData;
  unitId: UnitId;
  lessonId: LessonId;
  courseId: CourseId;
  lessonPath: string;
}

const TestingSection: React.FC<TestingSectionProps> = ({
  section,
  unitId,
  lessonId,
  courseId,
  lessonPath,
}) => {
  // Persistent draft code management
  const [code, setCode] = useDraftCode(
    unitId,
    lessonId,
    section.id,
    section.example.initialCode
  );

  // Shared testable section logic
  const {
    lastAction,
    handleRunCode,
    isRunningCode,
    runOutput,
    runError,
    handleRunTests,
    isRunningTests,
    testResults,
    testError,
    turtleCanvasRef,
    isVisualTurtleTest,
    resolvedTestCases,
    isRunningTurtle,
    turtleRunError,
    stopExecution,
    isLoading,
    isSectionComplete,
  } = useTestableSection({
    unitId,
    lessonId,
    sectionId: section.id,
    visualization: section.example.visualization,
    testCases: section.testCases,
    testMode: section.testMode,
    functionToTest: section.functionToTest,
    visualThreshold: section.visualThreshold,
    courseId,
    lessonPath,
    libraryCode: section.example.libraryCode,
  });

  return (
    <section id={section.id} className={styles.section}>
      <h2 className={styles.title}>{section.title}</h2>
      <div className={styles.content}>
        <ContentRenderer content={section.content} courseId={courseId} lessonPath={lessonPath} />
      </div>

      <div className={styles.exampleContainer}>
        <div className={styles.editorArea}>
          <h4>Your Solution:</h4>
          <CodeEditor
            value={code}
            onChange={setCode}
            readOnly={isLoading}
            minHeight="200px"
            data-testid={`code-editor-${section.id}`}
          />
          <div className={styles.editorControls}>
            <button
              onClick={() => handleRunCode(code)}
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
              onClick={() => handleRunTests(code)}
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

        {isLoading && !isVisualTurtleTest && (
          <LoadingSpinner message="Executing..." />
        )}

        <TestResultsArea
          lastAction={lastAction}
          runOutput={runOutput}
          runError={runError}
          testResults={testResults}
          testError={testError}
          isVisualTurtleTest={isVisualTurtleTest}
          turtleRunError={turtleRunError}
          turtleCanvasRef={turtleCanvasRef}
          resolvedTestCases={resolvedTestCases}
          isRunningTests={isRunningTests}
          visualThreshold={section.visualThreshold || 0.95}
          lessonPath={lessonPath}
        />
      </div>

      {/* Completion message */}
      {isSectionComplete && (
        <div className={styles.completionMessage}>
          All tests passed! Your solution correctly handles all test cases.
        </div>
      )}
    </section>
  );
};

export default TestingSection;
