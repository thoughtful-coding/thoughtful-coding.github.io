// src/components/sections/MultipleChoiceSection.tsx
import React, { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {
  MultipleChoiceSectionData,
  UnitId,
  LessonId,
  CourseId,
} from "../../types/data";
import styles from "./Section.module.css";
import { useQuizLogic } from "../../hooks/useQuizLogic";
import ContentRenderer from "../content_blocks/ContentRenderer";

interface MultipleChoiceSectionProps {
  section: MultipleChoiceSectionData;
  unitId: UnitId;
  lessonId: LessonId;
  courseId: CourseId;
  lessonPath: string;
}

const MultipleChoiceSection: React.FC<MultipleChoiceSectionProps> = ({
  section,
  unitId,
  lessonId,
  courseId,
  lessonPath,
}) => {
  const {
    selectedIndices,
    isSubmitted,
    isCorrect,
    isLocallyDisabled,
    remainingPenaltyTime,
    // isSectionComplete, // You can use this if needed for UI changes
    handleOptionChange,
    handleSubmit,
    handleTryAgain,
    canTryAgain,
  } = useQuizLogic({
    unitId,
    lessonId,
    section,
    isMultiSelect: false, // Explicitly false for multiple choice
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

  const selectedOption = selectedIndices.length > 0 ? selectedIndices[0] : null;

  // Click handler for the div/label to toggle the radio input
  const handleQuizOptionClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isSubmitted || isLocallyDisabled) return;

      if (
        event.target instanceof HTMLInputElement &&
        event.target.type === "radio"
      ) {
        return; // Let the input's own onChange handle it
      }
      const inputElement = event.currentTarget.querySelector(
        'input[type="radio"]'
      );
      if (inputElement) {
        const radioInput = inputElement as HTMLInputElement;
        const optionIndex = parseInt(radioInput.value, 10);
        handleOptionChange(optionIndex); // Call the hook's handler
      }
    },
    [isSubmitted, isLocallyDisabled, handleOptionChange]
  );

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
      <div className={styles.content}>
        <ContentRenderer content={section.content} courseId={courseId} lessonPath={lessonPath} />
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
            aria-checked={selectedOption === index}
            role="radio"
            tabIndex={isSubmitted || isLocallyDisabled ? -1 : 0}
          >
            <label
              htmlFor={`${section.id}-option-${index}`}
              className={styles.quizOptionLabel}
            >
              <input
                type="radio"
                name={section.id}
                value={index}
                id={`${section.id}-option-${index}`}
                checked={selectedOption === index}
                onChange={() => handleOptionChange(index)} // Call hook's handler
                disabled={isSubmitted || isLocallyDisabled}
                tabIndex={-1}
              />
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                disallowedElements={["p"]}
                unwrapDisallowed={true}
              >
                {option}
              </ReactMarkdown>
            </label>
          </div>
        ))}

        {!isSubmitted && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedOption === null || isLocallyDisabled}
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

export default MultipleChoiceSection;
