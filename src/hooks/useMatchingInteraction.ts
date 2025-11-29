import { useState, useCallback, useRef } from "react";
import { INTERACTION_CONFIG } from "../config/constants";

// Data transferred during drag-and-drop
interface DragData {
  optionId: string;
  sourcePrompt?: string;
}

interface DraggableOption {
  id: string;
  text: string;
}

interface SavedMatchingState {
  userMatches: { [promptText: string]: string | null };
}

interface UseMatchingInteractionProps {
  allOptions: DraggableOption[];
  prompts: string[];
  savedState: SavedMatchingState;
  setSavedState: React.Dispatch<React.SetStateAction<SavedMatchingState>>;
}

interface UseMatchingInteractionReturn {
  // Visual state
  draggingOptionId: string | null;
  hoveredPromptId: string | null;
  selectedOptionId: string | null;
  selectedSourcePrompt: string | null;

  // Drag handlers (mouse)
  handleDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    dragData: DragData
  ) => void;
  handleDragEnd: () => void;
  handleDragOver: (
    e: React.DragEvent<HTMLDivElement>,
    promptId: string
  ) => void;
  handleDragLeave: (promptId: string) => void;
  handleDrop: (
    e: React.DragEvent<HTMLDivElement>,
    targetPromptText: string
  ) => void;

  // Tap-to-select handlers (touch/click)
  handleOptionClick: (optionId: string, sourcePrompt?: string) => void;
  handlePromptClick: (promptText: string) => void;

  // Touch handlers (long-press for drag)
  handleTouchStart: (
    e: React.TouchEvent<HTMLDivElement>,
    optionId: string,
    sourcePrompt?: string
  ) => void;
  handleTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void;
}

