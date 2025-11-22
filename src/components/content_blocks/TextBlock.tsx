import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TextBlock as TextBlockData } from "../../types/data";
import styles from "./ContentRenderer.module.css";

interface TextBlockProps {
  block: TextBlockData;
}

const TextBlock: React.FC<TextBlockProps> = ({ block }) => {
  return (
    <div className={styles.contentBlock}>
      <ReactMarkdown
        children={block.value}
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      />
    </div>
  );
};

export default TextBlock;
