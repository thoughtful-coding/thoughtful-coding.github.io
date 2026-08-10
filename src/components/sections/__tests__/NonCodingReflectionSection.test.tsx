import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { render } from "../../../test-utils";
import NonCodingReflectionSection from "../NonCodingReflectionSection";
import { useReflectionWorkflow } from "../../../hooks/useReflectionWorkflow";
import { useSectionProgress } from "../../../hooks/useSectionProgress";
import { useAuthStore } from "../../../stores/authStore";
import {
  useProgressActions,
  useProgressStore,
} from "../../../stores/progressStore";
import type {
  NonCodingReflectionSectionData,
  UnitId,
  LessonId,
  SectionId,
  CourseId,
} from "../../../types/data";

vi.mock("../../../hooks/useReflectionWorkflow", () => ({
  useReflectionWorkflow: vi.fn(),
}));
vi.mock("../../../hooks/useSectionProgress", () => ({
  useSectionProgress: vi.fn(),
}));
vi.mock("../../../stores/authStore", () => ({ useAuthStore: vi.fn() }));
vi.mock("../../../stores/progressStore", () => ({
  useProgressActions: vi.fn(),
  useProgressStore: vi.fn(),
}));

const section: NonCodingReflectionSectionData = {
  kind: "NonCodingReflection",
  id: "reflect-1" as SectionId,
  title: "Why Randomisation Matters",
  content: [{ kind: "text", value: "Think it through." }],
  topic: "Why does randomisation matter?",
  minLength: 20,
  placeholder: "Start by naming what randomisation controls for...",
};

const INPUT = "non-coding-reflection-input-reflect-1";
const SUBMIT = "non-coding-reflection-submit-reflect-1";
const COUNT = "non-coding-reflection-count-reflect-1";

const completeSectionMock = vi.fn();
const handleGetFeedbackMock = vi.fn();

let workflowState: Record<string, unknown>;
let isSectionComplete: boolean;

const setWorkflow = (overrides: Record<string, unknown> = {}) => {
  workflowState = {
    currentExplanation: "",
    setCurrentExplanation: vi.fn(),
    draftHistory: [],
    isLoading: false,
    isLoadingHistory: false,
    fetchError: null,
    submitError: null,
    handleGetFeedback: handleGetFeedbackMock,
    handleFinalSubmit: vi.fn(),
    canSubmitToJournal: false,
    ...overrides,
  };
};

const renderSection = (
  overrides: Partial<NonCodingReflectionSectionData> = {}
) =>
  render(
    <NonCodingReflectionSection
      section={{ ...section, ...overrides }}
      unitId={"unit-1" as UnitId}
      lessonId={"lesson-1" as LessonId}
      courseId={"getting-started" as CourseId}
      lessonPath={"00_intro/lessons/reflect"}
    />
  );

