import { useState, useCallback, useRef, useMemo } from "react";
import type {
  UnitId,
  LessonId,
  SectionId,
  TestCase,
  CourseId,
} from "../types/data";
import type { RealTurtleInstance } from "../lib/turtleRenderer";
import { compareTurtleImages } from "../lib/turtleComparison";
import type { TurtleComparisonResult } from "../lib/turtleComparison";
import { useProgressActions } from "../stores/progressStore";
import { useTurtleExecution } from "./useTurtleExecution";
import { resolveImagePath } from "../lib/dataHelpers";

export interface TurtleTestResult {
  description: string;
  passed: boolean;
  similarity: number;
  referenceImage: string;
  studentImageDataURL?: string;
  comparisonResult?: TurtleComparisonResult;
}

interface UseTurtleTestingProps {
  unitId: UnitId;
  lessonId: LessonId;
  sectionId: SectionId;
  testCases: TestCase[];
  visualThreshold?: number;
  turtleInstance: RealTurtleInstance | null;
  runTurtleCode: (code: string, libraryCode?: string) => Promise<unknown>;
  functionToTest?: string;
}

/**
 * Removes trailing unindented executable code from the bottom of the user's code.
 * Keeps imports, function/class definitions, but removes unindented statements at the end.
 * This allows testing functions without executing module-level code that calls them.
 */
const stripTrailingMainCode = (code: string): string => {
  const lines = code.split("\n");
  let lastDefLine = -1;

  // Find the last line that's part of a function/class definition
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Check if this is a def/class line
    if (trimmed.startsWith("def ") || trimmed.startsWith("class ")) {
      lastDefLine = i;
    } else if (
      lastDefLine >= 0 &&
      (line.startsWith(" ") || line.startsWith("\t"))
    ) {
      // This is an indented line after a def/class, update lastDefLine
      lastDefLine = i;
    }
  }

  // If we found function/class definitions, only include up to the last def line
  if (lastDefLine >= 0) {
    return lines.slice(0, lastDefLine + 1).join("\n");
  }

  // If no functions found, return original code (might be __main__ mode)
  return code;
};

