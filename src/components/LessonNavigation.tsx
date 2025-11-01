// src/components/LessonNavigation.tsx
import React from "react";
import { NavLink } from "react-router-dom";
// Import the new CSS Module
import styles from "./LessonNavigation.module.css";
import { LessonPath } from "../types/data";

interface LessonNavigationProps {
  prevLessonPath: LessonPath | null;
  nextLessonPath: LessonPath | null;
  currentPosition: number;
  totalInUnit: number;
}

const LessonNavigation: React.FC<LessonNavigationProps> = ({
  // lessonId,
  prevLessonPath,
  nextLessonPath,
  currentPosition,
  totalInUnit,
}) => {
  // Helper to scroll to top when navigating
  const handleNavigation = () => {
    window.scrollTo(0, 0);
  };

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
      {prevLessonPath ? (
        <NavLink
          // Use path relative to basename
          to={`/python/lesson/${prevLessonPath}`}
          className={getNavLinkClass(true)}
          aria-label="Previous Lesson"
          onClick={handleNavigation}
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

      {nextLessonPath ? (
        <NavLink
          // Use path relative to basename
          to={`/python/lesson/${nextLessonPath}`}
          className={getNavLinkClass(true)}
          aria-label="Next Lesson"
          onClick={handleNavigation}
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
