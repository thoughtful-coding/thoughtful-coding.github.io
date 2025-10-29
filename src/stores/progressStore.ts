import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import * as apiService from "../lib/apiService"; // Your API service
import type {
  SectionCompletionInput as ApiSectionCompletionInput, // Renaming to avoid conflict if we redefine locally
  UserProgressData,
} from "../types/apiServiceTypes";
import { ANONYMOUS_USER_ID_PLACEHOLDER } from "../lib/localStorageUtils";
import { API_GATEWAY_BASE_URL } from "../config";
import { IsoTimestamp, LessonId, SectionId, UnitId } from "../types/data";
import { PROGRESS_CONFIG } from "../config/constants";
import { storeCoordinator } from "./storeCoordination";

export const BASE_PROGRESS_STORE_KEY = PROGRESS_CONFIG.STORAGE_KEY;

// Define SectionCompletionInput to include unitId, as it's needed for store and potentially API
interface SectionCompletionInput extends ApiSectionCompletionInput {
  unitId: UnitId; // Ensure this is part of the action data
  // lessonId and sectionId are already in ApiSectionCompletionInput
}

const EMPTY_COMPLETED_SECTIONS: { [sectionId: SectionId]: IsoTimestamp } = {};

interface ProgressStateData {
  completion: {
    [unitId: UnitId]: {
      [lessonId: LessonId]: {
        // lessonId here is the GUID
        [sectionId: SectionId]: IsoTimestamp; // timestamp string
      };
    };
  };
  penaltyEndTime: number | null;
  offlineActionQueue: SectionCompletionInput[]; // Now uses the extended SectionCompletionInput
  isSyncing: boolean;
  lastSyncError: string | null;
}

interface ProgressActions {
  completeSection: (
    unitId: UnitId,
    lessonId: LessonId,
    sectionId: SectionId
  ) => Promise<void>;
  isSectionComplete: (
    unitId: UnitId,
    lessonId: LessonId,
    sectionId: SectionId
  ) => boolean;
  getCompletedSections: (
    // Returns sections for a specific lesson within a unit
    unitId: UnitId,
    lessonId: LessonId
  ) => {
    [sectionId: SectionId]: IsoTimestamp;
  };
  resetLessonProgress: (unitId: UnitId, lessonId: LessonId) => void;
  resetAllProgress: () => void;
  startPenalty: () => void;
  clearPenalty: () => void;
  setServerProgress: (serverData: UserProgressData) => void;
  processOfflineQueue: () => Promise<void>;
  extractAnonymousCompletions: () => SectionCompletionInput[];
  syncProgressAfterLogin: (
    apiGatewayUrl: string,
    anonymousCompletions: SectionCompletionInput[]
  ) => Promise<UserProgressData>;
  _addToOfflineQueue: (action: SectionCompletionInput) => void;
}

interface ProgressState extends ProgressStateData {
  actions: ProgressActions;
}

const initialProgressData: ProgressStateData = {
  completion: {},
  penaltyEndTime: null,
  offlineActionQueue: [],
  isSyncing: false,
  lastSyncError: null,
};

