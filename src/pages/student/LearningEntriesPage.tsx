// src/pages/LearningEntriesPage.tsx
import React, { useState, useEffect } from "react";
import styles from "./LearningEntriesPage.module.css";
import { useAuthStore } from "../../stores/authStore";
import * as apiService from "../../lib/apiService";
import { ReflectionVersionItem } from "../../types/apiServiceTypes";
import LoadingSpinner from "../../components/LoadingSpinner";
import RenderFinalLearningEntry from "../../components/instructor/shared/RenderFinalLearningEntry";

const LearningEntriesPage: React.FC = () => {
  const [finalEntries, setFinalEntries] = useState<ReflectionVersionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // ... data fetching logic remains the same ...
    if (!isAuthenticated) {
      setError("Please log in to view your learning entries.");
      setIsLoading(false);
      setFinalEntries([]);
      return;
    }

    const fetchEntries = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiService.getFinalizedLearningEntries();
        const sortedEntries = response.entries.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFinalEntries(sortedEntries);
      } catch (err) {
        console.error("Failed to fetch finalized learning entries:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load learning entries."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [isAuthenticated]);

  if (!isAuthenticated && !isLoading) {
    return (
      <div className={styles.learningEntriesSection}>
        <h2>Your Learning Entries</h2>
        <div className={styles.noEntriesMessage}>
          <p>Please log in to view your learning journal.</p>
        </div>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className={styles.learningEntriesSection}>
        <LoadingSpinner message="Loading your learning entries..." />
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.learningEntriesSection}>
        <div
          className={styles.apiError}
          style={{ textAlign: "center", padding: "2rem" }}
        >
          Error loading entries: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.learningEntriesSection}>
      <h2>Your Learning Journal</h2>
      <p className={styles.introText}>
        This page displays all your finalized reflection entries. The AI
        feedback that qualified these submissions can be found on the original
        draft versions within each lesson.
      </p>

      {finalEntries.length === 0 ? (
        <div className={styles.noEntriesMessage}>{/* ... */}</div>
      ) : (
        <div className={styles.entriesList}>
          {/* 2. Replace the large block of rendering logic with the reusable component */}
          {finalEntries.map((entry) => (
            <RenderFinalLearningEntry key={entry.versionId} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningEntriesPage;
