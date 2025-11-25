// src/hooks/useAuthHandlers.ts
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogout, CredentialResponse } from "@react-oauth/google";
import { useAuthActions } from "../stores/authStore";

/**
 * Shared auth handlers for login/logout across student and instructor views
 */
export const useAuthHandlers = (options?: { redirectOnLogout?: string }) => {
  const { login, logout } = useAuthActions();
  const navigate = useNavigate();

  const handleLoginSuccess = useCallback(
    async (credentialResponse: CredentialResponse) => {
      if (credentialResponse.credential) {
        try {
          await login(credentialResponse.credential);
        } catch (e) {
          console.error("Login process failed:", e);
        }
      } else {
        console.error("Login failed: No credential returned from Google.");
      }
    },
    [login]
  );

  const handleLoginError = useCallback(() => {
    console.error("Google Login Failed");
  }, []);

  const handleLogout = useCallback(() => {
    googleLogout();
    logout();
    if (options?.redirectOnLogout) {
      navigate(options.redirectOnLogout);
    }
  }, [logout, navigate, options?.redirectOnLogout]);

  return {
    handleLoginSuccess,
    handleLoginError,
    handleLogout,
  };
};
