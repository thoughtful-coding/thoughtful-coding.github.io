import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useAuthHandlers } from "../useAuthHandlers";
import { useAuthActions } from "../../stores/authStore";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import type { CredentialResponse } from "@react-oauth/google";

vi.mock("react-router-dom", () => ({ useNavigate: vi.fn() }));
vi.mock("../../stores/authStore");
vi.mock("@react-oauth/google", () => ({ googleLogout: vi.fn() }));

const mockLogin = vi.fn();
const mockLogout = vi.fn();
const mockNavigate = vi.fn();

describe("useAuthHandlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useAuthActions).mockReturnValue({
      login: mockLogin,
      logout: mockLogout,
    } as any);
  });

  describe("handleLoginSuccess", () => {
    it("calls login with the credential token", async () => {
      const { result } = renderHook(() => useAuthHandlers());
      await result.current.handleLoginSuccess({
        credential: "token-xyz",
      } as CredentialResponse);
      expect(mockLogin).toHaveBeenCalledWith("token-xyz");
    });

    it("does not call login when credential is missing", async () => {
      const { result } = renderHook(() => useAuthHandlers());
      await result.current.handleLoginSuccess({} as CredentialResponse);
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it("does not throw when login rejects", async () => {
      mockLogin.mockRejectedValue(new Error("server error"));
      const { result } = renderHook(() => useAuthHandlers());
      await expect(
        result.current.handleLoginSuccess({
          credential: "token",
        } as CredentialResponse)
      ).resolves.toBeUndefined();
    });
  });

  describe("handleLogout", () => {
    it("calls googleLogout and the store logout action", () => {
      const { result } = renderHook(() => useAuthHandlers());
      result.current.handleLogout();
      expect(googleLogout).toHaveBeenCalledOnce();
      expect(mockLogout).toHaveBeenCalledOnce();
    });

    it("navigates when redirectOnLogout is provided", () => {
      const { result } = renderHook(() =>
        useAuthHandlers({ redirectOnLogout: "/login" })
      );
      result.current.handleLogout();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    it("does not navigate when redirectOnLogout is not provided", () => {
      const { result } = renderHook(() => useAuthHandlers());
      result.current.handleLogout();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("handleLoginError", () => {
    it("does not throw", () => {
      const { result } = renderHook(() => useAuthHandlers());
      expect(() => result.current.handleLoginError()).not.toThrow();
    });
  });
});
