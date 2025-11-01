// src/pages/ProgressPage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchUnitsData,
  fetchLessonData,
  getRequiredSectionsForLesson,
} from "../../lib/dataLoader";
import { useAllCompletions } from "../../stores/progressStore";
import type { Lesson, LessonId, LessonPath, UnitId } from "../../types/data";
import styles from "./ProgressPage.module.css";
import LoadingSpinner from "../../components/LoadingSpinner";

interface LessonCompletionStatus {
  lessonId: LessonId;
  lessonPath: LessonPath;
  title: string;
  isCompleted: boolean;
}

interface UnitProgress {
  unitId: UnitId;
  title: string;
  lessons: LessonCompletionStatus[];
}

const ProgressPage: React.FC = () => {
  const [unitsProgress, setUnitsProgress] = useState<UnitProgress[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const allCompletions = useAllCompletions();

  useEffect(() => {
    let isMounted = true;
    const loadProgressData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const unitsData = await fetchUnitsData();
        const fetchedUnits = unitsData.units;

        const unitProgressPromises = fetchedUnits.map(async (unit) => {
          const lessonPromises = unit.lessons.map(async (lessonReference) => {
            let lesson: Lesson | null = null;
            try {
              lesson = await fetchLessonData(lessonReference.path);
            } catch (lessonError) {
              console.error(
                `Failed to load lesson data for ${lessonReference.guid}:`,
                lessonError
              );
              return {
                lessonId: lessonReference.guid,
                lessonPath: lessonReference.path,
                title: `Lesson ${
                  lessonReference.path
                    .split("/")
                    .pop()
                    ?.replace("lesson_", "") || "N/A"
                } (Unavailable)`,
                isCompleted: false,
              };
            }

            const lessonProgressObject =
              allCompletions[unit.id]?.[lessonReference.guid];
            const completedSectionsForLesson = new Set<string>(
              lessonProgressObject ? Object.keys(lessonProgressObject) : []
            );

            const requiredSections = lesson
              ? getRequiredSectionsForLesson(lesson)
              : [];

            const isLessonComplete =
              requiredSections.length > 0 &&
              requiredSections.every((sectionId) =>
                completedSectionsForLesson.has(sectionId)
              );

            return {
              lessonId: lessonReference.guid,
              lessonPath: lessonReference.path,
              title:
                lesson?.title ||
                `Lesson ${
                  lessonReference.path
                    .split("/")
                    .pop()
                    ?.replace("lesson_", "") || "N/A"
                }`,
              isCompleted: isLessonComplete,
            };
          });

          const lessons = await Promise.all(lessonPromises);
          return {
            unitId: unit.id,
            title: unit.title,
            lessons: lessons,
          };
        });

        const results = await Promise.all(unitProgressPromises);
        if (isMounted) {
          setUnitsProgress(results);
        }
      } catch (err) {
        console.error("Error loading progress data:", err);
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load progress data."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProgressData();

    return () => {
      isMounted = false;
    };
  }, [allCompletions]);

  const renderUnitProgress = (unit: UnitProgress) => {
    return (
      <div key={unit.unitId} className={styles.unitProgressContainer}>
        <h3 className={styles.unitTitle}>{unit.title}</h3>
        <div className={styles.lessonsCircles}>
          {unit.lessons.map((lesson, index) => (
            <Link
              key={lesson.lessonId}
              to={`/python/lesson/${lesson.lessonPath}`}
              className={styles.lessonCircleLink}
              title={`${lesson.title} (${
                lesson.isCompleted ? "Completed" : "In Progress"
              })`}
            >
              <div
                className={`${styles.lessonCircle} ${
                  lesson.isCompleted
                    ? styles.completedCircle
                    : styles.incompleteCircle
                }`}
              >
                {index + 1}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.progressPageContainer}>
        <LoadingSpinner message="Loading your progress..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.progressPageContainer}>
        <div className={styles.errorMessage}>
          <h2>Error Loading Progress</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (unitsProgress.length === 0) {
    return (
      <div className={styles.progressPageContainer}>
        <div className={styles.noProgressMessage}>
          <p>No learning units found or no progress recorded yet.</p>
          <Link to="/" className={styles.primaryButton}>
            Start Learning
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.progressPageContainer}>
      <h2>Your Learning Progress</h2>
      <p className={styles.introText}>
        Track your progress through the Python learning units.
      </p>
      {unitsProgress.map(renderUnitProgress)}
    </div>
  );
};

export default ProgressPage;
