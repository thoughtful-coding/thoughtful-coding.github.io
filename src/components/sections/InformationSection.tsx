import React from "react";
import type { InformationSectionData } from "../../types/data";
import styles from "./Section.module.css";
import ContentRenderer from "../content_blocks/ContentRenderer";

interface InformationSectionProps {
  section: InformationSectionData;
  lessonPath: string;
}

const InformationSection: React.FC<InformationSectionProps> = ({
  section,
  lessonPath,
}) => {
  return (
    <section id={section.id} className={styles.section}>
      <h2 className={styles.title}>{section.title}</h2>
      <div className={styles.content}>
        <ContentRenderer content={section.content} lessonPath={lessonPath} />
      </div>
    </section>
  );
};

export default InformationSection;
