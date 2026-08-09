import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { render } from "../../../test-utils";
import ClozeSection from "../ClozeSection";
import { useSectionProgress } from "../../../hooks/useSectionProgress";
import {
  useProgressActions,
  useIsPenaltyActive,
  useRemainingPenaltyTime,
} from "../../../stores/progressStore";
import type {
  ClozeSectionData,
  UnitId,
  LessonId,
  SectionId,
  CourseId,
} from "../../../types/data";

// Mock useSectionProgress with a *functional* stand-in: it holds the state in a
// real useState and recomputes `isComplete` from the component's own
// checkCompletion on every render. This faithfully reproduces the real hook's
// contract (state, setter, derived completion) — and is precisely the mechanism
// that made completion recompute on each keystroke, so it's what the
// "waits for Check" behavior must be verified against.
vi.mock("../../../hooks/useSectionProgress", () => ({
  useSectionProgress: vi.fn(),
}));

vi.mock("../../../stores/progressStore", () => ({
  useProgressActions: vi.fn(),
  useIsPenaltyActive: vi.fn(),
  useRemainingPenaltyTime: vi.fn(),
}));

const SUCCESS = "Great job!";
const INCORRECT = "Keep trying!";

// Single blank, answer "def", so the DOM is small and predictable.
const mockSection: ClozeSectionData = {
  kind: "Cloze",
  id: "cloze-1" as SectionId,
  title: "Fill in the Blank",
  content: [{ kind: "text", value: "Complete the sentence." }],
  body: "A Python function uses the [[def]] keyword.",
  feedback: { correct: SUCCESS, incorrect: INCORRECT },
};

const startPenaltyMock = vi.fn();
const incrementAttemptCounterMock = vi.fn();

const renderSection = () =>
  render(
    <ClozeSection
      section={mockSection}
      unitId={"unit-1" as UnitId}
      lessonId={"lesson-1" as LessonId}
      courseId={"getting-started" as CourseId}
      lessonPath={"00_intro/lessons/cloze"}
    />
  );

const INPUT_ID = "cloze-input-cloze-1-0";
const CHECK_ID = "cloze-check-cloze-1";

describe("ClozeSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Functional useSectionProgress: derives completion from checkCompletion(state).
    vi.mocked(useSectionProgress).mockImplementation(
      ((
        _unitId: unknown,
        _lessonId: unknown,
        _sectionId: unknown,
        _key: unknown,
        initialState: object,
        checkCompletion: (s: object) => boolean
      ) => {
        const [state, setState] = React.useState(initialState);
        return [state, setState, checkCompletion(state)];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any
    );

    vi.mocked(useProgressActions).mockReturnValue({
      startPenalty: startPenaltyMock,
      incrementAttemptCounter: incrementAttemptCounterMock,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    // No active penalty: simulates a fresh attempt (or one after the lock-out
    // has expired), so inputs stay enabled and the flow is easy to drive.
    vi.mocked(useIsPenaltyActive).mockReturnValue(false);
    vi.mocked(useRemainingPenaltyTime).mockReturnValue(0);
  });

  it("does not show success feedback until 'Check Answers' is clicked, even with a correct answer typed", async () => {
    const user = userEvent.setup();
    renderSection();

    await user.type(screen.getByTestId(INPUT_ID), "def");

    // Correct text is typed, but nothing has been checked yet.
    expect(screen.queryByText(SUCCESS)).toBeNull();

    await user.click(screen.getByTestId(CHECK_ID));

    expect(screen.getByText(SUCCESS)).toBeInTheDocument();
    expect(startPenaltyMock).not.toHaveBeenCalled();
  });

  it("does NOT auto-complete when a wrong answer is corrected without re-checking (regression)", async () => {
    const user = userEvent.setup();
    renderSection();
    const input = screen.getByTestId(INPUT_ID);

    // First attempt: wrong, then check.
    await user.type(input, "xyz");
    await user.click(screen.getByTestId(CHECK_ID));

    expect(screen.getByText(/0 \/ 1 correct/i)).toBeInTheDocument();
    expect(screen.queryByText(SUCCESS)).toBeNull();
    expect(startPenaltyMock).toHaveBeenCalledTimes(1);

    // Fix the answer but do NOT click Check again.
    await user.clear(input);
    await user.type(input, "def");

    // The bug: feedback jumped to "Correct" here. It must still wait for Check.
    expect(screen.queryByText(SUCCESS)).toBeNull();

    // Second check confirms completion.
    await user.click(screen.getByTestId(CHECK_ID));
    expect(screen.getByText(SUCCESS)).toBeInTheDocument();
  });

  it("colors the blank from the last checked answer, not live typing", async () => {
    const user = userEvent.setup();
    renderSection();
    const input = screen.getByTestId(INPUT_ID);

    // Before any check: neither feedback class is applied.
    expect(input).not.toHaveClass("clozeInputCorrect");
    expect(input).not.toHaveClass("clozeInputIncorrect");

    // Wrong check -> red.
    await user.type(input, "xyz");
    await user.click(screen.getByTestId(CHECK_ID));
    expect(input).toHaveClass("clozeInputIncorrect");

    // Correcting the text without re-checking keeps the last (red) result.
    await user.clear(input);
    await user.type(input, "def");
    expect(input).toHaveClass("clozeInputIncorrect");
    expect(input).not.toHaveClass("clozeInputCorrect");

    // Re-check -> green.
    await user.click(screen.getByTestId(CHECK_ID));
    expect(input).toHaveClass("clozeInputCorrect");
    expect(input).not.toHaveClass("clozeInputIncorrect");
  });

  it("does not penalize a check with every blank still empty", async () => {
    const user = userEvent.setup();
    renderSection();
    const check = screen.getByTestId(CHECK_ID);

    // Nothing typed: the button is unavailable and a forced click is inert.
    expect(check).toBeDisabled();
    await user.click(check);
    expect(startPenaltyMock).not.toHaveBeenCalled();
    expect(incrementAttemptCounterMock).not.toHaveBeenCalled();
    expect(screen.queryByText(/correct/i)).toBeNull();

    // Whitespace alone doesn't count as an answer either.
    await user.type(screen.getByTestId(INPUT_ID), "   ");
    expect(check).toBeDisabled();

    // A real attempt re-enables it, and a wrong one still penalizes.
    await user.type(screen.getByTestId(INPUT_ID), "xyz");
    expect(check).toBeEnabled();
    await user.click(check);
    expect(startPenaltyMock).toHaveBeenCalledTimes(1);
  });

  it("warns when a Cloze body has no blanks (uncompletable authoring guard)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <ClozeSection
        section={{ ...mockSection, body: "No blanks here." }}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
        courseId={"getting-started" as CourseId}
        lessonPath={"00_intro/lessons/cloze"}
      />
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("no [[blanks]]")
    );
    warn.mockRestore();
  });
});
