import React, { useState, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {
  PRIMMSectionData,
  UnitId,
  LessonId,
  AssessmentLevel,
} from "../../types/data";
import styles from "./Section.module.css";
import primmStyles from "./PRIMMSection.module.css";
import ContentRenderer from "../content_blocks/ContentRenderer";
import CodeEditor from "../CodeEditor";
import { useEnhancedPRIMM } from "../../hooks/useEnhancedPRIMM";
import { usePyodide } from "../../contexts/PyodideContext";
import { useTurtleExecution } from "../../hooks/useTurtleExecution";

interface PRIMMSectionProps {
  section: PRIMMSectionData;
  unitId: UnitId;
  lessonId: LessonId;
  lessonPath: string;
}

const PRIMMSection: React.FC<PRIMMSectionProps> = ({
  section,
  unitId,
  lessonId,
  lessonPath,
}) => {
  const {
    state,
    actions,
    isSectionComplete,
    isLoadingAiFeedback,
    aiFeedbackError,
  } = useEnhancedPRIMM({
    unitId,
    lessonId,
    sectionId: section.id,
    exampleId: "main",
    predictPrompt: section.predictPrompt,
  });

  const { runPythonCode, isLoading: isPyodideLoading } = usePyodide();
  const canvasRef = useRef<HTMLDivElement>(null);

  const { runTurtleCode, isLoading: isTurtleLoading } = useTurtleExecution({
    canvasRef,
    unitId,
    lessonId,
    sectionId: section.id,
    autoCompleteOnRun: false,
  });

  const [isRunningCode, setIsRunningCode] = useState(false);
  const isTurtle = section.example.visualization === "turtle";
  const isExecutionEngineBusy = isPyodideLoading || isTurtleLoading;

  const handleRunAndLockPrediction = useCallback(async () => {
    actions.lockPrediction();
    setIsRunningCode(true);

    if (isTurtle) {
      await runTurtleCode(
        section.example.initialCode,
        section.example.libraryCode
      );
      actions.setActualOutput("Turtle drawing was displayed.");
    } else {
      const result = await runPythonCode(
        section.example.initialCode,
        section.example.libraryCode
      );

      // Format output with proper stream ordering
      const parts: string[] = [];
      if (result.stdout) parts.push(result.stdout.trim());
      if (result.stderr) parts.push(result.stderr.trim());
      if (!result.success && result.error) {
        parts.push(`${result.error.type}: ${result.error.message}`);
      }

      const formattedOutput =
        parts.length > 0 ? parts.join("\n") : "No output.";
      actions.setActualOutput(formattedOutput);
    }

    // Execution is finished
    setIsRunningCode(false);
  }, [
    runPythonCode,
    runTurtleCode,
    actions,
    section.example.initialCode,
    isTurtle,
  ]);

  const getAssessmentLabelClass = (
    assessment?: AssessmentLevel | null
  ): string => {
    if (!assessment) return "";
    return (
      primmStyles[
        `assessment${assessment.charAt(0).toUpperCase() + assessment.slice(1)}`
      ] || ""
    );
  };

  const getButtonState = () => {
    const isLoading = isRunningCode || isExecutionEngineBusy;
    if (isLoading) {
      return { text: "Executing...", disabled: true };
    }
    return {
      text: "Run Code",
      disabled: !state.userEnglishPrediction.trim(),
    };
  };
  const { text: buttonText, disabled: isButtonDisabled } = getButtonState();

  return (
    <section id={section.id} className={styles.section}>
      <h2 className={styles.title}>{section.title}</h2>
      <div className={styles.content}>
        <ContentRenderer content={section.content} lessonPath={lessonPath} />
      </div>

      <div className={styles.exampleContainer}>
        <h4>Code to Analyze:</h4>
        <CodeEditor
          value={section.example.initialCode}
          onChange={() => {}}
          readOnly={true}
          minHeight="100px"
        />

        {isTurtle && (
          <div className={primmStyles.infoEntry}>
            <span className={primmStyles.infoLabel}>Turtle Output:</span>
            <div ref={canvasRef} className={styles.turtleCanvasContainer}></div>
          </div>
        )}

        {/* --- PREDICT STEP --- */}
        <div className={primmStyles.stepContainer}>
          <label
            htmlFor={`predict-english-${section.id}`}
            className={primmStyles.inputLabel}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {section.predictPrompt}
            </ReactMarkdown>
          </label>
          <textarea
            id={`predict-english-${section.id}`}
            value={state.userEnglishPrediction}
            onChange={(e) => actions.setUserPrediction(e.target.value)}
            placeholder="In your own words, what will this code do?"
            className={primmStyles.predictionTextarea}
            rows={3}
            disabled={state.isPredictionLocked}
          />
          {!state.actualPyodideOutput && (
            <button
              onClick={handleRunAndLockPrediction}
              disabled={isButtonDisabled}
              className={primmStyles.primmButton}
            >
              {buttonText}
            </button>
          )}
        </div>

        {/* --- POST-RUN DISPLAY & REFLECTION STEP --- */}
        {state.isPredictionLocked &&
          !isRunningCode &&
          state.actualPyodideOutput && (
            <div className={primmStyles.pastAnswersDiv}>
              {!isTurtle && (
                <div className={primmStyles.infoEntry}>
                  <span className={primmStyles.infoLabel}>Actual Output:</span>
                  <pre className={primmStyles.keyOutputText}>
                    {state.actualPyodideOutput}
                  </pre>
                </div>
              )}

              {!isSectionComplete && (
                <div className={primmStyles.infoEntry}>
                  <label
                    htmlFor={`explanation-${section.id}`}
                    className={primmStyles.inputLabel}
                  >
                    Your Reflection/Explanation:
                  </label>
                  <textarea
                    id={`explanation-${section.id}`}
                    value={state.userExplanationText}
                    onChange={(e) => actions.setUserExplanation(e.target.value)}
                    placeholder="Explain the code's behavior and your initial prediction..."
                    className={primmStyles.explanationTextarea}
                    rows={4}
                  />
                  <button
                    onClick={() =>
                      actions.submitForFeedback(section.example.initialCode)
                    }
                    disabled={
                      !state.userExplanationText.trim() || isLoadingAiFeedback
                    }
                    className={primmStyles.getFeedbackButton}
                  >
                    {isLoadingAiFeedback
                      ? "Getting Feedback..."
                      : "Get AI Feedback"}
                  </button>
                </div>
              )}

              {state.aiEvaluationResult && (
                <>
                  <div className={primmStyles.infoEntry}>
                    <span className={primmStyles.infoLabel}>
                      Reflection:
                      <span
                        className={`${
                          primmStyles.assessmentLabel
                        } ${getAssessmentLabelClass(
                          state.aiEvaluationResult.aiExplanationAssessment
                        )}`}
                      >
                        {state.aiEvaluationResult.aiExplanationAssessment?.toUpperCase()}
                      </span>
                    </span>
                    <span className={primmStyles.infoText}>
                      {state.userExplanationText}
                    </span>
                  </div>
                  <div className={primmStyles.infoEntry}>
                    <span className={primmStyles.infoLabel}>
                      AI Overall Comments:
                    </span>
                    <div className={primmStyles.aiCommentText}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {state.aiEvaluationResult.aiOverallComment}
                      </ReactMarkdown>
                    </div>
                  </div>
                </>
              )}
              {aiFeedbackError && (
                <p className={styles.errorMessage}>{aiFeedbackError}</p>
              )}
            </div>
          )}

        {isSectionComplete && (
          <div className={styles.completionMessage}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {section.conclusion}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </section>
  );
};

export default PRIMMSection;
