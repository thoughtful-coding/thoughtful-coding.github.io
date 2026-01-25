import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./PhilosophySection.module.css";

interface PhilosophySectionProps {
  children?: React.ReactNode;
  markdown?: string;
}

const PhilosophySection: React.FC<PhilosophySectionProps> = ({
  children,
  markdown,
}) => {
  return (
    <section className={styles.philosophySection}>
      {markdown ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      ) : (
        children
      )}
    </section>
  );
};

export default PhilosophySection;
