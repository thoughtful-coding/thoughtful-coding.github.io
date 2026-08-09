import { vi } from "vitest";
import { act } from "@testing-library/react";

import { useProgressStore } from "../progressStore";
import { BASE_PROGRESS_STORE_KEY } from "../progressStore";
import * as apiService from "../../lib/apiService";
import type { LessonId, SectionId, UnitId } from "../../types/data";
import { UserProgressData } from "../../types/apiServiceTypes";
import { storeCoordinator } from "../storeCoordination";
import { ANONYMOUS_USER_ID_PLACEHOLDER } from "../../lib/localStorageUtils";

// Mock all external dependencies
vi.mock("../../lib/apiService");

describe("progressStore", () => {
  const unitId = "unit-1" as UnitId;
  const lessonId = "lesson-1" as LessonId;
  const sectionId = "sec-1" as SectionId;

  // Mock navigator.onLine to be configurable
  const onLineSpy = vi.spyOn(navigator, "onLine", "get");

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset the store to its initial state before each test
    act(() => {
      useProgressStore.setState({
        completion: {},
        drafts: {},
        attemptCounters: {},
        penaltyEndTime: null,
        offlineActionQueue: [],
        isSyncing: false,
        lastSyncError: null,
      });
    });

    // Default mocks for each test
    onLineSpy.mockReturnValue(true); // Default to being online

    // Set up authenticated state in the store coordinator
    storeCoordinator.publishAuthState({
      isAuthenticated: true,
      userId: "test-user-123" as any,
    });
  });

  describe("completeSection", () => {
    it("should optimistically update local state and sync with the server for an authenticated user", async () => {
      // ARRANGE
      const serverResponse: UserProgressData = {
        completion: {
          [unitId]: { [lessonId]: { [sectionId]: new Date().toISOString() } },
        },
      };
      vi.mocked(apiService.updateUserProgress).mockResolvedValue(
        serverResponse
      );

      // ACT
      await act(async () => {
        await useProgressStore
          .getState()
          .actions.completeSection(unitId, lessonId, sectionId);
      });

      // ASSERT
      const state = useProgressStore.getState();
      expect(state.actions.isSectionComplete(unitId, lessonId, sectionId)).toBe(
        true
      );
      expect(apiService.updateUserProgress).toHaveBeenCalledTimes(1);
      expect(state.completion).toEqual(serverResponse.completion);
    });

    it("should add the action to the offline queue if the user is offline", async () => {
      // ARRANGE
      onLineSpy.mockReturnValue(false); // Simulate offline

      // ACT
      await act(async () => {
        await useProgressStore
          .getState()
          .actions.completeSection(unitId, lessonId, sectionId);
      });

      // ASSERT
      const state = useProgressStore.getState();
      expect(state.actions.isSectionComplete(unitId, lessonId, sectionId)).toBe(
        true
      );
      expect(apiService.updateUserProgress).not.toHaveBeenCalled();
      expect(state.offlineActionQueue).toHaveLength(1);
    });

    it("should only update locally for an anonymous user", async () => {
      // ARRANGE
      storeCoordinator.publishAuthState({
        isAuthenticated: false,
        userId: null,
      });

      // ACT
      await act(async () => {
        await useProgressStore
          .getState()
          .actions.completeSection(unitId, lessonId, sectionId);
      });

      // ASSERT
      const state = useProgressStore.getState();
      expect(state.actions.isSectionComplete(unitId, lessonId, sectionId)).toBe(
        true
      );
      expect(apiService.updateUserProgress).not.toHaveBeenCalled();
    });
  });

  describe("processOfflineQueue", () => {
    it("should sync queued actions to the server when online", async () => {
      // ARRANGE
      const queuedAction = { unitId, lessonId, sectionId };
      act(() => {
        useProgressStore.setState({ offlineActionQueue: [queuedAction] });
      });
      const serverResponse: UserProgressData = {
        completion: {
          [unitId]: { [lessonId]: { [sectionId]: new Date().toISOString() } },
        },
      };
      vi.mocked(apiService.updateUserProgress).mockResolvedValue(
        serverResponse
      );

      // ACT
      await act(async () => {
        await useProgressStore.getState().actions.processOfflineQueue();
      });

      // ASSERT
      expect(apiService.updateUserProgress).toHaveBeenCalledWith({
        completions: [queuedAction],
      });
      const state = useProgressStore.getState();
      expect(state.offlineActionQueue).toHaveLength(0); // Queue should be cleared
    });
  });

  describe("penalty logic", () => {
    it("should set and clear a penalty", () => {
      // ARRANGE
      vi.useFakeTimers();
      const startTime = Date.now();
      vi.setSystemTime(startTime);

      // ACT 1: Start Penalty
      act(() => {
        useProgressStore.getState().actions.startPenalty();
      });

      // ASSERT 1
      let state = useProgressStore.getState();
      expect(state.penaltyEndTime).toBe(startTime + 15 * 1000);

      // ACT 2: Clear Penalty
      act(() => {
        useProgressStore.getState().actions.clearPenalty();
      });

      // ASSERT 2
      state = useProgressStore.getState();
      expect(state.penaltyEndTime).toBeNull();

      vi.useRealTimers();
    });
  });

  describe("setServerProgress", () => {
    it("merges server completion data into local state", () => {
      act(() => {
        useProgressStore.getState().actions.setServerProgress({
          completion: {
            [unitId]: {
              [lessonId]: { [sectionId]: "2024-01-01T00:00:00.000Z" },
            },
          },
        });
      });
      expect(
        useProgressStore
          .getState()
          .actions.isSectionComplete(unitId, lessonId, sectionId)
      ).toBe(true);
    });

    it("preserves existing local completions not present in server data", () => {
      const localSectionId = "local-sec" as SectionId;
      act(() => {
        useProgressStore.setState({
          completion: {
            [unitId]: {
              [lessonId]: { [localSectionId]: "2024-01-01T00:00:00.000Z" },
            },
          },
        });
        useProgressStore.getState().actions.setServerProgress({
          completion: {
            [unitId]: {
              [lessonId]: { [sectionId]: "2024-06-01T00:00:00.000Z" },
            },
          },
        });
      });
      const state = useProgressStore.getState();
      expect(
        state.actions.isSectionComplete(unitId, lessonId, localSectionId)
      ).toBe(true);
      expect(state.actions.isSectionComplete(unitId, lessonId, sectionId)).toBe(
        true
      );
    });

    it("removes offline queue items now confirmed by server", () => {
      act(() => {
        useProgressStore.setState({
          offlineActionQueue: [{ unitId, lessonId, sectionId }],
        });
        useProgressStore.getState().actions.setServerProgress({
          completion: {
            [unitId]: {
              [lessonId]: { [sectionId]: "2024-01-01T00:00:00.000Z" },
            },
          },
        });
      });
      expect(useProgressStore.getState().offlineActionQueue).toHaveLength(0);
    });

    it("keeps offline queue items not yet confirmed by server", () => {
      const otherSection = "other-sec" as SectionId;
      act(() => {
        useProgressStore.setState({
          offlineActionQueue: [{ unitId, lessonId, sectionId: otherSection }],
        });
        useProgressStore.getState().actions.setServerProgress({
          completion: {
            [unitId]: {
              [lessonId]: { [sectionId]: "2024-01-01T00:00:00.000Z" },
            },
          },
        });
      });
      expect(useProgressStore.getState().offlineActionQueue).toHaveLength(1);
    });
  });

  describe("resetLessonProgress", () => {
    it("removes a lesson's completions from state", () => {
      act(() => {
        useProgressStore.setState({
          completion: {
            [unitId]: {
              [lessonId]: { [sectionId]: "2024-01-01T00:00:00.000Z" },
            },
          },
        });
        useProgressStore
          .getState()
          .actions.resetLessonProgress(unitId, lessonId);
      });
      expect(
        useProgressStore
          .getState()
          .actions.isSectionComplete(unitId, lessonId, sectionId)
      ).toBe(false);
    });

    it("removes matching items from the offline queue", () => {
      act(() => {
        useProgressStore.setState({
          offlineActionQueue: [{ unitId, lessonId, sectionId }],
        });
        useProgressStore
          .getState()
          .actions.resetLessonProgress(unitId, lessonId);
      });
      expect(useProgressStore.getState().offlineActionQueue).toHaveLength(0);
    });

    it("cleans up empty unit object after removing last lesson", () => {
      act(() => {
        useProgressStore.setState({
          completion: {
            [unitId]: {
              [lessonId]: { [sectionId]: "2024-01-01T00:00:00.000Z" },
            },
          },
        });
        useProgressStore
          .getState()
          .actions.resetLessonProgress(unitId, lessonId);
      });
      expect(useProgressStore.getState().completion[unitId]).toBeUndefined();
    });
  });

  describe("resetAllProgress", () => {
    it("clears all completion, draft, and attempt counter state", () => {
      act(() => {
        useProgressStore.setState({
          completion: {
            [unitId]: {
              [lessonId]: { [sectionId]: "2024-01-01T00:00:00.000Z" },
            },
          },
          drafts: {
            [unitId]: { [lessonId]: { [sectionId]: { code: "x = 1" } } },
          },
          attemptCounters: { [unitId]: { [lessonId]: { [sectionId]: 3 } } },
        });
        useProgressStore.getState().actions.resetAllProgress();
      });
      const state = useProgressStore.getState();
      expect(state.completion).toEqual({});
      expect(state.drafts).toEqual({});
      expect(state.attemptCounters).toEqual({});
    });
  });

  describe("draft management", () => {
    it("saveDraft stores and getDraft retrieves draft content", () => {
      act(() => {
        useProgressStore
          .getState()
          .actions.saveDraft(unitId, lessonId, sectionId, {
            code: "x = 1",
            isModified: true,
          });
      });
      const draft = useProgressStore
        .getState()
        .actions.getDraft(unitId, lessonId, sectionId);
      expect(draft?.code).toBe("x = 1");
      expect(draft?.isModified).toBe(true);
    });

    it("getDraft returns null for an unsaved section", () => {
      const draft = useProgressStore
        .getState()
        .actions.getDraft(unitId, lessonId, "nonexistent-sec" as SectionId);
      expect(draft).toBeNull();
    });

    it("saveDraft merges with existing draft content", () => {
      act(() => {
        useProgressStore
          .getState()
          .actions.saveDraft(unitId, lessonId, sectionId, { code: "x = 1" });
        useProgressStore
          .getState()
          .actions.saveDraft(unitId, lessonId, sectionId, { isModified: true });
      });
      const draft = useProgressStore
        .getState()
        .actions.getDraft(unitId, lessonId, sectionId);
      expect(draft?.code).toBe("x = 1");
      expect(draft?.isModified).toBe(true);
    });
  });

  describe("mergeDraftsAfterLogin", () => {
    it("uses modified anonymous draft over existing authenticated draft", () => {
      act(() => {
        useProgressStore.setState({
          drafts: {
            [unitId]: {
              [lessonId]: {
                [sectionId]: { code: "auth-code", isModified: false },
              },
            },
          },
        });
        useProgressStore.getState().actions.mergeDraftsAfterLogin({
          [unitId]: {
            [lessonId]: {
              [sectionId]: { code: "anon-code", isModified: true },
            },
          },
        });
      });
      const draft = useProgressStore
        .getState()
        .actions.getDraft(unitId, lessonId, sectionId);
      expect(draft?.code).toBe("anon-code");
    });

    it("merges unmodified anonymous draft when no authenticated draft exists", () => {
      act(() => {
        useProgressStore.getState().actions.mergeDraftsAfterLogin({
          [unitId]: {
            [lessonId]: {
              [sectionId]: { code: "anon-code", isModified: false },
            },
          },
        });
      });
      const draft = useProgressStore
        .getState()
        .actions.getDraft(unitId, lessonId, sectionId);
      expect(draft?.code).toBe("anon-code");
    });

    it("keeps authenticated draft when anonymous draft is not modified", () => {
      act(() => {
        useProgressStore.setState({
          drafts: {
            [unitId]: {
              [lessonId]: {
                [sectionId]: { code: "auth-code", isModified: false },
              },
            },
          },
        });
        useProgressStore.getState().actions.mergeDraftsAfterLogin({
          [unitId]: {
            [lessonId]: {
              [sectionId]: { code: "anon-code", isModified: false },
            },
          },
        });
      });
      const draft = useProgressStore
        .getState()
        .actions.getDraft(unitId, lessonId, sectionId);
      expect(draft?.code).toBe("auth-code");
    });
  });

  describe("attempt counters", () => {
    it("incrementAttemptCounter initializes and increments the counter", () => {
      act(() => {
        useProgressStore
          .getState()
          .actions.incrementAttemptCounter(unitId, lessonId, sectionId);
        useProgressStore
          .getState()
          .actions.incrementAttemptCounter(unitId, lessonId, sectionId);
      });
      expect(
        useProgressStore
          .getState()
          .actions.getAttemptCounter(unitId, lessonId, sectionId)
      ).toBe(2);
    });

    it("getAttemptCounter returns 0 for an unset section", () => {
      expect(
        useProgressStore
          .getState()
          .actions.getAttemptCounter(
            unitId,
            lessonId,
            "no-section" as SectionId
          )
      ).toBe(0);
    });

    it("resetAttemptCounter removes the counter and cleans up empty objects", () => {
      act(() => {
        useProgressStore
          .getState()
          .actions.incrementAttemptCounter(unitId, lessonId, sectionId);
        useProgressStore
          .getState()
          .actions.resetAttemptCounter(unitId, lessonId, sectionId);
      });
      expect(
        useProgressStore
          .getState()
          .actions.getAttemptCounter(unitId, lessonId, sectionId)
      ).toBe(0);
      expect(
        useProgressStore.getState().attemptCounters[unitId]
      ).toBeUndefined();
    });
  });

  describe("mergeAttemptCountersAfterLogin", () => {
    it("uses the maximum of anonymous and authenticated counter values", () => {
      act(() => {
        useProgressStore.setState({
          attemptCounters: { [unitId]: { [lessonId]: { [sectionId]: 2 } } },
        });
        useProgressStore.getState().actions.mergeAttemptCountersAfterLogin({
          [unitId]: { [lessonId]: { [sectionId]: 5 } },
        });
      });
      expect(
        useProgressStore
          .getState()
          .actions.getAttemptCounter(unitId, lessonId, sectionId)
      ).toBe(5);
    });

    it("adopts anonymous counter when no authenticated counter exists", () => {
      act(() => {
        useProgressStore.getState().actions.mergeAttemptCountersAfterLogin({
          [unitId]: { [lessonId]: { [sectionId]: 3 } },
        });
      });
      expect(
        useProgressStore
          .getState()
          .actions.getAttemptCounter(unitId, lessonId, sectionId)
      ).toBe(3);
    });
  });

  describe("extractAnonymousCompletions", () => {
    const anonymousKey = `${ANONYMOUS_USER_ID_PLACEHOLDER}_${BASE_PROGRESS_STORE_KEY}`;

    afterEach(() => {
      localStorage.removeItem(anonymousKey);
    });

    it("returns empty array when no anonymous data is in localStorage", () => {
      const completions = useProgressStore
        .getState()
        .actions.extractAnonymousCompletions();
      expect(completions).toEqual([]);
    });

    it("parses and returns completions from localStorage", () => {
      const data = {
        state: {
          completion: {
            [unitId]: {
              [lessonId]: { [sectionId]: "2024-01-01T00:00:00.000Z" },
            },
          },
          attemptCounters: { [unitId]: { [lessonId]: { [sectionId]: 2 } } },
        },
      };
      localStorage.setItem(anonymousKey, JSON.stringify(data));

      const completions = useProgressStore
        .getState()
        .actions.extractAnonymousCompletions();
      expect(completions).toHaveLength(1);
      expect(completions[0]).toMatchObject({
        unitId,
        lessonId,
        sectionId,
        attemptsBeforeSuccess: 2,
      });
    });

    it("returns empty array when localStorage data is invalid JSON", () => {
      localStorage.setItem(anonymousKey, "not-valid-json");
      const completions = useProgressStore
        .getState()
        .actions.extractAnonymousCompletions();
      expect(completions).toEqual([]);
    });
  });
});
