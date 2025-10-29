import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as apiService from "../lib/apiService";
import { API_GATEWAY_BASE_URL } from "../config";
import type {
  UserId,
  AccessTokenId,
  RefreshTokenId,
} from "../types/data";
import { clearAllAnonymousData } from "../lib/localStorageUtils";
import { getProgressSyncOperations } from "../hooks/useStoreCoordination";

export interface UserProfile {
  userId: UserId;
  name?: string;
  email?: string;
  picture?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  accessToken: AccessTokenId | null;
  refreshToken: RefreshTokenId | null;
  isSyncingProgress: boolean;
  sessionHasExpired: boolean;
  actions: {
    login: (googleIdToken: string) => Promise<void>;
    logout: () => Promise<void>;
    setSessionExpired: (hasExpired: boolean) => void;
    setTokens: (tokens: {
      accessToken: AccessTokenId;
      refreshToken: RefreshTokenId;
    }) => void;
    getAccessToken: () => AccessTokenId | null;
    getRefreshToken: () => RefreshTokenId | null;
  };
}

const initialAuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  isSyncingProgress: false,
  sessionHasExpired: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialAuthState,
      actions: {
        login: async (googleIdToken: string) => {
          const apiGatewayUrl = API_GATEWAY_BASE_URL;
          if (!apiGatewayUrl)
            throw new Error("API Gateway URL is not configured.");

          // Step 1: Extract any anonymous progress and drafts before logging in
          const progressOps = getProgressSyncOperations();
          const anonymousCompletions = progressOps.extractAnonymousCompletions();
          const anonymousDrafts = progressOps.extractAnonymousDrafts();

          // Step 2: Log in and get application tokens
          const { accessToken, refreshToken } =
            await apiService.loginWithGoogle(apiGatewayUrl, googleIdToken);

          const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
          const userProfile: UserProfile = {
            userId: decodedToken.sub,
            name: decodedToken.name,
            email: decodedToken.email,
            picture: decodedToken.picture,
          };

          // Step 3: Set the new authentication state immediately
          set({
            isAuthenticated: true,
            accessToken,
            refreshToken,
            user: userProfile,
            isSyncingProgress: true,
            sessionHasExpired: false,
          });

          // Step 4: Sync progress and drafts with server/local storage
          try {
            // Sync completions with server
            await progressOps.syncProgressAfterLogin(
              apiGatewayUrl,
              anonymousCompletions
            );

            // Merge drafts locally (drafts don't sync to server)
            progressOps.mergeDraftsAfterLogin(anonymousDrafts);

            // Clear anonymous data after successful migration
            const hasAnonymousData =
              anonymousCompletions.length > 0 ||
              Object.keys(anonymousDrafts).length > 0;

            if (hasAnonymousData) {
              clearAllAnonymousData();
            }
          } catch (error) {
            console.error("Failed to sync progress after login:", error);
          } finally {
            set({ isSyncingProgress: false });
          }

          // The page does not need to reload.
        },
        logout: async () => {
          const { refreshToken } = get();
          const apiGatewayUrl = API_GATEWAY_BASE_URL;
          if (refreshToken && apiGatewayUrl) {
            try {
              await apiService.logoutUser(apiGatewayUrl, refreshToken);
            } catch (error) {
              console.error(
                "Logout API call failed, proceeding with client-side logout.",
                error
              );
            }
          }

          set({ ...initialAuthState });
          const progressOps = getProgressSyncOperations();
          progressOps.resetAllProgress();

          // A reload is still the cleanest way to ensure all components re-render with anonymous data.
          window.location.reload();
        },
        setSessionExpired: (hasExpired) =>
          set({ sessionHasExpired: hasExpired }),
        setTokens: ({ accessToken, refreshToken }) => {
          set({ accessToken, refreshToken });
        },
        getAccessToken: () => get().accessToken,
        getRefreshToken: () => get().refreshToken,
      },
    }),
    {
      name: "auth-storage-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

export const useAuthActions = () => useAuthStore((state) => state.actions);
