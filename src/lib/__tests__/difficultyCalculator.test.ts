import { describe, it, expect } from "vitest";
import {
  calculateSectionStats,
  calculateLessonAggregateStats,
} from "../difficultyCalculator";
import type {
  StudentUnitCompletionData,
  SectionCompletionDetail,
} from "../../types/apiServiceTypes";
import type { LessonId, SectionId } from "../../types/data";

// Helper to create mock completion data
function createCompletion(attempts: number): SectionCompletionDetail {
  return {
    completedAt: "2024-01-15T10:30:00Z",
    attemptsBeforeSuccess: attempts,
  };
}

describe("difficultyCalculator", () => {
  describe("calculateSectionStats", () => {
    it("calculates p50 and p95 correctly for a typical dataset", () => {
      const mockData: StudentUnitCompletionData[] = [
        {
          studentId: "s1",
          completedSectionsInUnit: {
            "lesson-1": {
              "sec-1": createCompletion(1),
            },
          },
        },
        {
          studentId: "s2",
          completedSectionsInUnit: {
            "lesson-1": {
              "sec-1": createCompletion(2),
            },
          },
        },
        {
          studentId: "s3",
          completedSectionsInUnit: {
            "lesson-1": {
              "sec-1": createCompletion(5),
            },
          },
        },
      ];

      const stats = calculateSectionStats(
        mockData,
        "lesson-1" as LessonId,
        "sec-1" as SectionId
      );

      expect(stats).toEqual({
        sectionId: "sec-1",
        totalCompletions: 3,
        p50: 2, // Median of [1, 2, 5]
        p95: 5, // 95th percentile
        mean: 2.67, // (1+2+5)/3
        distribution: { 1: 1, 2: 1, 5: 1 },
      });
    });

    it("returns null when no students have completed the section", () => {
      const mockData: StudentUnitCompletionData[] = [
        {
          studentId: "s1",
          completedSectionsInUnit: {},
        },
      ];

      const stats = calculateSectionStats(
        mockData,
        "lesson-1" as LessonId,
        "sec-1" as SectionId
      );

      expect(stats).toBeNull();
    });

    it("handles a single student completion", () => {
      const mockData: StudentUnitCompletionData[] = [
        {
          studentId: "s1",
          completedSectionsInUnit: {
            "lesson-1": {
              "sec-1": createCompletion(3),
            },
          },
        },
      ];

      const stats = calculateSectionStats(
        mockData,
        "lesson-1" as LessonId,
        "sec-1" as SectionId
      );

      expect(stats).toEqual({
        sectionId: "sec-1",
        totalCompletions: 1,
        p50: 3,
        p95: 3,
        mean: 3,
        distribution: { 3: 1 },
      });
    });

    it("calculates distribution correctly with duplicate values", () => {
      const mockData: StudentUnitCompletionData[] = [
        {
          studentId: "s1",
          completedSectionsInUnit: {
            "lesson-1": {
              "sec-1": createCompletion(2),
            },
          },
        },
        {
          studentId: "s2",
          completedSectionsInUnit: {
            "lesson-1": {
              "sec-1": createCompletion(2),
            },
          },
        },
        {
          studentId: "s3",
          completedSectionsInUnit: {
            "lesson-1": {
              "sec-1": createCompletion(2),
            },
          },
        },
        {
          studentId: "s4",
          completedSectionsInUnit: {
            "lesson-1": {
              "sec-1": createCompletion(5),
            },
          },
        },
      ];

      const stats = calculateSectionStats(
        mockData,
        "lesson-1" as LessonId,
        "sec-1" as SectionId
      );

      expect(stats?.distribution).toEqual({ 2: 3, 5: 1 });
      expect(stats?.p50).toBe(2);
    });

    it("handles students who haven't completed the specific section", () => {
      const mockData: StudentUnitCompletionData[] = [
        {
          studentId: "s1",
          completedSectionsInUnit: {
            "lesson-1": {
              "sec-1": createCompletion(1),
            },
          },
        },
        {
          studentId: "s2",
          completedSectionsInUnit: {
            "lesson-1": {
              "sec-2": createCompletion(3), // Different section
            },
          },
        },
        {
          studentId: "s3",
          completedSectionsInUnit: {
            "lesson-2": {
              // Different lesson
              "sec-1": createCompletion(4),
            },
          },
        },
      ];

      const stats = calculateSectionStats(
        mockData,
        "lesson-1" as LessonId,
        "sec-1" as SectionId
      );

      expect(stats?.totalCompletions).toBe(1); // Only s1 completed lesson-1/sec-1
    });

    it("calculates p95 correctly for large datasets", () => {
      // Create 100 students with varying attempts
      const mockData: StudentUnitCompletionData[] = Array.from(
        { length: 100 },
        (_, i) => ({
          studentId: `s${i}`,
          completedSectionsInUnit: {
            "lesson-1": {
              "sec-1": createCompletion(Math.floor(i / 10) + 1), // 1-10 attempts
            },
          },
        })
      );

      const stats = calculateSectionStats(
        mockData,
        "lesson-1" as LessonId,
        "sec-1" as SectionId
      );

      expect(stats?.totalCompletions).toBe(100);
      expect(stats?.p95).toBeGreaterThanOrEqual(9); // 95th percentile should be near the high end
      expect(stats?.p50).toBeGreaterThanOrEqual(5); // Median around middle
    });
  });

  describe("calculateLessonAggregateStats", () => {
    it("averages p50 and p95 across multiple sections", () => {
      const mockData: StudentUnitCompletionData[] = [
        {
          studentId: "s1",
          completedSectionsInUnit: {
            "lesson-1": {
              "sec-1": createCompletion(1),
              "sec-2": createCompletion(3),
            },
          },
        },
        {
          studentId: "s2",
          completedSectionsInUnit: {
            "lesson-1": {
              "sec-1": createCompletion(2),
              "sec-2": createCompletion(4),
            },
          },
        },
      ];

      const stats = calculateLessonAggregateStats(
        mockData,
        "lesson-1" as LessonId,
        ["sec-1" as SectionId, "sec-2" as SectionId]
      );

      // sec-1: [1,2] → p50=2, p95=2
      // sec-2: [3,4] → p50=4, p95=4
      // Average: p50=(2+4)/2=3, p95=(2+4)/2=3
      expect(stats).toEqual({
        p50: 3, // Average of section p50s, rounded
        p95: 3, // Average of section p95s, rounded
      });
    });

    it("returns null when no sections have completion data", () => {
      const mockData: StudentUnitCompletionData[] = [
        {
          studentId: "s1",
          completedSectionsInUnit: {},
        },
      ];

      const stats = calculateLessonAggregateStats(
        mockData,
        "lesson-1" as LessonId,
        ["sec-1" as SectionId, "sec-2" as SectionId]
      );

      expect(stats).toBeNull();
    });

    it("only includes sections with data in the average", () => {
      const mockData: StudentUnitCompletionData[] = [
        {
          studentId: "s1",
          completedSectionsInUnit: {
            "lesson-1": {
              "sec-1": createCompletion(2),
              // sec-2 not completed by anyone
            },
          },
        },
      ];

      const stats = calculateLessonAggregateStats(
        mockData,
        "lesson-1" as LessonId,
        ["sec-1" as SectionId, "sec-2" as SectionId]
      );

      // Should only use sec-1 data
      expect(stats).toEqual({
        p50: 2,
        p95: 2,
      });
    });

    it("handles empty section list", () => {
      const mockData: StudentUnitCompletionData[] = [
        {
          studentId: "s1",
          completedSectionsInUnit: {
            "lesson-1": {
              "sec-1": createCompletion(1),
            },
          },
        },
      ];

      const stats = calculateLessonAggregateStats(
        mockData,
        "lesson-1" as LessonId,
        []
      );

      expect(stats).toBeNull();
    });

    it("rounds averaged values correctly", () => {
      const mockData: StudentUnitCompletionData[] = [
        {
          studentId: "s1",
          completedSectionsInUnit: {
            "lesson-1": {
              "sec-1": createCompletion(1),
              "sec-2": createCompletion(2),
              "sec-3": createCompletion(3),
            },
          },
        },
      ];

      const stats = calculateLessonAggregateStats(
        mockData,
        "lesson-1" as LessonId,
        ["sec-1" as SectionId, "sec-2" as SectionId, "sec-3" as SectionId]
      );

      // Average of 1, 2, 3 = 2
      expect(stats).toEqual({
        p50: 2,
        p95: 2,
      });
    });
  });
});
