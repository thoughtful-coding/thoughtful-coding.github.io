import React, { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { SectionId, CourseId, ContentBlock } from "../../types/data";
import styles from "./Section.module.css";
import ContentRenderer from "../content_blocks/ContentRenderer";

interface BaseSectionWrapperProps {
  sectionId: SectionId;
  title: string;
  content: ContentBlock[];
  courseId: CourseId;
  lessonPath: string;
  children: ReactNode;
}

/**
 * Base wrapper component for all section types.
 * Provides consistent structure: section element, title, content, and section-specific content.
 */
const BaseSectionWrapper: React.FC<BaseSectionWrapperProps> = ({
  sectionId,
  title,
  content,
  courseId,
  lessonPath,
  children,
}) => {
  return (
    <section id={sectionId} className={styles.section}>
      <h2 className={styles.title}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          disallowedElements={["p"]}
          unwrapDisallowed={true}
        >
          {title}
        </ReactMarkdown>
      </h2>
      <div className={styles.content}>
        <ContentRenderer content={content} courseId={courseId} lessonPath={lessonPath} />
      </div>
      {children}
    </section>
  );
};

export default BaseSectionWrapper;
