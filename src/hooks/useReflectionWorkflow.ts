// useReflectionWorkflow: Shared logic for reflection draft workflow
// Used by both lesson ReflectionSection and standalone CustomReflectionEntry

import { useState, useCallback, useEffect } from "react";
import type { LessonId, SectionId, AssessmentLevel } from "../types/data";
import { useAuthStore } from "../stores/authStore";
import * as apiService from "../lib/apiService";
import { ApiError } from "../lib/apiService";
import {
  ReflectionInteractionInput,
  ReflectionVersionItem,
  ErrorCode,
} from "../types/apiServiceTypes";

const QUALIFYING_ASSESSMENTS_FOR_FINAL: AssessmentLevel[] = [
  "achieves",
  "mostly",
];

export interface UseReflectionWorkflowParams {
  lessonId: LessonId;
  sectionId: SectionId;
  isTopicPredefined?: boolean;
  isCodePredefined?: boolean;
  isExplanationPredefined?: boolean;
  defaultTopic?: string;
  defaultCode?: string;
  defaultExplanation?: string;
  extraContext?: string;
  onFinalSubmit?: () => void;
}

export interface UseReflectionWorkflowReturn {
  // State
  currentTopic: string;
  currentCode: string;
  currentExplanation: string;
  draftHistory: ReflectionVersionItem[];
  isLoading: boolean;
  isLoadingHistory: boolean;
  fetchError: string | null;
  submitError: string | null;

  // Actions
  setCurrentTopic: (value: string) => void;
  setCurrentCode: (value: string) => void;
  setCurrentExplanation: (value: string) => void;
  handleGetFeedback: () => Promise<void>;
  handleFinalSubmit: () => Promise<void>;
  fetchAndUpdateHistory: () => Promise<void>;

  // Computed
  canAttemptInteraction: boolean;
  canSubmitToJournal: boolean;
  latestAssessment: AssessmentLevel | null;
}

