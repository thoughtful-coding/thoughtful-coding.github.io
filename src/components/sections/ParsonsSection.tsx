import React, { useMemo, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type {
  ParsonsSectionData,
  UnitId,
  LessonId,
  CodeBlockItem,
} from "../../types/data";
import { useSectionProgress } from "../../hooks/useSectionProgress";
import {
  useParsonsInteraction,
  type SavedParsonsState,
} from "../../hooks/useParsonsInteraction";
import { useParsonsTestingLogic } from "../../hooks/useParsonsTestingLogic";
import { useTurtleVisualization } from "../../hooks/useTurtleTesting";
import { TestResultsArea } from "./TestResultsDisplay";
import { useInteractiveExample } from "../../hooks/useInteractiveExample";
import { INTERACTION_CONFIG } from "../../config/constants";
import styles from "./ParsonsSection.module.css";
import sectionStyles from "./Section.module.css";
import ContentRenderer from "../content_blocks/ContentRenderer";
import SyntaxHighlightedCode from "../SyntaxHighlightedCode";

interface ParsonsSectionProps {
  section: ParsonsSectionData;
  unitId: UnitId;
  lessonId: LessonId;
  lessonPath: string;
}

const ParsonsSection: React.FC<ParsonsSectionProps> = ({
  section,
  unitId,
  lessonId,
  lessonPath,
}) => {
  const storageKey = `parsonsState_${unitId}_${lessonId}_${section.id}`;

  // --- Data Derivation ---
  // Convert codeBlocks to CodeBlockItems with unique IDs
  const codeBlockItems = useMemo<CodeBlockItem[]>(() => {
    return section.codeBlocks.map((block, index) => ({
      id: `block-${index}`,
      lines: block,
      isMultiLine: block.length > 1,
    }));
  }, [section.codeBlocks]);

  // Detect if indentation mode should be enabled (check for control flow keywords at block start)
  const indentationEnabled = useMemo(() => {
    const keywords = [
      "if",
      "for",
      "def",
      "while",
      "class",
      "elif",
      "else",
      "try",
      "except",
      "finally",
      "with",
    ];
    return section.codeBlocks.some((block) => {
      if (block.length === 0) return false;
      const firstLine = block[0].trim();
      return keywords.some((keyword) => {
        return (
          firstLine.startsWith(keyword + " ") ||
          firstLine.startsWith(keyword + "(") ||
          firstLine === keyword ||
          firstLine.startsWith(keyword + ":")
        );
      });
    });
  }, [section.codeBlocks]);

  // --- State and Completion Logic ---
  const checkCompletion = (state: SavedParsonsState): boolean => {
    // Section is complete when tests have passed
    return state.testsPassedOnce;
  };

  const [savedState, setSavedState, isSectionComplete] =
    useSectionProgress<SavedParsonsState>(
      unitId,
      lessonId,
      section.id,
      storageKey,
      { placedBlocks: [], testsPassedOnce: false },
      checkCompletion
    );

  // --- Interaction Logic ---
  const interaction = useParsonsInteraction({
    savedState,
    setSavedState,
    indentationEnabled,
  });

  // Track which action was last performed (for displaying appropriate output)
  const [lastAction, setLastAction] = useState<"run" | "test" | null>(null);

  // --- Turtle Visualization Setup ---
  const {
    turtleCanvasRef,
    isVisualTurtleTest,
    resolvedTestCases,
    runTurtleCode,
    isRunningTurtle,
    turtleRunError,
    turtleTestingHook,
  } = useTurtleVisualization({
    unitId,
    lessonId,
    sectionId: section.id,
    visualization: section.visualization,
    testCases: section.testCases,
    visualThreshold: section.visualThreshold,
    functionToTest: section.functionToTest,
    lessonPath,
  });

  // --- Console "Run Code" Logic ---
  const {
    runCode,
    isLoading: isRunningCode,
    output: runOutput,
    error: runError,
  } = useInteractiveExample({
    unitId,
    lessonId,
    sectionId: section.id,
    autoComplete: false,
  });

  // --- Console Testing Logic ---
  const consoleTestingHook = useParsonsTestingLogic({
    unitId,
    lessonId,
    sectionId: section.id,
    testMode: section.testMode,
    functionToTest: section.functionToTest,
    testCases: section.testCases,
    codeBlockItems,
    placedBlocks: savedState.placedBlocks,
  });

  // Get reconstructed code from console testing hook (computed there, used for both test types)
  const { reconstructedCode } = consoleTestingHook;

  // Use appropriate testing hook based on test type
  const {
    runTests,
    testResults,
    isLoading: isRunningTests,
    error: testError,
  } = isVisualTurtleTest ? turtleTestingHook : consoleTestingHook;

  // Update testsPassedOnce when all tests pass
  useEffect(() => {
    if (testResults && testResults.every((r) => r.passed)) {
      setSavedState((prev) => ({ ...prev, testsPassedOnce: true }));
    }
  }, [testResults, setSavedState]);

  // --- Rendering Logic ---
  // Determine which blocks are unplaced (not in the solution area)
  const unplacedBlocks = useMemo(() => {
    const placedBlockIds = new Set(
      savedState.placedBlocks.map((pb) => pb.blockId)
    );
    return codeBlockItems.filter((block) => !placedBlockIds.has(block.id));
  }, [codeBlockItems, savedState.placedBlocks]);

  // Sort placed blocks by order
  const sortedPlacedBlocks = useMemo(() => {
    return [...savedState.placedBlocks].sort((a, b) => a.order - b.order);
  }, [savedState.placedBlocks]);

  // Handle running code (just execute, no tests)
  const handleRunCode = () => {
    setLastAction("run");
    if (isVisualTurtleTest) {
      runTurtleCode(reconstructedCode);
    } else {
      runCode(reconstructedCode);
    }
  };

  // Handle running tests
  const handleRunTests = async () => {
    setLastAction("test");
    try {
      await runTests(reconstructedCode);
    } catch (error) {
      console.error("Failed to run tests:", error);
    }
  };

  const isLoading = isRunningCode || isRunningTests || isRunningTurtle;
  const displayError = isVisualTurtleTest
    ? turtleRunError || testError
    : testError;

  return (
    <section id={section.id} className={sectionStyles.section}>
      <h2 className={sectionStyles.title}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          disallowedElements={["p"]}
          unwrapDisallowed={true}
        >
          {section.title}
        </ReactMarkdown>
      </h2>
      <div className={sectionStyles.content}>
        <ContentRenderer content={section.content} lessonPath={lessonPath} />
      </div>

      <div className={styles.parsonsContainer}>
        {/* Indentation mode indicator */}
        {indentationEnabled && (
          <div className={styles.modeIndicator}>
            2-D Mode: Use indent/outdent controls to adjust indentation
          </div>
        )}

        {/* Solution area - where blocks are placed */}
        <h4>Your Solution:</h4>
        <div
          className={styles.solutionArea}
          data-testid="parsons-solution-area"
        >
          <div className={styles.solutionBlocks}>
            {sortedPlacedBlocks.length === 0 ? (
              <div
                className={`${styles.emptyDropZone} ${
                  interaction.selectedBlockId || interaction.draggingBlockId
                    ? styles.emptyDropZoneActive
                    : ""
                }`}
                data-testid="parsons-empty-drop-zone"
                data-drop-position="0"
                onClick={() => interaction.handlePositionClick(0)}
                onDragOver={(e) => interaction.handleDragOver(e, 0)}
                onDragLeave={interaction.handleDragLeave}
                onDrop={(e) => interaction.handleDrop(e, 0)}
              >
                {interaction.selectedBlockId
                  ? "Click here to place selected block"
                  : "Click or drag code blocks here to build your solution"}
              </div>
            ) : (
              <>
                {sortedPlacedBlocks.map((placedBlock, index) => {
                  const block = codeBlockItems.find(
                    (b) => b.id === placedBlock.blockId
                  );
                  if (!block) return null;

                  const isSelected =
                    interaction.selectedBlockId === placedBlock.blockId;
                  const isDragging =
                    interaction.draggingBlockId === placedBlock.blockId;

                  return (
                    <div
                      key={placedBlock.blockId}
                      className={styles.placedBlockWrapper}
                    >
                      {/* Drop zone above this block */}
                      <div
                        className={`${styles.dropZone} ${
                          interaction.selectedBlockId ||
                          interaction.draggingBlockId
                            ? styles.dropZoneActive
                            : ""
                        } ${
                          interaction.hoveredPosition === index
                            ? styles.dropZoneHover
                            : ""
                        }`}
                        data-testid={`parsons-drop-zone-${index}`}
                        data-drop-position={index}
                        onClick={() => interaction.handlePositionClick(index)}
                        onDragOver={(e) => interaction.handleDragOver(e, index)}
                        onDragLeave={interaction.handleDragLeave}
                        onDrop={(e) => interaction.handleDrop(e, index)}
                      />

                      <div
                        className={`${styles.placedBlockRow} ${
                          isSelected ? styles.selected : ""
                        } ${isDragging ? styles.dragging : ""}`}
                        data-testid={`parsons-placed-block-${index}`}
                        style={{
                          marginLeft: `${placedBlock.indentLevel * 24}px`,
                        }}
                        draggable
                        onClick={(e) => {
                          e.stopPropagation();
                          interaction.handleBlockClick(
                            placedBlock.blockId,
                            "solution",
                            index
                          );
                        }}
                        onDragStart={(e) =>
                          interaction.handleDragStart(e, {
                            blockId: placedBlock.blockId,
                            sourceType: "solution",
                            currentOrder: index,
                          })
                        }
                        onDragEnd={interaction.handleDragEnd}
                        onTouchStart={(e) =>
                          interaction.handleTouchStart(
                            e,
                            placedBlock.blockId,
                            "solution",
                            index
                          )
                        }
                        onTouchMove={interaction.handleTouchMove}
                        onTouchEnd={interaction.handleTouchEnd}
                      >
                        <span className={styles.lineNumber}>{index + 1}</span>
                        <div className={styles.placedBlock}>
                          <SyntaxHighlightedCode
                            code={block.lines.join("\n")}
                            className={styles.blockContent}
                          />
                          <div className={styles.blockControls}>
                            {indentationEnabled && (
                              <>
                                <button
                                  className={styles.controlButton}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    interaction.handleOutdent(
                                      placedBlock.blockId
                                    );
                                  }}
                                  disabled={placedBlock.indentLevel === 0}
                                  title="Decrease indentation"
                                >
                                  ◀
                                </button>
                                <button
                                  className={styles.controlButton}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    interaction.handleIndent(
                                      placedBlock.blockId
                                    );
                                  }}
                                  disabled={
                                    placedBlock.indentLevel >=
                                    INTERACTION_CONFIG.MAX_INDENT_LEVEL
                                  }
                                  title="Increase indentation"
                                >
                                  ▶
                                </button>
                              </>
                            )}
                            <button
                              className={styles.controlButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                interaction.handleRemoveBlock(
                                  placedBlock.blockId
                                );
                              }}
                              title="Remove from solution"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* Drop zone at the end */}
                <div
                  className={`${styles.dropZone} ${
                    interaction.selectedBlockId || interaction.draggingBlockId
                      ? styles.dropZoneActive
                      : ""
                  } ${
                    interaction.hoveredPosition === sortedPlacedBlocks.length
                      ? styles.dropZoneHover
                      : ""
                  }`}
                  data-testid={`parsons-drop-zone-${sortedPlacedBlocks.length}`}
                  data-drop-position={sortedPlacedBlocks.length}
                  onClick={() =>
                    interaction.handlePositionClick(sortedPlacedBlocks.length)
                  }
                  onDragOver={(e) =>
                    interaction.handleDragOver(e, sortedPlacedBlocks.length)
                  }
                  onDragLeave={interaction.handleDragLeave}
                  onDrop={(e) =>
                    interaction.handleDrop(e, sortedPlacedBlocks.length)
                  }
                />
              </>
            )}
          </div>
        </div>

        {/* Block pool - unplaced blocks */}
        <div className={styles.blockPool} data-testid="parsons-block-pool">
          <h4>Code Blocks:</h4>
          {unplacedBlocks.length === 0 ? (
            <div className={styles.emptyPool}>All blocks have been placed!</div>
          ) : (
            unplacedBlocks.map((block, index) => {
              const isSelected = interaction.selectedBlockId === block.id;
              const isDragging = interaction.draggingBlockId === block.id;

              return (
                <div
                  key={block.id}
                  className={`${styles.draggableBlock} ${
                    isSelected ? styles.selected : ""
                  } ${isDragging ? styles.dragging : ""}`}
                  data-testid={`parsons-unplaced-block-${index}`}
                  draggable
                  onClick={() => interaction.handleBlockClick(block.id, "pool")}
                  onDragStart={(e) =>
                    interaction.handleDragStart(e, {
                      blockId: block.id,
                      sourceType: "pool",
                    })
                  }
                  onDragEnd={interaction.handleDragEnd}
                  onTouchStart={(e) =>
                    interaction.handleTouchStart(e, block.id, "pool")
                  }
                  onTouchMove={interaction.handleTouchMove}
                  onTouchEnd={interaction.handleTouchEnd}
                >
                  <SyntaxHighlightedCode code={block.lines.join("\n")} />
                </div>
              );
            })
          )}
        </div>

        {/* Control buttons */}
        <div className={styles.controls}>
          <button
            className={styles.runCodeButton}
            data-testid="parsons-run-code-button"
            disabled={sortedPlacedBlocks.length === 0 || isLoading}
            onClick={handleRunCode}
          >
            {isVisualTurtleTest && isRunningTurtle
              ? "Executing..."
              : isRunningCode
                ? "Running..."
                : "Run Code"}
          </button>
          <button
            className={styles.testButton}
            data-testid="parsons-run-tests-button"
            disabled={sortedPlacedBlocks.length === 0 || isLoading}
            onClick={handleRunTests}
          >
            {isRunningTests ? "Testing..." : "Run Tests"}
          </button>
        </div>

        <TestResultsArea
          lastAction={lastAction}
          runOutput={runOutput}
          runError={runError}
          testResults={testResults}
          testError={testError}
          isVisualTurtleTest={isVisualTurtleTest}
          turtleRunError={turtleRunError}
          turtleCanvasRef={turtleCanvasRef}
          resolvedTestCases={resolvedTestCases}
          isRunningTests={isRunningTests}
          visualThreshold={section.visualThreshold || 0.95}
          lessonPath={lessonPath}
        />
      </div>

      {/* Completion message */}
      {isSectionComplete && (
        <div className={sectionStyles.completionMessage}>
          Great job! You've arranged the code correctly and all tests pass!
        </div>
      )}
    </section>
  );
};

export default ParsonsSection;
