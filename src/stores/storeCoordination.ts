/**
 * Store Coordination Layer
 *
 * This module provides a way for stores to communicate without direct imports,
 * preventing circular dependencies and tight coupling.
 */

import type { UserId } from "../types/data";

// Type for auth state that other stores need to know about
export interface AuthStateForStores {
  isAuthenticated: boolean;
  userId: UserId | null;
}

// Subscribers to auth state changes
type AuthStateSubscriber = (authState: AuthStateForStores) => void;

/**
 * Read initial auth state from localStorage before stores initialize.
 * This ensures progressStore uses the correct localStorage key during rehydration.
 */
function getInitialAuthState(): AuthStateForStores {
  try {
    const stored = localStorage.getItem("auth-storage-v2");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.state?.isAuthenticated && parsed.state?.user?.userId) {
        return {
          isAuthenticated: true,
          userId: parsed.state.user.userId,
        };
      }
    }
  } catch (error) {
    console.error(
      "[StoreCoordinator] Failed to read initial auth state:",
      error
    );
  }
  return { isAuthenticated: false, userId: null };
}

class StoreCoordinator {
  private authStateSubscribers: Set<AuthStateSubscriber> = new Set();
  private currentAuthState: AuthStateForStores = getInitialAuthState();

  /**
   * Subscribe to auth state changes
   */
  subscribeToAuthState(callback: AuthStateSubscriber): () => void {
    this.authStateSubscribers.add(callback);
    // Immediately call with current state
    callback(this.currentAuthState);

    // Return unsubscribe function
    return () => {
      this.authStateSubscribers.delete(callback);
    };
  }

  /**
   * Publish auth state changes (called by authStore)
   */
  publishAuthState(authState: AuthStateForStores): void {
    this.currentAuthState = authState;
    this.authStateSubscribers.forEach((subscriber) => subscriber(authState));
  }

  /**
   * Get current auth state synchronously (for initialization)
   */
  getCurrentAuthState(): AuthStateForStores {
    return this.currentAuthState;
  }
}

// Singleton instance
export const storeCoordinator = new StoreCoordinator();
