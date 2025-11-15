/**
 * Difficulty Statistics Calculator
 *
 * Client-side utilities for calculating section difficulty statistics
 * (p50, p95, mean, distribution) from student completion data.
 */

import type { SectionId, LessonId } from "../types/data";
import type {
  StudentUnitCompletionData,
  SectionDifficultyStats,
} from "../types/apiServiceTypes";

/**
 * Calculate percentile from sorted array
 * @param sortedArray - Array of numbers sorted in ascending order
 * @param p - Percentile as decimal (0.50 for median, 0.95 for 95th percentile)
 * @returns The value at the specified percentile
 */
function percentile(sortedArray: number[], p: number): number {
  if (sortedArray.length === 0) return 0;
  const index = Math.floor(sortedArray.length * p);
  return sortedArray[Math.min(index, sortedArray.length - 1)];
}

/**
 * Calculate difficulty statistics for a specific section across all students
 *
 * @param studentData - Array of student completion data
 * @param lessonId - ID of the lesson containing the section
 * @param sectionId - ID of the section to analyze
 * @returns Statistics object or null if no completion data exists
 *
 * @example
 * const stats = calculateSectionStats(students, "lesson-1", "quiz-1");
 * console.log(`Median attempts: ${stats.p50}`); // e.g., "Median attempts: 2"
 */
export function calculateSectionStats(
  studentData: StudentUnitCompletionData[],
  lessonId: LessonId,
  sectionId: SectionId
): SectionDifficultyStats | null {
  // Collect all attempt counts for this section across all students
  const attempts: number[] = [];

  for (const student of studentData) {
    const lessonCompletions = student.completedSectionsInUnit[lessonId];
    if (!lessonCompletions) continue;

    const sectionCompletion = lessonCompletions[sectionId];
    if (sectionCompletion?.attemptsBeforeSuccess) {
      attempts.push(sectionCompletion.attemptsBeforeSuccess);
    }
  }

  // Return null if no students have completed this section
  if (attempts.length === 0) return null;

  // Sort for percentile calculation
  const sorted = [...attempts].sort((a, b) => a - b);

  // Calculate distribution (map of attempts -> count)
  const distribution = attempts.reduce(
    (acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  // Calculate mean
  const sum = attempts.reduce((a, b) => a + b, 0);
  const mean = sum / attempts.length;

  return {
    sectionId,
    totalCompletions: attempts.length,
    p50: percentile(sorted, 0.5),
    p95: percentile(sorted, 0.95),
    mean: Math.round(mean * 100) / 100, // Round to 2 decimal places
    distribution,
  };
}

/**
 * Calculate aggregate difficulty statistics for an entire lesson
 *
 * Averages the p50 and p95 values across all specified sections in the lesson.
 * Useful for showing overall lesson difficulty in a table header.
 *
 * @param studentData - Array of student completion data
 * @param lessonId - ID of the lesson to analyze
 * @param sectionIds - Array of section IDs to include in the aggregate
 * @returns Object with averaged p50 and p95, or null if no data
 *
 * @example
 * const stats = calculateLessonAggregateStats(students, "lesson-1", ["quiz-1", "quiz-2"]);
 * console.log(`Lesson difficulty: p50=${stats.p50}, p95=${stats.p95}`);
 */
export function calculateLessonAggregateStats(
  studentData: StudentUnitCompletionData[],
  lessonId: LessonId,
  sectionIds: SectionId[]
): { p50: number; p95: number } | null {
  // Calculate stats for each section
  const allStats = sectionIds
    .map((sId) => calculateSectionStats(studentData, lessonId, sId))
    .filter((s): s is SectionDifficultyStats => s !== null);

  // Return null if no sections have completion data
  if (allStats.length === 0) return null;

  // Average the percentiles across all sections
  const sumP50 = allStats.reduce((sum, s) => sum + s.p50, 0);
  const sumP95 = allStats.reduce((sum, s) => sum + s.p95, 0);

  return {
    p50: Math.round(sumP50 / allStats.length),
    p95: Math.round(sumP95 / allStats.length),
  };
}
