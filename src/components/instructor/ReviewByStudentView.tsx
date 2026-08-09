import React, { useState, useEffect, useMemo } from "react";
import * as apiService from "../../lib/apiService";
import { useAuthStore } from "../../stores/authStore";
import type { Course, Unit, CourseId, UserId } from "../../types/data";
import type {
  InstructorStudentInfo,
  StudentDetailedProgressResponse,
  SectionStatusItem,
  UnitProgressProfile,
} from "../../types/apiServiceTypes";
import * as instructorHelpers from "../../lib/instructorHelpers";
import { useLessonDataMap } from "../../hooks/useCurriculumData";
import { useCourseStudentSelection } from "../../hooks/useCourseStudentSelection";
import LoadingSpinner from "../LoadingSpinner";
import styles from "./InstructorViews.module.css";
import detailStyles from "./shared/ReviewStudentDetailView.module.css";
import RenderReflectionVersions from "./shared/RenderReflectionVersions";
import RenderPrimmActivity from "./shared/RenderPrimmActivity";
import RenderTestingSolution from "./shared/RenderTestingSolution";

interface ReviewByStudentViewProps {
  courses: Course[];
  units: Unit[];
  permittedStudents: InstructorStudentInfo[];
}

const ReviewByStudentView: React.FC<ReviewByStudentViewProps> = ({
  courses,
  units,
  permittedStudents,
}) => {
  const { isAuthenticated } = useAuthStore();

  const {
    selectedCourseId,
    selectedStudentId,
    handleCourseChange,
    handleStudentChange,
  } = useCourseStudentSelection({ courses, permittedStudents });

  // Filter units by selected course
  const filteredUnits = useMemo(
    () =>
      selectedCourseId
        ? units.filter((u) => u.courseId === selectedCourseId)
        : units,
    [units, selectedCourseId]
  );

  // Student detail state
  const [studentProfile, setStudentProfile] =
    useState<StudentDetailedProgressResponse | null>(null);
  const [enrichedProfile, setEnrichedProfile] = useState<
    UnitProgressProfile[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewingSubmission, setViewingSubmission] = useState<{
    section: SectionStatusItem;
    lessonId: string;
    lessonTitle: string;
  } | null>(null);

  const { lessonDataMap } = useLessonDataMap(filteredUnits);

  // Fetch student profile when student is selected
  useEffect(() => {
    if (!selectedStudentId || !isAuthenticated) {
      setStudentProfile(null);
      setEnrichedProfile(null);
      setError(null);
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const profileData = await apiService.getStudentDetailedProgress(
          selectedStudentId as UserId
        );
        setStudentProfile(profileData);
      } catch (err) {
        if (err instanceof apiService.ApiError) {
          setError(`Error: ${err.data.message || err.message}`);
        } else {
          setError("An unknown error occurred while fetching student profile.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [selectedStudentId, isAuthenticated]);

  // Enrich profile with titles
  useEffect(() => {
    if (!studentProfile || lessonDataMap.size === 0) {
      setEnrichedProfile(null);
      return;
    }

    // Filter profile to only include units in the filtered list
    const filteredUnitIds = new Set(filteredUnits.map((u) => u.id));
    const filteredProfile = studentProfile.profile.filter((unitProgress) =>
      filteredUnitIds.has(unitProgress.unitId as any)
    );

    const enriched = instructorHelpers.enrichStudentProfile(
      filteredProfile,
      filteredUnits,
      lessonDataMap
    );

    const sorted = instructorHelpers.sortUnitsByCurriculumOrder(
      enriched,
      filteredUnits
    );

    setEnrichedProfile(sorted);
  }, [studentProfile, lessonDataMap, filteredUnits]);

  const renderStatusBadge = (
    status: "completed" | "submitted" | "not_started"
  ) => {
    const statusClassMap = {
      completed: detailStyles.statusCompleted,
      submitted: detailStyles.statusSubmitted,
      not_started: detailStyles.statusNotStarted,
    };
    const statusText = status.replace("_", " ");
    return (
      <span className={`${detailStyles.statusBadge} ${statusClassMap[status]}`}>
        {statusText}
      </span>
    );
  };

  const renderSubmissionModal = () => {
    if (!viewingSubmission || !viewingSubmission.section.submissionDetails)
      return null;

    const { section, lessonId, lessonTitle } = viewingSubmission;
    const { sectionKind, submissionDetails, sectionId } = section;

    return (
      <div
        className={detailStyles.modalBackdrop}
        onClick={() => setViewingSubmission(null)}
      >
        <div
          className={detailStyles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          {sectionKind === "Reflection" && Array.isArray(submissionDetails) && (
            <RenderReflectionVersions
              versions={submissionDetails}
              lessonGuid={lessonId as any}
              sectionId={sectionId}
            />
          )}
          {sectionKind === "PRIMM" &&
            Array.isArray(submissionDetails) &&
            submissionDetails[0] && (
              <RenderPrimmActivity
                submission={submissionDetails[0]}
                lessonTitle={lessonTitle}
                sectionId={sectionId}
              />
            )}
          {sectionKind === "Testing" &&
            !Array.isArray(submissionDetails) &&
            submissionDetails && (
              <RenderTestingSolution
                submission={submissionDetails}
                lessonTitle={lessonTitle}
                sectionId={sectionId}
              />
            )}
          <button
            onClick={() => setViewingSubmission(null)}
            className={detailStyles.closeButton}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!selectedStudentId) {
      return (
        <p className={styles.placeholderMessage}>
          Select a student to view their progress.
        </p>
      );
    }

    if (isLoading) {
      return <LoadingSpinner message="Loading student progress..." />;
    }

    if (error) {
      return <p className={styles.errorMessage}>{error}</p>;
    }

    if (!studentProfile || !enrichedProfile) {
      return (
        <p className={styles.placeholderMessage}>
          No profile data available for this student.
        </p>
      );
    }

    // Render student detail inline
    return (
      <div className={detailStyles.viewContainer}>
        {enrichedProfile.map((unit) => (
          <details
            key={unit.unitId}
            className={detailStyles.unitAccordion}
            open
          >
            <summary className={detailStyles.unitSummary}>
              <span>{unit.unitTitle}</span>
            </summary>
            <div className={detailStyles.unitDetails}>
              {unit.lessons.map((lesson) => (
                <div key={lesson.lessonId} className={detailStyles.lessonBlock}>
                  <h5>{lesson.lessonTitle}</h5>
                  <ul className={detailStyles.sectionList}>
                    {lesson.sections.map((section) => (
                      <li
                        key={section.sectionId}
                        className={detailStyles.sectionItem}
                      >
                        <div className={detailStyles.sectionInfo}>
                          <span className={detailStyles.sectionTitle}>
                            {section.sectionTitle}
                          </span>
                          <span className={detailStyles.sectionContext}>
                            {lesson.lessonTitle}
                          </span>
                        </div>
                        <div>
                          {renderStatusBadge(section.status)}
                          {section.status === "submitted" && (
                            <button
                              className={detailStyles.viewSubmissionButton}
                              onClick={() =>
                                setViewingSubmission({
                                  section,
                                  lessonId: lesson.lessonId,
                                  lessonTitle: lesson.lessonTitle,
                                })
                              }
                            >
                              View Submission
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        ))}
        {renderSubmissionModal()}
      </div>
    );
  };

  const selectedStudent = permittedStudents.find(
    (s) => s.studentId === selectedStudentId
  );

  return (
    <div className={styles.viewContainer}>
      <h3>Review by Student</h3>
      <div className={styles.filters}>
        <select
          value={selectedStudentId}
          onChange={(e) => handleStudentChange(e.target.value)}
          className={styles.filterSelect}
          disabled={permittedStudents.length === 0}
        >
          <option value="">-- Select Student --</option>
          {permittedStudents.map((student) => (
            <option key={student.studentId} value={student.studentId}>
              {student.studentName || student.studentId}
            </option>
          ))}
        </select>
        <select
          value={selectedCourseId}
          onChange={(e) => handleCourseChange(e.target.value as CourseId | "")}
          className={styles.filterSelect}
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        {selectedStudent && (
          <span className={styles.studentCount}>
            {selectedStudent.studentEmail}
          </span>
        )}
      </div>
      {renderContent()}
    </div>
  );
};

export default ReviewByStudentView;
