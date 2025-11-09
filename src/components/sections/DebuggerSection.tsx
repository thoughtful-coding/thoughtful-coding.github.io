import React, { useState, useEffect, useRef } from "react";
import CodeEditor from "../CodeEditor";
import styles from "./DebuggerSection.module.css";
import sectionStyles from "./Section.module.css";
import type { DebuggerSectionData, UnitId, LessonId } from "../../types/data";
import ContentRenderer from "../content_blocks/ContentRenderer";
import { useDebuggerLogic } from "../../hooks/useDebuggerLogic";
import { useProgressActions } from "../../stores/progressStore";

interface DebuggerSectionProps {
  section: DebuggerSectionData;
  unitId: UnitId;
  lessonId: LessonId;
}

const DebuggerSection: React.FC<DebuggerSectionProps> = ({
  section,
  unitId,
  lessonId,
}) => {
  const [userCode, setUserCode] = useState<string>(section.example.initialCode);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [breakpoints, setBreakpoints] = useState<Set<number>>(new Set());
  const codeDisplayRef = useRef<HTMLDivElement>(null);

  const { runAndTrace, trace, isLoading, error } = useDebuggerLogic();
  const { completeSection } = useProgressActions();

  const simulationActive = trace?.success && trace.steps.length > 0;

  useEffect(() => {
    // Reset state when the section or its initial code changes
    setUserCode(section.example.initialCode);
    setCurrentStepIndex(-1);
    setBreakpoints(new Set());
  }, [section.id, section.example.initialCode]);

  const handleRunAndTrace = () => {
    runAndTrace(userCode).then((newTrace) => {
      if (newTrace?.success && newTrace.steps.length > 0) {
        setCurrentStepIndex(0);
      }
    });
  };

  const handleContinue = () => {
    if (!trace || currentStepIndex >= trace.steps.length - 1) return;
    const nextBreakpoint = trace.steps.findIndex(
      (step, i) => i > currentStepIndex && breakpoints.has(step.line_number)
    );
    setCurrentStepIndex(
      nextBreakpoint !== -1 ? nextBreakpoint : trace.steps.length - 1
    );
  };

  const handleStepInto = () => {
    if (trace && currentStepIndex < trace.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleStepOver = () => {
    if (!trace || currentStepIndex >= trace.steps.length - 1) return;
    const currentDepth = trace.steps[currentStepIndex].stack_depth;
    const nextStep = trace.steps.findIndex(
      (step, i) => i > currentStepIndex && step.stack_depth <= currentDepth
    );
    setCurrentStepIndex(nextStep !== -1 ? nextStep : trace.steps.length - 1);
  };

  const handleStepOut = () => {
    if (!trace || currentStepIndex >= trace.steps.length - 1) return;
    const currentDepth = trace.steps[currentStepIndex].stack_depth;
    if (currentDepth === 0) {
      setCurrentStepIndex(trace.steps.length - 1);
      return;
    }
    const nextStep = trace.steps.findIndex(
      (step, i) => i > currentStepIndex && step.stack_depth < currentDepth
    );
    setCurrentStepIndex(nextStep !== -1 ? nextStep : trace.steps.length - 1);
  };

  const handleRestart = () => {
    if (trace) setCurrentStepIndex(0);
  };

  const toggleBreakpoint = (lineNumber: number) => {
    setBreakpoints((prev) => {
      const newBreakpoints = new Set(prev);
      if (newBreakpoints.has(lineNumber)) newBreakpoints.delete(lineNumber);
      else newBreakpoints.add(lineNumber);
      return newBreakpoints;
    });
  };

  const currentStep = trace?.steps?.[currentStepIndex];

  useEffect(() => {
    // This is the corrected block. We explicitly check if currentStep exists.
    if (
      simulationActive &&
      currentStep &&
      currentStep.line_number > 0 &&
      codeDisplayRef.current
    ) {
      const lineElement = codeDisplayRef.current.querySelector(
        `#code-line-${currentStep.line_number}`
      );
      lineElement?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentStepIndex, simulationActive, currentStep]);

  // Mark section as complete when user reaches the end of the trace
  useEffect(() => {
    if (
      trace &&
      trace.steps.length > 0 &&
      currentStepIndex === trace.steps.length - 1
    ) {
      completeSection(unitId, lessonId, section.id);
    }
  }, [currentStepIndex, trace, completeSection, unitId, lessonId, section.id]);

  return (
    <section id={section.id} className={sectionStyles.section}>
      <h2 className={sectionStyles.title}>{section.title}</h2>
      <div className={sectionStyles.content}>
        <ContentRenderer content={section.content} />
      </div>

      <div className={styles.editorContainer}>
        <CodeEditor
          value={userCode}
          onChange={setUserCode}
          readOnly={isLoading || simulationActive}
        />
      </div>

      <div className={styles.controls}>
        {!simulationActive ? (
          <button
            onClick={handleRunAndTrace}
            disabled={isLoading}
            className={styles.runButton}
          >
            {isLoading ? "Entering Debug Mode..." : "Enter Debug Mode"}
          </button>
        ) : section.advancedControls ? (
          <>
            <button
              onClick={handleContinue}
              disabled={
                !currentStep ||
                currentStepIndex >= (trace?.steps.length ?? 0) - 1
              }
              className={styles.continueButton}
              title="Continue to next breakpoint"
            >
              Continue
            </button>
            <button
              onClick={handleStepOver}
              disabled={
                !currentStep ||
                currentStepIndex >= (trace?.steps.length ?? 0) - 1
              }
              className={styles.stepOverButton}
              title="Step Over"
            >
              Step Over
            </button>
            <button
              onClick={handleStepInto}
              disabled={
                !currentStep ||
                currentStepIndex >= (trace?.steps.length ?? 0) - 1
              }
              className={styles.stepIntoButton}
              title="Step Into"
            >
              Step Into
            </button>
            <button
              onClick={handleStepOut}
              disabled={
                !currentStep ||
                currentStepIndex >= (trace?.steps.length ?? 0) - 1 ||
                currentStep.stack_depth === 0
              }
              className={styles.stepOutButton}
              title="Step Out"
            >
              Step Out
            </button>
            <button
              onClick={handleRestart}
              className={styles.restartButton}
              title="Restart Simulation"
            >
              Restart
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setCurrentStepIndex((prev) => prev - 1)}
              disabled={currentStepIndex <= 0}
              className={styles.stepButton}
            >
              &larr; Prev Step
            </button>
            <button
              onClick={() => setCurrentStepIndex((prev) => prev + 1)}
              disabled={
                !currentStep ||
                currentStepIndex >= (trace?.steps.length ?? 0) - 1
              }
              className={styles.stepButton}
            >
              Next Step &rarr;
            </button>
          </>
        )}
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <strong>Error:</strong>
          <pre>{error}</pre>
        </div>
      )}

      {simulationActive && currentStep && (
        <div className={styles.simulationArea}>
          <div>
            <div className={styles.currentStepInfo}>
              Line:{" "}
              {currentStep.line_number > 0 ? currentStep.line_number : "N/A"}
            </div>
            <div className={styles.variablesDisplay}>
              <h4>Variables</h4>
              <pre>
                {Object.entries(currentStep.variables).map(([key, val]) => (
                  <span
                    key={key}
                    className={
                      currentStep.changed_variables.includes(key)
                        ? styles.variableChanged
                        : ""
                    }
                  >
                    {`${key}: ${val}\n`}
                  </span>
                ))}
              </pre>
            </div>
            <div className={styles.programOutputDisplay}>
              <h4>Program Output</h4>
              <pre>{currentStep.stdout || ""}</pre>
            </div>
          </div>
          <div className={styles.simulationCodeDisplay} ref={codeDisplayRef}>
            <h4>Code Execution</h4>
            {userCode.split("\n").map((line, index) => (
              <div
                key={index}
                id={`code-line-${index + 1}`}
                className={`${styles.codeLine} ${
                  currentStep.line_number === index + 1
                    ? styles.highlightedLine
                    : ""
                }`}
              >
                <div
                  className={styles.lineNumberGutter}
                  onClick={() => toggleBreakpoint(index + 1)}
                  title={`Toggle breakpoint on line ${index + 1}`}
                >
                  {breakpoints.has(index + 1) && (
                    <span className={styles.breakpointIndicator}></span>
                  )}
                  {index + 1}
                </div>
                <div className={styles.codeContent}>{line || "\u00A0"}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default DebuggerSection;
