import React, { useEffect, useRef } from "react";
import type {
  NonCodingReflectionSectionData,
  LessonId,
  UnitId,
  CourseId,
} from "../../types/data";
import styles from "./Section.module.css";
import { useAuthStore } from "../../stores/authStore";
import {
  useProgressActions,
  useProgressStore,
} from "../../stores/progressStore";
import { useSectionProgress } from "../../hooks/useSectionProgress";
import LoadingSpinner from "../LoadingSpinner";
import ContentRenderer from "../content_blocks/ContentRenderer";
import { useReflectionWorkflow } from "../../hooks/useReflectionWorkflow";

interface NonCodingReflectionSectionProps {
  section: NonCodingReflectionSectionData;
  unitId: UnitId;
  lessonId: LessonId;
  courseId: CourseId;
  lessonPath: string;
}

interface DraftState {
  text: string;
}

const NonCodingReflectionSection: React.FC<NonCodingReflectionSectionProps> = ({
  section,
  unitId,
  lessonId,
  courseId,
  lessonPath,
}) => {
  const { id: sectionId, title, topic, minLength } = section;

  const { isAuthenticated } = useAuthStore();
  const { completeSection } = useProgressActions();
  const isSectionMarkedCompleteInStore = useProgressStore((state) =>
    state.actions.isSectionComplete(unitId, lessonId, sectionId)
  );

  const reflection = useReflectionWorkflow({
    lessonId,
    sectionId,
    reflectionKind: "prose",
    isTopicPredefined: true,
    defaultTopic: topic,
    isCodePredefined: true,
    defaultCode: "",
    isExplanationPredefined: false,
    extraContext: section.extraContext,
  });

  const {
    currentExplanation,
    setCurrentExplanation,
    draftHistory,
    isLoading,
    isLoadingHistory,
    fetchError,
    submitError,
    handleGetFeedback,
    handleFinalSubmit,
    canSubmitToJournal,
  } = reflection;

  // Draft text is device-local; the server only sees it once it is submitted.
  const [draft, setDraft] = useSectionProgress<DraftState>(
    unitId,
    lessonId,
    sectionId,
    `nonCodingReflection_${sectionId}`,
    { text: "" },
    () => false
  );

  const hasSeededDraft = useRef(false);
  useEffect(() => {
    if (!hasSeededDraft.current && draft.text) {
      hasSeededDraft.current = true;
      setCurrentExplanation(draft.text);
    }
  }, [draft.text, setCurrentExplanation]);

  // Completion is a submitted reflection, never the model's opinion of it.
  useEffect(() => {
    if (draftHistory.length > 0 && !isSectionMarkedCompleteInStore) {
      completeSection(unitId, lessonId, sectionId, 1);
    }
  }, [
    draftHistory.length,
    isSectionMarkedCompleteInStore,
    completeSection,
    unitId,
    lessonId,
    sectionId,
  ]);

  const handleTextChange = (value: string) => {
    setCurrentExplanation(value);
    setDraft({ text: value });
  };

  const charCount = currentExplanation.trim().length;
  const meetsMinLength = charCount >= minLength;
  const canGetFeedback = meetsMinLength && isAuthenticated && !isLoading;

  const formatDate = (timestamp: string | undefined): string =>
    timestamp ? new Date(timestamp).toLocaleString() : "N/A";

  const latestEntry = draftHistory.length > 0 ? draftHistory[0] : null;

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
        <div className={styles.reflectionInputGroup}>
          <label
            htmlFor={`${sectionId}-explanation`}
            className={styles.reflectionLabel}
          >
            {topic}
          </label>
          <textarea
            id={`${sectionId}-explanation`}
            className={styles.reflectionExplanation}
            value={currentExplanation}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={section.placeholder}
            disabled={isLoading}
            rows={8}
            data-testid={`non-coding-reflection-input-${sectionId}`}
          />
          <p
            className={styles.reflectionCharCount}
            data-testid={`non-coding-reflection-count-${sectionId}`}
          >
            {charCount} / {minLength} characters
            {meetsMinLength ? "" : " — keep going"}
          </p>
        </div>

        <div className={styles.reflectionButtons}>
          <button
            onClick={handleGetFeedback}
            disabled={!canGetFeedback}
            className={styles.reflectionFeedbackBtn}
            title={
              !isAuthenticated
                ? "Please log in"
                : !meetsMinLength
                  ? `Write at least ${minLength} characters`
                  : "Get AI feedback"
            }
            data-testid={`non-coding-reflection-submit-${sectionId}`}
          >
            {isLoading && !submitError
              ? "Processing..."
              : !isAuthenticated
                ? "Please Log In to Get AI Feedback"
                : "Get Feedback"}
          </button>
          <button
            onClick={handleFinalSubmit}
            disabled={!canSubmitToJournal || !isAuthenticated || isLoading}
            className={styles.reflectionSubmitBtn}
            title={
              !isAuthenticated
                ? "Please log in"
                : !canSubmitToJournal
                  ? "Get qualifying AI feedback first ('achieves' or 'mostly')"
                  : "Save to Journal"
            }
            data-testid={`non-coding-reflection-journal-${sectionId}`}
          >
            Save to Journal
          </button>
        </div>

        {submitError && <p className={styles.apiError}>{submitError}</p>}

        <div className={styles.reflectionHistory}>
          <h4>
            Feedback{" "}
            {isSectionMarkedCompleteInStore ? "(Section Complete ✓)" : ""}
          </h4>
          {fetchError && <p className={styles.apiError}>{fetchError}</p>}
          {isLoadingHistory && !latestEntry && !fetchError && (
            <LoadingSpinner message="Loading history..." size="small" />
          )}
          {!isLoadingHistory && !latestEntry && !fetchError && (
            <p className={styles.noHistory}>
              No feedback yet. Write your reflection and click "Get Feedback".
            </p>
          )}
          {draftHistory.map((entry) => (
            <div
              key={entry.versionId}
              className={`${styles.reflectionCard} ${
                styles[`cardAssessment${entry.aiAssessment || "none"}`] || ""
              }`}
            >
              <div className={styles.reflectionHeader}>
                <span className={styles.reflectionDate}>
                  {formatDate(entry.createdAt)}
                </span>
              </div>
              <div className={styles.reflectionExplanationDisplay}>
                <p>{entry.userExplanation}</p>
              </div>
              {entry.aiFeedback && (
                <div className={styles.reflectionResponse}>
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
                  <p>{entry.aiFeedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NonCodingReflectionSection;
