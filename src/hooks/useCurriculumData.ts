import { useState, useEffect } from "react";
import type { Unit, Lesson, LessonId, UnitId } from "../types/data";
import * as instructorHelpers from "../lib/instructorHelpers";
import * as dataHelpers from "../lib/dataHelpers";

/**
 * React hooks for working with curriculum data
 *
 * Contains:
 * - **Instructor-specific hooks**: useLessonDataMap, useLessonTitleMap (load ALL lessons)
 * - **General-purpose hooks**: useUnitLessons (load lessons for ONE unit)
 */

/**
 * INSTRUCTOR-SPECIFIC: Fetches and caches all lesson data across all units
 * Returns a map of LessonId -> Lesson for enriching backend data with titles
 */
export function useLessonDataMap(units: Unit[]) {
  const [lessonDataMap, setLessonDataMap] = useState<
    Map<LessonId, Lesson & { guid: LessonId }>
  >(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (units && units.length > 0) {
        const lessonMap = await instructorHelpers.buildLessonDataMap(units);
        setLessonDataMap(lessonMap);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [units]);

  return { lessonDataMap, isLoading };
}

/**
 * INSTRUCTOR-SPECIFIC: Fetches lesson titles only (lighter than full lesson data)
 * Useful when you only need titles, not full section information
 */
export function useLessonTitleMap(units: Unit[]) {
  const [lessonTitlesMap, setLessonTitlesMap] = useState<Map<LessonId, string>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (units && units.length > 0) {
        const titleMap = await instructorHelpers.buildLessonTitleMap(units);
        setLessonTitlesMap(titleMap);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [units]);

  return { lessonTitlesMap, isLoading };
}

/**
 * GENERAL-PURPOSE: Loads all lessons for a specific unit
 * Used by both student pages (UnitPage) and instructor pages (ReviewByAssignmentView)
 */
export function useUnitLessons(units: Unit[], unitId: UnitId | "") {
  const [lessons, setLessons] = useState<(Lesson & { guid: LessonId })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!unitId) {
      setLessons([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchLessons = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const unit = units.find((u) => u.id === unitId);
        if (!unit) {
          throw new Error(`Unit ${unitId} not found`);
        }

        const loadedLessons = await dataHelpers.loadLessonsForUnit(unit);
        setLessons(loadedLessons);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load lessons");
        setLessons([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [unitId, units]);

  return { lessons, isLoading, error };
}
