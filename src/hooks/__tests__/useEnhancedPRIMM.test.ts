import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useEnhancedPRIMM } from "../useEnhancedPRIMM";
import { useSectionProgress } from "../useSectionProgress";
import { useAuthStore } from "../../stores/authStore";
import * as apiService from "../../lib/apiService";
import { ApiError } from "../../lib/apiService";
import { ErrorCode } from "../../types/apiServiceTypes";
import type {
  UnitId,
  LessonId,
  SectionId,
  EnhancedPRIMMExampleUserState,
} from "../../types/data";

// Mock dependencies
vi.mock("../useSectionProgress");
vi.mock("../../stores/authStore");
vi.mock("../../lib/apiService");
vi.mock("../../config", () => ({
  API_GATEWAY_BASE_URL: "http://api.test",
}));

const mockedUseSectionProgress = vi.mocked(useSectionProgress);
const mockedUseAuthStore = vi.mocked(useAuthStore);
const mockedSubmitPrimmEvaluation = vi.mocked(apiService.submitPrimmEvaluation);
const mockSetSavedState = vi.fn();

describe("useEnhancedPRIMM", () => {
  const defaultProps = {
    unitId: "unit-1" as UnitId,
    lessonId: "lesson-1" as LessonId,
    sectionId: "section-1" as SectionId,
    exampleId: "example-1",
    predictPrompt: "What will this code output?",
  };

  const initialState: EnhancedPRIMMExampleUserState = {
    userEnglishPrediction: "",
    isPredictionLocked: false,
    actualPyodideOutput: null,
    keyOutputSnippet: null,
    userExplanationText: "",
    aiEvaluationResult: null,
    currentUiStep: "PREDICT",
    isComplete: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: true,
    } as any);

    mockedUseSectionProgress.mockImplementation((() => {
      const state = {
        exampleStates: {
          "example-1": initialState,
        },
      };
      return [state, mockSetSavedState, false];
    }) as any);
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useEnhancedPRIMM(defaultProps));

    expect(result.current.state).toEqual(initialState);
    expect(result.current.isSectionComplete).toBe(false);
    expect(result.current.isLoadingAiFeedback).toBe(false);
    expect(result.current.aiFeedbackError).toBeNull();
  });

  it("should set user prediction", () => {
    const { result } = renderHook(() => useEnhancedPRIMM(defaultProps));

    act(() => {
      result.current.actions.setUserPrediction("Hello, World!");
    });

    expect(mockSetSavedState).toHaveBeenCalled();
    const updater = mockSetSavedState.mock.calls[0][0];
    const newState = updater({
      exampleStates: { "example-1": initialState },
    });

    expect(newState.exampleStates["example-1"].userEnglishPrediction).toBe(
      "Hello, World!"
    );
  });

  it("should lock prediction and move to RUN step", () => {
    const { result } = renderHook(() => useEnhancedPRIMM(defaultProps));

    act(() => {
      result.current.actions.lockPrediction();
    });

    const updater = mockSetSavedState.mock.calls[0][0];
    const newState = updater({
      exampleStates: { "example-1": initialState },
    });

    expect(newState.exampleStates["example-1"].isPredictionLocked).toBe(true);
    expect(newState.exampleStates["example-1"].currentUiStep).toBe("RUN");
  });

  it("should set actual output", () => {
    const { result } = renderHook(() => useEnhancedPRIMM(defaultProps));

    act(() => {
      result.current.actions.setActualOutput("42");
    });

    const updater = mockSetSavedState.mock.calls[0][0];
    const newState = updater({
      exampleStates: { "example-1": initialState },
    });

    expect(newState.exampleStates["example-1"].actualPyodideOutput).toBe("42");
  });

  it("should move to EXPLAIN step", () => {
    const { result } = renderHook(() => useEnhancedPRIMM(defaultProps));

    act(() => {
      result.current.actions.moveToExplain();
    });

    const updater = mockSetSavedState.mock.calls[0][0];
    const newState = updater({
      exampleStates: { "example-1": initialState },
    });

    expect(newState.exampleStates["example-1"].currentUiStep).toBe("EXPLAIN");
  });

  it("should set user explanation", () => {
    const { result } = renderHook(() => useEnhancedPRIMM(defaultProps));

    act(() => {
      result.current.actions.setUserExplanation("This code prints 42");
    });

    const updater = mockSetSavedState.mock.calls[0][0];
    const newState = updater({
      exampleStates: { "example-1": initialState },
    });

    expect(newState.exampleStates["example-1"].userExplanationText).toBe(
      "This code prints 42"
    );
  });

  it("should submit for feedback successfully", async () => {
    const mockAiResponse = {
      overallFeedback: "Great job!",
      predictionFeedback: "Correct prediction",
      explanationFeedback: "Clear explanation",
    };

    mockedSubmitPrimmEvaluation.mockResolvedValue(mockAiResponse);

    mockedUseSectionProgress.mockImplementation((() => {
      const state = {
        exampleStates: {
          "example-1": {
            ...initialState,
            userEnglishPrediction: "It prints 42",
            actualPyodideOutput: "42",
            userExplanationText: "The code outputs 42",
          },
        },
      };
      return [state, mockSetSavedState, false];
    }) as any);

    const { result } = renderHook(() => useEnhancedPRIMM(defaultProps));

    await act(async () => {
      await result.current.actions.submitForFeedback("print(42)");
    });

    expect(mockedSubmitPrimmEvaluation).toHaveBeenCalledWith({
      lessonId: defaultProps.lessonId,
      sectionId: defaultProps.sectionId,
      primmExampleId: defaultProps.exampleId,
      codeSnippet: "print(42)",
      userPredictionPromptText: defaultProps.predictPrompt,
      userPredictionText: "It prints 42",
      actualOutputSummary: "42",
      userExplanationText: "The code outputs 42",
    });

    const updater = mockSetSavedState.mock.calls[0][0];
    const newState = updater({
      exampleStates: {
        "example-1": {
          ...initialState,
          userEnglishPrediction: "It prints 42",
          actualPyodideOutput: "42",
          userExplanationText: "The code outputs 42",
        },
      },
    });

    expect(newState.exampleStates["example-1"].aiEvaluationResult).toEqual(
      mockAiResponse
    );
    expect(newState.exampleStates["example-1"].currentUiStep).toBe(
      "VIEW_AI_FEEDBACK"
    );
    expect(newState.exampleStates["example-1"].isComplete).toBe(true);
  });

  it("should handle authentication error when submitting feedback", async () => {
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: false,
    } as any);

    const { result } = renderHook(() => useEnhancedPRIMM(defaultProps));

    await act(async () => {
      await result.current.actions.submitForFeedback("print(42)");
    });

    expect(result.current.aiFeedbackError).toBe("Authentication required.");
    expect(mockedSubmitPrimmEvaluation).not.toHaveBeenCalled();
  });

  it("should handle 429 rate limit error", async () => {
    // Create error object that matches ApiError structure
    const apiError = Object.assign(new Error("Too Many Requests"), {
      name: "ApiError",
      status: 429,
      data: {
        message: "Too Many Requests",
        errorCode: ErrorCode.RATE_LIMIT_EXCEEDED,
      },
    });
    Object.setPrototypeOf(apiError, ApiError.prototype);

    mockedSubmitPrimmEvaluation.mockRejectedValue(apiError);

    const { result } = renderHook(() => useEnhancedPRIMM(defaultProps));

    await act(async () => {
      await result.current.actions.submitForFeedback("print(42)");
    });

    expect(result.current.aiFeedbackError).toContain(
      "submitted feedback too frequently"
    );
  });

  it("should handle ApiError with custom message", async () => {
    // Create error object that matches ApiError structure
    const apiError = Object.assign(new Error("Custom error message"), {
      name: "ApiError",
      status: 400,
      data: {
        message: "Custom error message",
        errorCode: ErrorCode.VALIDATION_ERROR,
      },
    });
    Object.setPrototypeOf(apiError, ApiError.prototype);

    mockedSubmitPrimmEvaluation.mockRejectedValue(apiError);

    const { result } = renderHook(() => useEnhancedPRIMM(defaultProps));

    await act(async () => {
      await result.current.actions.submitForFeedback("print(42)");
    });

    expect(result.current.aiFeedbackError).toBe("Custom error message");
  });

  it("should handle generic Error", async () => {
    const genericError = new Error("Network error");
    mockedSubmitPrimmEvaluation.mockRejectedValue(genericError);

    const { result } = renderHook(() => useEnhancedPRIMM(defaultProps));

    await act(async () => {
      await result.current.actions.submitForFeedback("print(42)");
    });

    expect(result.current.aiFeedbackError).toContain("Network error");
  });

  it("should handle unknown error type", async () => {
    mockedSubmitPrimmEvaluation.mockRejectedValue("Unknown error");

    const { result } = renderHook(() => useEnhancedPRIMM(defaultProps));

    await act(async () => {
      await result.current.actions.submitForFeedback("print(42)");
    });

    expect(result.current.aiFeedbackError).toContain("unknown error occurred");
  });

  it("should track loading state during feedback submission", async () => {
    let resolvePromise: any;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockedSubmitPrimmEvaluation.mockReturnValue(promise);

    const { result } = renderHook(() => useEnhancedPRIMM(defaultProps));

    expect(result.current.isLoadingAiFeedback).toBe(false);

    act(() => {
      result.current.actions.submitForFeedback("print(42)");
    });

    expect(result.current.isLoadingAiFeedback).toBe(true);

    await act(async () => {
      resolvePromise({
        overallFeedback: "Good",
        predictionFeedback: "Correct",
        explanationFeedback: "Clear",
      });
      await promise;
    });

    expect(result.current.isLoadingAiFeedback).toBe(false);
  });

  it("should clear error when submitting new feedback", async () => {
    // First submission fails
    mockedSubmitPrimmEvaluation.mockRejectedValueOnce(new Error("First error"));

    const { result } = renderHook(() => useEnhancedPRIMM(defaultProps));

    await act(async () => {
      await result.current.actions.submitForFeedback("print(42)");
    });

    expect(result.current.aiFeedbackError).toContain("First error");

    // Second submission succeeds
    mockedSubmitPrimmEvaluation.mockResolvedValueOnce({
      overallFeedback: "Good",
      predictionFeedback: "Correct",
      explanationFeedback: "Clear",
    });

    await act(async () => {
      await result.current.actions.submitForFeedback("print(42)");
    });

    expect(result.current.aiFeedbackError).toBeNull();
  });

  it("should check completion when state is complete", () => {
    mockedUseSectionProgress.mockImplementation(((...args: any[]) => {
      const state = {
        exampleStates: {
          "example-1": {
            ...initialState,
            isComplete: true,
          },
        },
      };
      const checkCompletion = args[5];
      return [state, mockSetSavedState, checkCompletion(state)];
    }) as any);

    const { result } = renderHook(() => useEnhancedPRIMM(defaultProps));

    expect(result.current.isSectionComplete).toBe(true);
  });

  it("should handle missing example state gracefully", () => {
    mockedUseSectionProgress.mockImplementation((() => {
      const state = {
        exampleStates: {},
      };
      return [state, mockSetSavedState, false];
    }) as any);

    const { result } = renderHook(() => useEnhancedPRIMM(defaultProps));

    // Should use initial state when example state is missing
    expect(result.current.state).toEqual(initialState);
  });

  it("should update only the specific example state", () => {
    mockedUseSectionProgress.mockImplementation((() => {
      const state = {
        exampleStates: {
          "example-1": initialState,
          "example-2": { ...initialState, userEnglishPrediction: "Other" },
        },
      };
      return [state, mockSetSavedState, false];
    }) as any);

    const { result } = renderHook(() => useEnhancedPRIMM(defaultProps));

    act(() => {
      result.current.actions.setUserPrediction("New prediction");
    });

    const updater = mockSetSavedState.mock.calls[0][0];
    const newState = updater({
      exampleStates: {
        "example-1": initialState,
        "example-2": { ...initialState, userEnglishPrediction: "Other" },
      },
    });

    expect(newState.exampleStates["example-1"].userEnglishPrediction).toBe(
      "New prediction"
    );
    expect(newState.exampleStates["example-2"].userEnglishPrediction).toBe(
      "Other"
    );
  });
});
