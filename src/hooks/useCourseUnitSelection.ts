/**
 * Shared hook for course/unit selection with URL synchronization.
 * Used by instructor dashboard views for consistent filtering behavior.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { Course, CourseId, Unit, UnitId } from "../types/data";

interface UseCourseUnitSelectionOptions {
  /** Available courses */
  courses: Course[];
  /** Available units (will be filtered by selected course) */
  units: Unit[];
  /** Whether to include unit selection (default: true) */
  includeUnit?: boolean;
}

interface UseCourseUnitSelectionResult {
  // State
  selectedCourseId: CourseId | "";
  selectedUnitId: UnitId | "";
  unitsForSelectedCourse: Unit[];

  // Handlers
  handleCourseChange: (courseId: CourseId | "") => void;
  handleUnitChange: (unitId: UnitId | "") => void;

  // URL params (for building links)
  buildUrlParams: (extra?: Record<string, string>) => Record<string, string>;
}

/**
 * Hook for managing course/unit selection with URL sync.
 *
 * @example
 * // With unit selection
 * const { selectedCourseId, selectedUnitId, handleCourseChange, handleUnitChange } =
 *   useCourseUnitSelection({ courses, units });
 *
 * @example
 * // Course only (no unit selection)
 * const { selectedCourseId, handleCourseChange } =
 *   useCourseUnitSelection({ courses, units, includeUnit: false });
 */
export function useCourseUnitSelection({
  courses: _courses,
  units,
  includeUnit = true,
}: UseCourseUnitSelectionOptions): UseCourseUnitSelectionResult {
  void _courses; // Reserved for future course validation
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCourseId, setSelectedCourseId] = useState<CourseId | "">("");
  const [selectedUnitId, setSelectedUnitId] = useState<UnitId | "">("");

  // Filter units by selected course
  const unitsForSelectedCourse = useMemo(
    () =>
      selectedCourseId
        ? units.filter((u) => u.courseId === selectedCourseId)
        : [],
    [selectedCourseId, units]
  );

  // Sync state from URL on mount and URL changes
  useEffect(() => {
    const courseFromUrl = searchParams.get("course") as CourseId;
    const unitFromUrl = searchParams.get("unit") as UnitId;

    if (courseFromUrl && courseFromUrl !== selectedCourseId) {
      setSelectedCourseId(courseFromUrl);
    }
    if (includeUnit && unitFromUrl && unitFromUrl !== selectedUnitId) {
      setSelectedUnitId(unitFromUrl);
    }
  }, [searchParams, selectedCourseId, selectedUnitId, includeUnit]);

  // Clear unit when course changes and unit doesn't belong to new course
  useEffect(() => {
    if (!includeUnit) return;

    if (selectedCourseId && selectedUnitId) {
      const unitBelongsToCourse = unitsForSelectedCourse.some(
        (u) => u.id === selectedUnitId
      );
      if (!unitBelongsToCourse) {
        setSelectedUnitId("");
        setSearchParams({ course: selectedCourseId });
      }
    }
  }, [
    selectedCourseId,
    selectedUnitId,
    unitsForSelectedCourse,
    setSearchParams,
    includeUnit,
  ]);

  // Handler for course selection
  const handleCourseChange = useCallback(
    (newCourseId: CourseId | "") => {
      setSelectedCourseId(newCourseId);
      if (includeUnit) {
        setSelectedUnitId("");
      }
      setSearchParams(newCourseId ? { course: newCourseId } : {});
    },
    [setSearchParams, includeUnit]
  );

  // Handler for unit selection
  const handleUnitChange = useCallback(
    (newUnitId: UnitId | "") => {
      if (!includeUnit) return;

      setSelectedUnitId(newUnitId);
      if (newUnitId && selectedCourseId) {
        setSearchParams({ course: selectedCourseId, unit: newUnitId });
      } else if (selectedCourseId) {
        setSearchParams({ course: selectedCourseId });
      } else {
        setSearchParams({});
      }
    },
    [setSearchParams, selectedCourseId, includeUnit]
  );

  // Build URL params with current selection + extras
  const buildUrlParams = useCallback(
    (extra?: Record<string, string>): Record<string, string> => {
      const params: Record<string, string> = {};
      if (selectedCourseId) params.course = selectedCourseId;
      if (includeUnit && selectedUnitId) params.unit = selectedUnitId;
      return { ...params, ...extra };
    },
    [selectedCourseId, selectedUnitId, includeUnit]
  );

  return {
    selectedCourseId,
    selectedUnitId,
    unitsForSelectedCourse,
    handleCourseChange,
    handleUnitChange,
    buildUrlParams,
  };
}
