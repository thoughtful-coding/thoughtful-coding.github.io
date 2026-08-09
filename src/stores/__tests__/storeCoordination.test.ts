import { vi } from "vitest";
import { storeCoordinator } from "../storeCoordination";
import type { AuthStateForStores } from "../storeCoordination";
import type { UserId } from "../../types/data";

const AUTHED: AuthStateForStores = {
  isAuthenticated: true,
  userId: "user-1" as UserId,
};
const ANON: AuthStateForStores = { isAuthenticated: false, userId: null };

describe("storeCoordinator", () => {
  afterEach(() => {
    storeCoordinator.publishAuthState(ANON);
  });

  describe("subscribeToAuthState", () => {
    it("immediately calls callback with current state on subscribe", () => {
      const cb = vi.fn();
      const unsub = storeCoordinator.subscribeToAuthState(cb);
      expect(cb).toHaveBeenCalledOnce();
      expect(cb).toHaveBeenCalledWith(storeCoordinator.getCurrentAuthState());
      unsub();
    });

    it("notifies subscriber when auth state is published", () => {
      const cb = vi.fn();
      const unsub = storeCoordinator.subscribeToAuthState(cb);
      cb.mockClear();
      storeCoordinator.publishAuthState(AUTHED);
      expect(cb).toHaveBeenCalledWith(AUTHED);
      unsub();
    });

    it("notifies multiple subscribers independently", () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();
      const unsub1 = storeCoordinator.subscribeToAuthState(cb1);
      const unsub2 = storeCoordinator.subscribeToAuthState(cb2);
      cb1.mockClear();
      cb2.mockClear();

      storeCoordinator.publishAuthState(AUTHED);

      expect(cb1).toHaveBeenCalledWith(AUTHED);
      expect(cb2).toHaveBeenCalledWith(AUTHED);
      unsub1();
      unsub2();
    });

    it("stops notifying after unsubscribing", () => {
      const cb = vi.fn();
      const unsub = storeCoordinator.subscribeToAuthState(cb);
      cb.mockClear();
      unsub();

      storeCoordinator.publishAuthState(AUTHED);
      expect(cb).not.toHaveBeenCalled();
    });
  });

  describe("getCurrentAuthState / publishAuthState", () => {
    it("returns the most recently published state", () => {
      storeCoordinator.publishAuthState(AUTHED);
      expect(storeCoordinator.getCurrentAuthState()).toEqual(AUTHED);

      storeCoordinator.publishAuthState(ANON);
      expect(storeCoordinator.getCurrentAuthState()).toEqual(ANON);
    });
  });
});
