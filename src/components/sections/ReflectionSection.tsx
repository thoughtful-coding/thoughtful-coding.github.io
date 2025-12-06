// src/components/sections/ReflectionSection.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {
  ReflectionSectionData,
  LessonId,
  UnitId,
  CourseId,
} from "../../types/data";
import styles from "./Section.module.css";
import CodeEditor from "../CodeEditor";
import { useAuthStore } from "../../stores/authStore";
import {
  useProgressActions,
  useProgressStore,
} from "../../stores/progressStore";
import LoadingSpinner from "../LoadingSpinner";
import ContentRenderer from "../content_blocks/ContentRenderer";
import { useReflectionWorkflow } from "../../hooks/useReflectionWorkflow";

interface ReflectionSectionProps {
  section: ReflectionSectionData;
  unitId: UnitId;
  lessonId: LessonId;
  courseId: CourseId;
  lessonPath: string;
}

const ReflectionSection: React.FC<ReflectionSectionProps> = ({
  section,
  unitId,
  lessonId,
  courseId,
  lessonPath,
}) => {
  const { id: sectionId, title } = section;
  const { isTopicPredefined, isCodePredefined, isExplanationPredefined } =
    section;

  const { isAuthenticated } = useAuthStore();
  const { completeSection } = useProgressActions();
  const isSectionMarkedCompleteInStore = useProgressStore((state) =>
    state.actions.isSectionComplete(unitId, lessonId, sectionId)
  );

  // Use shared reflection workflow hook
  const reflection = useReflectionWorkflow({
    lessonId,
    sectionId,
    isTopicPredefined,
    isCodePredefined,
    isExplanationPredefined,
    defaultTopic: section.topic,
    defaultCode: section.code,
    defaultExplanation: section.explanation,
    extraContext: section.extraContext,
    onFinalSubmit: () => completeSection(unitId, lessonId, sectionId, 1),
  });

  const {
    currentTopic,
    setCurrentTopic,
    currentCode,
    setCurrentCode,
    currentExplanation,
    setCurrentExplanation,
    draftHistory,
    isLoading,
    isLoadingHistory,
    fetchError,
    submitError,
    handleGetFeedback,
    handleFinalSubmit,
    canAttemptInteraction,
    canSubmitToJournal,
  } = reflection;

  const formatDate = (timestamp: string | undefined): string =>
    timestamp ? new Date(timestamp).toLocaleString() : "N/A";

  const getTopicNameForDisplay = (topicValue: string | undefined): string => {
    if (!topicValue || !topicValue.trim()) return "Untitled Entry";
    const trimmedTopic = topicValue.trim();
    return trimmedTopic.charAt(0).toUpperCase() + trimmedTopic.slice(1);
  };

  return (
    <section id={sectionId} className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.content}>
        <ContentRenderer
          content={section.content}
          courseId={courseId}
          lessonPath={lessonPath}
        />
      </div>

      <div className={styles.reflectionContainer}>
        {/* Input Fields for Topic, Code, Explanation */}
        <div className={styles.reflectionInputGroup}>
          <label
            htmlFor={`${sectionId}-topic`}
            className={styles.reflectionLabel}
          >
            Title of Journal Entry
          </label>
          <input
            type="text"
            id={`${sectionId}-topic`}
            className={styles.topicInput}
            value={currentTopic}
            onChange={
              isTopicPredefined
                ? undefined
                : (e) => setCurrentTopic(e.target.value)
            }
            readOnly={isTopicPredefined || isLoading}
            placeholder={isTopicPredefined ? undefined : section.topic}
          />
        </div>

        <div className={styles.reflectionInputGroup}>
          <label className={styles.reflectionLabel}>
            Simple code example that demonstrates this topic
          </label>
          <div className={styles.reflectionCodeEditorWrapper}>
            <CodeEditor
              value={currentCode}
              onChange={isCodePredefined ? () => {} : setCurrentCode}
              readOnly={isLoading || isCodePredefined}
              minHeight="150px"
            />
          </div>
        </div>

        <div className={styles.reflectionInputGroup}>
          <label
            htmlFor={`${sectionId}-explanation`}
            className={styles.reflectionLabel}
          >
            Explanation
          </label>
          <textarea
            id={`${sectionId}-explanation`}
            className={styles.reflectionExplanation}
            value={currentExplanation}
            onChange={
              isExplanationPredefined
                ? undefined
                : (e) => setCurrentExplanation(e.target.value)
            }
            readOnly={isLoading || isExplanationPredefined}
            placeholder={
              isExplanationPredefined ? undefined : section.explanation
            }
            rows={4}
          />
        </div>

        <div className={styles.reflectionButtons}>
          <button
            onClick={handleGetFeedback}
            disabled={isLoading || !canAttemptInteraction || !isAuthenticated}
            className={styles.reflectionFeedbackBtn}
            title={
              !canAttemptInteraction
                ? "Please fill in all fields"
                : !isAuthenticated
                  ? "Please log in"
                  : "Get AI feedback"
            }
          >
            {isLoading && !submitError
              ? "Processing..."
              : !isAuthenticated
                ? "Please Log In to Get AI Feedback"
                : "Get Feedback"}
          </button>
          <button
            onClick={handleFinalSubmit}
            disabled={
              isLoading ||
              !canAttemptInteraction ||
              !canSubmitToJournal ||
              !isAuthenticated ||
              isSectionMarkedCompleteInStore
            }
            className={styles.reflectionSubmitBtn}
            title={
              !isAuthenticated
                ? "Please log in"
                : !canAttemptInteraction
                  ? "Please fill in all fields"
                  : !canSubmitToJournal
                    ? "Get qualifying AI feedback first ('achieves' or 'mostly')"
                    : isSectionMarkedCompleteInStore
                      ? "Section already completed"
                      : "Submit to Journal"
            }
          >
            {isLoading && !submitError
              ? "Submitting..."
              : !isAuthenticated
                ? "Please Log In to Submit to Journal"
                : isSectionMarkedCompleteInStore
                  ? "Submitted ✓"
                  : "Submit to Journal"}
          </button>
        </div>
        {submitError && <p className={styles.apiError}>{submitError}</p>}

        <div className={styles.reflectionHistory}>
          <h4>
            Feedback History{" "}
            {isSectionMarkedCompleteInStore ? "(Section Complete ✓)" : ""}
          </h4>
          {fetchError && (
            <p className={styles.apiError} style={{ textAlign: "center" }}>
              {fetchError}
            </p>
          )}
          {isLoadingHistory && draftHistory.length === 0 && !fetchError && (
            <LoadingSpinner message="Loading history..." size="small" />
          )}
          {!isLoadingHistory && draftHistory.length === 0 && !fetchError && (
            <p className={styles.noHistory}>
              No feedback history yet. Fill out the fields and click "Get
              Feedback".
            </p>
          )}
          {draftHistory.map((entry) => (
            <div
              key={entry.versionId}
              className={`${styles.reflectionCard} ${
                styles[`cardAssessment${entry.aiAssessment || "none"}`] || ""
              }`}
            >
              <div className={styles.reflectionSubmission}>
                <div className={styles.reflectionHeader}>
                  <span className={styles.reflectionDate}>
                    {formatDate(entry.createdAt)}
                  </span>
                  <span
                    className={`${styles.submissionBadge} ${styles.feedbackOnlyBadge}`}
                  >
                    Feedback Cycle
                  </span>
                </div>
                <h5>{getTopicNameForDisplay(entry.userTopic)}</h5>
                <details>
                  <summary>Show Submitted Content & AI Feedback</summary>
                  <div className={styles.reflectionCodeDisplay}>
                    <pre>
                      <code>{entry.userCode}</code>
                    </pre>
                  </div>
                  <div className={styles.reflectionExplanationDisplay}>
                    <p>{entry.userExplanation}</p>
                  </div>
                  {entry.aiFeedback && entry.aiAssessment && (
                    <div className={styles.reflectionResponse}>
                      <h5>AI Feedback ({formatDate(entry.createdAt)}):</h5>
                      {entry.aiAssessment && (
                        <div
                          className={`${styles.assessmentBadge} ${
                            styles[
                              `assessmentBadge${
                                entry.aiAssessment.charAt(0).toUpperCase() +
                                entry.aiAssessment.slice(1)
                              }`
                            ] || ""
                          }`}
                        >
                          AI Assessment:{" "}
                          {entry.aiAssessment.charAt(0).toUpperCase() +
                            entry.aiAssessment.slice(1)}
                        </div>
                      )}
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {entry.aiFeedback}
                      </ReactMarkdown>
                    </div>
                  )}
                </details>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReflectionSection;
