import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { useSearchParams } from "react-router-dom";

import { render } from "../../../test-utils";
import ReviewClassProgressView from "../ReviewClassProgressView";
import * as apiService from "../../../lib/apiService";
import * as dataLoader from "../../../lib/dataLoader";
import { useAuthStore } from "../../../stores/authStore";
import type {
  Course,
  CourseId,
  Unit,
  Lesson,
  LessonId,
  UnitId,
} from "../../../types/data";
import type {
  InstructorStudentInfo,
  ClassUnitProgressResponse,
} from "../../../types/apiServiceTypes";

// Mock all external dependencies
vi.mock("../../../lib/apiService");
vi.mock("../../../lib/dataLoader");
vi.mock("../../../stores/authStore");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});
const mockedUseSearchParams = vi.mocked(useSearchParams);

// --- Mock Data ---
const mockCourses: Course[] = [
  {
    id: "course-1" as CourseId,
    title: "Intro to Python",
    description: "Learn Python",
    image: "python.png",
    units: [],
  },
];

const mockUnits: Unit[] = [
  {
    id: "unit-1" as UnitId,
    title: "Unit 1: The Basics",
    lessons: [{ path: "lesson1.ts" }, { path: "lesson2.ts" }],
    courseId: "course-1" as CourseId,
  },
];

const mockStudents: InstructorStudentInfo[] = [
  { studentId: "student-1", studentName: "Alice" },
];

const mockLessons: (Lesson & { guid: LessonId })[] = [
  {
    guid: "lesson-1" as LessonId,
    title: "First Lesson",
    sections: [
      { kind: "Information", id: "sec-1a" },
      { kind: "Reflection", id: "sec-1b" },
    ],
  },
  {
    guid: "lesson-2" as LessonId,
    title: "Second Lesson",
    sections: [{ kind: "Information", id: "sec-2a" }],
  },
];

const mockProgressResponse: ClassUnitProgressResponse = {
  unitId: "test-unit" as UnitId,
  studentProgressData: [
    {
      studentId: "student-1",
      completedSectionsInUnit: {
        "lesson-1": {
          "sec-1a": {
            completedAt: "2024-01-15T10:30:00Z",
            attemptsBeforeSuccess: 1,
          },
        }, // 1 of 2 sections complete
      },
    },
  ],
};

