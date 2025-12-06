import React from "react";
import { ImageBlock as ImageBlockData, CourseId } from "../../types/data";
import styles from "./ContentRenderer.module.css";
import { resolveImagePath } from "../../lib/dataHelpers";

interface ImageBlockProps {
  block: ImageBlockData;
  courseId: CourseId;
  lessonPath: string;
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  block,
  courseId,
  lessonPath,
}) => {
  // Resolve image path using the same helper as TurtleTesting
  const imageUrl = resolveImagePath(block.src, courseId, lessonPath);

  const imageStyles: React.CSSProperties = {};
  if (block.maxWidthPercentage) {
    imageStyles.maxWidth = `${block.maxWidthPercentage}%`;
  }

  return (
    <div className={`${styles.contentBlock} ${styles.imageContainer}`}>
      <img
        src={imageUrl}
        alt={block.alt}
        className={styles.image}
        style={imageStyles}
      />
    </div>
  );
};

export default ImageBlock;
