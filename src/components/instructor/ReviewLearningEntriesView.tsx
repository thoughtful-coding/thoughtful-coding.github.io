import React, { useState, useEffect } from "react";
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

import RenderFinalLearningEntry from "./shared/RenderFinalLearningEntry";

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

  const [selectedStudentId, setSelectedStudentId] = useState<UserId | "">("");
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

  const { lessonTitlesMap } = useLessonTitleMap(units);

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
        lessonTitle: lessonTitlesMap.get(entry.lessonId) || "Unknown Lesson",
        sectionId: entry.sectionId,
        date: entry.createdAt, // This is the final submission date
        sortDate: new Date(entry.createdAt),
        data: entry, // The single final ReflectionVersionItem
      })
    );

    workItems.sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime()); // Newest first
    setDisplayableFinalEntries(workItems);
    if (workItems.length > 0 && currentEntryIndex === null) {
      setCurrentEntryIndex(0);
    } else if (workItems.length === 0) {
      setCurrentEntryIndex(null);
    }
  }, [finalLearningEntries, lessonTitlesMap]); // Removed currentEntryIndex from deps

  const selectedStudentInfo = permittedStudents.find(
    (s) => s.studentId === selectedStudentId
  );
  const currentEntryToDisplay =
    currentEntryIndex !== null
      ? displayableFinalEntries[currentEntryIndex]
      : null;

  const handleNextEntry = () => {
    setCurrentEntryIndex((prev) =>
      prev !== null && prev < displayableFinalEntries.length - 1
        ? prev + 1
        : prev
    );
  };
  const handlePrevEntry = () => {
    setCurrentEntryIndex((prev) =>
      prev !== null && prev > 0 ? prev - 1 : prev
    );
  };

  return (
    <div className={styles.viewContainer}>
      <h3>Review Student Learning Entries (Final Submissions)</h3>
      <div className={styles.filters}>
        <select
          id="student-select-learning-entries"
          value={selectedStudentId}
          onChange={(e) => {
            setSelectedStudentId(e.target.value as UserId);
            setCurrentEntryIndex(null);
            setDisplayableFinalEntries([]);
          }}
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
          {displayableFinalEntries.length > 0 ? (
            <div
              className={styles.assignmentListContainer}
              style={{ maxHeight: "300px", marginBottom: "1rem" }}
            >
              <p
                style={{
                  padding: "0.5rem 1rem",
                  margin: 0,
                  fontSize: "0.9em",
                  color: "#555",
                }}
              >
                Select a final learning entry to view details:
              </p>
              <ul className={styles.assignmentList}>
                {displayableFinalEntries.map((item, index) => (
                  <li
                    key={item.key}
                    className={`${styles.assignmentListItem} ${
                      currentEntryIndex === index ? styles.selected : ""
                    }`}
                    onClick={() => setCurrentEntryIndex(index)}
                  >
                    <span className={styles.assignmentTitle}>{item.title}</span>
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
              No final learning entries found for this student.
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

              {displayableFinalEntries.length > 1 && (
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
                    {displayableFinalEntries.length}
                  </span>
                  <button
                    onClick={handleNextEntry}
                    disabled={
                      currentEntryIndex === null ||
                      currentEntryIndex >= displayableFinalEntries.length - 1
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
