import { renderHook, act, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useReflectionWorkflow } from "../useReflectionWorkflow";
import { useAuthStore } from "../../stores/authStore";
import * as apiService from "../../lib/apiService";
import type { LessonId, SectionId } from "../../types/data";

vi.mock("../../stores/authStore");
vi.mock("../../lib/apiService");
vi.mock("../../config", () => ({ API_GATEWAY_BASE_URL: "http://test.api" }));

const mockedUseAuthStore = vi.mocked(useAuthStore);
const mockedGetHistory = vi.mocked(apiService.getReflectionDraftVersions);

const PROPS = {
  lessonId: "lesson-1" as LessonId,
  sectionId: "section-1" as SectionId,
};

function makeVersion(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    versionId: "v1",
    userTopic: "Topic",
    userCode: "code",
    userExplanation: "Explanation",
    aiAssessment: null,
    createdAt: new Date().toISOString(),
    isFinal: false,
    ...overrides,
  };
}

describe("useReflectionWorkflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAuthStore.mockReturnValue({ isAuthenticated: false } as any);
    mockedGetHistory.mockResolvedValue({ versions: [] });
  });

  describe("initial state", () => {
    it("starts with empty fields and no history", async () => {
      const { result } = renderHook(() => useReflectionWorkflow(PROPS));
      await waitFor(() => expect(result.current.isLoadingHistory).toBe(false));
      expect(result.current.currentTopic).toBe("");
      expect(result.current.currentCode).toBe("");
      expect(result.current.currentExplanation).toBe("");
      expect(result.current.draftHistory).toEqual([]);
    });

    it("uses defaultCode as initial currentCode even when not predefined", async () => {
      const { result } = renderHook(() =>
        useReflectionWorkflow({ ...PROPS, defaultCode: "print('hello')" })
      );
      await waitFor(() => expect(result.current.isLoadingHistory).toBe(false));
      expect(result.current.currentCode).toBe("print('hello')");
    });

    it("populates predefined fields from defaults", async () => {
      const { result } = renderHook(() =>
        useReflectionWorkflow({
          ...PROPS,
          isTopicPredefined: true,
          defaultTopic: "Loops",
          isExplanationPredefined: true,
          defaultExplanation: "A loop repeats code.",
        })
      );
      await waitFor(() => expect(result.current.isLoadingHistory).toBe(false));
      expect(result.current.currentTopic).toBe("Loops");
      expect(result.current.currentExplanation).toBe("A loop repeats code.");
    });
  });

  describe("canAttemptInteraction", () => {
    it("is false when all non-predefined fields are empty", async () => {
      const { result } = renderHook(() => useReflectionWorkflow(PROPS));
      await waitFor(() => expect(result.current.isLoadingHistory).toBe(false));
      expect(result.current.canAttemptInteraction).toBe(false);
    });

    it("is true when all non-predefined fields have content", async () => {
      const { result } = renderHook(() => useReflectionWorkflow(PROPS));
      await waitFor(() => expect(result.current.isLoadingHistory).toBe(false));
      act(() => {
        result.current.setCurrentTopic("Recursion");
        result.current.setCurrentCode("def f(): return f()");
        result.current.setCurrentExplanation("It calls itself.");
      });
      expect(result.current.canAttemptInteraction).toBe(true);
    });

    it("is true when all fields are predefined", async () => {
      const { result } = renderHook(() =>
        useReflectionWorkflow({
          ...PROPS,
          isTopicPredefined: true,
          defaultTopic: "Topic",
          isCodePredefined: true,
          defaultCode: "code",
          isExplanationPredefined: true,
          defaultExplanation: "Explanation",
        })
      );
      await waitFor(() => expect(result.current.isLoadingHistory).toBe(false));
      expect(result.current.canAttemptInteraction).toBe(true);
    });
  });

  describe("canSubmitToJournal", () => {
    it("is false with no draft history", async () => {
      const { result } = renderHook(() => useReflectionWorkflow(PROPS));
      await waitFor(() => expect(result.current.isLoadingHistory).toBe(false));
      expect(result.current.canSubmitToJournal).toBeFalsy();
    });

    it("is true when latest draft has a qualifying assessment", async () => {
      mockedUseAuthStore.mockReturnValue({ isAuthenticated: true } as any);
      mockedGetHistory.mockResolvedValue({
        versions: [makeVersion({ aiAssessment: "achieves" })],
      });
      const { result } = renderHook(() => useReflectionWorkflow(PROPS));
      await waitFor(() => expect(result.current.draftHistory).toHaveLength(1));
      expect(result.current.canSubmitToJournal).toBeTruthy();
    });

    it("is false when latest draft has a non-qualifying assessment", async () => {
      mockedUseAuthStore.mockReturnValue({ isAuthenticated: true } as any);
      mockedGetHistory.mockResolvedValue({
        versions: [makeVersion({ aiAssessment: "not_there_yet" })],
      });
      const { result } = renderHook(() => useReflectionWorkflow(PROPS));
      await waitFor(() => expect(result.current.draftHistory).toHaveLength(1));
      expect(result.current.canSubmitToJournal).toBeFalsy();
    });
  });

  describe("fetchAndUpdateHistory", () => {
    it("does not call API when not authenticated", async () => {
      mockedUseAuthStore.mockReturnValue({ isAuthenticated: false } as any);
      const { result } = renderHook(() => useReflectionWorkflow(PROPS));
      await waitFor(() => expect(result.current.isLoadingHistory).toBe(false));
      expect(mockedGetHistory).not.toHaveBeenCalled();
      expect(result.current.draftHistory).toEqual([]);
    });

    it("fetches and sorts history newest-first when authenticated", async () => {
      const older = new Date("2024-01-01").toISOString();
      const newer = new Date("2024-06-01").toISOString();
      mockedUseAuthStore.mockReturnValue({ isAuthenticated: true } as any);
      mockedGetHistory.mockResolvedValue({
        versions: [
          makeVersion({ versionId: "v1", createdAt: older }),
          makeVersion({ versionId: "v2", createdAt: newer }),
        ],
      });
      const { result } = renderHook(() => useReflectionWorkflow(PROPS));
      await waitFor(() => expect(result.current.draftHistory).toHaveLength(2));
      expect(result.current.draftHistory[0].versionId).toBe("v2");
    });

    it("sets fetchError when API call fails", async () => {
      mockedUseAuthStore.mockReturnValue({ isAuthenticated: true } as any);
      mockedGetHistory.mockRejectedValue(new Error("Network error"));
      const { result } = renderHook(() => useReflectionWorkflow(PROPS));
      await waitFor(() => expect(result.current.fetchError).not.toBeNull());
      expect(result.current.fetchError).toContain("Network error");
    });
  });
});
