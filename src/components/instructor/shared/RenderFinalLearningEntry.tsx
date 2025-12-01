import React from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { AssessmentLevel } from "../../../types/data";
import { ReflectionVersionItem } from "../../../types/apiServiceTypes";
import { getLessonPathSync } from "../../../lib/dataLoader";
import { isCustomReflection } from "../../../types/customReflections";

// Import the consolidated CSS file
import styles from "../InstructorViews.module.css";

interface RenderFinalLearningEntryProps {
  entry: ReflectionVersionItem;
  lessonTitle?: string;
}

const RenderFinalLearningEntry: React.FC<RenderFinalLearningEntryProps> = ({
  entry,
  lessonTitle: _lessonTitle,
}) => {
  const getAssessmentClass = (assessment?: AssessmentLevel | null): string => {
    if (!assessment) return "";
    const capitalized =
      assessment.charAt(0).toUpperCase() + assessment.slice(1);
    return styles[`assessment${capitalized}`] || "";
  };

  const lessonPath = getLessonPathSync(entry.lessonId);
  const lessonLinkPath = lessonPath ? `/lesson/${lessonPath}` : "#";
  const isCustom = isCustomReflection(entry);

  const formatDate = (timestamp: string) =>
    new Date(timestamp).toLocaleString();
  const getTopicNameForDisplay = (topic?: string) =>
    topic?.trim() || "Untitled Entry";

  return (
    <div className={styles.entryCard}>
      <div className={styles.entryHeader}>
        <div className={styles.entryMeta}>
          <span className={styles.entryTopic}>
            {getTopicNameForDisplay(entry.userTopic)}
          </span>
          <span className={styles.entryDate}>
            {formatDate(entry.createdAt)}
          </span>
        </div>
        <span className={styles.entryLesson}>
          {isCustom ? (
            <span title="Custom reflection entry not tied to a lesson">
              Custom Entry
            </span>
          ) : (
            <Link
              to={lessonLinkPath}
              target="_blank"
              rel="noopener noreferrer"
              title={
                lessonPath ? "View original lesson" : "Lesson path not found"
              }
            >
              from section: {entry.sectionId}
            </Link>
          )}
        </span>
      </div>

      <div className={styles.entryContent}>
        {entry.userCode && (
          <div className={styles.entryCode}>
            <h4>Code Example:</h4>
            <pre>
              <code>{entry.userCode}</code>
            </pre>
          </div>
        )}
        <div className={styles.entryExplanation}>
          <h4>Student's Explanation:</h4>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {entry.userExplanation || "(No explanation provided)"}
          </ReactMarkdown>
        </div>
      </div>

      {entry.aiAssessment && (
        <div className={styles.aiFeedbackBlock} style={{ marginTop: "1.5rem" }}>
          <h5>AI Assessment (from qualifying draft):</h5>
          <div className={styles.evaluationItem}>
            <strong>Assessment:</strong>
            <span
              className={`${styles.assessmentLabel} ${getAssessmentClass(
                entry.aiAssessment
              )}`}
            >
              {entry.aiAssessment.toUpperCase()}
            </span>
          </div>
          {entry.aiFeedback && (
            <div
              className={`${styles.evaluationItem} ${styles.aiOverallComment}`}
            >
              <strong>Feedback:</strong>
              <p>
                <em>{entry.aiFeedback}</em>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RenderFinalLearningEntry;
