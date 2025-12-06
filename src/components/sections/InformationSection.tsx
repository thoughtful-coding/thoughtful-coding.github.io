import React from "react";
import type { InformationSectionData, CourseId } from "../../types/data";
import styles from "./Section.module.css";
import ContentRenderer from "../content_blocks/ContentRenderer";

interface InformationSectionProps {
  section: InformationSectionData;
  courseId: CourseId;
  lessonPath: string;
}

const InformationSection: React.FC<InformationSectionProps> = ({
  section,
  courseId,
  lessonPath,
}) => {
  return (
    <section id={section.id} className={styles.section}>
      <h2 className={styles.title}>{section.title}</h2>
      <div className={styles.content}>
        <ContentRenderer
          content={section.content}
          courseId={courseId}
          lessonPath={lessonPath}
        />
      </div>
    </section>
  );
};

export default InformationSection;
