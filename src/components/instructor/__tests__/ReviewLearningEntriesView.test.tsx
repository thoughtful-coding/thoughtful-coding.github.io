import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { render } from "../../../test-utils";
import ReviewLearningEntriesView from "../ReviewLearningEntriesView";
import * as apiService from "../../../lib/apiService";
import * as dataLoader from "../../../lib/dataLoader";
import { useAuthStore } from "../../../stores/authStore";
import type { Unit, LessonId, UnitId } from "../../../types/data";
import type {
  InstructorStudentInfo,
  ReflectionVersionItem,
} from "../../../types/apiServiceTypes";

// Mock all external dependencies
vi.mock("../../../lib/apiService");
vi.mock("../../../lib/dataLoader");
vi.mock("../../../stores/authStore");
// Mock the child component to isolate this component's logic
vi.mock("../shared/RenderFinalLearningEntry", () => ({
  default: vi.fn(({ entry }) => (
    <div>Mocked Final Entry: {entry.userTopic}</div>
  )),
}));

// --- Mock Data ---
const mockUnits: Unit[] = [
  {
    id: "unit-1" as UnitId,
    title: "Unit 1",
    lessons: [{ path: "lesson1.ts", guid: "lesson-1" as LessonId }],
  },
];

const mockStudents: InstructorStudentInfo[] = [
  { studentId: "student-1", studentName: "Alice" },
  { studentId: "student-2", studentName: "Bob" },
];

const mockEntries: ReflectionVersionItem[] = [
  {
    versionId: "v2",
    lessonId: "lesson-1" as LessonId,
    sectionId: "sec-1",
    userTopic: "Second Entry",
    userCode: "code2",
    userExplanation: "explanation2",
    createdAt: "2024-01-02T12:00:00Z",
  },
  {
    versionId: "v1",
    lessonId: "lesson-1" as LessonId,
    sectionId: "sec-1",
    userTopic: "First Entry",
    userCode: "code1",
    userExplanation: "explanation1",
    createdAt: "2024-01-01T12:00:00Z",
  },
];

describe("ReviewLearningEntriesView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated: true });
    vi.mocked(
      apiService.getInstructorStudentFinalLearningEntries
    ).mockResolvedValue({ entries: mockEntries });
    vi.mocked(dataLoader.fetchLessonData).mockResolvedValue({
      guid: "lesson-1" as LessonId,
      title: "Mock Lesson Title",
      sections: [],
    });
  });

  it("renders initial state and fetches entries when a student is selected", async () => {
    const user = userEvent.setup();
    render(
      <ReviewLearningEntriesView
        units={mockUnits}
        permittedStudents={mockStudents}
      />
    );

    // 1. Initial State
    expect(
      screen.getByText(
        /please select a student to view their learning entries/i
      )
    ).toBeInTheDocument();

    // 2. Select a student
    const studentSelect = document.getElementById(
      "student-select-learning-entries"
    ) as HTMLSelectElement;
    await user.selectOptions(studentSelect, "student-1");

    // 3. Assert that the API was called
    await waitFor(() => {
      expect(
        apiService.getInstructorStudentFinalLearningEntries
      ).toHaveBeenCalledWith("student-1");
    });

    // 4. Assert that the entries are rendered (newest first)
    const listItems = await screen.findAllByRole("listitem");
    expect(listItems[0]).toHaveTextContent("Second Entry");
    expect(listItems[1]).toHaveTextContent("First Entry");

    // 5. Assert that the detail view for the first (newest) entry is rendered
    expect(
      screen.getByText("Mocked Final Entry: Second Entry")
    ).toBeInTheDocument();
  });

  it("navigates between entries with next and previous buttons", async () => {
    const user = userEvent.setup();
    render(
      <ReviewLearningEntriesView
        units={mockUnits}
        permittedStudents={mockStudents}
      />
    );

    // Select a student to load the data
    const studentSelect = document.getElementById(
      "student-select-learning-entries"
    ) as HTMLSelectElement;
    await user.selectOptions(studentSelect, "student-1");

    // Wait for the initial view to render
    expect(
      await screen.findByText("Mocked Final Entry: Second Entry")
    ).toBeInTheDocument();

    const nextButton = screen.getByRole("button", { name: /next entry/i });
    const prevButton = screen.getByRole("button", { name: /previous entry/i });

    // Initial state: Prev is disabled, Next is enabled
    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeEnabled();

    // Click Next
    await user.click(nextButton);
    expect(
      await screen.findByText("Mocked Final Entry: First Entry")
    ).toBeInTheDocument();

    // New state: Both buttons are enabled
    expect(prevButton).toBeEnabled();
    expect(nextButton).toBeDisabled(); // Because we are at the end

    // Click Prev
    await user.click(prevButton);
    expect(
      await screen.findByText("Mocked Final Entry: Second Entry")
    ).toBeInTheDocument();
  });

  it("displays a message when a student has no final entries", async () => {
    const user = userEvent.setup();
    // ARRANGE: Mock the API to return an empty array
    vi.mocked(
      apiService.getInstructorStudentFinalLearningEntries
    ).mockResolvedValue({ entries: [] });

    render(
      <ReviewLearningEntriesView
        units={mockUnits}
        permittedStudents={mockStudents}
      />
    );

    // Select a student
    const studentSelect = document.getElementById(
      "student-select-learning-entries"
    ) as HTMLSelectElement;
    await user.selectOptions(studentSelect, "student-1");

    // Assert that the placeholder message is shown
    expect(
      await screen.findByText(/no.*learning entries found for this student/i)
    ).toBeInTheDocument();
  });
});
