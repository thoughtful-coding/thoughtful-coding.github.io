import React, { useState } from "react";
import type {
  ObservationSectionData,
  UnitId,
  LessonId,
  CourseId,
} from "../../types/data";
import type { RealTurtleInstance } from "../../lib/turtleRenderer";
import styles from "./Section.module.css";
import ContentRenderer from "../content_blocks/ContentRenderer";
import CodeExecutor from "./CodeExecutor";
import { useImageDownload } from "../../hooks/useImageDownload";

const ObservationSection: React.FC<{
  section: ObservationSectionData;
  unitId: UnitId;
  lessonId: LessonId;
  courseId: CourseId;
  lessonPath: string;
}> = ({ section, unitId, lessonId, courseId, lessonPath }) => {
  const [turtleInstance, setTurtleInstance] =
    useState<RealTurtleInstance | null>(null);

  const { downloadImage } = useImageDownload({
    turtleInstance,
    filename: `turtle-${section.id}.png`,
  });

  const showDownloadButton =
    section.example.visualization === "turtle" &&
    section.example.allowImageDownload === true;

  return (
    <section id={section.id} className={styles.section}>
      <h2 className={styles.title}>{section.title}</h2>

      <div className={styles.content}>
        <ContentRenderer content={section.content} courseId={courseId} lessonPath={lessonPath} />
      </div>

      <div className={styles.exampleContainer}>
        <CodeExecutor
          example={section.example}
          unitId={unitId}
          lessonId={lessonId}
          sectionId={section.id}
          onTurtleInstanceReady={setTurtleInstance}
        />
      </div>

      {showDownloadButton && turtleInstance && (
        <div className={styles.editorControls}>
          <button onClick={downloadImage} className={styles.runButton}>
            Download Image
          </button>
        </div>
      )}
    </section>
  );
};

export default ObservationSection;
