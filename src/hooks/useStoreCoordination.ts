/**
 * Store Coordination Hook
 *
 * This hook coordinates interactions between auth and progress stores
 * without creating tight coupling or circular dependencies.
 */

import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { useProgressStore } from "../stores/progressStore";
import { storeCoordinator } from "../stores/storeCoordination";

/**
 * Coordinates auth state with other stores that need to know about it.
 * Should be used at the app root level.
 */
export function useStoreCoordination() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const processOfflineQueue = useProgressStore(state => state.actions.processOfflineQueue);

  // Publish auth state changes to the coordinator
  useEffect(() => {
    storeCoordinator.publishAuthState({
      isAuthenticated,
      userId: user?.userId || null,
    });
  }, [isAuthenticated, user?.userId]);

  // Process offline queue when coming back online or when auth state changes
  useEffect(() => {
    if (isAuthenticated && navigator.onLine) {
      processOfflineQueue();
    }
  }, [isAuthenticated, processOfflineQueue]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      if (isAuthenticated) {
        processOfflineQueue();
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [isAuthenticated, processOfflineQueue]);
}

/**
 * Progress sync operations that need to be called from auth flow.
 * This provides a clean interface without direct store coupling.
 */
export interface ProgressSyncOperations {
  setServerProgress: (serverData: any) => void;
  resetAllProgress: () => void;
  extractAnonymousCompletions: () => any[];
  syncProgressAfterLogin: (apiGatewayUrl: string, anonymousCompletions: any[]) => Promise<any>;
}

/**
 * Get progress sync operations for use in auth flows.
 * This is used by authStore to interact with progressStore without direct import.
 */
export function getProgressSyncOperations(): ProgressSyncOperations {
  const progressStore = useProgressStore.getState();
  return {
    setServerProgress: progressStore.actions.setServerProgress,
    resetAllProgress: progressStore.actions.resetAllProgress,
    extractAnonymousCompletions: progressStore.actions.extractAnonymousCompletions,
    syncProgressAfterLogin: progressStore.actions.syncProgressAfterLogin,
  };
}