export const useTurtleTesting = ({
  unitId,
  lessonId,
  sectionId,
  testCases,
  visualThreshold = 0.95,
  turtleInstance,
  runTurtleCode,
  functionToTest,
}: UseTurtleTestingProps) => {
  const { completeSection, incrementAttemptCounter } = useProgressActions();
  const [testResults, setTestResults] = useState<TurtleTestResult[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const runTests = useCallback(
    async (userCode: string, libraryCode?: string) => {
      setIsRunningTests(true);
      setTestResults(null);
      setError(null);

      try {
        if (!turtleInstance) {
          throw new Error("Turtle instance not ready");
        }

        const results: TurtleTestResult[] = [];

        // Filter test cases that have reference images
        const visualTestCases = testCases.filter((tc) => tc.referenceImage);

        if (visualTestCases.length === 0) {
          throw new Error("No visual test cases found");
        }

        for (const testCase of visualTestCases) {
          if (!testCase.referenceImage) continue;

          // Update results to show we're about to run this test
          // This will trigger the UI to show the current test's reference image
          setTestResults([...results]);

          try {
            // Build code to execute for this test case
            let codeToRun: string;

            // If testing a function (not __main__), strip trailing code and call the function
            if (functionToTest && functionToTest !== "__main__") {
              // Strip trailing unindented code to avoid executing module-level calls
              const strippedCode = stripTrailingMainCode(userCode);
              const inputArgs = testCase.input
                ? testCase.input.map((arg) => JSON.stringify(arg)).join(", ")
                : "";
              // Define the function, then call it
              codeToRun = `${strippedCode}\n${functionToTest}(${inputArgs})`;
            } else {
              // For __main__ mode, run the entire code as-is
              codeToRun = userCode;
            }

            // Run the turtle code
            await runTurtleCode(codeToRun, libraryCode);

            // Wait for p5.js to render the final frame (fills render on next draw cycle)
            // Need two frames: one for p5 to process, one to ensure canvas is updated
            await new Promise((r) => requestAnimationFrame(r));
            await new Promise((r) => requestAnimationFrame(r));

            // Get the student's canvas as data URL
            const studentImageDataURL = turtleInstance.getCanvasDataURL();

            if (!studentImageDataURL) {
              throw new Error("Could not capture student canvas");
            }

            // Compare against reference image
            const comparisonResult = await compareTurtleImages(
              studentImageDataURL,
              testCase.referenceImage,
              {
                threshold: visualThreshold,
                includeDiff: true,
              }
            );

            const testResult = {
              description: testCase.description,
              passed: comparisonResult.passed,
              similarity: comparisonResult.similarity,
              referenceImage: testCase.referenceImage,
              studentImageDataURL,
              comparisonResult,
            };

            results.push(testResult);

            // Update results after completing this test
            setTestResults([...results]);

            // Stop on first failure
            if (!testResult.passed) {
              break;
            }
          } catch (testError) {
            results.push({
              description: testCase.description,
              passed: false,
              similarity: 0,
              referenceImage: testCase.referenceImage || "",
              studentImageDataURL: undefined,
              comparisonResult: undefined,
            });
            console.error(`Test failed: ${testCase.description}`, testError);
            // Update results after error
            setTestResults([...results]);
            // Stop on error as well
            break;
          }
        }

        setTestResults(results);

        // Check if all tests passed
        const allPassed = results.every((res) => res.passed);
        if (allPassed) {
          // Pass userCode as firstCompletionContent for academic integrity auditing
          completeSection(unitId, lessonId, sectionId, undefined, userCode);
        } else {
          // Increment attempt counter on test failure
          incrementAttemptCounter(unitId, lessonId, sectionId);
        }
      } catch (e) {
        // Increment attempt counter on error (code failed to execute)
        incrementAttemptCounter(unitId, lessonId, sectionId);
        const errorMessage =
          e instanceof Error ? e.message : "An unknown error occurred.";
        console.error("Visual testing execution error:", errorMessage);
        setError(errorMessage);
      } finally {
        setIsRunningTests(false);
      }
    },
    [
      testCases,
      visualThreshold,
      runTurtleCode,
      turtleInstance,
      completeSection,
      incrementAttemptCounter,
      unitId,
      lessonId,
      sectionId,
    ]
  );

  return {
    runTests,
    testResults,
    isLoading: isRunningTests,
    error,
  };
};

/**
 * Composite hook that bundles all turtle visualization setup.
 * Use this instead of manually setting up turtleCanvasRef, turtleInstance,
 * useTurtleExecution, and useTurtleTesting separately.
 */
interface UseTurtleVisualizationProps {
  unitId: UnitId;
  lessonId: LessonId;
  sectionId: SectionId;
  visualization: "console" | "turtle";
  testCases: TestCase[];
  visualThreshold?: number;
  functionToTest?: string;
  courseId: CourseId;
  lessonPath?: string;
}

export const useTurtleVisualization = ({
  unitId,
  lessonId,
  sectionId,
  visualization,
  testCases,
  visualThreshold,
  functionToTest,
  courseId,
  lessonPath,
}: UseTurtleVisualizationProps) => {
  const turtleCanvasRef = useRef<HTMLDivElement>(null);
  const [turtleInstance, setTurtleInstance] =
    useState<RealTurtleInstance | null>(null);

  const isVisualTurtleTest =
    visualization === "turtle" && testCases.some((tc) => tc.referenceImage);

  const resolvedTestCases = useMemo(() => {
    return testCases.map((tc) => ({
      ...tc,
      referenceImage: tc.referenceImage
        ? resolveImagePath(tc.referenceImage, courseId, lessonPath)
        : undefined,
    }));
  }, [testCases, courseId, lessonPath]);

  const {
    runTurtleCode,
    stopExecution,
    isLoading: isRunningTurtle,
    error: turtleRunError,
  } = useTurtleExecution({
    canvasRef: turtleCanvasRef,
    unitId,
    lessonId,
    sectionId,
    autoCompleteOnRun: false,
    onTurtleInstanceReady: setTurtleInstance,
  });

  const turtleTestingHook = useTurtleTesting({
    unitId,
    lessonId,
    sectionId,
    testCases: resolvedTestCases,
    visualThreshold,
    turtleInstance,
    runTurtleCode,
    functionToTest,
  });

  return {
    // Refs and state
    turtleCanvasRef,
    turtleInstance,
    // Detection
    isVisualTurtleTest,
    resolvedTestCases,
    // Execution
    runTurtleCode,
    stopExecution,
    isRunningTurtle,
    turtleRunError,
    // Testing (only valid if isVisualTurtleTest)
    turtleTestingHook,
  };
};