const createUserSpecificStorage = (baseKey: string): StateStorage => {
  const getEffectiveKey = (): string => {
    const authState = storeCoordinator.getCurrentAuthState();
    const userId = authState.userId || ANONYMOUS_USER_ID_PLACEHOLDER;
    return `${userId}_${baseKey}`;
  };
  return {
    getItem: (name) => localStorage.getItem(getEffectiveKey()),
    setItem: (name, value) => localStorage.setItem(getEffectiveKey(), value),
    removeItem: (name) => localStorage.removeItem(getEffectiveKey()),
  };
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialProgressData,
      actions: {
        _addToOfflineQueue: (action) => {
          set((state) => ({
            offlineActionQueue: [...state.offlineActionQueue, action],
            lastSyncError: null,
          }));
        },
        completeSection: async (unitId, lessonId, sectionId) => {
          const currentUnitCompletions = get().completion[unitId] || {};
          const currentLessonCompletions =
            currentUnitCompletions[lessonId] || {};

          if (currentLessonCompletions[sectionId]) {
            console.log(
              `[ProgressStore] Section ${unitId}/${lessonId}/${sectionId} already complete locally.`
            );
            return;
          }

          const optimisticTimestamp = new Date().toISOString() as IsoTimestamp;

          // Corrected optimistic local update for nested structure
          set((state) => {
            const newCompletion = { ...state.completion }; // Top level copy
            if (!newCompletion[unitId]) {
              newCompletion[unitId] = {};
            }
            const unitCompletion = { ...newCompletion[unitId] }; // Copy unit level
            if (!unitCompletion[lessonId]) {
              unitCompletion[lessonId] = {};
            }
            const lessonCompletion = { ...unitCompletion[lessonId] }; // Copy lesson level

            lessonCompletion[sectionId] = optimisticTimestamp; // Update section
            unitCompletion[lessonId] = lessonCompletion;
            newCompletion[unitId] = unitCompletion;

            return {
              completion: newCompletion,
              lastSyncError: null,
            };
          });
          console.log(
            `[ProgressStore] Optimistically completed ${unitId}/${lessonId}/${sectionId} locally.`
          );

          const authState = storeCoordinator.getCurrentAuthState();
          if (!authState.isAuthenticated) {
            console.log("[ProgressStore] Anonymous user. Local update done.");
            return;
          }

          // Ensure actionToSync includes unitId if your API and SectionCompletionInput type expect it
          const actionToSync: SectionCompletionInput = {
            unitId, // Included unitId
            lessonId,
            sectionId,
            // If your server's SectionCompletionInput doesn't expect unitId (derives it from lessonId),
            // then create a separate type for the API payload. For now, assume it's useful.
          };

          if (navigator.onLine) {
            try {
              const apiGatewayUrl = API_GATEWAY_BASE_URL;

              if (apiGatewayUrl) {
                console.log(
                  `[ProgressStore] Syncing: ${unitId}/${lessonId}/${sectionId}`
                );
                // The API payload for updateUserProgress might only need lessonId and sectionId,
                // if the server can derive unitId from lessonId (GUID).
                // Adjust the payload based on what apiService.updateUserProgress expects.
                // For this example, assuming it takes SectionCompletionInput which now includes unitId.
                const serverResponseState = await apiService.updateUserProgress(
                  apiGatewayUrl,
                  { completions: [actionToSync] } // Send as batch of one
                );
                console.log(
                  `[ProgressStore] Synced: ${unitId}/${lessonId}/${sectionId}.`
                );
                get().actions.setServerProgress(serverResponseState);
              } else {
                throw new Error("Missing token/API URL. Queuing action.");
              }
            } catch (error) {
              console.error(
                `[ProgressStore] Sync failed for ${unitId}/${lessonId}/${sectionId}:`,
                error
              );
              get().actions._addToOfflineQueue(actionToSync);
              set({
                lastSyncError:
                  error instanceof Error ? error.message : String(error),
              });
            }
          } else {
            console.log(
              `[ProgressStore] Offline. Queuing: ${unitId}/${lessonId}/${sectionId}`
            );
            get().actions._addToOfflineQueue(actionToSync);
          }
        },
        setServerProgress: (serverData) => {
          console.log(
            "[ProgressStore] Setting/Merging from server:",
            serverData
          );
          set((state) => {
            // Server data (UserProgressData) should also have the nested structure:
            // { completion: { [unitId]: { [lessonId]: { [sectionId]: timestamp } } } }
            const newCompletionState = JSON.parse(
              JSON.stringify(state.completion)
            );

            for (const unitIdStr in serverData.completion) {
              const unitId = unitIdStr as UnitId;
              if (
                Object.prototype.hasOwnProperty.call(
                  serverData.completion,
                  unitId
                )
              ) {
                const serverUnitCompletions = serverData.completion[unitId];
                if (!newCompletionState[unitId])
                  newCompletionState[unitId] = {};

                for (const lessonIdStr in serverUnitCompletions) {
                  const lessonId = lessonIdStr as LessonId;
                  if (
                    Object.prototype.hasOwnProperty.call(
                      serverUnitCompletions,
                      lessonId
                    )
                  ) {
                    const serverLessonCompletions =
                      serverUnitCompletions[lessonId];
                    if (!newCompletionState[unitId][lessonId])
                      newCompletionState[unitId][lessonId] = {};

                    for (const sectionIdStr in serverLessonCompletions) {
                      const sectionId = sectionIdStr as SectionId;
                      if (
                        Object.prototype.hasOwnProperty.call(
                          serverLessonCompletions,
                          sectionId
                        )
                      ) {
                        // Server is truth for sections it knows about
                        newCompletionState[unitId][lessonId][sectionId] =
                          serverLessonCompletions[sectionId];
                      }
                    }
                  }
                }
              }
            }

            // Filter offline queue: remove actions now confirmed by serverData
            const updatedQueue = state.offlineActionQueue.filter((action) => {
              const serverUnit = serverData.completion[action.unitId];
              if (!serverUnit) return true; // Unit not on server, keep action
              const serverLesson = serverUnit[action.lessonId];
              if (!serverLesson) return true; // Lesson not on server for this unit, keep action
              return !(action.sectionId in serverLesson); // If section is now on server, remove from queue
            });

            return {
              completion: newCompletionState,
              offlineActionQueue: updatedQueue,
              lastSyncError: null, // Sync was successful or merged
            };
          });
          console.log("[ProgressStore] Local state updated with server data.");
        },
        processOfflineQueue: async () => {
          const { isSyncing, offlineActionQueue } = get();
          const authState = storeCoordinator.getCurrentAuthState();

          if (
            !authState.isAuthenticated ||
            isSyncing ||
            offlineActionQueue.length === 0 ||
            !navigator.onLine
          ) {
            return;
          }

          set({ isSyncing: true, lastSyncError: null });
          const queueSnapshot = [...offlineActionQueue];

          try {
            const apiGatewayUrl = API_GATEWAY_BASE_URL;

            if (apiGatewayUrl) {
              // The items in queueSnapshot are SectionCompletionInput, which include unitId
              const serverResponseState = await apiService.updateUserProgress(
                apiGatewayUrl,
                { completions: queueSnapshot }
              );
              console.log("[ProgressStore] Synced offline queue to server.");
              get().actions.setServerProgress(serverResponseState); // This will also filter the queue

              // Redundant filter after setServerProgress, but ensures only truly unsynced remain
              // setServerProgress should ideally handle this fully.
              // For safety, or if setServerProgress's queue filter is different:
              set((state) => ({
                offlineActionQueue: state.offlineActionQueue.filter(
                  (item) =>
                    !queueSnapshot.some(
                      (syncedItem) =>
                        syncedItem.unitId === item.unitId &&
                        syncedItem.lessonId === item.lessonId &&
                        syncedItem.sectionId === item.sectionId
                    )
                ),
              }));
            } else {
              throw new Error("Missing token/API URL for offline sync.");
            }
          } catch (error) {
            console.error(
              "[ProgressStore] Failed to sync offline queue:",
              error
            );
            set({
              lastSyncError:
                error instanceof Error ? error.message : String(error),
            });
          } finally {
            set({ isSyncing: false });
          }
        },
        isSectionComplete: (unitId, lessonId, sectionId) => {
          const unitCompletions = get().completion[unitId];
          if (!unitCompletions) return false;
          const lessonCompletions = unitCompletions[lessonId];
          if (!lessonCompletions) return false;
          return sectionId in lessonCompletions;
        },
        getCompletedSections: (unitId, lessonId) => {
          const unitCompletions = get().completion[unitId];
          if (!unitCompletions) return EMPTY_COMPLETED_SECTIONS;
          return unitCompletions[lessonId] || EMPTY_COMPLETED_SECTIONS;
        },
        resetLessonProgress: (unitId, lessonId) =>
          set((state) => {
            const newCompletion = { ...state.completion };
            if (newCompletion[unitId]) {
              const unitCompletion = { ...newCompletion[unitId] };
              delete unitCompletion[lessonId];
              if (Object.keys(unitCompletion).length === 0) {
                delete newCompletion[unitId]; // Clean up empty unit if no lessons left
              } else {
                newCompletion[unitId] = unitCompletion;
              }
            }
            console.warn(
              `[ProgressStore] Local reset for lesson ${unitId}/${lessonId}.`
            );
            return {
              completion: newCompletion,
              offlineActionQueue: state.offlineActionQueue.filter(
                (act) => !(act.unitId === unitId && act.lessonId === lessonId)
              ),
            };
          }),
        resetAllProgress: () => {
          set({ ...initialProgressData, completion: {} }); // Ensure completion is also reset
          console.warn("[ProgressStore] Local reset for all progress.");
        },
        startPenalty: () =>
          set({
            penaltyEndTime: Date.now() + PROGRESS_CONFIG.PENALTY_DURATION_MS,
          }),
        clearPenalty: () => set({ penaltyEndTime: null }),
        extractAnonymousCompletions: () => {
          // Read anonymous progress from localStorage and convert to completions array
          const anonymousProgressKey = `${ANONYMOUS_USER_ID_PLACEHOLDER}_${BASE_PROGRESS_STORE_KEY}`;
          const anonymousProgressRaw = localStorage.getItem(anonymousProgressKey);
          const anonymousCompletions: SectionCompletionInput[] = [];

          if (anonymousProgressRaw) {
            try {
              const anonymousProgressData = JSON.parse(anonymousProgressRaw);
              const completionData = anonymousProgressData?.state?.completion;
              if (completionData) {
                for (const unitId in completionData) {
                  for (const lessonId in completionData[unitId]) {
                    for (const sectionId in completionData[unitId][lessonId]) {
                      anonymousCompletions.push({
                        unitId: unitId as UnitId,
                        lessonId: lessonId as LessonId,
                        sectionId: sectionId as SectionId,
                      });
                    }
                  }
                }
              }
              console.log(
                `[ProgressStore] Extracted ${anonymousCompletions.length} anonymous completions.`
              );
            } catch (e) {
              console.error("[ProgressStore] Failed to parse anonymous progress", e);
            }
          }

          return anonymousCompletions;
        },
        syncProgressAfterLogin: async (apiGatewayUrl, anonymousCompletions) => {
          // Sync anonymous progress with server after login
          let finalProgress: UserProgressData;

          if (anonymousCompletions.length > 0) {
            console.log(
              `[ProgressStore] Migrating ${anonymousCompletions.length} anonymous completions.`
            );
            finalProgress = await apiService.updateUserProgress(
              apiGatewayUrl,
              { completions: anonymousCompletions }
            );
          } else {
            console.log("[ProgressStore] No anonymous progress to migrate. Fetching server progress.");
            finalProgress = await apiService.getUserProgress(apiGatewayUrl);
          }

          // Update local state with server response
          get().actions.setServerProgress(finalProgress);
          console.log("[ProgressStore] Progress synced after login.");

          return finalProgress;
        },
      },
    }),
    {
      name: BASE_PROGRESS_STORE_KEY,
      storage: createJSONStorage(() =>
        createUserSpecificStorage(BASE_PROGRESS_STORE_KEY)
      ),
      partialize: (state) => ({
        completion: state.completion,
        penaltyEndTime: state.penaltyEndTime,
        offlineActionQueue: state.offlineActionQueue,
        lastSyncError: state.lastSyncError,
      }),
      onRehydrateStorage: () => {
        return (hydratedState, error) => {
          if (error) {
            console.error("[ProgressStore] Error rehydrating:", error);
          } else if (hydratedState) {
            hydratedState.isSyncing = false; // Always reset isSyncing on load
            console.log(
              "[ProgressStore] Rehydrated. Offline queue:",
              hydratedState.offlineActionQueue?.length
            );
          }
        };
      },
    }
  )
);