describe("ReviewClassProgressView", () => {
  const setSearchParamsMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated: true });
    mockedUseSearchParams.mockReturnValue([
      new URLSearchParams(),
      setSearchParamsMock,
    ]);
    // Mock dataLoader functions
    vi.mocked(dataLoader.fetchLessonData)
      .mockResolvedValueOnce(mockLessons[0])
      .mockResolvedValueOnce(mockLessons[1]);
    vi.mocked(dataLoader.getRequiredSectionsForLesson).mockImplementation(
      (lesson) => {
        // Return the sections for the matching lesson
        if (lesson.guid === mockLessons[0].guid) {
          return ["sec-1a", "sec-1b"]; // Lesson 1 has 2 required sections
        }
        if (lesson.guid === mockLessons[1].guid) {
          return ["sec-2a"]; // Lesson 2 has 1 required section
        }
        return [];
      }
    );
    vi.mocked(dataLoader.hasReviewableAssignments).mockReturnValue(false);
    // Mock apiService
    vi.mocked(apiService.getInstructorClassUnitProgress).mockResolvedValue(
      mockProgressResponse
    );
  });

  it("renders initial state and then fetches and displays class progress", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ReviewClassProgressView
        courses={mockCourses}
        units={mockUnits}
        permittedStudents={mockStudents}
        isLoadingUnitsGlobal={false}
        isLoadingStudentsGlobal={false}
        studentsErrorGlobal={null}
      />
    );

    // 1. Initial State
    expect(
      screen.getByText(/please select a unit to view progress/i)
    ).toBeInTheDocument();

    // 2. User selects a course first, then a unit
    const [courseSelect, unitSelect] = screen.getAllByRole("combobox");
    await user.selectOptions(courseSelect, "course-1");
    expect(setSearchParamsMock).toHaveBeenCalledWith({ course: "course-1" });

    // Simulate URL change after course selection
    mockedUseSearchParams.mockReturnValue([
      new URLSearchParams("course=course-1"),
      setSearchParamsMock,
    ]);
    rerender(
      <ReviewClassProgressView
        courses={mockCourses}
        units={mockUnits}
        permittedStudents={mockStudents}
        isLoadingUnitsGlobal={false}
        isLoadingStudentsGlobal={false}
        studentsErrorGlobal={null}
      />
    );

    // Now select the unit
    await user.selectOptions(unitSelect, "unit-1");
    expect(setSearchParamsMock).toHaveBeenCalledWith({
      course: "course-1",
      unit: "unit-1",
    });

    // 3. Simulate URL change and re-render
    mockedUseSearchParams.mockReturnValue([
      new URLSearchParams("course=course-1&unit=unit-1"),
      setSearchParamsMock,
    ]);
    rerender(
      <ReviewClassProgressView
        courses={mockCourses}
        units={mockUnits}
        permittedStudents={mockStudents}
        isLoadingUnitsGlobal={false}
        isLoadingStudentsGlobal={false}
        studentsErrorGlobal={null}
      />
    );

    // 4. Assert that the table renders with the correctly calculated data
    // Wait for the final state to appear after all async operations
    expect(
      await screen.findByRole("cell", { name: "Alice" })
    ).toBeInTheDocument();

    // Check for lesson headers (text should be present in headers)
    expect(screen.getByText("First Lesson")).toBeInTheDocument();
    expect(screen.getByText("Second Lesson")).toBeInTheDocument();

    // Assert on calculated percentages
    // Alice: Lesson 1 (1/2 = 50%), Lesson 2 (0/1 = 0%)
    expect(screen.getByRole("cell", { name: "50%" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "0%" })).toBeInTheDocument();

    // Overall: (1+0) / (2+1) = 33.3%
    expect(screen.getByRole("cell", { name: "33%" })).toBeInTheDocument();

    // Check student count is displayed
    expect(
      screen.getByText("Showing progress of 1 student")
    ).toBeInTheDocument();
  });

  it("shows a loading spinner while fetching data", async () => {
    // ARRANGE: Make the API promise never resolve
    vi.mocked(apiService.getInstructorClassUnitProgress).mockReturnValue(
      new Promise(() => {})
    );

    const { rerender } = render(
      <ReviewClassProgressView
        courses={mockCourses}
        units={mockUnits}
        permittedStudents={mockStudents}
        isLoadingUnitsGlobal={false}
        isLoadingStudentsGlobal={false}
        studentsErrorGlobal={null}
      />
    );

    // ACT: Simulate selecting course and unit via URL
    mockedUseSearchParams.mockReturnValue([
      new URLSearchParams("course=course-1&unit=unit-1"),
      setSearchParamsMock,
    ]);
    rerender(
      <ReviewClassProgressView
        courses={mockCourses}
        units={mockUnits}
        permittedStudents={mockStudents}
        isLoadingUnitsGlobal={false}
        isLoadingStudentsGlobal={false}
        studentsErrorGlobal={null}
      />
    );

    // ASSERT
    expect(
      await screen.findByText(/loading class progress for unit-1/i)
    ).toBeInTheDocument();
  });

  it("displays an error message if fetching progress fails", async () => {
    // ARRANGE: Make the API promise reject
    vi.mocked(apiService.getInstructorClassUnitProgress).mockRejectedValue(
      new Error("API Failure")
    );

    const { rerender } = render(
      <ReviewClassProgressView
        courses={mockCourses}
        units={mockUnits}
        permittedStudents={mockStudents}
        isLoadingUnitsGlobal={false}
        isLoadingStudentsGlobal={false}
        studentsErrorGlobal={null}
      />
    );

    // ACT: Simulate selecting course and unit via URL
    mockedUseSearchParams.mockReturnValue([
      new URLSearchParams("course=course-1&unit=unit-1"),
      setSearchParamsMock,
    ]);
    rerender(
      <ReviewClassProgressView
        courses={mockCourses}
        units={mockUnits}
        permittedStudents={mockStudents}
        isLoadingUnitsGlobal={false}
        isLoadingStudentsGlobal={false}
        studentsErrorGlobal={null}
      />
    );

    // ASSERT
    expect(await screen.findByText("Error: API Failure")).toBeInTheDocument();
  });
});
