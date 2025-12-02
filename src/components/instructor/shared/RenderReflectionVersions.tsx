import React from "react";
import type { AssessmentLevel, LessonId, SectionId } from "../../../types/data";
import styles from "../InstructorViews.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import { ReflectionVersionItem } from "../../../types/apiServiceTypes";
import { getLessonPathSync } from "../../../lib/dataLoader";

interface RenderReflectionVersionsProps {
  versions: ReflectionVersionItem[];
  lessonGuid: LessonId;
  sectionId: SectionId;
  // lessonPath?: string; // Optional: if you want to construct links using path instead of GUID directly
}

const RenderReflectionVersions: React.FC<RenderReflectionVersionsProps> = ({
  versions,
  lessonGuid,
  sectionId: _sectionId,
}) => {
  if (!versions || versions.length === 0) {
    return (
      <p className={styles.placeholderMessage}>
        No reflection versions available.
      </p>
    );
  }

  // Sort versions by createdAt: newest first to easily find the latest/final
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const finalOrLatestVersion =
    sortedVersions.find((v) => v.isFinal) || sortedVersions[0];

  // Helper to get assessment class
  const getAssessmentClass = (assessment?: AssessmentLevel | null): string => {
    if (!assessment) return "";
    return (
      styles[
        `assessment${assessment.charAt(0).toUpperCase() + assessment.slice(1)}`
      ] || ""
    );
  };

  const lessonPath = getLessonPathSync(lessonGuid);
  const lessonLinkPath = lessonPath ? `/python/lesson/${lessonPath}` : "#";

  return (
    <div className={styles.submissionDetailCard}>
      {" "}
      {/* Reusing this style for the overall container */}
      <h4>
        Reflection: {finalOrLatestVersion.userTopic || "Untitled Reflection"}
      </h4>
      <Link
        to={lessonLinkPath}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.contextLink}
        title={lessonPath ? "View original lesson" : "Lesson path not found"}
      >
        View Original Section in Lesson
      </Link>
      <div className={styles.iterationsContainer} style={{ marginTop: "1rem" }}>
        <h5>Version History (Newest First):</h5>
        {sortedVersions.map((version, index) => (
          <details
            key={version.versionId}
            className={styles.iterationDetail}
            open={index === 0}
          >
            <summary>
              Version {sortedVersions.length - index} (
              {version.isFinal ? "Final Entry" : "Draft"})
              <span className={styles.versionTimestamp}>
                ({new Date(version.createdAt).toLocaleString()})
              </span>
              {version.aiAssessment && (
                <span
                  className={`${
                    styles.assessmentLabelSmall
                  } ${getAssessmentClass(version.aiAssessment)}`}
                >
                  {version.aiAssessment.toUpperCase()}
                </span>
              )}
            </summary>
            <div className={styles.submissionDetailCard}>
              {/* <p><strong>Submitted:</strong> {new Date(version.createdAt).toLocaleString()}</p> */}
              {version.userTopic &&
                finalOrLatestVersion.userTopic !== version.userTopic && (
                  <p>
                    <strong>Topic for this version:</strong> {version.userTopic}
                  </p>
                )}
              <div>
                <strong>Code:</strong>
                <pre>
                  <code>{version.userCode || "(No code provided)"}</code>
                </pre>
              </div>
              <div>
                <strong>Explanation:</strong>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {version.userExplanation || "(No explanation provided)"}
                </ReactMarkdown>
              </div>

              {version.aiAssessment && (
                <div className={styles.aiFeedbackBlock}>
                  <strong>AI Assessment:</strong>
                  <span
                    className={`${styles.assessmentLabel} ${getAssessmentClass(
                      version.aiAssessment
                    )}`}
                  >
                    {version.aiAssessment.toUpperCase()}
                  </span>
                  {version.aiFeedback && (
                    <p className={styles.feedbackText}>
                      <em>{version.aiFeedback}</em>
                    </p>
                  )}
                </div>
              )}
              {!version.aiAssessment && version.isFinal === false && (
                <p className={styles.feedbackText}>
                  <em>No AI feedback was requested for this draft version.</em>
                </p>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default RenderReflectionVersions;
