import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { useSearchParams } from "react-router-dom";

import { render } from "../../../test-utils";
import ReviewByAssignmentView from "../ReviewByAssignmentView";
import * as apiService from "../../../lib/apiService";
import * as dataLoader from "../../../lib/dataLoader";
import { useAuthStore } from "../../../stores/authStore";
import type { Unit, Lesson, LessonId, UnitId } from "../../../types/data";
import type { AssignmentSubmission } from "../../../types/apiServiceTypes";

// Mock all external dependencies
vi.mock("../../../lib/apiService");
vi.mock("../../../lib/dataLoader");
vi.mock("../../../stores/authStore");
// Mock react-router-dom to have control over useSearchParams
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useSearchParams: vi.fn(), // We will provide the implementation in each test
  };
});
const mockedUseSearchParams = vi.mocked(useSearchParams);

// --- Mock Data ---
const mockUnits: Unit[] = [
  {
    id: "unit-1" as UnitId,
    title: "Unit 1: The Basics",
    lessons: [{ path: "01_intro/lesson_1.ts" }],
  },
];

const mockLesson: Lesson & { guid: LessonId } = {
  guid: "lesson-1" as LessonId,
  title: "Introduction to Python",
  sections: [
    {
      kind: "Reflection",
      id: "reflect-1",
      title: "First Reflection",
    },
  ],
};

const mockSubmissions: AssignmentSubmission<"Reflection">[] = [
  {
    studentId: "student-123",
    submissionDetails: [
      {
        versionId: "v1",
        userTopic: "My First Topic",
        userCode: "print('hello')",
        userExplanation: "It prints hello.",
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

describe("ReviewByAssignmentView", () => {
  const setSearchParamsMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated: true });
    vi.mocked(dataLoader.fetchLessonData).mockResolvedValue(mockLesson);
    vi.mocked(apiService.getSubmissionsForAssignment).mockResolvedValue({
      submissions: mockSubmissions,
    });
    // Default search params mock (no params)
    mockedUseSearchParams.mockReturnValue([
      new URLSearchParams(),
      setSearchParamsMock,
    ]);
  });

  it("renders the initial state and allows unit selection", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ReviewByAssignmentView units={mockUnits} permittedStudents={[]} />
    );

    // Initial state
    expect(
      screen.getByRole("heading", { name: /review by assignment/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/please select a unit to view available assignments/i)
    ).toBeInTheDocument();

    // Select a unit
    const unitSelect = screen.getByRole("combobox");
    await user.selectOptions(unitSelect, "unit-1");

    // Assert that setSearchParams was called
    expect(setSearchParamsMock).toHaveBeenCalledWith({ unit: "unit-1" });

    // FIX: Simulate the URL change by updating the mock and re-rendering
    mockedUseSearchParams.mockReturnValue([
      new URLSearchParams("unit=unit-1"),
      setSearchParamsMock,
    ]);
    rerender(
      <ReviewByAssignmentView units={mockUnits} permittedStudents={[]} />
    );

    // After selecting, it should load and display the assignment
    expect(
      await screen.findByText(/reflection: "first reflection"/i)
    ).toBeInTheDocument();
    expect(dataLoader.fetchLessonData).toHaveBeenCalledTimes(1);
  });

  it("fetches and displays submissions when an assignment is clicked", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ReviewByAssignmentView units={mockUnits} permittedStudents={[]} />
    );

    // 1. Select a unit to load assignments
    mockedUseSearchParams.mockReturnValue([
      new URLSearchParams("unit=unit-1"),
      setSearchParamsMock,
    ]);
    rerender(
      <ReviewByAssignmentView units={mockUnits} permittedStudents={[]} />
    );
    const assignmentItem = await screen.findByText(
      /reflection: "first reflection"/i
    );

    // 2. Click the assignment
    await user.click(assignmentItem);
    expect(setSearchParamsMock).toHaveBeenCalledWith({
      unit: "unit-1",
      lesson: "lesson-1",
      section: "reflect-1",
    });

    // 3. Simulate the URL change for the selected assignment
    mockedUseSearchParams.mockReturnValue([
      new URLSearchParams("unit=unit-1&lesson=lesson-1&section=reflect-1"),
      setSearchParamsMock,
    ]);
    rerender(
      <ReviewByAssignmentView units={mockUnits} permittedStudents={[]} />
    );

    // 4. Assert that submissions are fetched and displayed
    expect(
      await screen.findByText(/viewing submission 1 of 1/i)
    ).toBeInTheDocument();
    expect(apiService.getSubmissionsForAssignment).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/my first topic/i)).toBeInTheDocument();
  });

  it("shows a placeholder when a unit has no reviewable assignments", async () => {
    // ARRANGE: Mock dataLoader to return a lesson with no reflection/primm sections
    const lessonWithNoAssignments: Lesson & { guid: LessonId } = {
      ...mockLesson,
      sections: [{ kind: "Information", id: "info-1", title: "Info" }],
    };
    vi.mocked(dataLoader.fetchLessonData).mockResolvedValue(
      lessonWithNoAssignments
    );

    const { rerender } = render(
      <ReviewByAssignmentView units={mockUnits} permittedStudents={[]} />
    );

    // Simulate selecting the unit
    mockedUseSearchParams.mockReturnValue([
      new URLSearchParams("unit=unit-1"),
      setSearchParamsMock,
    ]);
    rerender(
      <ReviewByAssignmentView units={mockUnits} permittedStudents={[]} />
    );

    // Assert that the correct placeholder message is shown after loading
    expect(
      await screen.findByText(
        /no reviewable assignments \(reflections, primm, or testing\) found in this unit/i
      )
    ).toBeInTheDocument();
  });
});
