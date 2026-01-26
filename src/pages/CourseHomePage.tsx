import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getCoursesAsync } from "../lib/dataLoader";
import type { Course } from "../types/data";
import styles from "./CourseHomePage.module.css";
import loadingStyles from "../components/LoadingSpinner.module.css";
import PhilosophySection from "../components/PhilosophySection";
import LoadingSpinner from "../components/LoadingSpinner";
import { BASE_PATH } from "../config";

const CourseHomePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        setIsLoading(true);

        if (!courseId) {
          setError("No course specified");
          return;
        }

        const courses = await getCoursesAsync();
        const foundCourse = courses.find((c) => c.id === courseId);

        if (!foundCourse) {
          setError(`Course not found: ${courseId}`);
          return;
        }

        setCourse(foundCourse);
      } catch (err) {
        console.error("CourseHomePage Error:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [courseId]);

  const defaultImagePath = `${BASE_PATH}images/unit_icon_default.svg`;

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = event.target as HTMLImageElement;
    target.onerror = null;
    target.src = defaultImagePath;
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner message="Loading units..." />;
    }

    if (error) {
      return <div className={styles.error}>Error loading units: {error}</div>;
    }

    if (!course || course.units.length === 0) {
      return (
        <div className={loadingStyles.spinnerContainer}>
          <p>No units available yet. Check back soon!</p>
        </div>
      );
    }

    return (
      <div className={styles.unitsGrid}>
        {course.units.map((unit, index) => (
          <Link
            to={`/${courseId}/unit/${unit.id}`}
            key={unit.id}
            className={styles.unitCardLink}
          >
            <div className={styles.unitCard}>
              <div className={styles.unitImageContainer}>
                <img
                  src={unit.image || `${BASE_PATH}images/unit_icon_default.svg`}
                  alt={`${unit.title} image`}
                  className={styles.unitImage}
                  onError={handleImageError}
                />
              </div>
              <div className={styles.unitContent}>
                <div className={styles.unitNumber}>Unit {index + 1}</div>
                <h3 className={styles.unitTitle}>{unit.title}</h3>
                <div className={styles.unitDescription}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {unit.description}
                  </ReactMarkdown>
                </div>
                <div className={styles.unitDetails}>
                  <div className={styles.unitLessons}>
                    {unit.lessons.length} lessons
                  </div>
                  <button className={styles.unitButton}>Start Learning</button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.homePageContainer}>
      <section className={styles.welcome}>
        <h2>{course?.title || "Loading..."}</h2>
      </section>
      {course?.longDescription && (
        <PhilosophySection markdown={course.longDescription} />
      )}
      <section className={styles.learningPaths}>
        <h2>Available Units</h2>
        <p className={styles.learningPathsIntro}>
          Work through the units in order for the best learning experience.
        </p>
        {renderContent()}
      </section>
    </div>
  );
};

export default CourseHomePage;
