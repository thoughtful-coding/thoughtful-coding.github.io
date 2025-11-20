import { useEffect } from "react";
import type { UnitId, LessonId, SectionId } from "../types/data";
import { useSectionProgress } from "./useSectionProgress";

interface SavedTestingState {
  testsPassedOnce: boolean;
}

interface TestResultLike {
  passed: boolean;
}

/**
 * Shared hook for tracking completion state in testable sections.
 * Once all tests pass, completion is persisted and survives page refresh.
 *
 * Used by TestingSection, ParsonsSection, and other sections with test cases.
 */
export function useTestingCompletion(
  unitId: UnitId,
  lessonId: LessonId,
  sectionId: SectionId,
  testResults: TestResultLike[] | null
): boolean {
  const storageKey = `testingState_${unitId}_${lessonId}_${sectionId}`;

  const [_savedState, setSavedState, isSectionComplete] =
    useSectionProgress<SavedTestingState>(
      unitId,
      lessonId,
      sectionId,
      storageKey,
      { testsPassedOnce: false },
      (state) => state.testsPassedOnce
    );

  // Update testsPassedOnce when all tests pass
  useEffect(() => {
    if (testResults && testResults.every((r) => r.passed)) {
      setSavedState((prev) => ({ ...prev, testsPassedOnce: true }));
    }
  }, [testResults, setSavedState]);

  return isSectionComplete;
}
