import { vi } from "vitest";
import { act } from "@testing-library/react";

import { useAuthStore, UserProfile } from "../authStore";
import * as apiService from "../../lib/apiService";
import * as localStorageUtils from "../../lib/localStorageUtils";
import * as storeCoordination from "../../hooks/useStoreCoordination";

// Mock all external dependencies of the auth store
vi.mock("../../lib/apiService");
vi.mock("../../lib/localStorageUtils");
vi.mock("../../hooks/useStoreCoordination");

// Mock window.location.reload
Object.defineProperty(window, "location", {
  value: {
    reload: vi.fn(),
  },
  writable: true,
});

// A helper to create a mock JWT for testing
const createMockJwt = (payload: object): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  const signature = "mockSignature";
  return `${header}.${body}.${signature}`;
};

// --- Mock Data ---
const mockUserProfile: UserProfile = {
  userId: "user-123",
  name: "Test User",
  email: "test@example.com",
  picture: "http://example.com/pic.jpg",
};

const mockAccessToken = createMockJwt({
  sub: mockUserProfile.userId,
  name: mockUserProfile.name,
  email: mockUserProfile.email,
  picture: mockUserProfile.picture,
});

const mockTokens = {
  accessToken: mockAccessToken,
  refreshToken: "mockRefreshToken",
};

describe("authStore", () => {
  // Mock functions for the progress sync operations
  const extractAnonymousCompletionsMock = vi.fn();
  const extractAnonymousDraftsMock = vi.fn();
  const syncProgressAfterLoginMock = vi.fn();
  const mergeDraftsAfterLoginMock = vi.fn();
  const setServerProgressMock = vi.fn();
  const resetAllProgressMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset the auth store to its initial state before each test
    act(() => {
      useAuthStore.setState({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        isSyncingProgress: false,
        sessionHasExpired: false,
      });
    });

    // Mock the progress sync operations from coordination hook
    vi.mocked(storeCoordination.getProgressSyncOperations).mockReturnValue({
      extractAnonymousCompletions: extractAnonymousCompletionsMock,
      extractAnonymousDrafts: extractAnonymousDraftsMock,
      syncProgressAfterLogin: syncProgressAfterLoginMock,
      mergeDraftsAfterLogin: mergeDraftsAfterLoginMock,
      setServerProgress: setServerProgressMock,
      resetAllProgress: resetAllProgressMock,
    });

    // Mock localStorage
    Storage.prototype.getItem = vi.fn();
    Storage.prototype.setItem = vi.fn();
  });

  it("should log in a user, set the state, and fetch their progress", async () => {
    // ARRANGE: Mock the API and progress operations
    vi.mocked(apiService.loginWithGoogle).mockResolvedValue(mockTokens);
    extractAnonymousCompletionsMock.mockReturnValue([]);
    extractAnonymousDraftsMock.mockReturnValue({});
    syncProgressAfterLoginMock.mockResolvedValue({ completion: {} });

    // ACT: Call the login action
    await act(async () => {
      await useAuthStore.getState().actions.login("test-google-token");
    });

    // ASSERT
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUserProfile);
    expect(state.accessToken).toBe(mockAccessToken);
    expect(extractAnonymousCompletionsMock).toHaveBeenCalledTimes(1);
    expect(extractAnonymousDraftsMock).toHaveBeenCalledTimes(1);
    expect(syncProgressAfterLoginMock).toHaveBeenCalledWith([]);
    expect(mergeDraftsAfterLoginMock).toHaveBeenCalledWith({});
    expect(state.isSyncingProgress).toBe(false); // Should be false at the end
  });

  it("should migrate anonymous progress when logging in", async () => {
    // ARRANGE:
    const anonymousCompletions = [
      { unitId: "unit-1", lessonId: "lesson-1", sectionId: "sec-1" },
    ];
    const anonymousDrafts = {
      "unit-1": {
        "lesson-1": {
          "sec-1": { code: "draft code", isModified: true },
        },
      },
    };

    // Mock the API and progress operations
    vi.mocked(apiService.loginWithGoogle).mockResolvedValue(mockTokens);
    extractAnonymousCompletionsMock.mockReturnValue(anonymousCompletions);
    extractAnonymousDraftsMock.mockReturnValue(anonymousDrafts);
    syncProgressAfterLoginMock.mockResolvedValue({
      completion: {
        "unit-1": { "lesson-1": { "sec-1": "timestamp" } },
      },
    });

    // ACT
    await act(async () => {
      await useAuthStore.getState().actions.login("test-google-token");
    });

    // ASSERT
    // Check that extraction and sync were called with the completions and drafts
    expect(extractAnonymousCompletionsMock).toHaveBeenCalledTimes(1);
    expect(extractAnonymousDraftsMock).toHaveBeenCalledTimes(1);
    expect(syncProgressAfterLoginMock).toHaveBeenCalledWith(anonymousCompletions);
    expect(mergeDraftsAfterLoginMock).toHaveBeenCalledWith(anonymousDrafts);

    // Check that anonymous data was cleared
    expect(localStorageUtils.clearAllAnonymousData).toHaveBeenCalledTimes(1);
  });

  it("should log out a user, reset state, and reload the page", async () => {
    // ARRANGE: Set the store to a logged-in state first
    act(() => {
      useAuthStore.setState({
        isAuthenticated: true,
        user: mockUserProfile,
        accessToken: mockAccessToken,
        refreshToken: "mockRefreshToken",
      });
    });

    // ACT
    await act(async () => {
      await useAuthStore.getState().actions.logout();
    });

    // ASSERT
    expect(apiService.logoutUser).toHaveBeenCalledWith("mockRefreshToken");
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(resetAllProgressMock).toHaveBeenCalledTimes(1);
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });
});
