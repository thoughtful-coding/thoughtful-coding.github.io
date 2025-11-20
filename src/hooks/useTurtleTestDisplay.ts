import { useMemo } from "react";
import type { TurtleTestResult } from "./useTurtleTesting";
import type { TestCase } from "../types/data";
import { resolveImagePath } from "../lib/dataHelpers";

interface DisplayedTestInfo {
  referenceImage: string;
  description: string;
  isResult: boolean;
  resultIndex: number | null;
}

interface UseTurtleTestDisplayProps {
  results: TurtleTestResult[] | null;
  testCases: TestCase[];
  isRunningTests: boolean;
  lessonPath?: string;
}

interface UseTurtleTestDisplayReturn {
  visualTestCases: TestCase[];
  testsComplete: boolean;
  allTestsRan: boolean;
  allPassed: boolean;
  showSideBySide: boolean;
  displayedTestInfo: DisplayedTestInfo | null;
  accordionResults: TurtleTestResult[];
}

/**
 * Custom hook to manage turtle test display state and logic.
 * Handles determining which test to show, test completion states, and UI visibility.
 */
export const useTurtleTestDisplay = ({
  results,
  testCases,
  isRunningTests,
  lessonPath,
}: UseTurtleTestDisplayProps): UseTurtleTestDisplayReturn => {
  // Filter to only visual test cases (those with reference images)
  const visualTestCases = useMemo(
    () => testCases.filter((tc) => tc.referenceImage),
    [testCases]
  );

  // Determine test completion state
  const testsComplete =
    !isRunningTests && results !== null && results.length > 0;
  const allTestsRan =
    results !== null && results.length === visualTestCases.length;
  const allPassed =
    testsComplete && allTestsRan && results.every((r) => r.passed);

  // Determine which test to display in the side-by-side view
  const displayedTestInfo = useMemo((): DisplayedTestInfo | null => {
    // State 1: No results yet - show first test case
    if (!results || results.length === 0) {
      const firstTest = visualTestCases[0];
      if (firstTest && firstTest.referenceImage) {
        return {
          referenceImage: resolveImagePath(
            firstTest.referenceImage,
            lessonPath
          ),
          description: firstTest.description,
          isResult: false,
          resultIndex: null,
        };
      }
      return null;
    }

    // State 2: Has failure - show first failed test
    const failureIndex = results.findIndex((r) => !r.passed);
    if (failureIndex !== -1) {
      const failedTest = results[failureIndex];
      return {
        referenceImage: failedTest.referenceImage,
        description: failedTest.description,
        isResult: true,
        resultIndex: failureIndex,
      };
    }

    // State 3: Still running - show next test to be executed
    if (results.length < visualTestCases.length) {
      const nextTest = visualTestCases[results.length];
      if (nextTest && nextTest.referenceImage) {
        return {
          referenceImage: resolveImagePath(nextTest.referenceImage, lessonPath),
          description: nextTest.description,
          isResult: false,
          resultIndex: null,
        };
      }
    }

    // State 4: All tests completed and passed - show last test
    const lastIndex = results.length - 1;
    const lastTest = results[lastIndex];
    return {
      referenceImage: lastTest.referenceImage,
      description: lastTest.description,
      isResult: true,
      resultIndex: lastIndex,
    };
  }, [results, visualTestCases, lessonPath]);

  return {
    visualTestCases,
    testsComplete,
    allTestsRan,
    allPassed,
    showSideBySide: !testsComplete,
    displayedTestInfo,
    accordionResults: results || [],
  };
};
