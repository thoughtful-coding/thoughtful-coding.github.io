import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { render } from "../../../test-utils";
import FillInSection from "../FillInSection";
import { useSectionProgress } from "../../../hooks/useSectionProgress";
import {
  useProgressActions,
  useIsPenaltyActive,
  useRemainingPenaltyTime,
} from "../../../stores/progressStore";
import type {
  FillInSectionData,
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

// One text blank, answer "def", so the DOM is small and predictable.
const textSection: FillInSectionData = {
  kind: "FillIn",
  id: "fill-1" as SectionId,
  title: "Fill in the Blank",
  content: [{ kind: "text", value: "Complete the sentence." }],
  body: "A Python function uses the {{kw}} keyword.",
  blanks: {
    kw: {
      match: "text",
      answers: ["def"],
      caseSensitive: false,
      hintMode: "coloring",
    },
  },
  feedback: { correct: SUCCESS, incorrect: INCORRECT },
};

// One numeric blank: 9.09 within 0.1, shown in "patients".
const numericSection: FillInSectionData = {
  kind: "FillIn",
  id: "fill-2" as SectionId,
  title: "Computed Value",
  content: [{ kind: "text", value: "Compute the value." }],
  body: "The NNT is {{nnt}}.",
  blanks: {
    nnt: {
      match: "numeric",
      answer: 9.09,
      tolerance: 0.1,
      unit: "patients",
      hintMode: "highLow",
    },
  },
  feedback: { correct: SUCCESS, incorrect: INCORRECT },
};

const startPenaltyMock = vi.fn();
const incrementAttemptCounterMock = vi.fn();

const renderSection = (section: FillInSectionData) =>
  render(
    <FillInSection
      section={section}
      unitId={"unit-1" as UnitId}
      lessonId={"lesson-1" as LessonId}
      courseId={"getting-started" as CourseId}
      lessonPath={"00_intro/lessons/fill-in"}
    />
  );

const input = (sectionId: string, position = 0) =>
  screen.getByTestId(`fill-in-input-${sectionId}-${position}`);
const checkButton = (sectionId: string) =>
  screen.getByTestId(`fill-in-check-${sectionId}`);

describe("FillInSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Functional useSectionProgress: derives completion from checkCompletion(state).
    vi.mocked(useSectionProgress).mockImplementation(((
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
    }) as any);

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

  describe("text blanks", () => {
    it("does not show success feedback until 'Check Answers' is clicked", async () => {
      const user = userEvent.setup();
      renderSection(textSection);

      await user.type(input("fill-1"), "def");
      expect(screen.queryByText(SUCCESS)).toBeNull();

      await user.click(checkButton("fill-1"));
      expect(screen.getByText(SUCCESS)).toBeInTheDocument();
      expect(startPenaltyMock).not.toHaveBeenCalled();
    });

    it("does NOT auto-complete when a wrong answer is corrected without re-checking (regression)", async () => {
      const user = userEvent.setup();
      renderSection(textSection);

      await user.type(input("fill-1"), "xyz");
      await user.click(checkButton("fill-1"));
      expect(screen.getByText(/0 \/ 1 correct/i)).toBeInTheDocument();
      expect(startPenaltyMock).toHaveBeenCalledTimes(1);

      // Fix the answer but do NOT click Check again.
      await user.clear(input("fill-1"));
      await user.type(input("fill-1"), "def");
      expect(screen.queryByText(SUCCESS)).toBeNull();

      await user.click(checkButton("fill-1"));
      expect(screen.getByText(SUCCESS)).toBeInTheDocument();
    });

    it("colors the blank from the last checked answer, not live typing", async () => {
      const user = userEvent.setup();
      renderSection(textSection);

      expect(input("fill-1")).not.toHaveClass("fillInInputCorrect");
      expect(input("fill-1")).not.toHaveClass("fillInInputIncorrect");

      await user.type(input("fill-1"), "xyz");
      await user.click(checkButton("fill-1"));
      expect(input("fill-1")).toHaveClass("fillInInputIncorrect");

      // Correcting the text without re-checking keeps the last (red) result.
      await user.clear(input("fill-1"));
      await user.type(input("fill-1"), "def");
      expect(input("fill-1")).toHaveClass("fillInInputIncorrect");

      await user.click(checkButton("fill-1"));
      expect(input("fill-1")).toHaveClass("fillInInputCorrect");
    });

    it("shows per-letter hints for a wrong text guess, and honours hintMode none", async () => {
      const user = userEvent.setup();
      const { unmount } = renderSection(textSection);

      await user.type(input("fill-1"), "dex");
      await user.click(checkButton("fill-1"));
      expect(
        screen.getByTestId("fill-in-input-fill-1-hint-0")
      ).toBeInTheDocument();
      unmount();

      renderSection({
        ...textSection,
        blanks: {
          kw: {
            match: "text",
            answers: ["def"],
            caseSensitive: false,
            hintMode: "none",
          },
        },
      });
      await user.type(input("fill-1"), "dex");
      await user.click(checkButton("fill-1"));
      expect(screen.queryByTestId("fill-in-input-fill-1-hint-0")).toBeNull();
    });
  });

  describe("numeric blanks", () => {
    it("grades within the tolerance rather than by equality", async () => {
      const user = userEvent.setup();
      renderSection(numericSection);

      await user.type(input("fill-2"), "9.1");
      await user.click(checkButton("fill-2"));
      expect(screen.getByText(SUCCESS)).toBeInTheDocument();
    });

    it("says too high or too low without leaking the value", async () => {
      const user = userEvent.setup();
      const { unmount } = renderSection(numericSection);

      await user.type(input("fill-2"), "12");
      await user.click(checkButton("fill-2"));
      const hint = screen.getByTestId("fill-in-input-fill-2-hint-0");
      expect(hint).toHaveTextContent("too high");
      // The direction is the whole hint — it must not carry the target value.
      expect(hint.textContent).not.toMatch(/9\.09/);
      unmount();

      renderSection(numericSection);
      await user.type(input("fill-2"), "2");
      await user.click(checkButton("fill-2"));
      expect(
        screen.getByTestId("fill-in-input-fill-2-hint-0")
      ).toHaveTextContent("too low");
    });

    it("treats an unreadable number as a typo: no penalty, no attempt spent", async () => {
      const user = userEvent.setup();
      renderSection(numericSection);

      await user.type(input("fill-2"), "9,09");
      await user.click(checkButton("fill-2"));

      expect(
        screen.getByTestId("fill-in-input-fill-2-unparseable-0")
      ).toHaveTextContent("enter a number");
      expect(startPenaltyMock).not.toHaveBeenCalled();
      expect(incrementAttemptCounterMock).not.toHaveBeenCalled();

      // A genuinely wrong number still costs an attempt.
      await user.clear(input("fill-2"));
      await user.type(input("fill-2"), "12");
      await user.click(checkButton("fill-2"));
      expect(startPenaltyMock).toHaveBeenCalledTimes(1);
      expect(incrementAttemptCounterMock).toHaveBeenCalledTimes(1);
    });

    it("penalises a wrong blank even when another holds an unreadable number", async () => {
      const user = userEvent.setup();
      renderSection({
        ...numericSection,
        body: "NNT is {{nnt}} and ARR is {{arr}}.",
        blanks: {
          nnt: {
            match: "numeric",
            answer: 9.09,
            tolerance: 0.1,
            hintMode: "highLow",
          },
          arr: {
            match: "numeric",
            answer: 11,
            tolerance: 0.5,
            hintMode: "highLow",
          },
        },
      });

      // First blank unreadable (a typo), second genuinely wrong.
      await user.type(input("fill-2", 0), "9,09");
      await user.type(input("fill-2", 1), "50");
      await user.click(checkButton("fill-2"));

      expect(
        screen.getByTestId("fill-in-input-fill-2-unparseable-0")
      ).toHaveTextContent("enter a number");
      expect(startPenaltyMock).toHaveBeenCalledTimes(1);
      expect(incrementAttemptCounterMock).toHaveBeenCalledTimes(1);
    });

    it("renders the unit as static text the learner never types", async () => {
      const user = userEvent.setup();
      renderSection(numericSection);

      expect(screen.getByText("patients")).toBeInTheDocument();
      expect(input("fill-2")).toHaveValue("");

      // Typing just the number is accepted; the unit is not part of the answer.
      await user.type(input("fill-2"), "9.09");
      await user.click(checkButton("fill-2"));
      expect(screen.getByText(SUCCESS)).toBeInTheDocument();
    });

    it("shows the decimal-separator help only when a numeric blank exists", () => {
      const { unmount } = renderSection(numericSection);
      expect(screen.getByText(/decimal separator/i)).toBeInTheDocument();
      unmount();

      renderSection(textSection);
      expect(screen.queryByText(/decimal separator/i)).toBeNull();
    });
  });

  describe("mixed blanks", () => {
    const mixed: FillInSectionData = {
      kind: "FillIn",
      id: "fill-3" as SectionId,
      title: "Mixed",
      content: [{ kind: "text", value: "Both kinds at once." }],
      body: "Indexing starts at {{start}} so a {{len}}-item list ends at {{last}}.",
      blanks: {
        start: {
          match: "numeric",
          answer: 0,
          tolerance: 0,
          hintMode: "highLow",
        },
        len: {
          match: "text",
          answers: ["ten"],
          caseSensitive: false,
          hintMode: "coloring",
        },
        last: {
          match: "numeric",
          answer: 9,
          tolerance: 0,
          hintMode: "highLow",
        },
      },
      feedback: { correct: SUCCESS, incorrect: INCORRECT },
    };

    it("grades each blank with its own matcher and counts partial progress", async () => {
      const user = userEvent.setup();
      renderSection(mixed);

      await user.type(input("fill-3", 0), "0");
      await user.type(input("fill-3", 1), "TEN"); // text match is case-insensitive
      await user.type(input("fill-3", 2), "8"); // wrong, and low
      await user.click(checkButton("fill-3"));

      expect(screen.getByText(/2 \/ 3 correct/i)).toBeInTheDocument();
      expect(
        screen.getByTestId("fill-in-input-fill-3-hint-2")
      ).toHaveTextContent("too low");

      await user.clear(input("fill-3", 2));
      await user.type(input("fill-3", 2), "9");
      await user.click(checkButton("fill-3"));
      expect(screen.getByText(SUCCESS)).toBeInTheDocument();
    });
  });

  describe("unanswered blanks", () => {
    const twoBlanks: FillInSectionData = {
      ...textSection,
      body: "The {{kw}} keyword defines a {{fn}}.",
      blanks: {
        kw: {
          match: "text",
          answers: ["def"],
          caseSensitive: false,
          hintMode: "coloring",
        },
        fn: {
          match: "text",
          answers: ["function"],
          caseSensitive: false,
          hintMode: "coloring",
        },
      },
    };

    it("says so, rather than leaving the blank silently unmarked", async () => {
      const user = userEvent.setup();
      renderSection(twoBlanks);

      await user.type(input("fill-1", 0), "def");
      await user.click(checkButton("fill-1"));

      expect(
        screen.getByTestId("fill-in-input-fill-1-unanswered-1")
      ).toHaveTextContent("no answer");
      expect(screen.getByText(/1 \/ 2 correct/i)).toBeInTheDocument();
    });

    it("treats a never-touched blank and a cleared one identically", async () => {
      const user = userEvent.setup();
      renderSection(twoBlanks);

      // Touch the second blank and clear it again; the first is never touched.
      await user.type(input("fill-1", 0), "def");
      await user.type(input("fill-1", 1), "x");
      await user.clear(input("fill-1", 1));
      await user.click(checkButton("fill-1"));

      const cleared = screen.getByTestId("fill-in-input-fill-1-unanswered-1");
      expect(cleared).toHaveTextContent("no answer");

      // And the same on a fresh render where it was never touched at all.
      await user.clear(input("fill-1", 0));
      await user.type(input("fill-1", 0), "def");
      await user.click(checkButton("fill-1"));
      expect(
        screen.getByTestId("fill-in-input-fill-1-unanswered-1")
      ).toHaveTextContent("no answer");
    });
  });

  describe("guards", () => {
    it("does not penalize a check with every blank still empty", async () => {
      const user = userEvent.setup();
      renderSection(textSection);

      expect(checkButton("fill-1")).toBeDisabled();
      await user.click(checkButton("fill-1"));
      expect(startPenaltyMock).not.toHaveBeenCalled();
      expect(incrementAttemptCounterMock).not.toHaveBeenCalled();
      expect(screen.queryByText(/correct/i)).toBeNull();

      // Whitespace alone doesn't count as an answer either.
      await user.type(input("fill-1"), "   ");
      expect(checkButton("fill-1")).toBeDisabled();

      await user.type(input("fill-1"), "xyz");
      expect(checkButton("fill-1")).toBeEnabled();
      await user.click(checkButton("fill-1"));
      expect(startPenaltyMock).toHaveBeenCalledTimes(1);
    });

    it("cannot be re-checked once complete, so a finished section stays finished", async () => {
      const user = userEvent.setup();
      renderSection(textSection);

      await user.type(input("fill-1"), "def");
      await user.click(checkButton("fill-1"));
      expect(screen.getByText(SUCCESS)).toBeInTheDocument();

      // Input and button are both locked; clearing the box cannot un-complete it.
      expect(input("fill-1")).toBeDisabled();
      expect(checkButton("fill-1")).toBeDisabled();
      await user.click(checkButton("fill-1"));
      expect(screen.getByText(SUCCESS)).toBeInTheDocument();
      expect(startPenaltyMock).not.toHaveBeenCalled();
    });

    it("honours caseSensitive rather than assuming a lenient default", async () => {
      const user = userEvent.setup();
      renderSection({
        ...textSection,
        blanks: {
          kw: {
            match: "text",
            answers: ["def"],
            caseSensitive: true,
            hintMode: "coloring",
          },
        },
      });

      await user.type(input("fill-1"), "Def");
      await user.click(checkButton("fill-1"));
      expect(screen.getByText(/0 \/ 1 correct/i)).toBeInTheDocument();
    });

    it("refuses a blank that names no matcher instead of inferring one", () => {
      // What an author could previously write as shorthand. `9.09` as a text
      // blank would grade `9.090` wrong, so the guard stops it rather than
      // guessing which comparison was meant.
      renderSection({
        ...textSection,
        blanks: { kw: "9.09" } as unknown as FillInSectionData["blanks"],
      });

      expect(screen.getByTestId("fill-in-errors-fill-1")).toHaveTextContent(
        "naming its matcher"
      );
      expect(screen.queryByTestId("fill-in-check-fill-1")).toBeNull();
    });

    it("renders authoring errors instead of a broken interaction", () => {
      renderSection({
        ...textSection,
        body: "This references {{missing}}.",
        blanks: {
          unused: {
            match: "text",
            answers: ["never referenced"],
            caseSensitive: false,
            hintMode: "none",
          },
        },
      });

      const errors = screen.getByTestId("fill-in-errors-fill-1");
      expect(errors).toHaveTextContent("references {{missing}}");
      expect(errors).toHaveTextContent('blanks has "unused"');
      expect(screen.queryByTestId("fill-in-check-fill-1")).toBeNull();
    });

    it("reports a body with no blanks, which could never be completed", () => {
      renderSection({ ...textSection, body: "No blanks here.", blanks: {} });
      expect(screen.getByTestId("fill-in-errors-fill-1")).toHaveTextContent(
        "no {{name}} blanks"
      );
    });
  });
});
