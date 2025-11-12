import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { render } from "../../../test-utils";
import MultipleSelectionSection from "../MultipleSelectionSection";
import { useQuizLogic } from "../../../hooks/useQuizLogic";
import type {
  MultipleSelectionSectionData,
  UnitId,
  LessonId,
  SectionId,
} from "../../../types/data";

// Mock the useQuizLogic hook to control its return values in our tests
vi.mock("../../../hooks/useQuizLogic");

// Mock data specific to a MultipleSelection section
const mockSectionData: MultipleSelectionSectionData = {
  kind: "MultipleSelection",
  id: "test-msq" as SectionId,
  title: "Test Multi-Select Question",
  content: [
    {
      kind: "text",
      value: "Select all prime numbers.",
    },
  ],
  options: ["2", "4", "5", "6"],
  correctAnswers: [0, 2], // Correct answers are 2 and 5
  feedback: { correct: "Correct!", incorrect: "Not quite." },
};

describe("MultipleSelectionSection", () => {
  beforeEach(() => {
    // Reset mocks before each test to ensure they are isolated
    vi.clearAllMocks();
  });

  it("calls handleOptionChange and handleSubmit from its hook on user interaction", async () => {
    const user = userEvent.setup();
    const handleOptionChangeMock = vi.fn();
    const handleSubmitMock = vi.fn();

    // ARRANGE 1: Mock the initial state from the hook
    vi.mocked(useQuizLogic).mockReturnValue({
      isSubmitted: false,
      isCorrect: null,
      isLocallyDisabled: false,
      remainingPenaltyTime: 0,
      handleOptionChange: handleOptionChangeMock,
      handleSubmit: handleSubmitMock,
      handleTryAgain: vi.fn(),
      canTryAgain: false,
      selectedOptionsSet: new Set(),
    });

    const { rerender } = render(
      <MultipleSelectionSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    // ACT 1: Simulate user selecting multiple options
    await user.click(screen.getByLabelText("2"));
    await user.click(screen.getByLabelText("5"));

    // ASSERT 1: The change handler should have been called for each selection
    expect(handleOptionChangeMock).toHaveBeenCalledWith(0);
    expect(handleOptionChangeMock).toHaveBeenCalledWith(2);

    // ARRANGE 2: Simulate the state update after selections
    vi.mocked(useQuizLogic).mockReturnValue({
      isSubmitted: false,
      isCorrect: null,
      isLocallyDisabled: false,
      remainingPenaltyTime: 0,
      handleOptionChange: handleOptionChangeMock,
      handleSubmit: handleSubmitMock,
      handleTryAgain: vi.fn(),
      canTryAgain: false,
      selectedOptionsSet: new Set([0, 2]), // Reflect the new selections
    });

    rerender(
      <MultipleSelectionSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    // ACT 2: Click the submit button
    const submitButton = screen.getByRole("button", { name: /submit answer/i });
    expect(submitButton).not.toBeDisabled();
    await user.click(submitButton);

    // ASSERT 2: The submit handler should have been called
    expect(handleSubmitMock).toHaveBeenCalledTimes(1);
  });

  it("displays correct feedback and disables the form on correct submission", () => {
    // ARRANGE: Mock a correct, submitted state
    vi.mocked(useQuizLogic).mockReturnValue({
      isSubmitted: true,
      isCorrect: true,
      isLocallyDisabled: true,
      remainingPenaltyTime: 0,
      handleOptionChange: vi.fn(),
      handleSubmit: vi.fn(),
      handleTryAgain: vi.fn(),
      canTryAgain: false,
      selectedOptionsSet: new Set([0, 2]),
    });

    render(
      <MultipleSelectionSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    // ASSERT
    expect(screen.getByText("Correct!")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /submit answer/i })).toBeNull();
    expect(screen.getByLabelText("2")).toBeDisabled();
    expect(screen.getByLabelText("4")).toBeDisabled();
    expect(screen.getByLabelText("5")).toBeDisabled();
  });

  it("handles the incorrect answer and 'Try Again' flow", async () => {
    const user = userEvent.setup();
    const handleTryAgainMock = vi.fn();

    // ARRANGE 1: Mock an incorrect submission with a penalty active
    vi.mocked(useQuizLogic).mockReturnValue({
      isSubmitted: true,
      isCorrect: false,
      isLocallyDisabled: true,
      remainingPenaltyTime: 10,
      handleOptionChange: vi.fn(),
      handleSubmit: vi.fn(),
      handleTryAgain: handleTryAgainMock,
      canTryAgain: false,
      selectedOptionsSet: new Set([0, 1]), // Incorrect selection
    });

    const { rerender } = render(
      <MultipleSelectionSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    // ASSERT 1
    expect(screen.getByText(/oops! time penalty active/i)).toBeInTheDocument();
    expect(screen.getByText("Not quite.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /try again/i })).toBeNull();

    // ARRANGE 2: Mock the state after the penalty has expired
    vi.mocked(useQuizLogic).mockReturnValue({
      isSubmitted: true,
      isCorrect: false,
      isLocallyDisabled: false,
      remainingPenaltyTime: 0,
      handleOptionChange: vi.fn(),
      handleSubmit: vi.fn(),
      handleTryAgain: handleTryAgainMock,
      canTryAgain: true, // "Try Again" is now possible
      selectedOptionsSet: new Set([0, 1]),
    });

    rerender(
      <MultipleSelectionSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    // ACT 2: Click the "Try Again" button
    const tryAgainButton = screen.getByRole("button", { name: /try again/i });
    await user.click(tryAgainButton);

    // ASSERT 2
    expect(handleTryAgainMock).toHaveBeenCalledTimes(1);
  });
});