export function useReflectionWorkflow({
  lessonId,
  sectionId,
  isTopicPredefined = false,
  isCodePredefined = false,
  isExplanationPredefined = false,
  defaultTopic = "",
  defaultCode = "",
  defaultExplanation = "",
  extraContext,
  onFinalSubmit,
}: UseReflectionWorkflowParams): UseReflectionWorkflowReturn {
  const [currentTopic, setCurrentTopic] = useState<string>(() =>
    isTopicPredefined ? defaultTopic : ""
  );
  const [currentCode, setCurrentCode] = useState<string>(() =>
    isCodePredefined ? defaultCode : defaultCode || ""
  );
  const [currentExplanation, setCurrentExplanation] = useState<string>(() =>
    isExplanationPredefined ? defaultExplanation : ""
  );

  const [draftHistory, setDraftHistory] = useState<ReflectionVersionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { isAuthenticated } = useAuthStore();

  const fetchAndUpdateHistory = useCallback(async () => {
    if (!isAuthenticated || !lessonId || !sectionId) {
      setDraftHistory([]);
      return;
    }
    setIsLoadingHistory(true);
    setFetchError(null);
    try {
      const response = await apiService.getReflectionDraftVersions(
        lessonId,
        sectionId
      );
      const sortedVersions = response.versions.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setDraftHistory(sortedVersions);
    } catch (err) {
      console.error("Failed to fetch reflection draft history:", err);
      if (err instanceof ApiError) {
        setFetchError(`Error loading history: ${err.data.message}`);
      } else if (err instanceof Error) {
        setFetchError(`Error loading history: ${err.message}`);
      } else {
        setFetchError("An unknown error occurred while loading history.");
      }
    } finally {
      setIsLoadingHistory(false);
    }
  }, [lessonId, sectionId, isAuthenticated]);

  useEffect(() => {
    fetchAndUpdateHistory();
  }, [fetchAndUpdateHistory]);

  // Reset fields when defaults change
  useEffect(() => {
    setCurrentTopic(isTopicPredefined ? defaultTopic : currentTopic);
    setCurrentCode(isCodePredefined ? defaultCode : defaultCode || "");
    setCurrentExplanation(
      isExplanationPredefined ? defaultExplanation : currentExplanation
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    defaultTopic,
    defaultCode,
    defaultExplanation,
    isTopicPredefined,
    isCodePredefined,
    isExplanationPredefined,
  ]);

  const handleApiError = useCallback(
    (err: unknown, defaultMessage: string) => {
      if (err instanceof ApiError) {
        switch (err.data.errorCode) {
          case ErrorCode.RATE_LIMIT_EXCEEDED:
            setSubmitError(
              "You've submitted feedback too frequently. Please wait a moment before trying again."
            );
            break;
          case ErrorCode.AI_SERVICE_UNAVAILABLE:
            setSubmitError(
              "AI service is temporarily unavailable. Please try again later."
            );
            break;
          case ErrorCode.AUTHENTICATION_FAILED:
            setSubmitError("Authentication failed. Please log in again.");
            break;
          case ErrorCode.AUTHORIZATION_FAILED:
            setSubmitError("You don't have permission to perform this action.");
            break;
          default:
            setSubmitError(err.data.message);
        }
      } else if (err instanceof Error) {
        setSubmitError(`${defaultMessage}: ${err.message}`);
      } else {
        setSubmitError(`${defaultMessage}: An unknown error occurred.`);
      }
    },
    []
  );

  const handleGetFeedback = useCallback(async () => {
    if (!isAuthenticated) {
      setSubmitError("User not authenticated.");
      return;
    }

    const finalTopic = (isTopicPredefined ? defaultTopic : currentTopic).trim();
    const finalCode = isCodePredefined ? defaultCode : currentCode;
    const finalExplanation = (
      isExplanationPredefined ? defaultExplanation : currentExplanation
    ).trim();

    if (!finalTopic || !finalCode.trim() || !finalExplanation) {
      alert("Please ensure topic, code, and explanation have content.");
      return;
    }

    setIsLoading(true);
    setSubmitError(null);
    const submissionData: ReflectionInteractionInput = {
      userTopic: finalTopic,
      isUserTopicPredefined: isTopicPredefined,
      userCode: finalCode,
      isUserCodePredefined: isCodePredefined,
      userExplanation: finalExplanation,
      isFinal: false,
      ...(extraContext && { extraContext }),
    };

    try {
      const newDraftEntry = await apiService.submitReflectionInteraction(
        lessonId,
        sectionId,
        submissionData
      );
      setDraftHistory((prevHistory) =>
        [newDraftEntry, ...prevHistory].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
      alert("Feedback received and draft saved!");
    } catch (err) {
      console.error("Error getting AI feedback:", err);
      handleApiError(err, "Failed to get feedback");
    } finally {
      setIsLoading(false);
    }
  }, [
    isAuthenticated,
    lessonId,
    sectionId,
    currentTopic,
    currentCode,
    currentExplanation,
    isTopicPredefined,
    defaultTopic,
    isCodePredefined,
    defaultCode,
    isExplanationPredefined,
    defaultExplanation,
    extraContext,
    handleApiError,
  ]);

  const handleFinalSubmit = useCallback(async () => {
    if (!isAuthenticated) {
      setSubmitError("User not authenticated.");
      return;
    }

    const latestDraft = draftHistory.length > 0 ? draftHistory[0] : null;
    if (
      !latestDraft ||
      !latestDraft.aiAssessment ||
      !QUALIFYING_ASSESSMENTS_FOR_FINAL.includes(latestDraft.aiAssessment)
    ) {
      alert(
        "Please get feedback first, and ensure the latest assessment is 'achieves' or 'mostly' before final submission."
      );
      return;
    }

    const finalTopic = (isTopicPredefined ? defaultTopic : currentTopic).trim();
    const finalCode = isCodePredefined ? defaultCode : currentCode;
    const finalExplanation = (
      isExplanationPredefined ? defaultExplanation : currentExplanation
    ).trim();

    if (!finalTopic || !finalCode.trim() || !finalExplanation) {
      alert(
        "Please ensure topic, code, and explanation have content for final submission."
      );
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    const submissionData: ReflectionInteractionInput = {
      userTopic: finalTopic,
      isUserTopicPredefined: isTopicPredefined,
      userCode: finalCode,
      isUserCodePredefined: isCodePredefined,
      userExplanation: finalExplanation,
      isFinal: true,
      sourceVersionId: latestDraft.versionId,
      ...(extraContext && { extraContext }),
    };

    try {
      const finalEntryResponse = await apiService.submitReflectionInteraction(
        lessonId,
        sectionId,
        submissionData
      );
      alert(
        `Learning entry on ${finalEntryResponse.userTopic} submitted successfully!`
      );

      // Call completion callback if provided
      if (onFinalSubmit) {
        onFinalSubmit();
      }

      // Refresh history to show updated state
      fetchAndUpdateHistory();
    } catch (err) {
      console.error("Error submitting final learning entry:", err);
      handleApiError(err, "Failed to submit final entry");
    } finally {
      setIsLoading(false);
    }
  }, [
    isAuthenticated,
    lessonId,
    sectionId,
    draftHistory,
    currentTopic,
    currentCode,
    currentExplanation,
    isTopicPredefined,
    defaultTopic,
    isCodePredefined,
    defaultCode,
    isExplanationPredefined,
    defaultExplanation,
    extraContext,
    onFinalSubmit,
    fetchAndUpdateHistory,
    handleApiError,
  ]);

  const canAttemptInteraction =
    (isTopicPredefined || !!currentTopic.trim()) &&
    (isCodePredefined || !!currentCode.trim()) &&
    (isExplanationPredefined || !!currentExplanation.trim());

  const latestAssessment =
    draftHistory.length > 0 ? draftHistory[0].aiAssessment : null;
  const canSubmitToJournal =
    draftHistory.length > 0 &&
    latestAssessment &&
    QUALIFYING_ASSESSMENTS_FOR_FINAL.includes(latestAssessment);

  return {
    // State
    currentTopic,
    currentCode,
    currentExplanation,
    draftHistory,
    isLoading,
    isLoadingHistory,
    fetchError,
    submitError,

    // Actions
    setCurrentTopic,
    setCurrentCode,
    setCurrentExplanation,
    handleGetFeedback,
    handleFinalSubmit,
    fetchAndUpdateHistory,

    // Computed
    canAttemptInteraction,
    canSubmitToJournal,
    latestAssessment,
  };
}
