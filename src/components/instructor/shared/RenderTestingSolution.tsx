import React from "react";
import type { SectionId } from "../../../types/data";
import styles from "../InstructorViews.module.css";
import { Link } from "react-router-dom";
import { StoredFirstSolutionItem } from "../../../types/apiServiceTypes";
import { getLessonPathSync } from "../../../lib/dataLoader";

interface RenderTestingSolutionProps {
  submission: StoredFirstSolutionItem;
  lessonTitle: string;
  sectionId: SectionId;
}

const RenderTestingSolution: React.FC<RenderTestingSolutionProps> = ({
  submission,
  lessonTitle,
  sectionId,
}) => {
  // Use the new sync function to get the correct path
  const lessonPath = getLessonPathSync(submission.lessonId);
  const lessonLinkPath = lessonPath ? `/python/lesson/${lessonPath}` : "#";

  // Format the submitted timestamp
  const submittedDate = new Date(submission.submittedAt).toLocaleString();

  return (
    <div className={styles.submissionDetailCard}>
      <h4>
        Lesson/Section: {lessonTitle} / {sectionId}
      </h4>
      <div>
        <Link
          to={lessonLinkPath}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contextLink}
          title={lessonPath ? "View original lesson" : "Lesson path not found"}
        >
          View Original Section in Lesson
        </Link>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <h5>First Correct Solution:</h5>
        <div className={styles.infoEntry}>
          <strong>Submitted At:</strong>
          <span className={styles.infoText}> {submittedDate}</span>
        </div>
        <div className={styles.infoEntry}>
          <strong>Student's Code:</strong>
          <pre className={styles.codeBlock}>
            <code>{submission.solution}</code>
          </pre>
        </div>
        <div className={styles.infoEntry}>
          <p className={styles.infoText} style={{ fontStyle: "italic" }}>
            This is the student's first successful solution for this Testing
            section, saved for academic integrity auditing and identifying
            misconceptions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RenderTestingSolution;
