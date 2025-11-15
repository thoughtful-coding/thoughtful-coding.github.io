import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type {
  Unit,
  Lesson,
  LessonId,
  PRIMMSectionData,
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
import * as dataLoader from "../../lib/dataLoader";
import * as apiService from "../../lib/apiService";
import { useAuthStore } from "../../stores/authStore";
import LoadingSpinner from "../LoadingSpinner";
import styles from "./InstructorViews.module.css";
import RenderReflectionVersions from "./shared/RenderReflectionVersions";
import RenderPrimmActivity from "./shared/RenderPrimmActivity";
import RenderTestingSolution from "./shared/RenderTestingSolution";

interface ReviewByAssignmentViewProps {
  units: Unit[];
  permittedStudents: InstructorStudentInfo[];
}

const ReviewByAssignmentView: React.FC<ReviewByAssignmentViewProps> = ({
  units,
  permittedStudents,
}) => {
  const { isAuthenticated } = useAuthStore();

  const [selectedUnitId, setSelectedUnitId] = useState<UnitId | "">("");
  const [lessonsInSelectedUnit, setLessonsInSelectedUnit] = useState<
    (Lesson & { guid: LessonId })[]
  >([]);
  const [selectedAssignmentKey, setSelectedAssignmentKey] = useState<
    string | null
  >(null);
  const [submissions, setSubmissions] = useState<
    AssignmentSubmission<"Reflection" | "PRIMM" | "Testing">[]
  >([]);
  const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState(0);
  const [isLoading, setIsLoadingState] = useState({
    lessons: false,
    submissions: false,
  });
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  // This useEffect loads lessons when the selected unit changes
  useEffect(() => {
    if (selectedUnitId) {
      const unit = units.find((u) => u.id === selectedUnitId);
      if (unit) {
        setIsLoadingState((prev) => ({ ...prev, lessons: true }));
        setLessonsInSelectedUnit([]);
        Promise.all(
          unit.lessons.map((lr) => dataLoader.fetchLessonData(lr.path))
        )
          .then((loadedLessons) => {
            setLessonsInSelectedUnit(
              loadedLessons.filter((l) => l !== null) as (Lesson & {
                guid: LessonId;
              })[]
            );
          })
          .catch((_err) =>
            setError("Failed to load lessons for assignment list.")
          )
          .finally(() =>
            setIsLoadingState((prev) => ({ ...prev, lessons: false }))
          );
      }
    } else {
      setLessonsInSelectedUnit([]);
    }
    setSelectedAssignmentKey(null);
    setSubmissions([]);
    setError(null);
  }, [selectedUnitId, units]);

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
          ((section as PRIMMSectionData).examples || []).forEach((example) => {
            displayableAssignments.push({
              key: `${lesson.guid}-${section.id}-primm-${example.id}`,
              unitId: unit.id,
              lessonId: lesson.guid,
              lessonTitle: lesson.title,
              sectionId: section.id,
              sectionTitle: section.title,
              assignmentType: "PRIMM",
              primmExampleId: example.id,
              assignmentDisplayTitle: `PRIMM: "${section.title}" (in Lesson: ${lesson.title})`,
            });
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

  useEffect(() => {
    const unitIdFromUrl = searchParams.get("unit") as UnitId;
    const lessonIdFromUrl = searchParams.get("lesson");

    if (unitIdFromUrl && unitIdFromUrl !== selectedUnitId) {
      setSelectedUnitId(unitIdFromUrl);
    }

    if (lessonIdFromUrl && assignmentsInUnit.length > 0) {
      const targetAssignment = assignmentsInUnit.find(
        (a) => a.lessonId === lessonIdFromUrl
      );
      if (targetAssignment && targetAssignment.key !== selectedAssignmentKey) {
        setSelectedAssignmentKey(targetAssignment.key);
      }
    } else if (!lessonIdFromUrl) {
      setSelectedAssignmentKey(null);
    }
  }, [searchParams, selectedUnitId, assignmentsInUnit, selectedAssignmentKey]);

  const fetchSubmissionsForSelectedAssignment = useCallback(
    async (assignment: DisplayableAssignment) => {
      if (!isAuthenticated || !assignment) return;
      setIsLoadingState((prev) => ({ ...prev, submissions: true }));
      setError(null);
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
        setSubmissions(response.submissions);
        if (response.submissions.length === 0) {
          setError(
            "No submissions found for this assignment from any student."
          );
        }
      } catch (err) {
        setError(
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

  const handleUnitSelectionChange = (newUnitId: UnitId | "") => {
    setSearchParams(newUnitId ? { unit: newUnitId } : {});
  };

  const handleAssignmentSelection = (assignmentKey: string) => {
    const assignment = assignmentsInUnit.find((a) => a.key === assignmentKey);
    if (assignment) {
      setSearchParams({ unit: assignment.unitId, lesson: assignment.lessonId });
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
    if (isLoading.lessons) {
      return <LoadingSpinner message="Loading assignments..." />;
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
        {error && !isLoading.submissions && (
          <p className={styles.errorMessage}>{error}</p>
        )}
        {!isLoading.submissions &&
          !error &&
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
              {selectedAssignmentDetails.assignmentType === "Reflection" ? (
                <RenderReflectionVersions
                  versions={
                    currentSubmissionData.submissionDetails as ReflectionVersionItem[]
                  }
                  lessonGuid={selectedAssignmentDetails.lessonId}
                  sectionId={selectedAssignmentDetails.sectionId}
                />
              ) : selectedAssignmentDetails.assignmentType === "PRIMM" ? (
                <RenderPrimmActivity
                  submission={
                    currentSubmissionData.submissionDetails as StoredPrimmSubmissionItem
                  }
                  lessonTitle={selectedAssignmentDetails.lessonTitle}
                  sectionId={selectedAssignmentDetails.sectionId}
                />
              ) : selectedAssignmentDetails.assignmentType === "Testing" ? (
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
          value={selectedUnitId}
          onChange={(e) =>
            handleUnitSelectionChange(e.target.value as UnitId | "")
          }
          className={styles.filterSelect}
          disabled={units.length === 0}
        >
          <option value="">-- Select Unit --</option>
          {units.map((unit) => (
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
