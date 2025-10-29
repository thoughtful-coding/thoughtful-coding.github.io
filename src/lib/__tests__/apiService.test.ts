import { vi } from "vitest";
import { useAuthStore } from "../../stores/authStore";
import * as apiService from "../apiService";
import { ApiError } from "../apiService";

// Mock the authStore to control token state
vi.mock("../../stores/authStore", () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
}));

// FIX: Mock the config module to control the API_GATEWAY_BASE_URL
vi.mock("../../config", () => ({
  API_GATEWAY_BASE_URL: "http://api.test",
}));

// Mock the global fetch API
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("apiService", () => {
  // Mock implementations for authStore actions
  const getAccessTokenMock = vi.fn();
  const getRefreshTokenMock = vi.fn();
  const setTokensMock = vi.fn();
  const logoutMock = vi.fn();
  const setSessionExpiredMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Provide a default implementation for the authStore mock
    vi.mocked(useAuthStore.getState).mockReturnValue({
      actions: {
        getAccessToken: getAccessTokenMock,
        getRefreshToken: getRefreshTokenMock,
        setTokens: setTokensMock,
        logout: logoutMock,
        setSessionExpired: setSessionExpiredMock,
      },
    } as any);
  });

  describe("getUserProgress", () => {
    it("should fetch user progress with the correct auth headers", async () => {
      // ARRANGE
      const mockProgress = { completions: { "unit-1": {} } };
      getAccessTokenMock.mockReturnValue("fake-access-token");
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProgress),
      });

      // ACT
      const result = await apiService.getUserProgress();

      // ASSERT
      expect(result).toEqual(mockProgress);
      expect(mockFetch).toHaveBeenCalledWith("http://api.test/progress", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer fake-access-token",
        },
      });
    });

    it("should throw an ApiError on a failed request", async () => {
      // ARRANGE
      getAccessTokenMock.mockReturnValue("fake-access-token");
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Server Error",
        json: () => Promise.resolve({ message: "Internal Server Error" }),
      });

      // ACT & ASSERT
      await expect(
        apiService.getUserProgress()
      ).rejects.toThrow(ApiError);
      await expect(
        apiService.getUserProgress()
      ).rejects.toThrow("Internal Server Error");
    });
  });

  describe("Token Refresh Logic (via fetchWithAuth)", () => {
    it("should refresh the token and retry the request on a 401 error", async () => {
      // ARRANGE
      const newTokens = {
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      };
      getAccessTokenMock.mockReturnValue("old-access-token");
      getRefreshTokenMock.mockReturnValue("old-refresh-token");

      // First call (original request) fails with 401
      mockFetch.mockResolvedValueOnce({ status: 401, ok: false });
      // Second call (token refresh) succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(newTokens),
      });
      // Third call (retried original request) succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: "success" }),
      });

      // ACT
      const result = await apiService.getUserProgress();

      // ASSERT
      expect(result).toEqual({ data: "success" });
      expect(mockFetch).toHaveBeenCalledTimes(3);

      // Check the refresh call
      expect(mockFetch).toHaveBeenCalledWith("http://api.test/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: "old-refresh-token" }),
      });

      // Check that tokens were updated in the store
      expect(setTokensMock).toHaveBeenCalledWith(newTokens);

      // Check that the original request was retried with the NEW token
      expect(mockFetch).toHaveBeenCalledWith("http://api.test/progress", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer new-access-token",
        },
      });
    });

    it("should set session as expired if token refresh fails", async () => {
      // ARRANGE
      getAccessTokenMock.mockReturnValue("old-access-token");
      getRefreshTokenMock.mockReturnValue("old-refresh-token");

      // First call fails with 401
      mockFetch.mockResolvedValueOnce({ status: 401, ok: false });
      // Second call (token refresh) also fails
      mockFetch.mockResolvedValueOnce({ status: 401, ok: false });

      // ACT & ASSERT
      await expect(
        apiService.getUserProgress()
      ).rejects.toThrow("Session expired. Please log in again.");

      // Check that the session expired flag was set
      expect(setSessionExpiredMock).toHaveBeenCalledWith(true);
    });
  });

  describe("ApiError class", () => {
    it("should create an error with status and data", () => {
      const error = new ApiError("Test error", 404, { message: "Not found" });
      expect(error.message).toBe("Test error");
      expect(error.status).toBe(404);
      expect(error.data).toEqual({ message: "Not found" });
      expect(error.name).toBe("ApiError");
    });

    it("should use message as data if no data provided", () => {
      const error = new ApiError("Test error", 500);
      expect(error.data).toEqual({ message: "Test error" });
    });

    it("should be an instance of Error", () => {
      const error = new ApiError("Test error", 400);
      expect(error instanceof Error).toBe(true);
      expect(error instanceof ApiError).toBe(true);
    });
  });

  describe("loginWithGoogle", () => {
    it("should send googleIdToken and return tokens", async () => {
      const mockTokens = {
        accessToken: "access-123",
        refreshToken: "refresh-456",
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTokens),
      });

      const result = await apiService.loginWithGoogle(
        "google-id-token"
      );

      expect(result).toEqual(mockTokens);
      expect(mockFetch).toHaveBeenCalledWith("http://api.test/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleIdToken: "google-id-token" }),
      });
    });

    it("should throw ApiError on failed login", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
      });

      await expect(
        apiService.loginWithGoogle("invalid-token")
      ).rejects.toThrow(ApiError);
    });
  });

  describe("refreshAccessToken", () => {
    it("should send refresh token and return new tokens", async () => {
      const newTokens = {
        accessToken: "new-access",
        refreshToken: "new-refresh",
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(newTokens),
      });

      const result = await apiService.refreshAccessToken(
        "old-refresh-token"
      );

      expect(result).toEqual(newTokens);
      expect(mockFetch).toHaveBeenCalledWith("http://api.test/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: "old-refresh-token" }),
      });
    });

    it("should throw ApiError on failed refresh", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
      });

      await expect(
        apiService.refreshAccessToken("expired-token")
      ).rejects.toThrow(ApiError);
    });
  });

  describe("logoutUser", () => {
    it("should send logout request with refresh token", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
      });

      await apiService.logoutUser("refresh-token");

      expect(mockFetch).toHaveBeenCalledWith("http://api.test/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: "refresh-token" }),
      });
    });

    it("should not throw even if logout fails", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      // Should not throw - logout is best-effort
      await expect(
        apiService.logoutUser("token")
      ).resolves.not.toThrow();
    });
  });

  describe("updateUserProgress", () => {
    it("should send batch completions to server", async () => {
      const batchInput = {
        completions: [
          { unitId: "unit-1", lessonId: "lesson-1", sectionId: "sec-1" },
        ],
      };
      const mockResponse = { completion: {} };

      getAccessTokenMock.mockReturnValue("access-token");
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiService.updateUserProgress(
        batchInput
      );

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith("http://api.test/progress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer access-token",
        },
        body: JSON.stringify(batchInput),
      });
    });
  });

  describe("fetchWithAuth - edge cases", () => {
    it("should reject immediately if no access token available", async () => {
      getAccessTokenMock.mockReturnValue(null);

      await expect(
        apiService.getUserProgress()
      ).rejects.toThrow("No access token available.");
    });

    it("should handle 403 errors same as 401 (trigger refresh)", async () => {
      const newTokens = {
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      };
      getAccessTokenMock.mockReturnValue("old-access-token");
      getRefreshTokenMock.mockReturnValue("old-refresh-token");

      // First call fails with 403
      mockFetch.mockResolvedValueOnce({ status: 403, ok: false });
      // Refresh succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(newTokens),
      });
      // Retry succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: "success" }),
      });

      const result = await apiService.getUserProgress();

      expect(result).toEqual({ data: "success" });
      expect(setTokensMock).toHaveBeenCalledWith(newTokens);
    });

    it("should logout if no refresh token available on 401", async () => {
      getAccessTokenMock.mockReturnValue("access-token");
      getRefreshTokenMock.mockReturnValue(null);

      mockFetch.mockResolvedValueOnce({ status: 401, ok: false });

      await expect(
        apiService.getUserProgress()
      ).rejects.toThrow("Session expired. Please log in again.");

      expect(logoutMock).toHaveBeenCalled();
    });
  });
});
