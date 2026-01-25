// src/components/LessonNavigation.tsx
import React from "react";
import { NavLink } from "react-router-dom";
// Import the new CSS Module
import styles from "./LessonNavigation.module.css";
import { LessonPath, CourseId } from "../types/data";

interface LessonNavigationProps {
  courseId: CourseId;
  prevLessonPath: LessonPath | null;
  nextLessonPath: LessonPath | null;
  currentPosition: number;
  totalInUnit: number;
}

const LessonNavigation: React.FC<LessonNavigationProps> = ({
  courseId,
  prevLessonPath,
  nextLessonPath,
  currentPosition,
  totalInUnit,
}) => {
  // Strip courseId prefix from lesson paths since it's already in the URL
  const stripCourseIdPrefix = (path: LessonPath | null): string | null => {
    if (!path) return null;
    return path.startsWith(`${courseId}/`)
      ? path.slice(`${courseId}/`.length)
      : path;
  };

  const prevPath = stripCourseIdPrefix(prevLessonPath);
  const nextPath = stripCourseIdPrefix(nextLessonPath);

  // Helper to get link classes (including disabled state)
  const getNavLinkClass = (isTargetAvailable: boolean): string => {
    let classes = styles.navLink;
    if (!isTargetAvailable) {
      classes += ` ${styles.navLinkDisabled}`;
    }
    return classes;
  };

  if (totalInUnit <= 0) {
    return null;
  }

  return (
    // Use the container class from the new CSS module
    <div className={styles.navigationContainer}>
      {prevPath ? (
        <NavLink
          to={`/${courseId}/lesson/${prevPath}`}
          className={getNavLinkClass(true)}
          aria-label="Previous Lesson"
        >
          &larr; Previous
        </NavLink>
      ) : (
        // Use span for non-link disabled elements
        <span className={getNavLinkClass(false)}>&larr; Previous</span>
      )}

      <span className={styles.lessonCurrentIndicator}>
        Lesson {currentPosition} of {totalInUnit}
      </span>

      {nextPath ? (
        <NavLink
          to={`/${courseId}/lesson/${nextPath}`}
          className={getNavLinkClass(true)}
          aria-label="Next Lesson"
        >
          Next &rarr;
        </NavLink>
      ) : (
        <span className={getNavLinkClass(false)}>Next &rarr;</span>
      )}
    </div>
  );
};

export default LessonNavigation;
