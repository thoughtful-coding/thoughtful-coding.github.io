import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type {
  Course,
  CourseId,
  Unit,
  DisplayableAssignment,
  UnitId,
} from "../../types/data";
import type {
  AssignmentSubmission,
  InstructorStudentInfo,
  ReflectionVersionItem,
  StoredPrimmSubmissionItem,
  StoredFirstSolutionItem,
} from "../../types/apiServiceTypes";
import * as apiService from "../../lib/apiService";
import { useAuthStore } from "../../stores/authStore";
import { useUnitLessons } from "../../hooks/useCurriculumData";
import { useCourseUnitSelection } from "../../hooks/useCourseUnitSelection";
import { sortByStudentName } from "../../lib/instructorHelpers";
import LoadingSpinner from "../LoadingSpinner";
import styles from "./InstructorViews.module.css";
import RenderReflectionVersions from "./shared/RenderReflectionVersions";
import RenderPrimmActivity from "./shared/RenderPrimmActivity";
import RenderTestingSolution from "./shared/RenderTestingSolution";

interface ReviewByAssignmentViewProps {
  courses: Course[];
  units: Unit[];
  permittedStudents: InstructorStudentInfo[];
}

const ReviewByAssignmentView: React.FC<ReviewByAssignmentViewProps> = ({
  courses,
  units,
  permittedStudents,
}) => {
  const { isAuthenticated } = useAuthStore();

  const {
    selectedCourseId,
    selectedUnitId,
    unitsForSelectedCourse,
    handleCourseChange,
    handleUnitChange,
  } = useCourseUnitSelection({ courses, units });

  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedAssignmentKey, setSelectedAssignmentKey] = useState<
    string | null
  >(null);
  const [submissions, setSubmissions] = useState<
    AssignmentSubmission<"Reflection" | "PRIMM" | "Testing">[]
  >([]);
  const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState(0);
  const [isLoading, setIsLoadingState] = useState({
    submissions: false,
  });
  const [submissionsError, setSubmissionsError] = useState<string | null>(null);

  // Load lessons for the selected unit
  const {
    lessons: lessonsInSelectedUnit,
    isLoading: isLoadingLessons,
    error: lessonsError,
  } = useUnitLessons(units, selectedUnitId);

  // Reset selections when unit changes
  useEffect(() => {
    setSelectedAssignmentKey(null);
    setSubmissions([]);
    setSubmissionsError(null);
  }, [selectedUnitId]);

  const assignmentsInUnit: DisplayableAssignment[] = useMemo(() => {
    if (!selectedUnitId || !lessonsInSelectedUnit.length) return [];
    const displayableAssignments: DisplayableAssignment[] = [];
    const unit = units.find((u) => u.id === selectedUnitId);
    if (!unit) return [];

    lessonsInSelectedUnit.forEach((lesson) => {
      (lesson.sections || []).forEach((section) => {
        if (section.kind === "Reflection") {
          displayableAssignments.push({
            key: `${lesson.guid}-${section.id}-reflection`,
            unitId: unit.id,
            lessonId: lesson.guid,
            lessonTitle: lesson.title,
            sectionId: section.id,
            sectionTitle: section.title,
            assignmentType: "Reflection",
            assignmentDisplayTitle: `Reflection: "${section.title}" (in Lesson: ${lesson.title})`,
          });
        } else if (section.kind === "PRIMM") {
          displayableAssignments.push({
            key: `${lesson.guid}-${section.id}-primm`,
            unitId: unit.id,
            lessonId: lesson.guid,
            lessonTitle: lesson.title,
            sectionId: section.id,
            sectionTitle: section.title,
            assignmentType: "PRIMM",
            assignmentDisplayTitle: `PRIMM: "${section.title}" (in Lesson: ${lesson.title})`,
          });
        } else if (section.kind === "Testing") {
          displayableAssignments.push({
            key: `${lesson.guid}-${section.id}-testing`,
            unitId: unit.id,
            lessonId: lesson.guid,
            lessonTitle: lesson.title,
            sectionId: section.id,
            sectionTitle: section.title,
            assignmentType: "Testing",
            assignmentDisplayTitle: `Testing: "${section.title}" (in Lesson: ${lesson.title})`,
          });
        }
      });
    });
    return displayableAssignments;
  }, [selectedUnitId, lessonsInSelectedUnit, units]);

  // Sync assignment selection from URL (course/unit handled by hook)
  useEffect(() => {
    const lessonIdFromUrl = searchParams.get("lesson");
    const sectionIdFromUrl = searchParams.get("section");

    if (lessonIdFromUrl && assignmentsInUnit.length > 0) {
      const targetAssignment = assignmentsInUnit.find(
        (a) =>
          a.lessonId === lessonIdFromUrl &&
          (!sectionIdFromUrl || a.sectionId === sectionIdFromUrl)
      );
      if (targetAssignment && targetAssignment.key !== selectedAssignmentKey) {
        setSelectedAssignmentKey(targetAssignment.key);
      }
    } else if (!lessonIdFromUrl) {
      setSelectedAssignmentKey(null);
    }
  }, [searchParams, assignmentsInUnit, selectedAssignmentKey]);

  const fetchSubmissionsForSelectedAssignment = useCallback(
    async (assignment: DisplayableAssignment) => {
      if (!isAuthenticated || !assignment) return;
      setIsLoadingState((prev) => ({ ...prev, submissions: true }));
      setSubmissionsError(null);
      setSubmissions([]);
      setCurrentSubmissionIndex(0);
      try {
        const response = await apiService.getSubmissionsForAssignment(
          assignment.unitId,
          assignment.lessonId,
          assignment.sectionId,
          assignment.assignmentType,
          assignment.primmExampleId
        );
        setSubmissions(sortByStudentName(response.submissions));
        if (response.submissions.length === 0) {
          setSubmissionsError(
            "No submissions found for this assignment from any student."
          );
        }
      } catch (err) {
        setSubmissionsError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setIsLoadingState((prev) => ({ ...prev, submissions: false }));
      }
    },
    [isAuthenticated]
  );

  useEffect(() => {
    const assignment = assignmentsInUnit.find(
      (a) => a.key === selectedAssignmentKey
    );
    if (assignment) {
      fetchSubmissionsForSelectedAssignment(assignment);
    } else {
      setSubmissions([]);
    }
  }, [
    selectedAssignmentKey,
    assignmentsInUnit,
    fetchSubmissionsForSelectedAssignment,
  ]);

  const handleAssignmentSelection = (assignmentKey: string) => {
    const assignment = assignmentsInUnit.find((a) => a.key === assignmentKey);
    if (assignment && selectedCourseId) {
      setSearchParams({
        course: selectedCourseId,
        unit: assignment.unitId,
        lesson: assignment.lessonId,
        section: assignment.sectionId,
      });
    }
  };

  const currentSubmissionData = submissions[currentSubmissionIndex];
  const currentStudentInfo = permittedStudents.find(
    (s) => s.studentId === currentSubmissionData?.studentId
  );
  const selectedAssignmentDetails = assignmentsInUnit.find(
    (a) => a.key === selectedAssignmentKey
  );

  // This helper function now correctly decides what to render based on the current state.
  const renderContent = () => {
    if (!selectedUnitId) {
      return (
        <p className={styles.placeholderMessage}>
          Please select a unit to view available assignments.
        </p>
      );
    }
    if (isLoadingLessons) {
      return <LoadingSpinner message="Loading assignments..." />;
    }
    if (lessonsError) {
      return <p className={styles.errorMessage}>{lessonsError}</p>;
    }
    if (assignmentsInUnit.length === 0) {
      return (
        <p className={styles.placeholderMessage}>
          No reviewable assignments (Reflections, PRIMM, or Testing) found in
          this unit.
        </p>
      );
    }

    return (
      <>
        <div className={styles.assignmentListContainer}>
          <ul className={styles.assignmentList}>
            {assignmentsInUnit.map((assignment) => (
              <li
                key={assignment.key}
                className={`${styles.assignmentListItem} ${
                  selectedAssignmentKey === assignment.key
                    ? styles.selected
                    : ""
                }`}
                onClick={() => handleAssignmentSelection(assignment.key)}
              >
                <span className={styles.assignmentTitle}>
                  {assignment.assignmentDisplayTitle}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {isLoading.submissions && (
          <LoadingSpinner message="Loading student submissions..." />
        )}
        {submissionsError && !isLoading.submissions && (
          <p className={styles.errorMessage}>{submissionsError}</p>
        )}
        {!isLoading.submissions &&
          !submissionsError &&
          submissions.length > 0 &&
          currentSubmissionData &&
          selectedAssignmentDetails && (
            <div className={styles.submissionViewer}>
              <h4>
                Viewing Submission {currentSubmissionIndex + 1} of{" "}
                {submissions.length} (Student:{" "}
                {currentStudentInfo?.studentName ||
                  currentSubmissionData.studentId}
                )
              </h4>
              {selectedAssignmentDetails.assignmentType === "Reflection" &&
              Array.isArray(currentSubmissionData.submissionDetails) ? (
                <RenderReflectionVersions
                  versions={
                    currentSubmissionData.submissionDetails as ReflectionVersionItem[]
                  }
                  lessonGuid={selectedAssignmentDetails.lessonId}
                  sectionId={selectedAssignmentDetails.sectionId}
                />
              ) : selectedAssignmentDetails.assignmentType === "PRIMM" &&
                !Array.isArray(currentSubmissionData.submissionDetails) ? (
                <RenderPrimmActivity
                  submission={
                    currentSubmissionData.submissionDetails as StoredPrimmSubmissionItem
                  }
                  lessonTitle={selectedAssignmentDetails.lessonTitle}
                  sectionId={selectedAssignmentDetails.sectionId}
                />
              ) : selectedAssignmentDetails.assignmentType === "Testing" &&
                !Array.isArray(currentSubmissionData.submissionDetails) ? (
                <RenderTestingSolution
                  submission={
                    currentSubmissionData.submissionDetails as StoredFirstSolutionItem
                  }
                  lessonTitle={selectedAssignmentDetails.lessonTitle}
                  sectionId={selectedAssignmentDetails.sectionId}
                />
              ) : null}
              {submissions.length > 1 && (
                <div className={styles.navigationButtons}>
                  <button
                    onClick={() =>
                      setCurrentSubmissionIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentSubmissionIndex === 0}
                  >
                    &larr; Previous Student
                  </button>
                  <span>
                    Student {currentSubmissionIndex + 1} / {submissions.length}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentSubmissionIndex((prev) =>
                        Math.min(submissions.length - 1, prev + 1)
                      )
                    }
                    disabled={currentSubmissionIndex >= submissions.length - 1}
                  >
                    Next Student &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
      </>
    );
  };

  return (
    <div className={styles.viewContainer}>
      <h3>Review by Assignment</h3>
      <div className={styles.filters}>
        <select
          value={selectedCourseId}
          onChange={(e) => handleCourseChange(e.target.value as CourseId | "")}
          className={styles.filterSelect}
          disabled={courses.length === 0}
        >
          <option value="">-- Select Course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        <select
          value={selectedUnitId}
          onChange={(e) => handleUnitChange(e.target.value as UnitId | "")}
          className={styles.filterSelect}
          disabled={!selectedCourseId || unitsForSelectedCourse.length === 0}
        >
          <option value="">-- Select Unit --</option>
          {unitsForSelectedCourse.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.title}
            </option>
          ))}
        </select>
      </div>
      {renderContent()}
    </div>
  );
};

export default ReviewByAssignmentView;
