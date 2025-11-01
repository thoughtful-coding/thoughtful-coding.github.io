import React from "react";
import { Link } from "react-router-dom"; // Use Link for navigation
import type { InstructorStudentInfo } from "../../types/apiServiceTypes";
import styles from "./InstructorViews.module.css";

interface ReviewByStudentViewProps {
  permittedStudents: InstructorStudentInfo[];
}

const ReviewByStudentView: React.FC<ReviewByStudentViewProps> = ({
  permittedStudents,
}) => {
  // This component now ONLY returns the list.
  // The logic for showing the detail view is now handled by the router in InstructorDashboardPage.
  return (
    <div className={styles.viewContainer}>
      <h3>Review by Student</h3>
      <p>
        Select a student to view their detailed progress and submissions across
        the curriculum.
      </p>

      <div
        className={styles.assignmentListContainer}
        style={{ maxHeight: "60vh" }}
      >
        <ul className={styles.assignmentList}>
          {permittedStudents.map((student) => (
            <li key={student.studentId} className={styles.assignmentListItem}>
              <Link
                to={`/python/instructor-dashboard/students/${student.studentId}`}
                className={styles.studentLink}
                style={{ display: "block", textDecoration: "none" }}
              >
                <span className={styles.assignmentTitle}>
                  {student.studentName || student.studentId}
                </span>
                <span className={styles.assignmentMeta}>
                  {student.studentEmail}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {permittedStudents.length === 0 && (
        <p className={styles.placeholderMessage}>
          No students are currently assigned to you.
        </p>
      )}
    </div>
  );
};

export default ReviewByStudentView;
