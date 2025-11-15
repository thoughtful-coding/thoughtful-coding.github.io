// src/hooks/useQuizLogic.ts
import { useState, useCallback, useEffect, useMemo } from "react";
import { useSectionProgress } from "./useSectionProgress";
import {
  useProgressActions,
  useIsPenaltyActive,
  useRemainingPenaltyTime,
} from "../stores/progressStore";
import type {
  LessonId,
  MultipleChoiceSectionData,
  MultipleSelectionSectionData,
  UnitId,
} from "../types/data";

// The state managed by useSectionProgress via this hook
export interface QuizLogicPersistedState {
  selectedIndices: number[];
  submitted: boolean;
  isCorrect: boolean | null;
}

interface UseQuizLogicProps {
  unitId: UnitId;
  lessonId: LessonId;
  section: MultipleChoiceSectionData | MultipleSelectionSectionData;
  isMultiSelect: boolean;
}

export const useQuizLogic = ({
  unitId,
  lessonId,
  section,
  isMultiSelect,
}: UseQuizLogicProps) => {
  const storageKey = `quizState_${unitId}_${lessonId}_${section.id}`; // Unique key for persistence
  const initialQuizState: QuizLogicPersistedState = {
    selectedIndices: [],
    submitted: false,
    isCorrect: null,
  };

  const { startPenalty, incrementAttemptCounter } = useProgressActions();
  const isPenaltyActiveGlobally = useIsPenaltyActive();
  const remainingPenaltyTimeGlobal = useRemainingPenaltyTime();

  const [isLocallyDisabled, setIsLocallyDisabled] = useState(false);

  // Effect to synchronize local disabled state with global penalty
  useEffect(() => {
    setIsLocallyDisabled(isPenaltyActiveGlobally);
  }, [isPenaltyActiveGlobally]);

  const checkQuizCompletion = useCallback(
    (state: QuizLogicPersistedState): boolean => {
      return state.isCorrect === true;
    },
    []
  );

  const [
    persistedQuizState,
    setPersistedQuizState, // This updates the state in localStorage and Zustand
    isSectionComplete, // Boolean from useSectionProgress
  ] = useSectionProgress<QuizLogicPersistedState>(
    unitId,
    lessonId,
    section.id,
    storageKey,
    initialQuizState,
    checkQuizCompletion
  );

  const {
    selectedIndices,
    submitted: isSubmitted,
    isCorrect,
  } = persistedQuizState;

  const selectedOptionsSet = useMemo(
    () => new Set(selectedIndices),
    [selectedIndices]
  );

  const handleOptionChange = useCallback(
    (optionIndex: number) => {
      if (isSubmitted || isLocallyDisabled) return;

      setPersistedQuizState((prevState) => {
        const currentSelected = new Set(prevState.selectedIndices);
        if (isMultiSelect) {
          if (currentSelected.has(optionIndex)) {
            currentSelected.delete(optionIndex);
          } else {
            currentSelected.add(optionIndex);
          }
          return { ...prevState, selectedIndices: Array.from(currentSelected) };
        } else {
          // Single select (radio button behavior)
          return { ...prevState, selectedIndices: [optionIndex] };
        }
      });
    },
    [isSubmitted, isLocallyDisabled, isMultiSelect, setPersistedQuizState]
  );

  const handleSubmit = useCallback(() => {
    if (selectedOptionsSet.size === 0 || isSubmitted || isLocallyDisabled)
      return;

    let answerIsCorrect = false;
    if (isMultiSelect) {
      const correctAnswersSet = new Set(
        (section as MultipleSelectionSectionData).correctAnswers
      );
      answerIsCorrect =
        selectedOptionsSet.size === correctAnswersSet.size &&
        [...selectedOptionsSet].every((selectedIndex) =>
          correctAnswersSet.has(selectedIndex)
        );
    } else {
      answerIsCorrect =
        selectedIndices[0] ===
        (section as MultipleChoiceSectionData).correctAnswer;
    }

    setPersistedQuizState((prevState) => ({
      ...prevState,
      isCorrect: answerIsCorrect,
      submitted: true,
    }));

    if (!answerIsCorrect) {
      startPenalty();
      incrementAttemptCounter(unitId, lessonId, section.id);
    }
  }, [
    selectedOptionsSet,
    selectedIndices,
    isSubmitted,
    isLocallyDisabled,
    isMultiSelect,
    section,
    setPersistedQuizState,
    startPenalty,
    incrementAttemptCounter,
    unitId,
    lessonId,
  ]);

  const handleTryAgain = useCallback(() => {
    // Reset only the persisted quiz state for this section
    setPersistedQuizState({
      selectedIndices: [],
      submitted: false,
      isCorrect: null,
    });
    // Local disabled state will be reset by the useEffect listening to global penalty
  }, [setPersistedQuizState]);

  const canTryAgain = isSubmitted && !isCorrect && !isLocallyDisabled;

  return {
    selectedIndices, // Use this to determine checked status
    isSubmitted,
    isCorrect,
    isLocallyDisabled, // True if global penalty is active
    remainingPenaltyTime: remainingPenaltyTimeGlobal, // Renamed for clarity
    isSectionComplete, // From useSectionProgress
    handleOptionChange, // Pass optionIndex directly
    handleSubmit,
    handleTryAgain,
    canTryAgain, // Derived state for convenience
    selectedOptionsSet, // Useful for multi-select forms
  };
};
