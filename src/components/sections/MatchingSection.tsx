import React, { useMemo, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { MatchingSectionData, UnitId, LessonId } from "../../types/data";
import { useSectionProgress } from "../../hooks/useSectionProgress";
import { useMatchingInteraction } from "../../hooks/useMatchingInteraction";
import { useProgressActions } from "../../stores/progressStore";
import styles from "./MatchingSection.module.css";
import sectionStyles from "./Section.module.css";
import ContentRenderer from "../content_blocks/ContentRenderer";

interface MatchingSectionProps {
  section: MatchingSectionData;
  unitId: UnitId;
  lessonId: LessonId;
  lessonPath: string;
}

// Define the shape of a draggable option, giving each a unique ID
interface DraggableOption {
  id: string; // A unique ID like 'option-0', 'option-1'
  text: string; // The actual answer text, which can be a duplicate
}

// The state now maps a prompt text to the unique ID of the matched option
interface SavedMatchingState {
  userMatches: { [promptText: string]: string | null };
}

const MatchingSection: React.FC<MatchingSectionProps> = ({
  section,
  unitId,
  lessonId,
  lessonPath,
}) => {
  const storageKey = `matchingState_${unitId}_${lessonId}_${section.id}`;

  // --- Data Derivation ---
  const { prompts, allOptions, solution } = useMemo(() => {
    const prompts = section.prompts.map((p) => Object.keys(p)[0]);
    // Create the master list of options, giving each a unique ID
    const allOptions: DraggableOption[] = section.prompts.map((p, index) => ({
      id: `option-${index}`,
      text: Object.values(p)[0],
    }));
    // The solution maps the prompt text to the correct answer TEXT
    const solution = Object.fromEntries(
      section.prompts.flatMap((p) => Object.entries(p))
    );
    return { prompts, allOptions, solution };
  }, [section.prompts]);

  const initialShuffledOptions = useMemo(() => {
    if (
      section.initialOrder &&
      section.initialOrder.length === allOptions.length
    ) {
      return section.initialOrder.map((index) => allOptions[index]);
    }
    return [...allOptions].sort(() => Math.random() - 0.5);
  }, [allOptions, section.initialOrder]);

  // --- State and Completion Logic ---
  const checkCompletion = (state: SavedMatchingState): boolean => {
    // Check if every prompt has a match
    if (prompts.some((prompt) => !state.userMatches[prompt])) {
      return false;
    }

    // Check if every match is correct by comparing the TEXT of the answer
    return prompts.every((prompt) => {
      const matchedOptionId = state.userMatches[prompt];
      if (!matchedOptionId) return false;

      const matchedOption = allOptions.find(
        (opt) => opt.id === matchedOptionId
      );
      if (!matchedOption) return false;

      return matchedOption.text === solution[prompt];
    });
  };

  const [savedState, setSavedState, isSectionComplete] =
    useSectionProgress<SavedMatchingState>(
      unitId,
      lessonId,
      section.id,
      storageKey,
      { userMatches: {} },
      checkCompletion
    );

  const { incrementAttemptCounter } = useProgressActions();
  const hasCountedCurrentAttempt = useRef(false);

  // Determine if all drop zones are filled
  const isFullyMatched = useMemo(() => {
    return (
      prompts.length > 0 &&
      prompts.every((p) => savedState.userMatches[p] != null)
    );
  }, [prompts, savedState.userMatches]);

  // Track incorrect attempts: when all matches are filled but wrong
  useEffect(() => {
    // When user changes matches, reset the attempt counter flag
    hasCountedCurrentAttempt.current = false;
  }, [savedState.userMatches]);

  useEffect(() => {
    if (
      isFullyMatched &&
      !isSectionComplete &&
      !hasCountedCurrentAttempt.current
    ) {
      // All slots filled but incorrect - count this as an attempt
      incrementAttemptCounter(unitId, lessonId, section.id);
      hasCountedCurrentAttempt.current = true;
    }
  }, [
    isFullyMatched,
    isSectionComplete,
    incrementAttemptCounter,
    unitId,
    lessonId,
    section.id,
  ]);

  // --- Interaction Logic (Drag, Tap-to-Select, Long-Press) ---
  const {
    draggingOptionId,
    hoveredPromptId,
    selectedOptionId,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleOptionClick,
    handlePromptClick,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useMatchingInteraction({
    allOptions,
    prompts,
    savedState,
    setSavedState,
  });

  // --- Rendering Logic ---
  const unmatchedOptions = useMemo(() => {
    const matchedOptionIds = new Set(Object.values(savedState.userMatches));
    return initialShuffledOptions.filter(
      (option) => !matchedOptionIds.has(option.id)
    );
  }, [savedState.userMatches, initialShuffledOptions]);

  return (
    <section id={section.id} className={sectionStyles.section}>
      <h2 className={sectionStyles.title}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          disallowedElements={["p"]}
          unwrapDisallowed={true}
        >
          {section.title}
        </ReactMarkdown>
      </h2>
      <div className={styles.content}>
        <ContentRenderer content={section.content} lessonPath={lessonPath} />
      </div>

      <div className={styles.matchingContainer}>
        <div className={styles.promptsContainer}>
          {prompts.map((promptText) => {
            const matchedOptionId = savedState.userMatches[promptText];
            const matchedOption = matchedOptionId
              ? allOptions.find((opt) => opt.id === matchedOptionId)
              : null;

            return (
              <div key={promptText} className={styles.matchRow}>
                <div className={styles.promptItem}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    disallowedElements={["p"]}
                    unwrapDisallowed={true}
                  >
                    {promptText}
                  </ReactMarkdown>
                </div>
                <div
                  className={`${styles.dropZone} ${
                    hoveredPromptId === promptText ? styles.dropZoneHover : ""
                  } ${isSectionComplete ? styles.correct : ""} ${
                    isFullyMatched && !isSectionComplete ? styles.incorrect : ""
                  }`}
                  data-prompt-id={promptText}
                  onClick={() => handlePromptClick(promptText)}
                  onDragOver={(e) => handleDragOver(e, promptText)}
                  onDragLeave={() => handleDragLeave(promptText)}
                  onDrop={(e) => handleDrop(e, promptText)}
                >
                  {matchedOption ? (
                    <div
                      className={`${styles.matchedOption} ${
                        draggingOptionId === matchedOption.id
                          ? styles.dragging
                          : ""
                      } ${
                        selectedOptionId === matchedOption.id
                          ? styles.selected
                          : ""
                      }`}
                      draggable
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering drop zone click
                        // If another option is already selected, place it here (swap/move)
                        if (
                          selectedOptionId &&
                          selectedOptionId !== matchedOption.id
                        ) {
                          handlePromptClick(promptText);
                        } else {
                          // Otherwise, select this option
                          handleOptionClick(matchedOption.id, promptText);
                        }
                      }}
                      onDragStart={(e) =>
                        handleDragStart(e, {
                          optionId: matchedOption.id,
                          sourcePrompt: promptText,
                        })
                      }
                      onDragEnd={handleDragEnd}
                      onTouchStart={(e) =>
                        handleTouchStart(e, matchedOption.id, promptText)
                      }
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        disallowedElements={["p"]}
                        unwrapDisallowed={true}
                      >
                        {matchedOption.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <span className={styles.dropZonePlaceholder}>
                      Drop here
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.optionsPool}>
          <h4>Tap or drag an option...</h4>
          {unmatchedOptions.map((option) => (
            <div
              key={option.id}
              className={`${styles.draggableOption} ${
                draggingOptionId === option.id ? styles.dragging : ""
              } ${selectedOptionId === option.id ? styles.selected : ""}`}
              draggable
              onClick={() => handleOptionClick(option.id)}
              onDragStart={(e) => handleDragStart(e, { optionId: option.id })}
              onDragEnd={handleDragEnd}
              onTouchStart={(e) => handleTouchStart(e, option.id)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                disallowedElements={["p"]}
                unwrapDisallowed={true}
              >
                {option.text}
              </ReactMarkdown>
            </div>
          ))}
        </div>
      </div>

      {/* Incorrect feedback message */}
      {isFullyMatched && !isSectionComplete && (
        <div className={styles.incorrectMessage}>
          Not quite right. You can drag the answers to rearrange them.
        </div>
      )}

      {/* Correct feedback message */}
      {isSectionComplete && (
        <div className={sectionStyles.completionMessage}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            disallowedElements={["p"]}
            unwrapDisallowed={true}
          >
            {section.feedback ? section.feedback.correct : "Correct!"}
          </ReactMarkdown>
        </div>
      )}
    </section>
  );
};

export default MatchingSection;
