// src/pages/UnitPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  fetchUnitById,
  getRequiredSectionsForLesson,
} from "../../lib/dataLoader";
import * as dataHelpers from "../../lib/dataHelpers";
import type { Unit, Lesson, UnitId, LessonId } from "../../types/data";
import styles from "./UnitPage.module.css";
import { useAllCompletions } from "../../stores/progressStore";
import LoadingSpinner from "../../components/LoadingSpinner";

type CompletionStatus = {
  text: string;
  class: string;
};

const UnitPage: React.FC = () => {
  const { unitId } = useParams<{ unitId: UnitId }>();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [lessonsData, setLessonsData] = useState<Map<LessonId, Lesson | null>>(
    new Map()
  );
  const [pathToGuidMap, setPathToGuidMap] = useState<Map<string, LessonId>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const allCompletions = useAllCompletions();

  useEffect(() => {
    const loadUnitAndLessons = async () => {
      if (!unitId) {
        setError("No Unit ID provided in URL.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setLessonsData(new Map());
      setPathToGuidMap(new Map());

      try {
        const fetchedUnit = await fetchUnitById(unitId);
        if (!fetchedUnit) {
          throw new Error(`Unit with ID "${unitId}" not found.`);
        }
        setUnit(fetchedUnit);
        document.title = `${fetchedUnit.title} - Python Lessons`;

        // Load all lessons for this unit
        const lessons = await dataHelpers.loadLessonsForUnit(fetchedUnit);

        // Create maps for quick lookups
        const loadedLessons = dataHelpers.createGuidToLessonMap(lessons);
        const pathToGuid = dataHelpers.createPathToGuidMap(
          fetchedUnit,
          lessons
        );

        setLessonsData(loadedLessons);
        setPathToGuidMap(pathToGuid);
      } catch (err) {
        console.error("Error loading unit page:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setUnit(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUnitAndLessons();
  }, [unitId]);

  const lessonStatuses = useMemo(() => {
    const statuses = new Map<LessonId, CompletionStatus>();
    if (unit) {
      unit.lessons.forEach((lessonReference) => {
        const lessonGuid = pathToGuidMap.get(lessonReference.path);
        if (!lessonGuid) {
          // Lesson not loaded yet or failed to load
          return;
        }

        let status: CompletionStatus = {
          text: "Not Started", // Default status
          class: "not-started",
        };
        const lesson = lessonsData.get(lessonGuid);

        if (lesson === null) {
          status = { text: "Info unavailable", class: "not-started" };
        } else if (lesson) {
          try {
            let completedSectionsForThisLesson = new Set<string>();
            if (allCompletions?.[unit.id]?.[lessonGuid]) {
              completedSectionsForThisLesson = new Set(
                Object.keys(allCompletions[unit.id][lessonGuid])
              );
            }

            const requiredSections = getRequiredSectionsForLesson(lesson);
            if (requiredSections.length === 0) {
              status = { text: "No sections", class: "not-started" };
            } else if (completedSectionsForThisLesson.size === 0) {
              status = { text: "Not Started", class: "not-started" };
            } else {
              const completedRequiredCount = requiredSections.filter(
                (sectionId) => completedSectionsForThisLesson.has(sectionId)
              ).length;

              if (completedRequiredCount >= requiredSections.length) {
                status = { text: "Completed", class: "completed" };
              } else if (completedRequiredCount > 0) {
                const percentage = Math.round(
                  (completedRequiredCount / requiredSections.length) * 100
                );
                status = {
                  text: `${percentage}% Complete`,
                  class: "in-progress",
                };
              } else {
                status = { text: "Started", class: "in-progress" };
              }
            }
          } catch (e) {
            console.error(`Error calculating status for ${lessonGuid}:`, e);
            status = { text: "Status Error", class: "not-started" };
          }
        }
        statuses.set(lessonGuid, status);
      });
    }
    return statuses;
  }, [unit, lessonsData, pathToGuidMap, allCompletions]);

  if (isLoading) {
    return <LoadingSpinner message="Loading unit content..." />;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading unit: {error}</p>
        <Link to="/python/" className={styles.backLink}>
          &larr; Back to Learning Paths
        </Link>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className={styles.error}>
        <p>Unit data could not be loaded.</p>
        <Link to="/python/" className={styles.backLink}>
          &larr; Back to Learning Paths
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.unitContainer}>
      <Link to="/python/" className={styles.backLink}>
        &larr; Back to Learning Paths
      </Link>
      <div className={styles.unitHeader}>
        <h2 className={styles.unitTitle}>{unit.title}</h2>
        <div className={styles.unitDescription}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {unit.description}
          </ReactMarkdown>
        </div>
      </div>
      <div className={styles.lessonsList}>
        {unit.lessons.map((lessonReference, index) => {
          const lessonGuid = pathToGuidMap.get(lessonReference.path);
          const lesson = lessonGuid ? lessonsData.get(lessonGuid) : undefined;
          const status = lessonGuid
            ? lessonStatuses.get(lessonGuid) || {
                text: "Loading...",
                class: "not-started",
              }
            : { text: "Loading...", class: "not-started" };

          if (lesson === null) {
            return (
              <div
                key={lessonReference.path}
                className={`${styles.lessonCard} ${styles.lessonCardError}`}
              >
                <div className={styles.lessonNumber}>Lesson {index + 1}</div>
                <h3 className={styles.lessonTitle}>Lesson Unavailable</h3>
                <p className={styles.lessonDescription}>
                  Could not load data for {lessonReference.path}.
                </p>
              </div>
            );
          }
          if (!lesson) {
            return (
              <div key={lessonReference.path} className={styles.lessonCard}>
                <div className={styles.lessonNumber}>Lesson {index + 1}</div>
                <h3 className={styles.lessonTitle}>Loading...</h3>
              </div>
            );
          }

          return (
            <Link
              to={`/python/lesson/${lessonReference.path}`}
              key={lessonReference.path}
              className={styles.lessonCardLink}
            >
              <div className={styles.lessonCard}>
                <div className={styles.lessonNumber}>Lesson {index + 1}</div>
                <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                <div className={styles.lessonDescription}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {lesson.description}
                  </ReactMarkdown>
                </div>
                <div className={styles.lessonStatus}>
                  {status.class === "completed" ? (
                    <span
                      className={`${styles.checkmarkIcon} ${styles.statusCompleted}`}
                    >
                      ✓
                    </span>
                  ) : (
                    <span
                      className={`${styles.statusDot} ${styles[status.class]}`}
                    ></span>
                  )}
                  <span>{status.text}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default UnitPage;
