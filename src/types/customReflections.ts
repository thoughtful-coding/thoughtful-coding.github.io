// Custom Reflections: Constants and utilities for standalone reflections
// not tied to any specific lesson or section

import type { LessonId } from "./data";
import type { ReflectionVersionItem } from "./apiServiceTypes";

/**
 * Sentinel GUID used to identify custom reflections in the API.
 * This UUID is outside the range of any reasonable GUID generation.
 */
export const CUSTOM_REFLECTION_LESSON_ID =
  "00000000-0000-0000-0000-000000000001" as LessonId;

/**
 * Type guard to check if a reflection entry is a custom reflection.
 * Custom reflections are identified by the sentinel lesson ID.
 */
export function isCustomReflection(
  entry: ReflectionVersionItem | { lessonId: LessonId }
): boolean {
  return entry.lessonId === CUSTOM_REFLECTION_LESSON_ID;
}