describe("NonCodingReflectionSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setWorkflow();
    isSectionComplete = false;

    vi.mocked(useReflectionWorkflow).mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (() => workflowState) as any
    );
    // Real useState stand-in so the persisted draft round-trips.
    vi.mocked(useSectionProgress).mockImplementation(((
      _unitId: unknown,
      _lessonId: unknown,
      _sectionId: unknown,
      _key: unknown,
      initialState: object
    ) => {
      const [state, setState] = React.useState(initialState);
      return [state, setState, false];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated: true } as any);
    vi.mocked(useProgressActions).mockReturnValue({
      completeSection: completeSectionMock,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useProgressStore).mockImplementation(
      (() =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        isSectionComplete) as any
    );
  });

  it("renders the topic as the prompt and never a code editor", () => {
    renderSection();
    expect(
      screen.getByText("Why does randomisation matter?")
    ).toBeInTheDocument();
    expect(document.querySelector(".cm-editor")).toBeNull();
    expect(screen.queryByText(/code/i)).toBeNull();
  });

  it("keeps Submit disabled until minLength is reached", async () => {
    const user = userEvent.setup();
    const { rerender } = renderSection();

    expect(screen.getByTestId(SUBMIT)).toBeDisabled();
    expect(screen.getByTestId(COUNT)).toHaveTextContent("0 / 20");

    await user.type(screen.getByTestId(INPUT), "too short");
    // The workflow owns the text, so drive it the way the real hook would.
    setWorkflow({ currentExplanation: "too short" });
    rerender(
      <NonCodingReflectionSection
        section={section}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
        courseId={"getting-started" as CourseId}
        lessonPath={"00_intro/lessons/reflect"}
      />
    );
    expect(screen.getByTestId(COUNT)).toHaveTextContent("9 / 20");
    expect(screen.getByTestId(SUBMIT)).toBeDisabled();

    setWorkflow({
      currentExplanation: "this is definitely long enough to submit",
    });
    rerender(
      <NonCodingReflectionSection
        section={section}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
        courseId={"getting-started" as CourseId}
        lessonPath={"00_intro/lessons/reflect"}
      />
    );
    expect(screen.getByTestId(SUBMIT)).toBeEnabled();
  });

  it("measures length after trimming, so whitespace cannot pad it", () => {
    setWorkflow({ currentExplanation: `   short   ${" ".repeat(40)}` });
    renderSection();
    expect(screen.getByTestId(COUNT)).toHaveTextContent("5 / 20");
    expect(screen.getByTestId(SUBMIT)).toBeDisabled();
  });

  it("blocks submission and explains when the learner is not logged in", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated: false } as any);
    setWorkflow({ currentExplanation: "a".repeat(50) });
    renderSection();

    const submit = screen.getByTestId(SUBMIT);
    expect(submit).toBeDisabled();
    expect(submit).toHaveTextContent(/log in/i);
  });

  it("submits the reflection when Submit is clicked", async () => {
    const user = userEvent.setup();
    setWorkflow({ currentExplanation: "a".repeat(50) });
    renderSection();

    await user.click(screen.getByTestId(SUBMIT));
    expect(handleGetFeedbackMock).toHaveBeenCalledTimes(1);
  });

  it("renders returned feedback and its assessment level", () => {
    setWorkflow({
      draftHistory: [
        {
          versionId: "v1",
          userExplanation: "Randomisation balances confounders.",
          aiFeedback: "Good — you named the mechanism.",
          aiAssessment: "achieves",
          createdAt: new Date().toISOString(),
        },
      ],
    });
    renderSection();

    expect(
      screen.getByText("Good — you named the mechanism.")
    ).toBeInTheDocument();
    expect(screen.getByText(/AI Assessment: Achieves/)).toBeInTheDocument();
  });

  describe("completion", () => {
    it("completes on a submitted reflection whatever the assessment says", () => {
      setWorkflow({
        draftHistory: [
          {
            versionId: "v1",
            userExplanation: "A thin answer.",
            aiFeedback: "Needs more depth.",
            aiAssessment: "insufficient",
            createdAt: new Date().toISOString(),
          },
        ],
      });
      renderSection();

      expect(completeSectionMock).toHaveBeenCalledWith(
        "unit-1",
        "lesson-1",
        "reflect-1",
        1
      );
    });

    it("does not complete before anything has been submitted", () => {
      renderSection();
      expect(completeSectionMock).not.toHaveBeenCalled();
    });

    it("does not re-complete a section already marked complete", () => {
      isSectionComplete = true;
      setWorkflow({
        draftHistory: [
          {
            versionId: "v1",
            userExplanation: "Answer.",
            aiAssessment: "mostly",
            createdAt: new Date().toISOString(),
          },
        ],
      });
      renderSection();
      expect(completeSectionMock).not.toHaveBeenCalled();
    });
  });

  it("restores a persisted draft into the editor on mount", () => {
    const setCurrentExplanation = vi.fn();
    setWorkflow({ setCurrentExplanation });
    vi.mocked(useSectionProgress).mockImplementation(((
      _unitId: unknown,
      _lessonId: unknown,
      _sectionId: unknown,
      _key: unknown
    ) => [{ text: "saved from last time" }, vi.fn(), false]) as never);

    renderSection();
    expect(setCurrentExplanation).toHaveBeenCalledWith("saved from last time");
  });
});
