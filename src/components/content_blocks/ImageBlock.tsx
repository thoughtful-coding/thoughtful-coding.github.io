import React from "react";
import { ImageBlock as ImageBlockData } from "../../types/data";
import styles from "./ContentRenderer.module.css";
import { resolveImagePath } from "../../lib/dataHelpers";

interface ImageBlockProps {
  block: ImageBlockData;
  lessonPath: string;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ block, lessonPath }) => {
  // Resolve image path using the same helper as TurtleTesting
  const imageUrl = resolveImagePath(block.src, lessonPath);

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
