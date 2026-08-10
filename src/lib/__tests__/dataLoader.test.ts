import type { AnyLessonSectionData, Lesson, LessonId } from "../../types/data";

// --- Mock Data ---
const mockLesson1: Lesson = {
  guid: "lesson-1" as LessonId,
  title: "Lesson One Title",
  description: "The first lesson description",
  sections: [
    { kind: "Information", id: "sec-1a" },
    { kind: "Reflection", id: "sec-1b" },
  ],
};

// Import the functions we want to test
import {
  getRequiredSectionsForLesson,
  hasReviewableAssignments,
} from "../dataLoader";

describe("dataLoader - Pure Logic Functions", () => {
  describe("getRequiredSectionsForLesson", () => {
    it("should return a list of IDs for all sections except 'Information'", () => {
      const requiredSections = getRequiredSectionsForLesson(mockLesson1);
      // "sec-1a" (Information) should be excluded, "sec-1b" (Reflection) should be included
      expect(requiredSections).toEqual(["sec-1b"]);
    });

    it("should return empty array for lesson with no sections", () => {
      const lessonWithoutSections: Lesson = {
        guid: "lesson-empty" as LessonId,
        title: "Empty Lesson",
        sections: [],
      };
      const result = getRequiredSectionsForLesson(lessonWithoutSections);
      expect(result).toEqual([]);
    });

    it("should return empty array for null lesson", () => {
      const result = getRequiredSectionsForLesson(null as any);
      expect(result).toEqual([]);
    });

    it("should filter out Information sections and keep required ones", () => {
      const lessonWithMixed: Lesson = {
        guid: "lesson-mixed" as LessonId,
        title: "Mixed Lesson",
        sections: [
          { kind: "Information", id: "info-1" },
          { kind: "Testing", id: "test-1" },
          { kind: "Information", id: "info-2" },
          { kind: "Prediction", id: "pred-1" },
          { kind: "PRIMM", id: "primm-1" },
        ],
      };
      const result = getRequiredSectionsForLesson(lessonWithMixed);
      expect(result).toEqual(["test-1", "pred-1", "primm-1"]);
    });

    it("requires every graded section kind", () => {
      // Listing the kinds by hand is the point: adding one to SectionKind should
      // fail here until someone decides whether it counts toward completion.
      // Parsons and Refactor were silently absent, so lessons built on them
      // reported progress that ignored the only work in them.
      const ALL_KINDS: AnyLessonSectionData["kind"][] = [
        "Information",
        "MultipleChoice",
        "MultipleSelection",
        "Matching",
        "Parsons",
        "FillIn",
        "Reflection",
        "NonCodingReflection",
        "Observation",
        "Coverage",
        "Prediction",
        "PRIMM",
        "Testing",
        "Debugger",
        "Refactor",
      ];
      // Information is the only kind that asks nothing of the learner.
      const UNGRADED: AnyLessonSectionData["kind"][] = ["Information"];

      const lesson: Lesson = {
        guid: "lesson-all" as LessonId,
        title: "All Kinds",
        sections: ALL_KINDS.map((kind) => ({
          kind,
          id: `${kind}-1`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        })) as any,
      };

      const result = getRequiredSectionsForLesson(lesson);
      const expected = ALL_KINDS.filter((k) => !UNGRADED.includes(k));

      expect(result).toEqual(expected.map((k) => `${k}-1`));
      expect(result).not.toContain("Information-1");
    });
  });

  describe("hasReviewableAssignments", () => {
    it("should return true if a lesson contains a Reflection section", () => {
      const result = hasReviewableAssignments(mockLesson1);
      expect(result).toBe(true);
    });

    it("should return false if a lesson has no reviewable sections", () => {
      const lessonWithoutReviewables: Lesson = {
        guid: "lesson-2" as LessonId,
        title: "No Assignments Here",
        sections: [{ kind: "Information", id: "info-1" }],
      };
      const result = hasReviewableAssignments(lessonWithoutReviewables);
      expect(result).toBe(false);
    });

    it("should return true for lesson with PRIMM section", () => {
      const lessonWithPrimm: Lesson = {
        guid: "lesson-primm" as LessonId,
        title: "PRIMM Lesson",
        sections: [
          { kind: "Information", id: "info-1" },
          { kind: "PRIMM", id: "primm-1" },
        ],
      };
      const result = hasReviewableAssignments(lessonWithPrimm);
      expect(result).toBe(true);
    });

    it("should return true for lesson with both Reflection and PRIMM", () => {
      const lessonWithBoth: Lesson = {
        guid: "lesson-both" as LessonId,
        title: "Both Types",
        sections: [
          { kind: "Reflection", id: "refl-1" },
          { kind: "PRIMM", id: "primm-1" },
        ],
      };
      const result = hasReviewableAssignments(lessonWithBoth);
      expect(result).toBe(true);
    });

    it("should return false for null lesson", () => {
      const result = hasReviewableAssignments(null as any);
      expect(result).toBe(false);
    });

    it("should return false for lesson without sections array", () => {
      const lessonWithoutSections = {
        guid: "lesson-no-sections" as LessonId,
        title: "No Sections",
      } as any;
      const result = hasReviewableAssignments(lessonWithoutSections);
      expect(result).toBe(false);
    });

    it("should return false for lesson with empty sections", () => {
      const lessonEmpty: Lesson = {
        guid: "lesson-empty" as LessonId,
        title: "Empty",
        sections: [],
      };
      const result = hasReviewableAssignments(lessonEmpty);
      expect(result).toBe(false);
    });
  });
});
