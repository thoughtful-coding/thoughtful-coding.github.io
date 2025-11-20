import { useState, useCallback, useRef } from "react";
import { INTERACTION_CONFIG } from "../config/constants";

// Represents a placed block in the solution area
export interface PlacedBlock {
  blockId: string;
  order: number;
  indentLevel: number;
}

// State saved to localStorage
export interface SavedParsonsState {
  placedBlocks: PlacedBlock[];
  testsPassedOnce: boolean;
}

// Data transferred during drag-and-drop
interface DragData {
  blockId: string;
  sourceType: "pool" | "solution"; // Where the block is being dragged from
  currentOrder?: number; // If from solution, what's its current order
}

interface UseParsonsInteractionProps {
  savedState: SavedParsonsState;
  setSavedState: React.Dispatch<React.SetStateAction<SavedParsonsState>>;
  indentationEnabled: boolean;
}

interface UseParsonsInteractionReturn {
  // Visual state
  draggingBlockId: string | null;
  hoveredPosition: number | null; // Position in solution where drop would occur
  selectedBlockId: string | null;
  selectedSourceType: "pool" | "solution" | null;

  // Drag handlers (mouse)
  handleDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    dragData: DragData
  ) => void;
  handleDragEnd: () => void;
  handleDragOver: (
    e: React.DragEvent<HTMLDivElement>,
    position: number
  ) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, position: number) => void;

  // Click handlers
  handleBlockClick: (
    blockId: string,
    sourceType: "pool" | "solution",
    currentOrder?: number
  ) => void;
  handlePositionClick: (position: number) => void;

  // Touch handlers
  handleTouchStart: (
    e: React.TouchEvent<HTMLDivElement>,
    blockId: string,
    sourceType: "pool" | "solution",
    currentOrder?: number
  ) => void;
  handleTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void;

  // Indentation controls
  handleIndent: (blockId: string) => void;
  handleOutdent: (blockId: string) => void;

  // Remove block from solution
  handleRemoveBlock: (blockId: string) => void;
}

