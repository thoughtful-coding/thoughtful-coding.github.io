import type { Unit, Lesson, LessonId, UnitId, CourseId } from "../types/data";
import * as dataLoader from "./dataLoader";

/**
 * General-purpose utilities for working with curriculum data
 * Used by both student-facing and instructor-facing components
 */

/**
 * Resolves relative image paths to absolute paths based on lesson location.
 * Returns absolute paths and URLs unchanged.
 */
export function resolveImagePath(
  imagePath: string,
  courseId: CourseId,
  lessonPath?: string
): string {
  if (imagePath.startsWith("/") || imagePath.startsWith("http")) {
    return imagePath;
  }

  if (!lessonPath) {
    throw new Error(
      `lessonPath is required to resolve relative image path: ${imagePath}`
    );
  }

  const unitDir = lessonPath.split("/")[0];
  const courseDir = dataLoader.getCourseDirectory(courseId);

  // Fall back to using courseId if directory mapping not available (e.g., during tests)
  const dirToUse = courseDir || courseId;

  return `/data/${dirToUse}/${unitDir}/${imagePath}`;
}

/**
 * Loads all lessons for a given unit
 * Returns lessons in curriculum order (as specified in the unit manifest)
 */
export async function loadLessonsForUnit(
  unit: Unit
): Promise<(Lesson & { guid: LessonId })[]> {
  const lessonPromises = unit.lessons.map((lessonRef) =>
    dataLoader.fetchLessonData(lessonRef.path)
  );

  const loadedLessons = await Promise.all(lessonPromises);

  // Filter out null values and ensure type safety
  return loadedLessons.filter(
    (lesson): lesson is Lesson & { guid: LessonId } => lesson !== null
  );
}

/**
 * Loads all lessons for a unit by unitId
 * Convenience wrapper around loadLessonsForUnit
 */
export async function loadLessonsByUnitId(
  unitId: UnitId
): Promise<(Lesson & { guid: LessonId })[]> {
  const unit = await dataLoader.fetchUnitById(unitId);
  if (!unit) {
    throw new Error(`Unit ${unitId} not found`);
  }
  return loadLessonsForUnit(unit);
}

/**
 * Creates a map of lesson paths to lesson GUIDs
 * Useful for looking up GUIDs when you only have the path
 */
export function createPathToGuidMap(
  unit: Unit,
  lessons: (Lesson & { guid: LessonId })[]
): Map<string, LessonId> {
  const pathToGuid = new Map<string, LessonId>();

  unit.lessons.forEach((lessonRef, index) => {
    const lesson = lessons[index];
    if (lesson) {
      pathToGuid.set(lessonRef.path, lesson.guid);
    }
  });

  return pathToGuid;
}

/**
 * Creates a map of lesson GUIDs to lesson objects
 * Useful for quick lookups by GUID
 */
export function createGuidToLessonMap(
  lessons: (Lesson & { guid: LessonId })[]
): Map<LessonId, Lesson> {
  const guidToLesson = new Map<LessonId, Lesson>();

  lessons.forEach((lesson) => {
    guidToLesson.set(lesson.guid, lesson);
  });

  return guidToLesson;
}
