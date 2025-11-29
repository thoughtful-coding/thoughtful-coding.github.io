import { useState } from "react";
import { useInteractiveExample } from "./useInteractiveExample";
import { useTestingLogic, TestResult } from "./useTestingLogic";
import { useTurtleVisualization, TurtleTestResult } from "./useTurtleTesting";
import { useTestingCompletion } from "./useTestingCompletion";
import type {
  UnitId,
  LessonId,
  SectionId,
  TestCase,
  TestMode,
} from "../types/data";

export type LastAction = "run" | "test" | null;

interface UseTestableSectionProps {
  unitId: UnitId;
  lessonId: LessonId;
  sectionId: SectionId;
  visualization?: "console" | "turtle";
  testCases: TestCase[];
  testMode: TestMode;
  functionToTest: string;
  visualThreshold?: number;
  lessonPath?: string;
  libraryCode?: string;
}

interface UseTestableSectionResult {
  // State
  lastAction: LastAction;

  // Run code functionality
  handleRunCode: (code: string) => void;
  isRunningCode: boolean;
  runOutput: string;
  runError: Error | null;

  // Test functionality
  handleRunTests: (code: string) => Promise<void>;
  isRunningTests: boolean;
  testResults: TestResult[] | TurtleTestResult[] | null;
  testError: string | null;

  // Turtle-specific
  turtleCanvasRef: React.RefObject<HTMLDivElement>;
  isVisualTurtleTest: boolean;
  resolvedTestCases: TestCase[];
  isRunningTurtle: boolean;
  turtleRunError: string | null;
  stopExecution: () => void;

  // Combined state
  isLoading: boolean;
  isSectionComplete: boolean;
}

/**
 * Shared hook for sections that support "Run Code" and "Run Tests" functionality.
 * Used by TestingSection and ParsonsSection.
 */
export function useTestableSection({
  unitId,
  lessonId,
  sectionId,
  visualization,
  testCases,
  testMode,
  functionToTest,
  visualThreshold,
  lessonPath,
  libraryCode,
}: UseTestableSectionProps): UseTestableSectionResult {
  const [lastAction, setLastAction] = useState<LastAction>(null);

  // Turtle visualization setup
  const {
    turtleCanvasRef,
    isVisualTurtleTest,
    resolvedTestCases,
    runTurtleCode,
    stopExecution,
    isRunningTurtle,
    turtleRunError,
    turtleTestingHook,
  } = useTurtleVisualization({
    unitId,
    lessonId,
    sectionId,
    visualization,
    testCases,
    visualThreshold,
    functionToTest,
    lessonPath,
  });

  // Console "Run Code" functionality
  const {
    runCode,
    isLoading: isRunningCode,
    output: runOutput,
    error: runError,
  } = useInteractiveExample({
    unitId,
    lessonId,
    sectionId,
    autoComplete: false,
  });

  // Console testing logic
  const consoleTestingHook = useTestingLogic({
    unitId,
    lessonId,
    sectionId,
    testMode,
    functionToTest,
    testCases,
  });

  // Use appropriate testing hook based on test type
  const {
    runTests,
    testResults,
    isLoading: isRunningTests,
    error: testError,
  } = isVisualTurtleTest ? turtleTestingHook : consoleTestingHook;

  // Track completion state
  const isSectionComplete = useTestingCompletion(
    unitId,
    lessonId,
    sectionId,
    testResults
  );

  // Handlers
  const handleRunCode = (code: string) => {
    setLastAction("run");
    if (isVisualTurtleTest) {
      runTurtleCode(code, libraryCode);
    } else {
      runCode(code, libraryCode);
    }
  };

  const handleRunTests = async (code: string) => {
    setLastAction("test");
    await runTests(code, libraryCode);
  };

  const isLoading = isRunningCode || isRunningTests || isRunningTurtle;

  return {
    lastAction,
    handleRunCode,
    isRunningCode,
    runOutput,
    runError,
    handleRunTests,
    isRunningTests,
    testResults,
    testError,
    turtleCanvasRef,
    isVisualTurtleTest,
    resolvedTestCases,
    isRunningTurtle,
    turtleRunError,
    stopExecution,
    isLoading,
    isSectionComplete,
  };
}