export function useParsonsInteraction({
  savedState,
  setSavedState,
  indentationEnabled,
}: UseParsonsInteractionProps): UseParsonsInteractionReturn {
  // Visual feedback state
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<number | null>(null);

  // Click-to-select state
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedSourceType, setSelectedSourceType] = useState<
    "pool" | "solution" | null
  >(null);
  // Note: selectedCurrentOrder is tracked for potential future use (e.g., reordering within solution)
  const [_selectedCurrentOrder, setSelectedCurrentOrder] = useState<
    number | undefined
  >(undefined);

  // Long-press detection for touch
  const longPressTimerRef = useRef<number | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const isDragModeRef = useRef<boolean>(false);

  // Core operation: Add or move a block to a specific position
  const placeBlock = useCallback(
    (blockId: string, position: number, sourceType: "pool" | "solution") => {
      setSavedState((prevState) => {
        let newPlacedBlocks = [...prevState.placedBlocks];

        // Remove block from its current position if coming from solution
        if (sourceType === "solution") {
          newPlacedBlocks = newPlacedBlocks.filter(
            (pb) => pb.blockId !== blockId
          );
        }

        // Insert at new position with default indentation
        const newBlock: PlacedBlock = {
          blockId,
          order: position,
          indentLevel: 0,
        };

        // Find where to insert in the array
        const insertIndex = newPlacedBlocks.findIndex(
          (pb) => pb.order >= position
        );

        if (insertIndex === -1) {
          // Insert at end
          newPlacedBlocks.push(newBlock);
        } else {
          // Insert at specific position
          newPlacedBlocks.splice(insertIndex, 0, newBlock);
        }

        // Renumber all blocks to maintain sequential order
        newPlacedBlocks = newPlacedBlocks.map((pb, idx) => ({
          ...pb,
          order: idx,
        }));

        return {
          ...prevState,
          placedBlocks: newPlacedBlocks,
        };
      });
    },
    [setSavedState]
  );

  // Remove block from solution (send back to pool)
  const handleRemoveBlock = useCallback(
    (blockId: string) => {
      setSavedState((prevState) => {
        const newPlacedBlocks = prevState.placedBlocks
          .filter((pb) => pb.blockId !== blockId)
          .map((pb, idx) => ({ ...pb, order: idx })); // Renumber

        return {
          ...prevState,
          placedBlocks: newPlacedBlocks,
        };
      });
    },
    [setSavedState]
  );

  // Indent/outdent operations
  const handleIndent = useCallback(
    (blockId: string) => {
      if (!indentationEnabled) return;

      setSavedState((prevState) => {
        const newPlacedBlocks = prevState.placedBlocks.map((pb) =>
          pb.blockId === blockId
            ? {
                ...pb,
                indentLevel: Math.min(
                  pb.indentLevel + 1,
                  INTERACTION_CONFIG.MAX_INDENT_LEVEL
                ),
              }
            : pb
        );

        return {
          ...prevState,
          placedBlocks: newPlacedBlocks,
        };
      });
    },
    [setSavedState, indentationEnabled]
  );

  const handleOutdent = useCallback(
    (blockId: string) => {
      if (!indentationEnabled) return;

      setSavedState((prevState) => {
        const newPlacedBlocks = prevState.placedBlocks.map((pb) =>
          pb.blockId === blockId
            ? { ...pb, indentLevel: Math.max(pb.indentLevel - 1, 0) } // Min 0
            : pb
        );

        return {
          ...prevState,
          placedBlocks: newPlacedBlocks,
        };
      });
    },
    [setSavedState, indentationEnabled]
  );

  // Drag handlers
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, dragData: DragData) => {
      e.dataTransfer.setData("application/json", JSON.stringify(dragData));
      setDraggingBlockId(dragData.blockId);
      // Clear click-to-select states
      setSelectedBlockId(null);
      setSelectedSourceType(null);
      setSelectedCurrentOrder(undefined);
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDraggingBlockId(null);
    setHoveredPosition(null);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, position: number) => {
      e.preventDefault();
      setHoveredPosition(position);
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    setHoveredPosition(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, position: number) => {
      e.preventDefault();
      setHoveredPosition(null);

      try {
        const data = JSON.parse(
          e.dataTransfer.getData("application/json")
        ) as DragData;
        const { blockId, sourceType } = data;

        if (!blockId) return;

        placeBlock(blockId, position, sourceType);
        setDraggingBlockId(null);
      } catch (error) {
        console.error("Failed to parse drag data:", error);
      }
    },
    [placeBlock]
  );

  // Click-to-select handlers
  const handleBlockClick = useCallback(
    (
      blockId: string,
      sourceType: "pool" | "solution",
      currentOrder?: number
    ) => {
      setSelectedBlockId(blockId);
      setSelectedSourceType(sourceType);
      setSelectedCurrentOrder(currentOrder);
      // Clear drag states
      setDraggingBlockId(null);
      setHoveredPosition(null);
    },
    []
  );

  const handlePositionClick = useCallback(
    (position: number) => {
      if (selectedBlockId && selectedSourceType) {
        placeBlock(selectedBlockId, position, selectedSourceType);
        // Clear selection
        setSelectedBlockId(null);
        setSelectedSourceType(null);
        setSelectedCurrentOrder(undefined);
      }
    },
    [selectedBlockId, selectedSourceType, placeBlock]
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
      blockId: string,
      _sourceType: "pool" | "solution",
      _currentOrder?: number
    ) => {
      const touch = e.touches[0];
      touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
      isDragModeRef.current = false;

      // Start long-press timer
      clearLongPressTimer();
      longPressTimerRef.current = window.setTimeout(() => {
        // Long press detected - enter drag mode
        isDragModeRef.current = true;
        setDraggingBlockId(blockId);
        // Clear click-to-select states
        setSelectedBlockId(null);
        setSelectedSourceType(null);
        setSelectedCurrentOrder(undefined);
        // Haptic feedback
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

      // If finger moved more than threshold, cancel long-press (it's a scroll)
      if (
        deltaX > INTERACTION_CONFIG.TOUCH_MOVE_THRESHOLD_PX ||
        deltaY > INTERACTION_CONFIG.TOUCH_MOVE_THRESHOLD_PX
      ) {
        clearLongPressTimer();
      }

      // If in drag mode, update hover state based on touch position
      if (isDragModeRef.current) {
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = element?.closest("[data-drop-position]");
        if (dropZone) {
          const position = dropZone.getAttribute("data-drop-position");
          setHoveredPosition(position ? parseInt(position) : null);
        } else {
          setHoveredPosition(null);
        }
      }
    },
    [clearLongPressTimer]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      clearLongPressTimer();

      if (isDragModeRef.current && draggingBlockId) {
        // Drag mode - find drop target
        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = element?.closest("[data-drop-position]");

        if (dropZone) {
          const position = dropZone.getAttribute("data-drop-position");
          if (position !== null) {
            // Determine source type
            const sourceType = savedState.placedBlocks.some(
              (pb) => pb.blockId === draggingBlockId
            )
              ? "solution"
              : "pool";
            placeBlock(draggingBlockId, parseInt(position), sourceType);
          }
        }

        // Clean up drag state
        setDraggingBlockId(null);
        setHoveredPosition(null);
        isDragModeRef.current = false;
      }

      touchStartPosRef.current = null;
    },
    [clearLongPressTimer, draggingBlockId, savedState.placedBlocks, placeBlock]
  );

  return {
    draggingBlockId,
    hoveredPosition,
    selectedBlockId,
    selectedSourceType,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleBlockClick,
    handlePositionClick,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleIndent,
    handleOutdent,
    handleRemoveBlock,
  };
}
