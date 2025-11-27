// src/components/sections/MultipleSelectionSection.tsx
import React, { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {
  LessonId,
  MultipleSelectionSectionData,
  UnitId,
} from "../../types/data";
import styles from "./Section.module.css";
import { useQuizLogic } from "../../hooks/useQuizLogic";
import ContentRenderer from "../content_blocks/ContentRenderer";

interface MultipleSelectionSectionProps {
  section: MultipleSelectionSectionData;
  unitId: UnitId;
  lessonId: LessonId;
  lessonPath: string;
}

const MultipleSelectionSection: React.FC<MultipleSelectionSectionProps> = ({
  section,
  unitId,
  lessonId,
  lessonPath,
}) => {
  const {
    // selectedIndices, // Not directly used, use selectedOptionsSet instead
    isSubmitted,
    isCorrect,
    isLocallyDisabled,
    remainingPenaltyTime,
    // isSectionComplete, // You can use this if needed
    handleOptionChange,
    handleSubmit,
    handleTryAgain,
    canTryAgain,
    selectedOptionsSet, // Get this from the hook
  } = useQuizLogic({
    unitId,
    lessonId,
    section,
    isMultiSelect: true, // Explicitly true for multiple selection
  });

  // Force re-render every second while penalty is active to show countdown
  const [, setTick] = useState(0);
  useEffect(() => {
    if (isLocallyDisabled && remainingPenaltyTime > 0) {
      const interval = setInterval(() => {
        setTick((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLocallyDisabled, remainingPenaltyTime]);

  // Click handler for the div/label to toggle the checkbox
  const handleQuizOptionClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isSubmitted || isLocallyDisabled) return;

      if (
        event.target instanceof HTMLInputElement &&
        event.target.type === "checkbox"
      ) {
        return; // Let the input's own onChange handle it
      }
      const inputElement = event.currentTarget.querySelector(
        'input[type="checkbox"]'
      );
      if (inputElement) {
        const checkboxInput = inputElement as HTMLInputElement;
        const optionIndex = parseInt(checkboxInput.value, 10);
        handleOptionChange(optionIndex); // Call the hook's handler
      }
    },
    [isSubmitted, isLocallyDisabled, handleOptionChange]
  );

  const contentText = section.content
    .filter((block) => block.kind === "text")
    .map((block) => (block as any).value)
    .join(" ")
    .toLowerCase();

  const hasRequiredPhrase = contentText.includes("select");

  return (
    <section id={section.id} className={styles.section}>
      <h2 className={styles.title}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          disallowedElements={["p"]}
          unwrapDisallowed={true}
        >
          {section.title}
        </ReactMarkdown>
      </h2>
      <div
        className={!hasRequiredPhrase ? styles.questionError : styles.content}
      >
        <ContentRenderer content={section.content} lessonPath={lessonPath} />
      </div>

      {isLocallyDisabled && !isCorrect && (
        <div className={styles.penaltyMessageActive}>
          Oops! Time penalty active. Please wait {remainingPenaltyTime} seconds.
        </div>
      )}

      <form
        className={`${styles.quizForm} ${
          isSubmitted ? styles.quizFormSubmitted : ""
        } ${isLocallyDisabled ? styles.penaltyFormDisabled : ""}`}
        onSubmit={(e) => e.preventDefault()}
      >
        {section.options.map((option, index) => (
          <div
            key={index}
            className={`${styles.quizOption} ${
              isSubmitted || isLocallyDisabled ? styles.optionDisabled : ""
            }`}
            onClick={handleQuizOptionClick}
            aria-checked={selectedOptionsSet.has(index)}
            role="checkbox"
            tabIndex={isSubmitted || isLocallyDisabled ? -1 : 0}
          >
            <label
              htmlFor={`${section.id}-option-${index}`}
              className={styles.quizOptionLabel}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                name={`${section.id}-option-${index}`} // Name can be unique per option for multi-select
                value={index}
                id={`${section.id}-option-${index}`}
                checked={selectedOptionsSet.has(index)}
                onChange={() => handleOptionChange(index)} // Call hook's handler
                disabled={isSubmitted || isLocallyDisabled}
                tabIndex={-1}
              />
              <ReactMarkdown
                children={option}
                remarkPlugins={[remarkGfm]}
                // These two props are the solution
                disallowedElements={["p"]}
                unwrapDisallowed={true}
              />
            </label>
          </div>
        ))}

        {!isSubmitted && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedOptionsSet.size === 0 || isLocallyDisabled}
            className={styles.quizSubmitButton}
          >
            Submit Answer
          </button>
        )}
      </form>

      {isSubmitted && (
        <div
          className={
            isCorrect ? styles.correctFeedback : styles.incorrectFeedback
          }
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            disallowedElements={["p"]}
            unwrapDisallowed={true}
          >
            {isCorrect
              ? section.feedback
                ? section.feedback.correct
                : "Correct!"
              : section.feedback
                ? section.feedback.incorrect || "Incorrect!"
                : "Incorrect!"}
          </ReactMarkdown>
        </div>
      )}

      {canTryAgain && (
        <button
          type="button"
          onClick={handleTryAgain}
          className={styles.tryAgainButton}
        >
          Try Again
        </button>
      )}
    </section>
  );
};

export default MultipleSelectionSection;
