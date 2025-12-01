// src/pages/LearningEntriesPage.tsx
import React, { useState, useEffect } from "react";
import styles from "./LearningEntriesPage.module.css";
import { useAuthStore } from "../../stores/authStore";
import * as apiService from "../../lib/apiService";
import { ReflectionVersionItem } from "../../types/apiServiceTypes";
import LoadingSpinner from "../../components/LoadingSpinner";
import RenderFinalLearningEntry from "../../components/instructor/shared/RenderFinalLearningEntry";
import CustomReflectionEntry from "../../components/custom/CustomReflectionEntry";
import { isCustomReflection } from "../../types/customReflections";

const LearningEntriesPage: React.FC = () => {
  const [finalEntries, setFinalEntries] = useState<ReflectionVersionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingCustomEntry, setIsAddingCustomEntry] =
    useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

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
  }, [isAuthenticated, refreshKey]);

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
        <div className={styles.noEntriesMessage}>
          <p>No learning entries yet. Complete reflection activities in lessons or create custom entries below.</p>
        </div>
      ) : (
        <div className={styles.entriesList}>
          {finalEntries.map((entry) => (
            <div key={entry.versionId} className={styles.entryWrapper}>
              {isCustomReflection(entry) && (
                <span className={styles.customBadge}>Custom Entry</span>
              )}
              <RenderFinalLearningEntry entry={entry} />
            </div>
          ))}
        </div>
      )}

      {/* Custom Reflection Entry Section */}
      {isAuthenticated && (
        <div className={styles.customEntrySection}>
          <button
            onClick={() => setIsAddingCustomEntry(!isAddingCustomEntry)}
            className={styles.customEntryToggle}
          >
            {isAddingCustomEntry ? "− Hide" : "+ Add New Custom Entry"}
          </button>

          {isAddingCustomEntry && (
            <div className={styles.customEntryContainer}>
              <CustomReflectionEntry
                onSuccess={() => {
                  setRefreshKey((k) => k + 1);
                  setIsAddingCustomEntry(false);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LearningEntriesPage;
