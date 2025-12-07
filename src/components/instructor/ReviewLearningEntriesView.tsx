import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type {
  UserId,
  LessonId,
  Unit,
  SectionId,
  IsoTimestamp,
} from "../../types/data";
import type {
  InstructorStudentInfo,
  ReflectionVersionItem,
} from "../../types/apiServiceTypes";
import * as apiService from "../../lib/apiService";
import { useAuthStore } from "../../stores/authStore";
import { useLessonTitleMap } from "../../hooks/useCurriculumData";
import LoadingSpinner from "../LoadingSpinner";
import styles from "./InstructorViews.module.css";
import { isCustomReflection } from "../../types/customReflections";

import RenderFinalLearningEntry from "./shared/RenderFinalLearningEntry";

type EntryFilter = "all" | "lesson" | "custom";

// Type for the list items in this view
interface DisplayableFinalEntryItem {
  key: string;
  title: string;
  lessonGuid: LessonId;
  lessonTitle?: string;
  sectionId: SectionId;
  date: IsoTimestamp;
  sortDate: Date;
  data: ReflectionVersionItem;
}

interface ReviewLearningEntriesViewProps {
  permittedStudents: InstructorStudentInfo[];
  units: Unit[];
}

const ReviewLearningEntriesView: React.FC<ReviewLearningEntriesViewProps> = ({
  permittedStudents,
  units,
}) => {
  const { isAuthenticated } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedStudentId, setSelectedStudentId] = useState<UserId | "">("");
  const [entryFilter, setEntryFilter] = useState<EntryFilter>("all");
  const [finalLearningEntries, setFinalLearningEntries] = useState<
    ReflectionVersionItem[]
  >([]);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayableFinalEntries, setDisplayableFinalEntries] = useState<
    DisplayableFinalEntryItem[]
  >([]);
  const [currentEntryIndex, setCurrentEntryIndex] = useState<number | null>(
    null
  );
  const [pendingEntryId, setPendingEntryId] = useState<string | null>(null);

  const { lessonTitlesMap } = useLessonTitleMap(units);

  // Update URL when selections change
  const updateUrlParams = useCallback(
    (student: string, filter: EntryFilter, entryId: string | null) => {
      const params: Record<string, string> = {};
      if (student) params.student = student;
      if (filter !== "all") params.filter = filter;
      if (entryId) params.entry = entryId;
      setSearchParams(params);
    },
    [setSearchParams]
  );

  // Initialize from URL on mount
  useEffect(() => {
    const studentFromUrl = searchParams.get("student") as UserId | null;
    const filterFromUrl = searchParams.get("filter") as EntryFilter | null;
    const entryFromUrl = searchParams.get("entry");

    if (studentFromUrl && studentFromUrl !== selectedStudentId) {
      setSelectedStudentId(studentFromUrl);
    }
    if (filterFromUrl && ["all", "lesson", "custom"].includes(filterFromUrl)) {
      setEntryFilter(filterFromUrl);
    }
    if (entryFromUrl) {
      setPendingEntryId(entryFromUrl);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedStudentId && isAuthenticated) {
      const fetchStudentFinalEntries = async () => {
        setIsLoadingData(true);
        setError(null);
        setFinalLearningEntries([]);
        setDisplayableFinalEntries([]);
        setCurrentEntryIndex(null);

        try {
          // Call the new API service function
          const response =
            await apiService.getInstructorStudentFinalLearningEntries(
              selectedStudentId
            );
          setFinalLearningEntries(response.entries); // These are already filtered to be isFinal: true
        } catch (err) {
          console.error(
            `Failed to fetch final learning entries for student ${selectedStudentId}:`,
            err
          );
          if (err instanceof apiService.ApiError) {
            setError(`Error: ${err.data.message || err.message}`);
          } else {
            setError("An unknown error occurred.");
          }
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchStudentFinalEntries();
    } else {
      setFinalLearningEntries([]);
      setDisplayableFinalEntries([]);
      setCurrentEntryIndex(null);
    }
  }, [selectedStudentId, isAuthenticated]);

  // Process fetched final entries into a displayable list
  useEffect(() => {
    const workItems: DisplayableFinalEntryItem[] = finalLearningEntries.map(
      (entry) => ({
        key: `final-reflection-${entry.versionId}`,
        title: entry.userTopic || `Reflection for Section ${entry.sectionId}`,
        lessonGuid: entry.lessonId,
        lessonTitle: isCustomReflection(entry)
          ? "Custom Entry"
          : lessonTitlesMap.get(entry.lessonId) || "Unknown Lesson",
        sectionId: entry.sectionId,
        date: entry.createdAt, // This is the final submission date
        sortDate: new Date(entry.createdAt),
        data: entry, // The single final ReflectionVersionItem
      })
    );

    workItems.sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime()); // Newest first
    setDisplayableFinalEntries(workItems);

    // Handle pending entry from URL or default to first
    if (workItems.length > 0) {
      if (pendingEntryId) {
        const idx = workItems.findIndex(
          (item) => item.data.versionId === pendingEntryId
        );
        setCurrentEntryIndex(idx >= 0 ? idx : 0);
        setPendingEntryId(null);
      } else {
        // Use functional update to avoid stale closure
        setCurrentEntryIndex((prev) => (prev === null ? 0 : prev));
      }
    } else {
      setCurrentEntryIndex(null);
    }
  }, [finalLearningEntries, lessonTitlesMap, pendingEntryId]);

  // Filter entries based on selected filter
  const filteredDisplayableEntries = useMemo(() => {
    if (entryFilter === "all") return displayableFinalEntries;
    if (entryFilter === "lesson")
      return displayableFinalEntries.filter((e) => !isCustomReflection(e.data));
    if (entryFilter === "custom")
      return displayableFinalEntries.filter((e) => isCustomReflection(e.data));
    return displayableFinalEntries;
  }, [displayableFinalEntries, entryFilter]);

  const selectedStudentInfo = permittedStudents.find(
    (s) => s.studentId === selectedStudentId
  );
  const currentEntryToDisplay =
    currentEntryIndex !== null
      ? filteredDisplayableEntries[currentEntryIndex]
      : null;

  const handleEntrySelect = useCallback(
    (index: number) => {
      setCurrentEntryIndex(index);
      const entry = filteredDisplayableEntries[index];
      if (entry) {
        updateUrlParams(selectedStudentId, entryFilter, entry.data.versionId);
      }
    },
    [
      filteredDisplayableEntries,
      selectedStudentId,
      entryFilter,
      updateUrlParams,
    ]
  );

  const handleNextEntry = () => {
    if (
      currentEntryIndex !== null &&
      currentEntryIndex < filteredDisplayableEntries.length - 1
    ) {
      handleEntrySelect(currentEntryIndex + 1);
    }
  };
  const handlePrevEntry = () => {
    if (currentEntryIndex !== null && currentEntryIndex > 0) {
      handleEntrySelect(currentEntryIndex - 1);
    }
  };

  const handleStudentChange = (newStudentId: UserId | "") => {
    setSelectedStudentId(newStudentId);
    setCurrentEntryIndex(null);
    setDisplayableFinalEntries([]);
    updateUrlParams(newStudentId, entryFilter, null);
  };

  const handleFilterChange = (newFilter: EntryFilter) => {
    setEntryFilter(newFilter);
    setCurrentEntryIndex(null);
    updateUrlParams(selectedStudentId, newFilter, null);
  };

  return (
    <div className={styles.viewContainer}>
      <h3>Review Student Learning Entries (Final Submissions)</h3>
      <div className={styles.filters}>
        <select
          id="student-select-learning-entries"
          value={selectedStudentId}
          onChange={(e) => handleStudentChange(e.target.value as UserId | "")}
          className={styles.filterSelect}
          disabled={permittedStudents.length === 0}
        >
          <option value="">-- Select a Student --</option>
          {permittedStudents.map((student) => (
            <option key={student.studentId} value={student.studentId}>
              {student.studentName || student.studentId}{" "}
              {student.studentEmail ? `(${student.studentEmail})` : ""}
            </option>
          ))}
        </select>

        <select
          id="entry-type-filter"
          value={entryFilter}
          onChange={(e) => handleFilterChange(e.target.value as EntryFilter)}
          className={styles.filterSelect}
          disabled={!selectedStudentId}
        >
          <option value="all">All Entries</option>
          <option value="lesson">Lesson Reflections</option>
          <option value="custom">Custom Entries</option>
        </select>
      </div>

      {isLoadingData && (
        <LoadingSpinner
          message={`Loading learning entries for ${
            selectedStudentInfo?.studentName || selectedStudentId
          }...`}
        />
      )}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {selectedStudentId && !isLoadingData && !error && (
        <>
          {filteredDisplayableEntries.length > 0 ? (
            <div
              className={`${styles.assignmentListContainer} ${styles.entryListContainer}`}
            >
              <p className={styles.entryListDescription}>
                Select a final learning entry to view details (
                {filteredDisplayableEntries.length}{" "}
                {entryFilter === "all" ? "total" : entryFilter}{" "}
                {filteredDisplayableEntries.length === 1 ? "entry" : "entries"}
                ):
              </p>
              <ul className={styles.assignmentList}>
                {filteredDisplayableEntries.map((item, index) => (
                  <li
                    key={item.key}
                    className={`${styles.assignmentListItem} ${
                      currentEntryIndex === index ? styles.selected : ""
                    }`}
                    onClick={() => handleEntrySelect(index)}
                  >
                    <span className={styles.assignmentTitle}>
                      {isCustomReflection(item.data) && (
                        <span className={styles.customEntryBadge}>Custom </span>
                      )}
                      {item.title}
                    </span>
                    <span className={styles.assignmentMeta}>
                      {item.lessonTitle} -{" "}
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className={styles.placeholderMessage}>
              No {entryFilter === "all" ? "" : entryFilter} learning entries
              found for this student.
            </p>
          )}

          {currentEntryToDisplay && (
            <div className={styles.submissionViewer}>
              {/* No general H4 here, RenderFinalLearningEntry provides its own title */}
              <RenderFinalLearningEntry
                entry={currentEntryToDisplay.data}
                studentName={selectedStudentInfo?.studentName}
                lessonTitle={currentEntryToDisplay.lessonTitle}
              />

              {filteredDisplayableEntries.length > 1 && (
                <div className={styles.navigationButtons}>
                  <button
                    onClick={handlePrevEntry}
                    disabled={
                      currentEntryIndex === 0 || currentEntryIndex === null
                    }
                  >
                    &larr; Previous Entry
                  </button>
                  <span>
                    Entry{" "}
                    {currentEntryIndex !== null ? currentEntryIndex + 1 : "-"}/
                    {filteredDisplayableEntries.length}
                  </span>
                  <button
                    onClick={handleNextEntry}
                    disabled={
                      currentEntryIndex === null ||
                      currentEntryIndex >= filteredDisplayableEntries.length - 1
                    }
                  >
                    Next Entry &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
      {!selectedStudentId && permittedStudents.length > 0 && (
        <p className={styles.placeholderMessage}>
          Please select a student to view their learning entries.
        </p>
      )}
    </div>
  );
};

export default ReviewLearningEntriesView;
