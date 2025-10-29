// src/components/sections/ReflectionSection.tsx
import React, { useState, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {
  ReflectionSectionData,
  AssessmentLevel,
  LessonId,
  UnitId,
} from "../../types/data";
import styles from "./Section.module.css";
import CodeEditor from "../CodeEditor";
import { useAuthStore } from "../../stores/authStore";
import * as apiService from "../../lib/apiService";
import { ApiError } from "../../lib/apiService";
import {
  useProgressActions,
  useProgressStore,
} from "../../stores/progressStore";
import {
  ReflectionInteractionInput,
  ReflectionVersionItem,
} from "../../types/apiServiceTypes";
import LoadingSpinner from "../LoadingSpinner";
import ContentRenderer from "../content_blocks/ContentRenderer";

const QUALIFYING_ASSESSMENTS_FOR_FINAL: AssessmentLevel[] = [
  "achieves",
  "mostly",
];

interface ReflectionSectionProps {
  section: ReflectionSectionData;
  unitId: UnitId;
  lessonId: LessonId;
}

const ReflectionSection: React.FC<ReflectionSectionProps> = ({
  section,
  unitId,
  lessonId,
}) => {
  const { id: sectionId, title } = section;
  const { isTopicPredefined, isCodePredefined, isExplanationPredefined } =
    section;

  const [currentTopic, setCurrentTopic] = useState<string>(() =>
    isTopicPredefined ? section.topic : ""
  );
  const [currentCode, setCurrentCode] = useState<string>(() =>
    isCodePredefined ? section.code : section.code || ""
  );
  const [currentExplanation, setCurrentExplanation] = useState<string>(() =>
    isExplanationPredefined ? section.explanation : ""
  );

  const [draftHistory, setDraftHistory] = useState<ReflectionVersionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // General loading for submit/feedback
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null); // For history fetch errors
  const [submitError, setSubmitError] = useState<string | null>(null); // For submit/feedback errors

  const { isAuthenticated } = useAuthStore();

  const { completeSection } = useProgressActions();
  const isSectionMarkedCompleteInStore = useProgressStore((state) =>
    state.actions.isSectionComplete(unitId, lessonId, sectionId)
  );

  const fetchAndUpdateHistory = useCallback(async () => {
    if (!isAuthenticated || !lessonId || !sectionId) {
      setDraftHistory([]);
      return;
    }
    setIsLoadingHistory(true);
    setFetchError(null);
    try {
      const response = await apiService.getReflectionDraftVersions(
        lessonId,
        sectionId
      );
      const sortedVersions = response.versions.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setDraftHistory(sortedVersions);
    } catch (err) {
      console.error("Failed to fetch reflection draft history:", err);
      if (err instanceof ApiError) {
        setFetchError(
          `Error loading history: ${err.data.message} (Status: ${err.status})`
        );
      } else if (err instanceof Error) {
        setFetchError(`Error loading history: ${err.message}`);
      } else {
        setFetchError("An unknown error occurred while loading history.");
      }
    } finally {
      setIsLoadingHistory(false);
    }
  }, [lessonId, sectionId, isAuthenticated]);

  useEffect(() => {
    fetchAndUpdateHistory();
  }, [fetchAndUpdateHistory]);

  useEffect(() => {
    setCurrentTopic(isTopicPredefined ? section.topic : "");
    setCurrentCode(isCodePredefined ? section.code : section.code || "");
    setCurrentExplanation(isExplanationPredefined ? section.explanation : "");
  }, [
    section.id,
    section.topic,
    section.code,
    section.explanation,
    isTopicPredefined,
    isCodePredefined,
    isExplanationPredefined,
  ]);

  const handleApiError = (err: unknown, defaultMessage: string) => {
    if (err instanceof ApiError) {
      // ApiError includes status and potentially parsed server message
      if (err.status === 429) {
        setSubmitError(
          "You've submitted feedback too frequently. Please wait a moment before trying again."
        );
      } else {
        setSubmitError(err.data.message || err.message);
      }
    } else if (err instanceof Error) {
      setSubmitError(`${defaultMessage}: ${err.message}`);
    } else {
      setSubmitError(`${defaultMessage}: An unknown error occurred.`);
    }
  };

  const handleGetFeedback = useCallback(async () => {
    if (!isAuthenticated) {
      setSubmitError("User not authenticated.");
      return;
    }
    // ... (input validation remains same)
    const finalTopic = (
      isTopicPredefined ? section.topic : currentTopic
    ).trim();
    const finalCode = isCodePredefined ? section.code : currentCode;
    const finalExplanation = (
      isExplanationPredefined ? section.explanation : currentExplanation
    ).trim();

    if (!finalTopic || !finalCode.trim() || !finalExplanation) {
      alert("Please ensure topic, code, and explanation have content.");
      return;
    }

    setIsLoading(true);
    setSubmitError(null);
    const submissionData: ReflectionInteractionInput = {
      userTopic: finalTopic,
      isUserTopicPredefined: isTopicPredefined,
      userCode: finalCode,
      isUserCodePredefined: isCodePredefined,
      userExplanation: finalExplanation,
      isFinal: false,
    };

    try {
      const newDraftEntry = await apiService.submitReflectionInteraction(
        lessonId,
        sectionId,
        submissionData
      );
      setDraftHistory((prevHistory) =>
        [newDraftEntry, ...prevHistory].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
      alert("Feedback received and draft saved!");
    } catch (err) {
      console.error("Error getting AI feedback:", err);
      handleApiError(err, "Failed to get feedback");
    } finally {
      setIsLoading(false);
    }
  }, [
    isAuthenticated,
    lessonId,
    sectionId,
    currentTopic,
    currentCode,
    currentExplanation,
    isTopicPredefined,
    section.topic,
    isCodePredefined,
    section.code,
    isExplanationPredefined,
    section.explanation,
  ]);

  const handleFinalSubmit = useCallback(async () => {
    if (!isAuthenticated) {
      setSubmitError("User not authenticated.");
      return;
    }

    const latestDraft = draftHistory.length > 0 ? draftHistory[0] : null;
    if (
      !latestDraft ||
      !latestDraft.aiAssessment ||
      !QUALIFYING_ASSESSMENTS_FOR_FINAL.includes(latestDraft.aiAssessment)
    ) {
      alert(
        "Please get feedback first, and ensure the latest assessment is 'achieves' or 'mostly' before final submission."
      );
      return;
    }

    const finalTopic = (
      isTopicPredefined ? section.topic : currentTopic
    ).trim();
    const finalCode = isCodePredefined ? section.code : currentCode;
    const finalExplanation = (
      isExplanationPredefined ? section.explanation : currentExplanation
    ).trim();

    if (!finalTopic || !finalCode.trim() || !finalExplanation) {
      alert(
        "Please ensure topic, code, and explanation have content for final submission."
      );
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    const submissionData: ReflectionInteractionInput = {
      userTopic: finalTopic,
      isUserTopicPredefined: section.isTopicPredefined,
      userCode: finalCode,
      isUserCodePredefined: section.isCodePredefined,
      userExplanation: finalExplanation,
      isFinal: true,
      sourceVersionId: latestDraft.versionId,
    };

    try {
      const finalEntryResponse = await apiService.submitReflectionInteraction(
        lessonId,
        sectionId,
        submissionData
      );
      alert(
        `Learning entry on ${finalEntryResponse.userTopic} submitted successfully!`
      );
      completeSection(unitId, lessonId, sectionId);
      fetchAndUpdateHistory();
    } catch (err) {
      console.error("Error submitting final learning entry:", err);
      handleApiError(err, "Failed to submit final entry");
    } finally {
      setIsLoading(false);
    }
  }, [
    isAuthenticated,
    unitId,
    lessonId,
    sectionId,
    draftHistory,
    currentTopic,
    currentCode,
    currentExplanation,
    completeSection,
    fetchAndUpdateHistory,
    isTopicPredefined,
    section.topic,
    isCodePredefined,
    section.code,
    isExplanationPredefined,
    section.explanation,
  ]);

  const canAttemptInteraction =
    (isTopicPredefined || !!currentTopic.trim()) &&
    (isCodePredefined || !!currentCode.trim()) &&
    (isExplanationPredefined || !!currentExplanation.trim());

  const latestAssessment =
    draftHistory.length > 0 ? draftHistory[0].aiAssessment : null;
  const canSubmitToJournal =
    draftHistory.length > 0 &&
    latestAssessment &&
    QUALIFYING_ASSESSMENTS_FOR_FINAL.includes(latestAssessment);

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
        <ContentRenderer content={section.content} />
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
