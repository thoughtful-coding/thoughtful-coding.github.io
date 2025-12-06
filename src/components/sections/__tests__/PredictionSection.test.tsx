import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { render } from "../../../test-utils";
import PredictionSection from "../PredictionSection";
import { useInteractiveTableLogic } from "../../../hooks/useInteractiveTableLogic";
import type {
  PredictionSectionData,
  UnitId,
  LessonId,
  SectionId,
  SavedPredictionState,
  CourseId,
} from "../../../types/data";

// Mock the custom hook that provides all the logic
vi.mock("../../../hooks/useInteractiveTableLogic");

// Create mock data for the section
const mockSectionData: PredictionSectionData = {
  kind: "Prediction",
  id: "pred-1" as SectionId,
  title: "Predict the Output",
  content: [{ kind: "text", value: "Analyze this function:" }],
  example: {
    initialCode: "def add(a, b):\n  return a + b",
  },
  predictionTable: {
    functionToTest: "add",
    columns: [
      { variableName: "a", type: "number" },
      { variableName: "b", type: "number" },
    ],
    rows: [
      { inputs: [2, 3], expectedOutput: "5" },
      { inputs: [10, 5], expectedOutput: "15" },
    ],
  },
};

// Default state for the mocked hook
const mockSavedState: SavedPredictionState = {
  predictions: {},
};

describe("PredictionSection", () => {
  const mockCourseId = "getting-started" as CourseId;
  const mockLessonPath = "00_intro/lessons/intro_prediction";
  const handleUserInputChangeMock = vi.fn();
  const runRowMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Set up a default mock return value for the hook
    vi.mocked(useInteractiveTableLogic).mockReturnValue({
      savedState: mockSavedState,
      isSectionComplete: false,
      runningStates: {},
      rowReadyStates: { 0: true, 1: true },
      isLoading: false,
      pyodideError: null,
      handleUserInputChange: handleUserInputChangeMock,
      runRow: runRowMock,
    });
  });

  it("should render the initial state correctly", () => {
    render(
      <PredictionSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
        courseId={mockCourseId}
        lessonPath={mockLessonPath}
      />
    );

    // Assert that the title, code, and table headers are rendered
    expect(
      screen.getByRole("heading", { name: /predict the output/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "a" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "b" })).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Your Prediction" })
    ).toBeInTheDocument();
    // Assert that the inputs are rendered
    expect(screen.getByRole("cell", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "3" })).toBeInTheDocument();

    // Assert that the progress text is correct for the initial state
    expect(screen.getByText("0 / 2 predictions correct")).toBeInTheDocument();
  });

  it("should call handleUserInputChange when a user types in a prediction", async () => {
    const user = userEvent.setup();
    render(
      <PredictionSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
        courseId={mockCourseId}
        lessonPath={mockLessonPath}
      />
    );

    const predictionInputs =
      screen.getAllByPlaceholderText("Predict the output");
    await user.type(predictionInputs[0], "5");

    // The first input corresponds to rowIndex 0
    expect(handleUserInputChangeMock).toHaveBeenCalledWith(0, "5");
  });

  it("should call runRow when a user clicks the 'Run' button", async () => {
    const user = userEvent.setup();
    render(
      <PredictionSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
        courseId={mockCourseId}
        lessonPath={mockLessonPath}
      />
    );

    const runButtons = screen.getAllByRole("button", { name: "Run" });
    await user.click(runButtons[1]); // Click the button for the second row

    // The second button corresponds to rowIndex 1
    expect(runRowMock).toHaveBeenCalledWith(1);
  });

  it("should display correct and incorrect row states based on hook data", () => {
    // ARRANGE: Mock a state where one row is correct and one is incorrect
    const newState: SavedPredictionState = {
      predictions: {
        0: { userAnswer: "5", actualOutput: "5", isCorrect: true },
        1: { userAnswer: "14", actualOutput: "15", isCorrect: false },
      },
    };
    vi.mocked(useInteractiveTableLogic).mockReturnValue({
      savedState: newState,
      isSectionComplete: false,
      runningStates: {},
      rowReadyStates: { 0: true, 1: true },
      isLoading: false,
      pyodideError: null,
      handleUserInputChange: handleUserInputChangeMock,
      runRow: runRowMock,
    });

    render(
      <PredictionSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
        courseId={mockCourseId}
        lessonPath={mockLessonPath}
      />
    );

    const rows = screen.getAllByRole("row"); // Includes header row

    // ASSERT
    // The first data row (index 1) should have the 'correctRow' class
    expect(rows[1]).toHaveClass("correctRow");
    // The second data row (index 2) should have the 'incorrectRow' class
    expect(rows[2]).toHaveClass("incorrectRow");

    // Assert that the progress text has updated
    expect(screen.getByText("1 / 2 predictions correct")).toBeInTheDocument();
  });

  // NEW TEST CASE
  it("should apply the 'complete' style to the progress bar when the section is complete", () => {
    // ARRANGE: Mock a state where all predictions are correct and the section is complete
    const completeState: SavedPredictionState = {
      predictions: {
        0: { userAnswer: "5", actualOutput: "5", isCorrect: true },
        1: { userAnswer: "15", actualOutput: "15", isCorrect: true },
      },
    };
    vi.mocked(useInteractiveTableLogic).mockReturnValue({
      savedState: completeState,
      isSectionComplete: true, // Tell the component it's complete
      runningStates: {},
      rowReadyStates: { 0: true, 1: true },
      isLoading: false,
      pyodideError: null,
      handleUserInputChange: vi.fn(),
      runRow: vi.fn(),
    });

    render(
      <PredictionSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
        courseId={mockCourseId}
        lessonPath={mockLessonPath}
      />
    );

    // ASSERT
    const progressBar = screen.getByText("2 / 2 predictions correct")
      .previousElementSibling?.firstChild;

    expect(progressBar).toHaveClass("progressFillComplete");
    expect(screen.getByText("2 / 2 predictions correct")).toBeInTheDocument();
  });
});
