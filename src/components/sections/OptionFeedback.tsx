import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./Section.module.css";
import type { OptionFeedbackEntry } from "../../lib/quizFeedback";

const REASON_LABEL: Record<OptionFeedbackEntry["reason"], string> = {
  chose: "You chose:",
  missed: "You missed:",
};

interface OptionFeedbackProps {
  entries: OptionFeedbackEntry[];
  testId: string;
}

/**
 * Explanations for the options a learner got wrong. The authored string
 * describes the option itself, so the label supplies whether it was wrongly
 * picked or wrongly left out.
 */
const OptionFeedback: React.FC<OptionFeedbackProps> = ({ entries, testId }) => {
  if (entries.length === 0) return null;
  return (
    <ul className={styles.optionFeedbackList} data-testid={testId}>
      {entries.map((entry) => (
        <li
          key={entry.index}
          className={styles.optionFeedbackItem}
          data-reason={entry.reason}
        >
          <span className={styles.optionFeedbackLabel}>
            {REASON_LABEL[entry.reason]}
          </span>{" "}
          <span className={styles.optionFeedbackOption}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              disallowedElements={["p"]}
              unwrapDisallowed={true}
            >
              {entry.text}
            </ReactMarkdown>
          </span>{" "}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            disallowedElements={["p"]}
            unwrapDisallowed={true}
          >
            {entry.feedback}
          </ReactMarkdown>
        </li>
      ))}
    </ul>
  );
};

export default OptionFeedback;
