import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import * as apiService from "../../lib/apiService";
import { useAuthStore } from "../../stores/authStore";
import type {
  InstructorStudentInfo,
  StudentLessonProgressItem,
} from "../../types/apiServiceTypes";
import type {
  Unit,
  Lesson,
  LessonId,
  UserId,
  UnitId,
  LessonReference,
} from "../../types/data";
import {
  fetchLessonData,
  getRequiredSectionsForLesson,
  hasReviewableAssignments,
} from "../../lib/dataLoader";

import LoadingSpinner from "../LoadingSpinner";
import styles from "./InstructorViews.module.css";
import placeholderStyles from "./InstructorViews.module.css"; // Using the same style for placeholder

// This interface defines the shape of the data used for rendering the main table.
interface DisplayableStudentUnitProgress {
  studentId: UserId;
  studentName?: string | null;
  lessonsProgress: StudentLessonProgressItem[];
  overallUnitCompletionPercent: number;
}

interface ReviewClassProgressViewProps {
  units: Unit[];
  permittedStudents: InstructorStudentInfo[];
  isLoadingUnitsGlobal: boolean;
  isLoadingStudentsGlobal: boolean;
  studentsErrorGlobal: string | null;
}

const ReviewClassProgressView: React.FC<ReviewClassProgressViewProps> = ({
  units,
  permittedStudents,
  isLoadingUnitsGlobal,
  isLoadingStudentsGlobal,
  studentsErrorGlobal,
}) => {
  const { isAuthenticated } = useAuthStore();

  const [selectedUnitId, setSelectedUnitId] = useState<UnitId | "">("");
  const [selectedUnitLessons, setSelectedUnitLessons] = useState<
    (Lesson & { guid: LessonId })[]
  >([]);
  const [displayableClassProgress, setDisplayableClassProgress] = useState<
    DisplayableStudentUnitProgress[]
  >([]);
  const [isLoadingClassProgressLocal, setIsLoadingClassProgressLocal] =
    useState<boolean>(false);
  const [classProgressErrorLocal, setClassProgressErrorLocal] = useState<
    string | null
  >(null);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const unitFromUrl = searchParams.get("unit") as UnitId;
    // Set initial state from URL only if it's not already set
    if (unitFromUrl && unitFromUrl !== selectedUnitId) {
      setSelectedUnitId(unitFromUrl);
    }
  }, [searchParams, selectedUnitId]);

  useEffect(() => {
    if (!selectedUnitId || !isAuthenticated) {
      setDisplayableClassProgress([]);
      setSelectedUnitLessons([]);
      return;
    }

    const fetchUnitAndProgressDetails = async () => {
      // ... (This entire data fetching logic remains the same as the previous step)
      setIsLoadingClassProgressLocal(true);
      setClassProgressErrorLocal(null);

      try {
        const currentUnitData = units.find((u) => u.id === selectedUnitId);
        if (!currentUnitData) throw new Error("Unit not found");

        const lessonPromises = currentUnitData.lessons.map(
          (lessonRef: LessonReference) => fetchLessonData(lessonRef.path)
        );
        const lessonsForUnitRaw = (await Promise.all(lessonPromises)).filter(
          (l): l is Lesson => l !== null
        );
        setSelectedUnitLessons(
          lessonsForUnitRaw.map((l) => ({ ...l, guid: l.guid }))
        );

        if (lessonsForUnitRaw.length === 0 || permittedStudents.length === 0) {
          setDisplayableClassProgress([]);
          setIsLoadingClassProgressLocal(false);
          return;
        }

        const classProgressResponse =
          await apiService.getInstructorClassUnitProgress(selectedUnitId, []);

        const computedProgress: DisplayableStudentUnitProgress[] =
          classProgressResponse.studentProgressData.map((studentData) => {
            const studentInfo = permittedStudents.find(
              (ps) => ps.studentId === studentData.studentId
            );
            let totalCompletedInUnit = 0;
            let totalRequiredInUnit = 0;

            const lessonsProgress: StudentLessonProgressItem[] =
              lessonsForUnitRaw.map((lesson) => {
                const requiredSections = getRequiredSectionsForLesson(lesson);
                const totalRequiredInLesson = requiredSections.length;
                const completedSectionsMapForLesson =
                  studentData.completedSectionsInUnit[lesson.guid] || {};
                const completedInLessonCount = Object.keys(
                  completedSectionsMapForLesson
                ).length;

                totalCompletedInUnit += Math.min(
                  completedInLessonCount,
                  totalRequiredInLesson
                );
                totalRequiredInUnit += totalRequiredInLesson;

                const completionPercent =
                  totalRequiredInLesson > 0
                    ? (Math.min(completedInLessonCount, totalRequiredInLesson) /
                        totalRequiredInLesson) *
                      100
                    : 0;

                return {
                  lessonId: lesson.guid,
                  lessonTitle: lesson.title,
                  completionPercent: parseFloat(completionPercent.toFixed(1)),
                  isCompleted: completionPercent >= 100,
                  completedSectionsCount: Math.min(
                    completedInLessonCount,
                    totalRequiredInLesson
                  ),
                  totalRequiredSectionsInLesson: totalRequiredInLesson,
                };
              });

            const overallUnitCompletionPercent =
              totalRequiredInUnit > 0
                ? (totalCompletedInUnit / totalRequiredInUnit) * 100
                : 0;

            return {
              studentId: studentData.studentId as UserId,
              studentName: studentInfo?.studentName,
              lessonsProgress,
              overallUnitCompletionPercent: parseFloat(
                overallUnitCompletionPercent.toFixed(1)
              ),
            };
          });
        setDisplayableClassProgress(computedProgress);
      } catch (err) {
        console.error(
          `Failed to fetch class progress for unit ${selectedUnitId}:`,
          err
        );
        if (err instanceof apiService.ApiError) {
          setClassProgressErrorLocal(
            `Error: ${err.data.message || err.message}`
          );
        } else if (err instanceof Error) {
          setClassProgressErrorLocal(`Error: ${err.message}`);
        } else {
          setClassProgressErrorLocal(
            "An unknown error occurred while fetching class progress."
          );
        }
      } finally {
        setIsLoadingClassProgressLocal(false);
      }
    };

    if (selectedUnitId && permittedStudents.length > 0) {
      fetchUnitAndProgressDetails();
    }
  }, [selectedUnitId, permittedStudents, isAuthenticated, units]);

  const handleUnitSelectionChange = (newUnitId: UnitId | "") => {
    setSearchParams(newUnitId ? { unit: newUnitId } : {});
  };

  const getCellBackgroundColor = (
    percent: number | null | undefined
  ): string => {
    const safePercent =
      percent === null || typeof percent === "undefined"
        ? 0
        : Math.max(0, Math.min(100, percent));
    const baseOpacity = 0.1;
    const opacity =
      safePercent > 0 ? baseOpacity + (safePercent / 100) * 0.6 : 0;
    if (safePercent === 0) return `rgba(255, 100, 100, ${baseOpacity})`;
    return `rgba(70, 180, 70, ${opacity})`;
  };

  // This new helper function contains the logic to decide what to render.
  const renderContent = () => {
    if (isLoadingUnitsGlobal) {
      return <LoadingSpinner message="Loading units..." />;
    }
    if (studentsErrorGlobal) {
      return (
        <p className={placeholderStyles.errorMessage}>{studentsErrorGlobal}</p>
      );
    }

    // This is the restored logic to prompt the user to select a unit.
    if (!selectedUnitId) {
      return (
        <p className={placeholderStyles.placeholderMessage}>
          Please select a unit to view progress.
        </p>
      );
    }

    if (isLoadingStudentsGlobal) {
      return <LoadingSpinner message="Loading student list..." />;
    }
    if (isLoadingClassProgressLocal) {
      return (
        <LoadingSpinner
          message={`Loading class progress for ${selectedUnitId}...`}
        />
      );
    }
    if (classProgressErrorLocal) {
      return (
        <p className={placeholderStyles.errorMessage}>
          {classProgressErrorLocal}
        </p>
      );
    }
    if (permittedStudents.length === 0) {
      return (
        <p className={placeholderStyles.placeholderMessage}>
          No students are assigned to you.
        </p>
      );
    }
    if (displayableClassProgress.length === 0) {
      return (
        <p className={placeholderStyles.placeholderMessage}>
          No progress data available for this unit.
        </p>
      );
    }

    // Only render the table if all checks pass
    return (
      <div className={styles.progressTableContainer}>
        <table className={styles.progressTable}>
          <thead>
            <tr>
              <th>Student</th>
              {selectedUnitLessons.map((lesson) => {
                const hasAssignments = hasReviewableAssignments(lesson);
                const lessonLink = `/python/instructor-dashboard/assignments?unit=${selectedUnitId}&lesson=${lesson.guid}`;
                return (
                  <th key={lesson.guid} title={lesson.guid}>
                    {hasAssignments ? (
                      <Link
                        to={lessonLink}
                        title={`Review assignments for ${lesson.title}`}
                      >
                        {lesson.title} ↗
                      </Link>
                    ) : (
                      lesson.title
                    )}
                  </th>
                );
              })}
              <th>Unit Avg.</th>
            </tr>
          </thead>
          <tbody>
            {displayableClassProgress.map((studentProgress) => (
              <tr key={studentProgress.studentId}>
                <td className={styles.studentNameCell}>
                  <Link
                    to={`/python/instructor-dashboard/students/${studentProgress.studentId}`}
                  >
                    {studentProgress.studentName || studentProgress.studentId}
                  </Link>
                </td>
                {selectedUnitLessons.map((lesson) => {
                  const lessonProg = studentProgress.lessonsProgress.find(
                    (lp) => lp.lessonId === lesson.guid
                  );
                  const percent = lessonProg ? lessonProg.completionPercent : 0;
                  return (
                    <td
                      key={`${studentProgress.studentId}-${lesson.guid}`}
                      style={{
                        backgroundColor: getCellBackgroundColor(percent),
                      }}
                      title={`${percent.toFixed(0)}% completed`}
                    >
                      {percent.toFixed(0)}%
                    </td>
                  );
                })}
                <td
                  style={{
                    fontWeight: "bold",
                    backgroundColor: getCellBackgroundColor(
                      studentProgress.overallUnitCompletionPercent
                    ),
                  }}
                >
                  {studentProgress.overallUnitCompletionPercent.toFixed(0)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <section className={styles.viewContainer}>
      <h3>Class Progress Overview</h3>
      <div className={styles.filters}>
        <select
          value={selectedUnitId}
          onChange={(e) => handleUnitSelectionChange(e.target.value as UnitId)}
          className={styles.filterSelect}
          disabled={units.length === 0 || isLoadingUnitsGlobal}
        >
          <option value="">-- Select Unit --</option>
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.title}
            </option>
          ))}
        </select>
      </div>

      {/* Call the new render helper function here */}
      {renderContent()}
    </section>
  );
};

export default ReviewClassProgressView;
