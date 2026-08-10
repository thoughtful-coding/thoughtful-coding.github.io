import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { render } from "../../../test-utils";
import MultipleChoiceSection from "../MultipleChoiceSection";
import { useQuizLogic } from "../../../hooks/useQuizLogic";
import type {
  MultipleChoiceSectionData,
  UnitId,
  LessonId,
  SectionId,
} from "../../../types/data";

vi.mock("../../../hooks/useQuizLogic");

const mockSectionData: MultipleChoiceSectionData = {
  kind: "MultipleChoice",
  id: "test-mcq" as SectionId,
  title: "Test Question",
  content: [
    {
      kind: "text",
      value: "What is 2 + 2?",
    },
  ],
  options: [{ text: "3" }, { text: "4" }, { text: "5" }],
  correctAnswer: 1,
  feedback: { correct: "You got it!", incorrect: "Incorrect!" },
};

describe("MultipleChoiceSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls the handleOptionChange and handleSubmit actions from its hook on user interaction", async () => {
    const user = userEvent.setup();
    const handleOptionChangeMock = vi.fn();
    const handleSubmitMock = vi.fn();

    // ARRANGE: Mock the initial state where no option is selected.
    vi.mocked(useQuizLogic).mockReturnValue({
      selectedIndices: [],
      isSubmitted: false,
      isCorrect: null,
      isLocallyDisabled: false,
      remainingPenaltyTime: 0,
      isSectionComplete: false,
      handleOptionChange: handleOptionChangeMock,
      handleSubmit: handleSubmitMock,
      handleTryAgain: vi.fn(),
      canTryAgain: false,
      selectedOptionsSet: new Set(),
    });

    const { rerender } = render(
      <MultipleChoiceSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    // ACT 1: Simulate user clicking an option.
    const optionToSelect = screen.getByLabelText("4");
    await user.click(optionToSelect);

    // ASSERT 1: The component should have called the function to change the option.
    expect(handleOptionChangeMock).toHaveBeenCalledWith(1);

    // ARRANGE 2: Now, we simulate the state update that would happen in React.
    vi.mocked(useQuizLogic).mockReturnValue({
      selectedIndices: [1], // An option is now selected
      isSubmitted: false,
      isCorrect: null,
      isLocallyDisabled: false,
      remainingPenaltyTime: 0,
      isSectionComplete: false,
      handleOptionChange: handleOptionChangeMock,
      handleSubmit: handleSubmitMock,
      handleTryAgain: vi.fn(),
      canTryAgain: false,
      selectedOptionsSet: new Set([1]),
    });

    // Re-render the component with the new state from the hook.
    rerender(
      <MultipleChoiceSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    // ACT 2: Find and click the submit button, which is now enabled.
    const submitButton = screen.getByRole("button", { name: /submit answer/i });
    expect(submitButton).not.toBeDisabled(); // Verify it's enabled
    await user.click(submitButton);

    // ASSERT 2: The component should have now called the submit function.
    expect(handleSubmitMock).toHaveBeenCalledTimes(1);
  });

  it("displays feedback and disables the form when the hook reports the question is submitted and correct", () => {
    // ARRANGE
    vi.mocked(useQuizLogic).mockReturnValue({
      selectedIndices: [1],
      isSubmitted: true,
      isCorrect: true,
      isLocallyDisabled: true,
      remainingPenaltyTime: 0,
      isSectionComplete: true,
      handleOptionChange: vi.fn(),
      handleSubmit: vi.fn(),
      handleTryAgain: vi.fn(),
      canTryAgain: false,
      selectedOptionsSet: new Set([1]),
    });

    render(
      <MultipleChoiceSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    // ASSERT
    expect(screen.getByText("You got it!")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /submit answer/i })).toBeNull();
    expect(screen.getByLabelText("3")).toBeDisabled();
    expect(screen.getByLabelText("4")).toBeDisabled();
    expect(screen.getByLabelText("5")).toBeDisabled();
  });

  it("handles the incorrect answer and 'Try Again' button flow correctly", async () => {
    const user = userEvent.setup();
    const handleTryAgainMock = vi.fn();

    // ARRANGE 1: Mock the state for an incorrect answer with a penalty active
    vi.mocked(useQuizLogic).mockReturnValue({
      selectedIndices: [0],
      isSubmitted: true,
      isCorrect: false,
      isLocallyDisabled: true,
      remainingPenaltyTime: 15,
      isSectionComplete: false,
      handleOptionChange: vi.fn(),
      handleSubmit: vi.fn(),
      handleTryAgain: handleTryAgainMock,
      canTryAgain: false, // Cannot try again yet
      selectedOptionsSet: new Set([0]),
    });

    const { rerender } = render(
      <MultipleChoiceSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    // ASSERT 1: Check for the initial incorrect state
    expect(screen.getByText(/oops! time penalty active/i)).toBeInTheDocument();
    expect(screen.getByText("Incorrect!")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /try again/i })).toBeNull();

    // ARRANGE 2: Mock the state for after the penalty has expired
    vi.mocked(useQuizLogic).mockReturnValue({
      selectedIndices: [0],
      isSubmitted: true,
      isCorrect: false,
      isLocallyDisabled: false, // No longer disabled
      remainingPenaltyTime: 0,
      isSectionComplete: false,
      handleOptionChange: vi.fn(),
      handleSubmit: vi.fn(),
      handleTryAgain: handleTryAgainMock,
      canTryAgain: true, // Can now try again
      selectedOptionsSet: new Set([0]),
    });

    // ACT 2: Re-render to simulate the state update after the timer
    rerender(
      <MultipleChoiceSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    // ASSERT 2: The "Try Again" button should now be visible
    const tryAgainButton = screen.getByRole("button", { name: /try again/i });
    expect(tryAgainButton).toBeInTheDocument();

    // ACT 3: Click the "Try Again" button
    await user.click(tryAgainButton);

    // ASSERT 3: The handleTryAgain function from the hook should have been called
    expect(handleTryAgainMock).toHaveBeenCalledTimes(1);

    // ACT: Go back to beginning
    vi.mocked(useQuizLogic).mockReturnValue({
      selectedIndices: [],
      isSubmitted: false,
      isCorrect: null,
      isLocallyDisabled: false, // Form is now reenabled
      remainingPenaltyTime: 0,
      isSectionComplete: false,
      handleOptionChange: vi.fn(),
      handleSubmit: vi.fn(),
      handleTryAgain: handleTryAgainMock,
      canTryAgain: false,
      selectedOptionsSet: new Set(),
    });

    rerender(
      <MultipleChoiceSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    // ASSERT 4: All the labels and things are now enabled again
    expect(screen.getByLabelText("3")).not.toBeDisabled();
    expect(screen.getByLabelText("4")).not.toBeDisabled();
    expect(screen.getByLabelText("5")).not.toBeDisabled();
  });

  describe("per-option feedback", () => {
    const withFeedback = {
      ...mockSectionData,
      options: [
        { text: "3", feedback: "That is 2 + 1." },
        { text: "4" },
        { text: "5", feedback: "That is 2 + 3." },
      ],
    };

    const submitted = (selected: number[], correct: boolean) => {
      vi.mocked(useQuizLogic).mockReturnValue({
        selectedIndices: selected,
        isSubmitted: true,
        isCorrect: correct,
        isLocallyDisabled: false,
        remainingPenaltyTime: 0,
        isSectionComplete: correct,
        handleOptionChange: vi.fn(),
        handleSubmit: vi.fn(),
        handleTryAgain: vi.fn(),
        canTryAgain: false,
        selectedOptionsSet: new Set(selected),
      });
      return render(
        <MultipleChoiceSection
          section={withFeedback}
          unitId={"unit-1" as UnitId}
          lessonId={"lesson-1" as LessonId}
        />
      );
    };

    it("explains the distractor the learner actually chose", () => {
      submitted([2], false);
      const list = screen.getByTestId("quiz-option-feedback-test-mcq");
      expect(list).toHaveTextContent("You chose:");
      expect(list).toHaveTextContent("That is 2 + 3.");
      // Not the other distractor's explanation.
      expect(list).not.toHaveTextContent("That is 2 + 1.");
    });

    it("shows only feedback.correct on a right answer", () => {
      submitted([1], true);
      expect(screen.queryByTestId("quiz-option-feedback-test-mcq")).toBeNull();
      expect(screen.getByText("You got it!")).toBeInTheDocument();
    });

    it("falls back to feedback.incorrect when the option has none", () => {
      submitted([0], false);
      const list = screen.getByTestId("quiz-option-feedback-test-mcq");
      expect(list).toHaveTextContent("That is 2 + 1.");
      expect(screen.getByText("Incorrect!")).toBeInTheDocument();
    });

    it("never says 'You missed:' — there is only one answer to choose", () => {
      submitted([2], false);
      expect(
        screen.getByTestId("quiz-option-feedback-test-mcq")
      ).not.toHaveTextContent("You missed:");
    });

    it("warns about feedback on the correct option, which never renders", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      vi.mocked(useQuizLogic).mockReturnValue({
        selectedIndices: [],
        isSubmitted: false,
        isCorrect: null,
        isLocallyDisabled: false,
        remainingPenaltyTime: 0,
        isSectionComplete: false,
        handleOptionChange: vi.fn(),
        handleSubmit: vi.fn(),
        handleTryAgain: vi.fn(),
        canTryAgain: false,
        selectedOptionsSet: new Set(),
      });
      render(
        <MultipleChoiceSection
          section={{
            ...withFeedback,
            options: [
              { text: "3" },
              { text: "4", feedback: "never seen" },
              { text: "5" },
            ],
          }}
          unitId={"unit-1" as UnitId}
          lessonId={"lesson-1" as LessonId}
        />
      );
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining("never be shown")
      );
      warn.mockRestore();
    });
  });
});
