import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { useParams, useNavigate } from "react-router-dom";

import { render } from "../../../../test-utils";
import ReviewStudentDetailView from "../ReviewStudentDetailView";
import * as apiService from "../../../../lib/apiService";
import { useAuthStore } from "../../../../stores/authStore";
import type {
  StudentDetailedProgressResponse,
  ReflectionVersionItem,
} from "../../../../types/apiServiceTypes";

// Mock all external dependencies
vi.mock("../../../../lib/apiService");
vi.mock("../../../../stores/authStore");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});
// Mock child components with corrected paths
vi.mock("../RenderReflectionVersions", () => ({
  default: () => <div>Mocked Reflection Submission</div>,
}));
vi.mock("../RenderPrimmActivity", () => ({
  default: () => <div>Mocked PRIMM Submission</div>,
}));

const mockedUseParams = vi.mocked(useParams);
const mockedUseNavigate = vi.mocked(useNavigate);

// --- Mock Data ---
const mockStudentProfile: StudentDetailedProgressResponse = {
  studentId: "student-123",
  studentName: "Alice",
  profile: [
    {
      unitId: "unit-1",
      unitTitle: "Unit 1: Basics",
      lessons: [
        {
          lessonId: "lesson-1",
          lessonTitle: "Intro Lesson",
          sections: [
            {
              sectionId: "sec-1",
              sectionTitle: "First Section",
              sectionKind: "Information",
              status: "completed",
            },
            {
              sectionId: "sec-2",
              sectionTitle: "Reflection Section",
              sectionKind: "Reflection",
              status: "submitted",
              // FIX: Provide actual submission data
              submissionDetails: [
                {
                  versionId: "v1",
                  userTopic: "Test Topic",
                  userCode: "Test Code",
                  userExplanation: "Test Explanation",
                  createdAt: new Date().toISOString(),
                },
              ] as ReflectionVersionItem[],
            },
          ],
        },
      ],
    },
  ],
};

describe("ReviewStudentDetailView", () => {
  const navigateMock = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated: true });
    mockedUseParams.mockReturnValue({ studentId: "student-123" });
    mockedUseNavigate.mockReturnValue(navigateMock);
    vi.mocked(apiService.getStudentDetailedProgress).mockResolvedValue(
      mockStudentProfile
    );
  });

  it("fetches and displays student progress details", async () => {
    render(<ReviewStudentDetailView />);

    // Check for student name after loading
    expect(
      await screen.findByRole("heading", { name: "Alice" })
    ).toBeInTheDocument();

    // Check for unit, lesson, and section titles
    expect(screen.getByText("Unit 1: Basics")).toBeInTheDocument();
    expect(screen.getByText("Intro Lesson")).toBeInTheDocument();
    expect(screen.getByText("First Section")).toBeInTheDocument();

    // Check for status badges
    expect(screen.getByText("completed")).toBeInTheDocument();
    expect(screen.getByText("submitted")).toBeInTheDocument();

    // Check for the "View Submission" button for the submitted section
    expect(
      screen.getByRole("button", { name: "View Submission" })
    ).toBeInTheDocument();
  });

  it("opens and closes the submission modal", async () => {
    const user = userEvent.setup();
    render(<ReviewStudentDetailView />);

    // Wait for the main view to load
    const viewButton = await screen.findByRole("button", {
      name: "View Submission",
    });

    // Modal should not be visible initially
    expect(screen.queryByText("Mocked Reflection Submission")).toBeNull();

    // Click to open the modal
    await user.click(viewButton);
    expect(
      await screen.findByText("Mocked Reflection Submission")
    ).toBeInTheDocument();

    // Click the close button
    const closeButton = screen.getByRole("button", { name: "Close" });
    await user.click(closeButton);

    // Modal should now be gone
    expect(screen.queryByText("Mocked Reflection Submission")).toBeNull();
  });

  it("navigates back to the student list when the back button is clicked", async () => {
    const user = userEvent.setup();
    render(<ReviewStudentDetailView />);

    const backButton = await screen.findByRole("button", {
      name: /back to student list/i,
    });
    await user.click(backButton);

    expect(navigateMock).toHaveBeenCalledWith(
      "/python/instructor-dashboard/students"
    );
  });

  it("displays an error message if fetching fails", async () => {
    // ARRANGE: Mock the API to reject
    vi.mocked(apiService.getStudentDetailedProgress).mockRejectedValue(
      new Error("API Error")
    );
    render(<ReviewStudentDetailView />);

    // ASSERT: Check for the error message
    expect(
      await screen.findByText(
        "An unknown error occurred while fetching the student profile."
      )
    ).toBeInTheDocument();
  });
});