// Selectors
export const useProgressActions = () =>
  useProgressStore((state) => state.actions);

export const useCompletedSectionsForLesson = (
  unitId: UnitId | undefined | null,
  lessonId: LessonId | undefined | null
): { [sectionId: SectionId]: IsoTimestamp } =>
  useProgressStore((state) => {
    if (!unitId || !lessonId) return EMPTY_COMPLETED_SECTIONS;
    const unitCompletions = state.completion[unitId];
    if (!unitCompletions) return EMPTY_COMPLETED_SECTIONS;
    return unitCompletions[lessonId] || EMPTY_COMPLETED_SECTIONS;
  });

export const useAllCompletions = () =>
  useProgressStore((state) => state.completion);
export const useIsPenaltyActive = (): boolean =>
  useProgressStore(
    (state) =>
      state.penaltyEndTime !== null && Date.now() < state.penaltyEndTime
  );
export const useRemainingPenaltyTime = (): number => {
  const penaltyEndTime = useProgressStore((state) => state.penaltyEndTime);
  if (penaltyEndTime === null || Date.now() >= penaltyEndTime) return 0;
  return Math.ceil((penaltyEndTime - Date.now()) / 1000);
};
export const useIsSyncing = () => useProgressStore((state) => state.isSyncing);
export const useLastSyncError = () =>
  useProgressStore((state) => state.lastSyncError);
export const useOfflineQueueCount = () =>
  useProgressStore((state) => state.offlineActionQueue.length);
