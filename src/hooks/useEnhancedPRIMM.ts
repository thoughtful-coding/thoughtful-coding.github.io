import { useState, useCallback, useMemo } from "react";
import type {
  UnitId,
  LessonId,
  SectionId,
  EnhancedPRIMMExampleUserState,
  SavedEnhancedPRIMMSectionState,
} from "../types/data";
import type { PrimmEvaluationRequest } from "../types/apiServiceTypes";
import { ErrorCode } from "../types/apiServiceTypes";
import { useSectionProgress } from "./useSectionProgress";
import { useAuthStore } from "../stores/authStore";
import * as apiService from "../lib/apiService";
import { ApiError } from "../lib/apiService";

interface UseEnhancedPRIMMProps {
  unitId: UnitId;
  lessonId: LessonId;
  sectionId: SectionId;
  exampleId: string;
  predictPrompt: string; // Added this prop
}

// Corrected initial state to include all required properties
const initialSingleExampleState: EnhancedPRIMMExampleUserState = {
  userEnglishPrediction: "",
  isPredictionLocked: false,
  actualPyodideOutput: null,
  keyOutputSnippet: null,
  userExplanationText: "",
  aiEvaluationResult: null,
  currentUiStep: "PREDICT",
  isComplete: false,
};

export const useEnhancedPRIMM = ({
  unitId,
  lessonId,
  sectionId,
  exampleId,
  predictPrompt, // Get the new prop
}: UseEnhancedPRIMMProps) => {
  const { isAuthenticated } = useAuthStore();

  const storageKey = `primmEnhanced_${unitId}_${lessonId}_${sectionId}_${exampleId}`;

  const checkCompletion = useCallback(
    (state: SavedEnhancedPRIMMSectionState): boolean => {
      return state.exampleStates[exampleId]?.isComplete === true;
    },
    [exampleId]
  );

  const [savedState, setSavedState, isSectionComplete] =
    useSectionProgress<SavedEnhancedPRIMMSectionState>(
      unitId,
      lessonId,
      sectionId,
      storageKey,
      { exampleStates: { [exampleId]: initialSingleExampleState } },
      checkCompletion
    );

  const state = useMemo(
    () => savedState.exampleStates[exampleId] || initialSingleExampleState,
    [savedState, exampleId]
  );

  const [isLoadingAiFeedback, setIsLoadingAiFeedback] = useState(false);
  const [aiFeedbackError, setAiFeedbackError] = useState<string | null>(null);

  const updateState = useCallback(
    (newState: Partial<EnhancedPRIMMExampleUserState>) => {
      setSavedState((prev) => ({
        ...prev,
        exampleStates: {
          ...prev.exampleStates,
          [exampleId]: {
            ...(prev.exampleStates[exampleId] || initialSingleExampleState),
            ...newState,
          },
        },
      }));
    },
    [setSavedState, exampleId]
  );

  const actions = useMemo(
    () => ({
      setUserPrediction: (text: string) => {
        updateState({ userEnglishPrediction: text });
      },
      lockPrediction: () => {
        updateState({ isPredictionLocked: true, currentUiStep: "RUN" });
      },
      setActualOutput: (output: string) => {
        updateState({ actualPyodideOutput: output });
      },
      moveToExplain: () => {
        updateState({ currentUiStep: "EXPLAIN" });
      },
      setUserExplanation: (text: string) => {
        updateState({ userExplanationText: text });
      },
      submitForFeedback: async (codeSnippet: string) => {
        if (!isAuthenticated) {
          setAiFeedbackError("Authentication required.");
          return;
        }
        setIsLoadingAiFeedback(true);
        setAiFeedbackError(null);

        // Corrected payload to include all required fields
        const payload: PrimmEvaluationRequest = {
          lessonId,
          sectionId,
          primmExampleId: exampleId,
          codeSnippet,
          userPredictionPromptText: predictPrompt,
          userPredictionText: state.userEnglishPrediction,
          userPredictionConfidence: 2, // Using a default value as before
          actualOutputSummary: state.actualPyodideOutput,
          userExplanationText: state.userExplanationText,
        };

        try {
          const aiResponse = await apiService.submitPrimmEvaluation(payload);
          updateState({
            aiEvaluationResult: aiResponse,
            currentUiStep: "VIEW_AI_FEEDBACK",
            isComplete: true,
          });
        } catch (err) {
          if (err instanceof ApiError) {
            switch (err.data.errorCode) {
              case ErrorCode.RATE_LIMIT_EXCEEDED:
                setAiFeedbackError(
                  "You've submitted feedback too frequently. Please wait a moment before trying again."
                );
                break;
              case ErrorCode.AI_SERVICE_UNAVAILABLE:
                setAiFeedbackError(
                  "AI service is temporarily unavailable. Please try again later."
                );
                break;
              case ErrorCode.AUTHENTICATION_FAILED:
                setAiFeedbackError(
                  "Authentication failed. Please log in again."
                );
                break;
              case ErrorCode.AUTHORIZATION_FAILED:
                setAiFeedbackError(
                  "You don't have permission to perform this action."
                );
                break;
              default:
                setAiFeedbackError(err.data.message);
            }
          } else if (err instanceof Error) {
            setAiFeedbackError(`Failed to get AI evaluation: ${err.message}`);
          } else {
            setAiFeedbackError(
              "Failed to get AI evaluation: An unknown error occurred."
            );
          }
        } finally {
          setIsLoadingAiFeedback(false);
        }
      },
    }),
    [
      updateState,
      isAuthenticated,
      lessonId,
      sectionId,
      exampleId,
      state,
      predictPrompt,
    ]
  );

  return {
    state,
    actions,
    isSectionComplete,
    isLoadingAiFeedback,
    aiFeedbackError,
  };
};
