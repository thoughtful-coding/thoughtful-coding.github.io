import { useState, useEffect } from "react";
import { useProgressStore } from "../stores/progressStore";
import type { UnitId, LessonId, SectionId } from "../types/data";

/**
 * Custom hook for managing persistent draft code in sections.
 *
 * This hook handles:
 * - Loading saved draft code from progressStore
 * - Fallback to initial code if no draft exists
 * - Auto-saving draft whenever code changes
 * - Tracking whether code has been modified from initial state
 *
 * @param unitId - The unit ID
 * @param lessonId - The lesson ID
 * @param sectionId - The section ID
 * @param initialCode - The default/initial code for this section
 * @returns [code, setCode] - Current code and setter function
 *
 * @example
 * const [code, setCode] = useDraftCode(
 *   unitId,
 *   lessonId,
 *   section.id,
 *   section.example.initialCode
 * );
 */
export function useDraftCode(
  unitId: UnitId,
  lessonId: LessonId,
  sectionId: SectionId,
  initialCode: string
): [string, (code: string) => void] {
  const { saveDraft, getDraft } = useProgressStore((state) => state.actions);

  // Initialize code from draft or use default (only runs once on mount)
  const [code, setCode] = useState(() => {
    const draft = getDraft(unitId, lessonId, sectionId);
    return draft?.code || initialCode;
  });

  // Save draft whenever code changes
  useEffect(() => {
    const isModified = code !== initialCode;
    saveDraft(unitId, lessonId, sectionId, {
      code,
      isModified,
    });
  }, [code, unitId, lessonId, sectionId, initialCode, saveDraft]);

  return [code, setCode];
}
