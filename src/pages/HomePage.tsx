import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchUnitsData } from "../lib/dataLoader";
import type { Unit } from "../types/data";
import styles from "./HomePage.module.css";
import loadingStyles from "../components/LoadingSpinner.module.css";
import LoadingSpinner from "../components/LoadingSpinner";
import { BASE_PATH } from "../config";
import WelcomeModal from "../components/WelcomeModal";

const MODAL_SEEN_KEY = "hasSeenRoleSelector";

const HomePage: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    // Check if the user has seen the modal before
    const hasSeenModal = localStorage.getItem(MODAL_SEEN_KEY);
    if (!hasSeenModal) {
      setShowRoleModal(true);
    }

    const loadData = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const unitsData = await fetchUnitsData();
        setUnits(unitsData.units);
      } catch (err) {
        console.error("HomePage Error:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

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
      return <LoadingSpinner message="Loading learning paths..." />;
    }

    if (error) {
      return (
        <div className={styles.error}>
          Error loading learning paths: {error}
        </div>
      );
    }

    if (units.length === 0) {
      return (
        <div className={loadingStyles.spinnerContainer}>
          <p>No learning paths available yet. Check back soon!</p>
        </div>
      );
    }

    return (
      <div className={styles.unitsGrid}>
        {units.map((unit) => (
          <Link
            to={`/python/unit/${unit.id}`}
            key={unit.id}
            className={styles.unitCardLink}
          >
            <div className={styles.unitCard}>
              <div className={styles.unitImageContainer}>
                <img
                  src={`${BASE_PATH}data/${
                    unit.image || "images/unit_icon_default.svg"
                  }`}
                  alt={`${unit.title} image`}
                  className={styles.unitImage}
                  onError={handleImageError}
                />
              </div>
              <div className={styles.unitContent}>
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
    <>
      {showRoleModal && (
        <WelcomeModal onClose={() => setShowRoleModal(false)} />
      )}
      <div className={styles.homePageContainer}>
        <section className={styles.welcome}>
          <h2>A Thoughtful Approach to Learning Python</h2>
        </section>
        <section className={styles.philosophySection}>
          <p>
            This website can be viewed as the first step on your programming
            journey. It will help you establish a strong foundation in Python
            fundamentals and effective learning processes. Once you feel more
            confident, you will be well-prepared to explore other, more powerful
            tools.
          </p>
          <h3>Philosophy:</h3>
          <ul>
            <li>Anyone can learn Python.</li>
            <li>
              Python is a wonderful way to order your thoughts and accomplish
              complex tasks.
            </li>
            <li>
              Like any language, learning Python takes concentration and
              practice.
            </li>
            <li>
              The best way to learn a programming language is PRIMM: Predict,
              Run, Investigate, Modify, Make.
            </li>
            <li>
              The best way to solidify your knowledge is through reflection.
            </li>
            <li>
              There are many powerful coding tools, but they are overwhelming
              for first time learners.
            </li>
            <li>
              Once you have a base understanding, it's easy to jump to more
              powerful tools.
            </li>
          </ul>
        </section>
        <section className={styles.learningPaths}>
          <h2>Learning Paths</h2>
          <p className={styles.learningPathsIntro}>
            {" "}
            Choose a learning path to begin your Python journey.
          </p>
          {renderContent()}
        </section>
      </div>
    </>
  );
};

export default HomePage;
