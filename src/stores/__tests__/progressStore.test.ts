import { vi } from "vitest";
import { act } from "@testing-library/react";

import { useProgressStore } from "../progressStore";
import * as apiService from "../../lib/apiService";
import type { LessonId, SectionId, UnitId } from "../../types/data";
import { UserProgressData } from "../../types/apiServiceTypes";
import { storeCoordinator } from "../storeCoordination";

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
});
