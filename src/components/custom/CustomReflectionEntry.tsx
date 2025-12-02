// Custom Reflection Entry: Standalone reflection not tied to any lesson
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "../sections/Section.module.css";
import CodeEditor from "../CodeEditor";
import { useAuthStore } from "../../stores/authStore";
import LoadingSpinner from "../LoadingSpinner";
import { useReflectionWorkflow } from "../../hooks/useReflectionWorkflow";
import { CUSTOM_REFLECTION_LESSON_ID } from "../../types/customReflections";
import { useProgressActions } from "../../stores/progressStore";

interface CustomReflectionEntryProps {
  onSuccess?: () => void;
}

const CustomReflectionEntry: React.FC<CustomReflectionEntryProps> = ({
  onSuccess,
}) => {
  const { isAuthenticated } = useAuthStore();
  const { getCurrentCustomReflectionId, clearCustomReflectionDraft } =
    useProgressActions();

  // Get current custom reflection draft ID from store (user-specific)
  // Use useState to freeze the ID for this component instance
  const [currentSectionId] = React.useState(() =>
    getCurrentCustomReflectionId()
  );

  // Use shared reflection workflow with unique sectionId
  const reflection = useReflectionWorkflow({
    lessonId: CUSTOM_REFLECTION_LESSON_ID,
    sectionId: currentSectionId,
    isTopicPredefined: false,
    isCodePredefined: false,
    isExplanationPredefined: false,
    defaultTopic: "",
    defaultCode: "# Your code example here\n",
    defaultExplanation: "",
    onFinalSubmit: () => {
      // Clear draft and generate new ID for next custom reflection
      clearCustomReflectionDraft();
      if (onSuccess) {
        onSuccess();
      }
    },
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

  if (!isAuthenticated) {
    return (
      <div className={styles.section}>
        <p className={styles.infoMessage}>
          Please log in to create custom reflection entries.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Create Custom Reflection Entry</h3>
      <p className={styles.infoMessage}>
        Use this to create standalone reflections not tied to any specific
        lesson. These will appear in your Learning Entries journal.
      </p>

      <div className={styles.reflectionContainer}>
        {/* Input Fields for Topic, Code, Explanation */}
        <div className={styles.reflectionInputGroup}>
          <label htmlFor="custom-topic" className={styles.reflectionLabel}>
            Title of Journal Entry
          </label>
          <input
            type="text"
            id="custom-topic"
            className={styles.topicInput}
            value={currentTopic}
            onChange={(e) => setCurrentTopic(e.target.value)}
            readOnly={isLoading}
            placeholder="Enter a title for your reflection..."
          />
        </div>

        <div className={styles.reflectionInputGroup}>
          <label className={styles.reflectionLabel}>
            Simple code example that demonstrates this topic
          </label>
          <div className={styles.reflectionCodeEditorWrapper}>
            <CodeEditor
              value={currentCode}
              onChange={setCurrentCode}
              readOnly={isLoading}
              minHeight="150px"
            />
          </div>
        </div>

        <div className={styles.reflectionInputGroup}>
          <label
            htmlFor="custom-explanation"
            className={styles.reflectionLabel}
          >
            Explanation
          </label>
          <textarea
            id="custom-explanation"
            className={styles.reflectionExplanation}
            value={currentExplanation}
            onChange={(e) => setCurrentExplanation(e.target.value)}
            readOnly={isLoading}
            placeholder="Explain your understanding of this topic..."
            rows={4}
          />
        </div>

        <div className={styles.reflectionButtons}>
          <button
            onClick={handleGetFeedback}
            disabled={isLoading || !canAttemptInteraction}
            className={styles.reflectionFeedbackBtn}
            title={
              !canAttemptInteraction
                ? "Please fill in all fields"
                : "Get AI feedback"
            }
          >
            {isLoading && !submitError ? "Processing..." : "Get Feedback"}
          </button>
          <button
            onClick={handleFinalSubmit}
            disabled={
              isLoading || !canAttemptInteraction || !canSubmitToJournal
            }
            className={styles.reflectionSubmitBtn}
            title={
              !canAttemptInteraction
                ? "Please fill in all fields"
                : !canSubmitToJournal
                  ? "Get qualifying AI feedback first ('achieves' or 'mostly')"
                  : "Submit to Journal"
            }
          >
            {isLoading && !submitError ? "Submitting..." : "Submit to Journal"}
          </button>
        </div>
        {submitError && <p className={styles.apiError}>{submitError}</p>}

        <div className={styles.reflectionHistory}>
          <h4>Feedback History</h4>
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
    </div>
  );
};

export default CustomReflectionEntry;