export function useMatchingInteraction({
  allOptions: _allOptions,
  prompts: _prompts,
  savedState,
  setSavedState,
}: UseMatchingInteractionProps): UseMatchingInteractionReturn {
  // Visual feedback state
  const [draggingOptionId, setDraggingOptionId] = useState<string | null>(null);
  const [hoveredPromptId, setHoveredPromptId] = useState<string | null>(null);

  // Tap-to-select state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedSourcePrompt, setSelectedSourcePrompt] = useState<
    string | null
  >(null);

  // Long-press detection for touch
  const longPressTimerRef = useRef<number | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const isDragModeRef = useRef<boolean>(false);

  // Core matching operation - single source of truth
  const performMatch = useCallback(
    (optionId: string, targetPromptText: string, sourcePrompt?: string) => {
      setSavedState((prevState) => {
        const newUserMatches = { ...prevState.userMatches };

        // If the item was moved from another prompt, clear its original spot
        if (sourcePrompt) {
          newUserMatches[sourcePrompt] = null;
        }

        // If target already has an item, it will be "kicked out" back to options pool
        // (we just overwrite it, so it becomes unmatched)

        // Place the new match in the target
        newUserMatches[targetPromptText] = optionId;

        return { userMatches: newUserMatches };
      });
    },
    [setSavedState]
  );

  // Drag handlers
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, dragData: DragData) => {
      e.dataTransfer.setData("application/json", JSON.stringify(dragData));
      setDraggingOptionId(dragData.optionId);
      // Clear tap-to-select states when starting a drag
      setSelectedOptionId(null);
      setSelectedSourcePrompt(null);
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDraggingOptionId(null);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, promptId: string) => {
      e.preventDefault();
      setHoveredPromptId(promptId);
    },
    []
  );

  const handleDragLeave = useCallback((_promptId: string) => {
    setHoveredPromptId(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, targetPromptText: string) => {
      e.preventDefault();
      setHoveredPromptId(null);

      try {
        const data = JSON.parse(
          e.dataTransfer.getData("application/json")
        ) as DragData;
        const { optionId, sourcePrompt } = data;

        if (!optionId) return;

        performMatch(optionId, targetPromptText, sourcePrompt);

        // Clear dragging state immediately after drop
        setDraggingOptionId(null);
      } catch (error) {
        console.error("Failed to parse drag data:", error);
      }
    },
    [performMatch]
  );

  // Tap-to-select handlers
  const handleOptionClick = useCallback(
    (optionId: string, sourcePrompt?: string) => {
      // Select this option for tap-to-select mode
      setSelectedOptionId(optionId);
      setSelectedSourcePrompt(sourcePrompt || null);
      // Clear any drag/hover states from previous interactions
      setDraggingOptionId(null);
      setHoveredPromptId(null);
    },
    []
  );

  const handlePromptClick = useCallback(
    (promptText: string) => {
      // If an option is selected, match it to this prompt
      if (selectedOptionId) {
        performMatch(
          selectedOptionId,
          promptText,
          selectedSourcePrompt || undefined
        );
        // Clear all selection states after matching
        setSelectedOptionId(null);
        setSelectedSourcePrompt(null);
        setDraggingOptionId(null); // Clear any lingering drag state
        setHoveredPromptId(null); // Clear any hover state
      }
    },
    [selectedOptionId, selectedSourcePrompt, performMatch]
  );

  // Touch handlers (long-press detection)
  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleTouchStart = useCallback(
    (
      e: React.TouchEvent<HTMLDivElement>,
      optionId: string,
      _sourcePrompt?: string
    ) => {
      const touch = e.touches[0];
      touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
      isDragModeRef.current = false;

      // Start long-press timer
      clearLongPressTimer();
      longPressTimerRef.current = window.setTimeout(() => {
        // Long press detected - enter drag mode
        isDragModeRef.current = true;
        setDraggingOptionId(optionId);
        // Clear tap-to-select states when entering drag mode
        setSelectedOptionId(null);
        setSelectedSourcePrompt(null);
        // Add haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(INTERACTION_CONFIG.HAPTIC_FEEDBACK_DURATION_MS);
        }
      }, INTERACTION_CONFIG.LONG_PRESS_DURATION_MS);
    },
    [clearLongPressTimer]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!touchStartPosRef.current) return;

      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartPosRef.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartPosRef.current.y);

      // If finger moved more than threshold, cancel long-press (it's a swipe/scroll)
      if (
        deltaX > INTERACTION_CONFIG.TOUCH_MOVE_THRESHOLD_PX ||
        deltaY > INTERACTION_CONFIG.TOUCH_MOVE_THRESHOLD_PX
      ) {
        clearLongPressTimer();
      }

      // If in drag mode, update hover state based on touch position
      if (isDragModeRef.current) {
        // Find which prompt drop zone is under the finger
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = element?.closest("[data-prompt-id]");
        if (dropZone) {
          const promptId = dropZone.getAttribute("data-prompt-id");
          setHoveredPromptId(promptId);
        } else {
          setHoveredPromptId(null);
        }
      }
    },
    [clearLongPressTimer]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      clearLongPressTimer();

      if (isDragModeRef.current) {
        // Drag mode - find drop target
        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = element?.closest("[data-prompt-id]");

        if (dropZone && draggingOptionId) {
          const promptId = dropZone.getAttribute("data-prompt-id");
          if (promptId) {
            // Find the source prompt if dragging from a matched option
            let sourcePrompt: string | undefined;
            for (const [prompt, matchedId] of Object.entries(
              savedState.userMatches
            )) {
              if (matchedId === draggingOptionId) {
                sourcePrompt = prompt;
                break;
              }
            }
            performMatch(draggingOptionId, promptId, sourcePrompt);
          }
        }

        // Clean up drag state
        setDraggingOptionId(null);
        setHoveredPromptId(null);
        isDragModeRef.current = false;
      } else {
        // Not drag mode - this was a tap, but we handle it via onClick
        // No action needed here
      }

      touchStartPosRef.current = null;
    },
    [
      clearLongPressTimer,
      draggingOptionId,
      savedState.userMatches,
      performMatch,
    ]
  );

  return {
    draggingOptionId,
    hoveredPromptId,
    selectedOptionId,
    selectedSourcePrompt,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleOptionClick,
    handlePromptClick,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
