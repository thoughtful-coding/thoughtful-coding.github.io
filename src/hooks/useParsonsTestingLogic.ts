import { useMemo } from "react";
import { useTestingLogic } from "./useTestingLogic";
import type {
  UnitId,
  LessonId,
  SectionId,
  TestCase,
  TestMode,
  CodeBlockItem,
} from "../types/data";
import type { PlacedBlock } from "./useParsonsInteraction";

interface UseParsonsTestingLogicProps {
  unitId: UnitId;
  lessonId: LessonId;
  sectionId: SectionId;
  testMode: TestMode;
  functionToTest: string;
  testCases: TestCase[];
  codeBlockItems: CodeBlockItem[];
  placedBlocks: PlacedBlock[];
}

/**
 * Reconstructs Python code from placed blocks with proper indentation
 */
export function reconstructCodeFromBlocks(
  codeBlockItems: CodeBlockItem[],
  placedBlocks: PlacedBlock[]
): string {
  // Sort blocks by order
  const sortedBlocks = [...placedBlocks].sort((a, b) => a.order - b.order);

  const lines: string[] = [];

  for (const placedBlock of sortedBlocks) {
    const block = codeBlockItems.find((b) => b.id === placedBlock.blockId);
    if (!block) continue;

    for (const line of block.lines) {
      // If the line already has indentation (multi-line blocks), preserve it relative to the block's indent level
      const trimmedLine = line.trimStart();
      const existingIndentSpaces = line.length - trimmedLine.length;
      const totalIndentSpaces =
        placedBlock.indentLevel * 4 + existingIndentSpaces;
      const totalIndentation = " ".repeat(totalIndentSpaces);

      lines.push(totalIndentation + trimmedLine);
    }
  }

  return lines.join("\n");
}

/**
 * Hook for testing Parsons problem solutions
 * Reconstructs code from blocks and runs tests using the same logic as TestingSection
 */
export function useParsonsTestingLogic({
  unitId,
  lessonId,
  sectionId,
  testMode,
  functionToTest,
  testCases,
  codeBlockItems,
  placedBlocks,
}: UseParsonsTestingLogicProps) {
  // Reconstruct code from current block arrangement
  const reconstructedCode = useMemo(() => {
    return reconstructCodeFromBlocks(codeBlockItems, placedBlocks);
  }, [codeBlockItems, placedBlocks]);

  // Use the same testing logic as TestingSection
  const { runTests, testResults, isLoading, error } = useTestingLogic({
    unitId,
    lessonId,
    sectionId,
    testMode,
    functionToTest,
    testCases,
  });

  // Wrapper function to run tests with reconstructed code
  const runParsonsTests = async () => {
    await runTests(reconstructedCode);
  };

  return {
    runTests: runParsonsTests,
    reconstructedCode,
    testResults,
    isLoading,
    error,
  };
}
