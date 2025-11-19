import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import router hooks
import * as apiService from "../../../lib/apiService";
import { useAuthStore } from "../../../stores/authStore";
import type {
  StudentDetailedProgressResponse,
  SectionStatusItem,
  UnitProgressProfile,
} from "../../../types/apiServiceTypes";
import type { UserId, Unit } from "../../../types/data";
import * as instructorHelpers from "../../../lib/instructorHelpers";
import { useLessonDataMap } from "../../../hooks/useCurriculumData";
import LoadingSpinner from "../../LoadingSpinner";
import styles from "./ReviewStudentDetailView.module.css";
import instructorStyles from "../InstructorViews.module.css";
import RenderReflectionVersions from "../shared/RenderReflectionVersions";
import RenderPrimmActivity from "../shared/RenderPrimmActivity";
import RenderTestingSolution from "../shared/RenderTestingSolution";

interface ReviewStudentDetailViewProps {
  units: Unit[];
}

const ReviewStudentDetailView: React.FC<ReviewStudentDetailViewProps> = ({
  units,
}) => {
  const { studentId } = useParams<{ studentId: string }>(); // Get studentId from URL
  const navigate = useNavigate(); // Get the navigate function for the back button

  const [studentProfile, setStudentProfile] =
    useState<StudentDetailedProgressResponse | null>(null);
  const [enrichedProfile, setEnrichedProfile] = useState<
    UnitProgressProfile[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingSubmission, setViewingSubmission] = useState<{
    section: SectionStatusItem;
    lessonId: string;
    lessonTitle: string;
  } | null>(null);

  const { isAuthenticated } = useAuthStore();
  const { lessonDataMap } = useLessonDataMap(units);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) {
        setError("Not authenticated.");
        setIsLoading(false);
        return;
      }
      if (!studentId) {
        setError("Student ID not found in URL.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const profileData = await apiService.getStudentDetailedProgress(
          studentId as UserId
        );
        setStudentProfile(profileData);
      } catch (err) {
        if (err instanceof apiService.ApiError) {
          setError(`Error: ${err.data.message || err.message}`);
        } else {
          setError(
            "An unknown error occurred while fetching the student profile."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [studentId, isAuthenticated]);

  // Enrich the profile with actual titles from lesson data
  useEffect(() => {
    if (!studentProfile || lessonDataMap.size === 0) {
      setEnrichedProfile(null);
      return;
    }

    // Enrich with titles from lesson data
    const enriched = instructorHelpers.enrichStudentProfile(
      studentProfile.profile,
      units,
      lessonDataMap
    );

    // Sort units by curriculum order
    const sorted = instructorHelpers.sortUnitsByCurriculumOrder(
      enriched,
      units
    );

    setEnrichedProfile(sorted);
  }, [studentProfile, lessonDataMap, units]);

  const handleBack = () => {
    navigate("/python/instructor-dashboard/students"); // Always navigate back to the main student list page
  };

  // ... (renderStatusBadge and renderSubmissionModal functions remain the same)
  const renderStatusBadge = (
    status: "completed" | "submitted" | "not_started"
  ) => {
    const statusClassMap = {
      completed: styles.statusCompleted,
      submitted: styles.statusSubmitted,
      not_started: styles.statusNotStarted,
    };
    const statusText = status.replace("_", " ");
    return (
      <span className={`${styles.statusBadge} ${statusClassMap[status]}`}>
        {statusText}
      </span>
    );
  };

  const renderSubmissionModal = () => {
    if (!viewingSubmission || !viewingSubmission.section.submissionDetails)
      return null;

    const { section, lessonId, lessonTitle } = viewingSubmission;
    const { sectionKind, submissionDetails, sectionTitle, sectionId } = section;

    return (
      <div
        className={styles.modalBackdrop}
        onClick={() => setViewingSubmission(null)}
      >
        <div
          className={styles.modalContent}
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
            className={styles.closeButton}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  if (isLoading)
    return <LoadingSpinner message="Loading student's detailed progress..." />;
  if (error) return <p className={instructorStyles.errorMessage}>{error}</p>;
  if (!studentProfile || !enrichedProfile)
    return (
      <p className={instructorStyles.placeholderMessage}>
        No profile data available for this student.
      </p>
    );

  return (
    <div className={styles.viewContainer}>
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          &larr; Back to Student List
        </button>
        <h3>{studentProfile.studentName || studentProfile.studentId}</h3>
      </div>
      {enrichedProfile.map((unit) => (
        <details key={unit.unitId} className={styles.unitAccordion} open>
          <summary className={styles.unitSummary}>
            <span>{unit.unitTitle}</span>
          </summary>
          <div className={styles.unitDetails}>
            {unit.lessons.map((lesson) => (
              <div key={lesson.lessonId} className={styles.lessonBlock}>
                <h5>{lesson.lessonTitle}</h5>
                <ul className={styles.sectionList}>
                  {lesson.sections.map((section) => (
                    <li key={section.sectionId} className={styles.sectionItem}>
                      <div className={styles.sectionInfo}>
                        <span className={styles.sectionTitle}>
                          {section.sectionTitle}
                        </span>
                        <span className={styles.sectionContext}>
                          {lesson.lessonTitle}
                        </span>
                      </div>
                      <div>
                        {renderStatusBadge(section.status)}
                        {section.status === "submitted" && (
                          <button
                            className={styles.viewSubmissionButton}
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

export default ReviewStudentDetailView;
