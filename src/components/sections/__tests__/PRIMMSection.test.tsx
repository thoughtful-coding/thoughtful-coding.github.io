import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { render } from "../../../test-utils";
import PRIMMSection from "../PRIMMSection";
import { useEnhancedPRIMM } from "../../../hooks/useEnhancedPRIMM";
import { usePyodide } from "../../../contexts/PyodideContext";
import { useTurtleExecution } from "../../../hooks/useTurtleExecution";
import type {
  PRIMMSectionData,
  UnitId,
  LessonId,
  SectionId,
} from "../../../types/data";

// Mock the hooks that provide the component's logic and dependencies
vi.mock("../../../hooks/useEnhancedPRIMM");
vi.mock("../../../contexts/PyodideContext");
vi.mock("../../../hooks/useTurtleExecution");

const mockSectionData: PRIMMSectionData = {
  kind: "PRIMM",
  id: "primm-1" as SectionId,
  title: "PRIMM Challenge",
  content: [{ kind: "text", value: "Analyze the following code." }],
  example: {
    initialCode: "print('Hello, PRIMM!')",
    visualization: "text",
  },
  predictPrompt: "What will the output of this code be?",
  conclusion: "This concludes the PRIMM challenge.",
};

// A base state for the useEnhancedPRIMM hook mock
const mockPrimmState = {
  isPredictionLocked: false,
  userEnglishPrediction: "",
  actualPyodideOutput: "",
  userExplanationText: "",
  aiEvaluationResult: null,
};

describe("PRIMMSection", () => {
  // Mock functions for the actions returned by the useEnhancedPRIMM hook
  const mockActions = {
    setUserPrediction: vi.fn(),
    lockPrediction: vi.fn(),
    setActualOutput: vi.fn(),
    setUserExplanation: vi.fn(),
    submitForFeedback: vi.fn(),
  };
  const mockRunPythonCode = vi.fn();
  const mockRunTurtleCode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up default mock implementations for all the hooks
    vi.mocked(useEnhancedPRIMM).mockReturnValue({
      state: mockPrimmState,
      actions: mockActions,
      isSectionComplete: false,
      isLoadingAiFeedback: false,
      aiFeedbackError: null,
    });
    vi.mocked(usePyodide).mockReturnValue({
      runPythonCode: mockRunPythonCode,
      isLoading: false,
    });
    vi.mocked(useTurtleExecution).mockReturnValue({
      runTurtleCode: mockRunTurtleCode,
      isLoading: false,
    });
  });

  it("renders the initial 'Predict' step correctly", () => {
    render(
      <PRIMMSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );
    expect(
      screen.getByText("What will the output of this code be?")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/in your own words/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Run Code" })).toBeDisabled();
  });

  it("enables 'Run Code' button and calls setUserPrediction on input", () => {
    // To enable the button, the mock state needs to reflect the user's input
    vi.mocked(useEnhancedPRIMM).mockReturnValue({
      state: { ...mockPrimmState, userEnglishPrediction: "A prediction" },
      actions: mockActions,
      isSectionComplete: false,
      isLoadingAiFeedback: false,
      aiFeedbackError: null,
    });

    render(
      <PRIMMSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    const textarea = screen.getByPlaceholderText(/in your own words/i);
    fireEvent.change(textarea, {
      target: { value: "It will print a greeting." },
    });

    expect(mockActions.setUserPrediction).toHaveBeenCalledWith(
      "It will print a greeting."
    );
    expect(screen.getByRole("button", { name: "Run Code" })).toBeEnabled();
  });

  it("locks prediction, runs code, and shows output when 'Run Code' is clicked", async () => {
    const user = userEvent.setup();
    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: "Hello, PRIMM!",
      stderr: "",
      error: null,
    });
    vi.mocked(useEnhancedPRIMM).mockReturnValue({
      state: { ...mockPrimmState, userEnglishPrediction: "A prediction" },
      actions: mockActions,
      isSectionComplete: false,
      isLoadingAiFeedback: false,
      aiFeedbackError: null,
    });

    const { rerender } = render(
      <PRIMMSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    await user.click(screen.getByRole("button", { name: "Run Code" }));

    expect(mockActions.lockPrediction).toHaveBeenCalledTimes(1);
    expect(mockRunPythonCode).toHaveBeenCalledWith(
      mockSectionData.example.initialCode,
      undefined
    );
    await waitFor(() => {
      expect(mockActions.setActualOutput).toHaveBeenCalledWith("Hello, PRIMM!");
    });

    vi.mocked(useEnhancedPRIMM).mockReturnValue({
      state: {
        ...mockPrimmState,
        isPredictionLocked: true,
        actualPyodideOutput: "Hello, PRIMM!",
      },
      actions: mockActions,
      isSectionComplete: false,
      isLoadingAiFeedback: false,
      aiFeedbackError: null,
    });

    rerender(
      <PRIMMSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    expect(screen.getByText("Hello, PRIMM!")).toBeInTheDocument();
  });

  it("shows the explanation step and calls for feedback", async () => {
    const user = userEvent.setup();
    vi.mocked(useEnhancedPRIMM).mockReturnValue({
      state: {
        ...mockPrimmState,
        isPredictionLocked: true,
        actualPyodideOutput: "Hello, PRIMM!",
      },
      actions: mockActions,
      isSectionComplete: false,
      isLoadingAiFeedback: false,
      aiFeedbackError: null,
    });

    const { rerender } = render(
      <PRIMMSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    const explanationTextarea = screen.getByPlaceholderText(
      /explain the code's behavior/i
    );
    fireEvent.change(explanationTextarea, {
      target: { value: "My explanation." },
    });

    // FIX: Simulate the re-render after the user types their explanation
    vi.mocked(useEnhancedPRIMM).mockReturnValue({
      state: {
        ...mockPrimmState,
        isPredictionLocked: true,
        actualPyodideOutput: "Hello, PRIMM!",
        userExplanationText: "My explanation.", // The button is now enabled
      },
      actions: mockActions,
      isSectionComplete: false,
      isLoadingAiFeedback: false,
      aiFeedbackError: null,
    });

    rerender(
      <PRIMMSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    await user.click(screen.getByRole("button", { name: /get ai feedback/i }));

    expect(mockActions.submitForFeedback).toHaveBeenCalledWith(
      mockSectionData.example.initialCode
    );
  });

  it("displays the completion message when section is complete", () => {
    vi.mocked(useEnhancedPRIMM).mockReturnValue({
      state: { ...mockPrimmState, isPredictionLocked: true },
      actions: mockActions,
      isSectionComplete: true,
      isLoadingAiFeedback: false,
      aiFeedbackError: null,
    });

    render(
      <PRIMMSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    expect(
      screen.getByText(/this concludes the primm challenge./i)
    ).toBeInTheDocument();
  });
});
