// src/components/LessonSidebar.tsx
import React from "react";
import type { LessonSection, SectionId } from "../types/data";
import styles from "./LessonSidebar.module.css";

interface LessonSidebarProps {
  sections: LessonSection[];
  completedSections: Set<SectionId>;
  informationSections: Set<SectionId>;
}

const LessonSidebar: React.FC<LessonSidebarProps> = ({
  sections,
  completedSections,
  informationSections,
}) => {
  const handleLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    // Prevent default jump
    event.preventDefault();
    // Find target element
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      // Smooth scroll
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update URL hash to make the link shareable
      window.history.pushState(null, "", `#${sectionId}`);
    }
  };

  if (!sections || sections.length === 0) {
    return (
      <aside className={styles.sidebar}>
        <h3 className={styles.title}>In This Lesson</h3>
        <p className={styles.loading}>Loading sections...</p>
      </aside>
    );
  }

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.title}>In This Lesson</h3>
      <ul className={styles.sectionList}>
        {sections.map((section) => {
          const isCompleted = completedSections.has(section.id);
          const isInformation = informationSections.has(section.id);

          let itemClass = `${styles.sectionItem} ${styles.sectionItemToBeDone}`;
          if (isInformation) {
            itemClass = `${styles.sectionItem} ${styles.sectionItemInfo}`;
          } else if (isCompleted) {
            itemClass = `${styles.sectionItem} ${styles.sectionItemCompleted}`;
          }

          return (
            <li
              key={section.id}
              className={itemClass}
              data-section-id={section.id}
            >
              <a
                href={`#${section.id}`}
                className={styles.sectionLink}
                // Add onClick for optional smooth scrolling later
                onClick={(e) => handleLinkClick(e, section.id)}
              >
                {section.title}
              </a>
            </li>
          );
        })}
      </ul>
      {/* Placeholder for Progress Saved notification - could be added here or managed globally */}
      {/* <div id="progress-saved-indicator"></div> */}
    </aside>
  );
};

export default LessonSidebar;
