/**
 * Hook for course/student selection with URL synchronization.
 * Used by ReviewByStudentView for consistent filtering behavior.
 */

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { Course, CourseId } from "../types/data";
import type { InstructorStudentInfo } from "../types/apiServiceTypes";

interface UseCourseStudentSelectionOptions {
  courses: Course[];
  permittedStudents: InstructorStudentInfo[];
}

interface UseCourseStudentSelectionResult {
  selectedCourseId: CourseId | "";
  selectedStudentId: string;
  handleCourseChange: (courseId: CourseId | "") => void;
  handleStudentChange: (studentId: string) => void;
  buildUrlParams: (extra?: Record<string, string>) => Record<string, string>;
}

export function useCourseStudentSelection({
  courses: _courses,
  permittedStudents,
}: UseCourseStudentSelectionOptions): UseCourseStudentSelectionResult {
  void _courses; // Reserved for future course-based student filtering
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCourseId, setSelectedCourseId] = useState<CourseId | "">("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  // Sync state from URL on mount and URL changes
  useEffect(() => {
    const courseFromUrl = searchParams.get("course") as CourseId;
    const studentFromUrl = searchParams.get("student");

    if (courseFromUrl && courseFromUrl !== selectedCourseId) {
      setSelectedCourseId(courseFromUrl);
    }
    if (studentFromUrl && studentFromUrl !== selectedStudentId) {
      // Validate student exists
      const studentExists = permittedStudents.some(
        (s) => s.studentId === studentFromUrl
      );
      if (studentExists) {
        setSelectedStudentId(studentFromUrl);
      }
    }
  }, [searchParams, selectedCourseId, selectedStudentId, permittedStudents]);

  // Handler for course selection - preserves student in URL
  const handleCourseChange = useCallback(
    (newCourseId: CourseId | "") => {
      setSelectedCourseId(newCourseId);
      // Keep student in URL when changing course (don't clear selectedStudentId)
      if (newCourseId) {
        const params: Record<string, string> = { course: newCourseId };
        if (selectedStudentId) params.student = selectedStudentId;
        setSearchParams(params);
      } else {
        setSearchParams(
          selectedStudentId ? { student: selectedStudentId } : {}
        );
      }
    },
    [setSearchParams, selectedStudentId]
  );

  // Handler for student selection
  const handleStudentChange = useCallback(
    (newStudentId: string) => {
      setSelectedStudentId(newStudentId);
      if (newStudentId && selectedCourseId) {
        setSearchParams({ course: selectedCourseId, student: newStudentId });
      } else if (selectedCourseId) {
        setSearchParams({ course: selectedCourseId });
      } else {
        setSearchParams({});
      }
    },
    [setSearchParams, selectedCourseId]
  );

  // Build URL params with current selection + extras
  const buildUrlParams = useCallback(
    (extra?: Record<string, string>): Record<string, string> => {
      const params: Record<string, string> = {};
      if (selectedCourseId) params.course = selectedCourseId;
      if (selectedStudentId) params.student = selectedStudentId;
      return { ...params, ...extra };
    },
    [selectedCourseId, selectedStudentId]
  );

  return {
    selectedCourseId,
    selectedStudentId,
    handleCourseChange,
    handleStudentChange,
    buildUrlParams,
  };
}
