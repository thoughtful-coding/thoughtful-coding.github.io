import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { render } from "../../../test-utils";
import ReviewByStudentView from "../ReviewByStudentView";
import type { InstructorStudentInfo } from "../../../types/apiServiceTypes";
import type { Course, CourseId, Unit, UnitId } from "../../../types/data";
import * as apiService from "../../../lib/apiService";

// Mock apiService
vi.mock("../../../lib/apiService", () => ({
  getStudentDetailedProgress: vi.fn(),
  ApiError: class ApiError extends Error {
    data: { message: string };
    constructor(message: string) {
      super(message);
      this.data = { message };
    }
  },
}));

// Mock authStore
vi.mock("../../../stores/authStore", () => ({
  useAuthStore: () => ({ isAuthenticated: true }),
}));

const mockCourses: Course[] = [
  {
    id: "course-1" as CourseId,
    title: "Intro to Python",
    description: "Learn Python",
    image: "python.png",
    units: [],
  },
  {
    id: "course-2" as CourseId,
    title: "Advanced Python",
    description: "More Python",
    image: "python2.png",
    units: [],
  },
];

const mockUnits: Unit[] = [
  {
    id: "unit-1" as UnitId,
    title: "Unit 1",
    lessons: [],
    courseId: "course-1" as CourseId,
  },
];

const mockStudents: InstructorStudentInfo[] = [
  {
    studentId: "student-123",
    studentName: "Alice",
    studentEmail: "alice@example.com",
  },
  {
    studentId: "student-456",
    studentName: "Bob",
    studentEmail: "bob@example.com",
  },
];

describe("ReviewByStudentView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows placeholder until student is selected", () => {
    render(
      <ReviewByStudentView
        courses={mockCourses}
        units={mockUnits}
        permittedStudents={mockStudents}
      />
    );

    expect(
      screen.getByText(/select a student to view their progress/i)
    ).toBeInTheDocument();

    // Student dropdown (first) should be enabled, course dropdown (second) also enabled
    const selects = screen.getAllByRole("combobox");
    expect(selects[0]).not.toBeDisabled(); // Student dropdown
    expect(selects[1]).not.toBeDisabled(); // Course dropdown
  });

  it("shows student options in dropdown", () => {
    render(
      <ReviewByStudentView
        courses={mockCourses}
        units={mockUnits}
        permittedStudents={mockStudents}
      />
    );

    // Student dropdown is first, check it has options
    const selects = screen.getAllByRole("combobox");
    const studentSelect = selects[0];
    expect(studentSelect).toContainHTML("Alice");
    expect(studentSelect).toContainHTML("Bob");
  });

  it("shows 'All Courses' option in course dropdown", () => {
    render(
      <ReviewByStudentView
        courses={mockCourses}
        units={mockUnits}
        permittedStudents={mockStudents}
      />
    );

    const selects = screen.getAllByRole("combobox");
    const courseSelect = selects[1];
    expect(courseSelect).toContainHTML("All Courses");
    expect(courseSelect).toContainHTML("Intro to Python");
  });

  it("fetches student profile when student is selected", async () => {
    const mockProfile = {
      studentId: "student-123",
      studentName: "Alice",
      profile: [],
    };
    vi.mocked(apiService.getStudentDetailedProgress).mockResolvedValue(
      mockProfile
    );

    const user = userEvent.setup();
    render(
      <ReviewByStudentView
        courses={mockCourses}
        units={mockUnits}
        permittedStudents={mockStudents}
      />
    );

    // Select student (first dropdown)
    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[0], "student-123");

    await waitFor(() => {
      expect(apiService.getStudentDetailedProgress).toHaveBeenCalledWith(
        "student-123"
      );
    });
  });

  it("shows student email when student is selected", async () => {
    const mockProfile = {
      studentId: "student-123",
      studentName: "Alice",
      profile: [],
    };
    vi.mocked(apiService.getStudentDetailedProgress).mockResolvedValue(
      mockProfile
    );

    const user = userEvent.setup();
    render(
      <ReviewByStudentView
        courses={mockCourses}
        units={mockUnits}
        permittedStudents={mockStudents}
      />
    );

    // Select student (first dropdown)
    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[0], "student-123");

    // Should show email next to dropdowns
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });

  it("shows no profile message when student has no data", async () => {
    const mockProfile = {
      studentId: "student-123",
      studentName: "Alice",
      profile: [],
    };
    vi.mocked(apiService.getStudentDetailedProgress).mockResolvedValue(
      mockProfile
    );

    const user = userEvent.setup();
    render(
      <ReviewByStudentView
        courses={mockCourses}
        units={mockUnits}
        permittedStudents={mockStudents}
      />
    );

    // Select student (first dropdown)
    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[0], "student-123");

    await waitFor(() => {
      expect(
        screen.getByText(/no profile data available/i)
      ).toBeInTheDocument();
    });
  });
});
