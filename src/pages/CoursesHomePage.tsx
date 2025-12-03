import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCoursesAsync } from "../lib/dataLoader";
import type { Course } from "../types/data";
import styles from "./CoursesHomePage.module.css";
import WelcomeModal from "../components/WelcomeModal";
import LoadingSpinner from "../components/LoadingSpinner";

const MODAL_SEEN_KEY = "hasSeenRoleSelector";

const CoursesHomePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    // Check if the user has seen the modal before
    const hasSeenModal = localStorage.getItem(MODAL_SEEN_KEY);
    if (!hasSeenModal) {
      setShowRoleModal(true);
    }

    // Load courses asynchronously
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        const loadedCourses = await getCoursesAsync();
        setCourses(loadedCourses);
      } catch (err) {
        console.error("Error loading courses:", err);
        setError(err instanceof Error ? err.message : "Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  return (
    <>
      {showRoleModal && (
        <WelcomeModal onClose={() => setShowRoleModal(false)} />
      )}
      <div className={styles.container}>
        <section className={styles.welcome}>
          <h1>Welcome to Thoughtful Coding</h1>
          <p className={styles.subtitle}>
            Learn programming through interactive, thoughtful lessons
          </p>
        </section>

        <section className={styles.philosophySection}>
          <h2>Philosophy</h2>
          <ul>
            <li>Anyone can learn to code.</li>
            <li>
              Programming is a wonderful way to order your thoughts and
              accomplish complex tasks.
            </li>
            <li>
              Like any language, learning to code takes concentration and
              practice.
            </li>
            <li>
              The best way to learn is PRIMM: Predict, Run, Investigate, Modify,
              Make.
            </li>
            <li>The best way to solidify knowledge is through reflection.</li>
            <li>
              There are many powerful coding tools, but they can be overwhelming
              for beginners.
            </li>
            <li>
              Once you have a base understanding, it's easy to jump to more
              powerful tools.
            </li>
          </ul>
        </section>

        <section className={styles.coursesSection}>
          <h2>Available Courses</h2>
          <p className={styles.coursesIntro}>
            Choose a course to begin your learning journey
          </p>

          {isLoading ? (
            <LoadingSpinner message="Loading courses..." />
          ) : error ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "var(--error-color)",
              }}
            >
              Error loading courses: {error}
            </div>
          ) : courses.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              No courses available yet. Check back soon!
            </div>
          ) : (
            <div className={styles.coursesGrid}>
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link to={`/${course.id}`} className={styles.courseCardLink}>
      <div className={styles.courseCard}>
        <div className={styles.courseImageContainer}>
          <img
            src={course.image}
            alt={`${course.title} course`}
            className={styles.courseImage}
          />
        </div>
        <div className={styles.courseContent}>
          <h3 className={styles.courseTitle}>{course.title}</h3>
          <p className={styles.courseDescription}>{course.description}</p>
          {course.difficulty && (
            <span
              className={`${styles.difficultyBadge} ${styles[course.difficulty]}`}
            >
              {course.difficulty}
            </span>
          )}
          <div className={styles.courseFooter}>
            <span className={styles.unitCount}>
              {course.units.length}{" "}
              {course.units.length === 1 ? "unit" : "units"}
            </span>
            <span className={styles.startButton}>Start Learning →</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CoursesHomePage;
