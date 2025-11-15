import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useQuizLogic } from "../useQuizLogic";
import { useSectionProgress } from "../useSectionProgress";
import {
  useProgressActions,
  useIsPenaltyActive,
  useRemainingPenaltyTime,
} from "../../stores/progressStore";
import type {
  MultipleChoiceSectionData,
  MultipleSelectionSectionData,
  UnitId,
  LessonId,
} from "../../types/data";

// --- Mocks Setup ---
vi.mock("../useSectionProgress");
vi.mock("../../stores/progressStore", () => ({
  useProgressActions: vi.fn(),
  useIsPenaltyActive: vi.fn(),
  useRemainingPenaltyTime: vi.fn(),
}));

const mockedUseSectionProgress = vi.mocked(useSectionProgress);
const mockedUseProgressActions = vi.mocked(useProgressActions);
const mockedUseIsPenaltyActive = vi.mocked(useIsPenaltyActive);
const mockedUseRemainingPenaltyTime = vi.mocked(useRemainingPenaltyTime);

// --- Mock Data ---
const mockMcqSection: MultipleChoiceSectionData = {
  kind: "MultipleChoice",
  id: "mcq-1",
  title: "MCQ Test",
  options: ["A", "B", "C"],
  correctAnswer: 1, // "B" is correct
  content: [],
};

const mockMsqSection: MultipleSelectionSectionData = {
  kind: "MultipleSelection",
  id: "msq-1",
  title: "MSQ Test",
  options: ["A", "B", "C", "D"],
  correctAnswers: [0, 2], // "A" and "C" are correct
  content: [],
};

describe("useQuizLogic", () => {
  const setPersistedQuizStateMock = vi.fn();
  const startPenaltyMock = vi.fn();
  const incrementAttemptCounterMock = vi.fn();
  let mockCurrentState: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock for progress store hooks
    mockedUseProgressActions.mockReturnValue({
      startPenalty: startPenaltyMock,
      incrementAttemptCounter: incrementAttemptCounterMock,
    });
    mockedUseIsPenaltyActive.mockReturnValue(false);
    mockedUseRemainingPenaltyTime.mockReturnValue(0);

    // Mock useSectionProgress to return a state we can control
    mockCurrentState = {
      selectedIndices: [],
      submitted: false,
      isCorrect: null,
    };
    mockedUseSectionProgress.mockImplementation(() => [
      mockCurrentState,
      setPersistedQuizStateMock,
      false, // isSectionComplete
    ]);
  });

  it("should initialize with a default state", () => {
    const { result } = renderHook(() =>
      useQuizLogic({
        unitId: "u1" as UnitId,
        lessonId: "l1" as LessonId,
        section: mockMcqSection,
        isMultiSelect: false,
      })
    );
    expect(result.current.selectedIndices).toEqual([]);
    expect(result.current.isSubmitted).toBe(false);
    expect(result.current.isCorrect).toBeNull();
  });

  describe("Single-Select (Multiple Choice)", () => {
    it("should select an option and replace the previous one", () => {
      const { result } = renderHook(() =>
        useQuizLogic({
          unitId: "u1" as UnitId,
          lessonId: "l1" as LessonId,
          section: mockMcqSection,
          isMultiSelect: false,
        })
      );

      act(() => result.current.handleOptionChange(0)); // Select "A"
      expect(setPersistedQuizStateMock).toHaveBeenCalled();

      // Simulate the state update
      const firstUpdateFn = setPersistedQuizStateMock.mock.calls[0][0];
      mockCurrentState = firstUpdateFn(mockCurrentState);
      expect(mockCurrentState.selectedIndices).toEqual([0]);

      act(() => result.current.handleOptionChange(2)); // Select "C"
      const secondUpdateFn = setPersistedQuizStateMock.mock.calls[1][0];
      mockCurrentState = secondUpdateFn(mockCurrentState);
      expect(mockCurrentState.selectedIndices).toEqual([2]); // "A" should be replaced
    });

    it("should correctly identify a correct answer on submit", () => {
      mockCurrentState.selectedIndices = [1]; // "B", the correct answer
      const { result } = renderHook(() =>
        useQuizLogic({
          unitId: "u1" as UnitId,
          lessonId: "l1" as LessonId,
          section: mockMcqSection,
          isMultiSelect: false,
        })
      );

      act(() => result.current.handleSubmit());

      const finalStateUpdater = setPersistedQuizStateMock.mock.calls[0][0];
      const finalState = finalStateUpdater(mockCurrentState);
      expect(finalState.isCorrect).toBe(true);
      expect(finalState.submitted).toBe(true);
      expect(startPenaltyMock).not.toHaveBeenCalled();
    });

    it("should correctly identify an incorrect answer and start a penalty", () => {
      mockCurrentState.selectedIndices = [0]; // "A", incorrect
      const { result } = renderHook(() =>
        useQuizLogic({
          unitId: "u1" as UnitId,
          lessonId: "l1" as LessonId,
          section: mockMcqSection,
          isMultiSelect: false,
        })
      );

      act(() => result.current.handleSubmit());

      const finalStateUpdater = setPersistedQuizStateMock.mock.calls[0][0];
      const finalState = finalStateUpdater(mockCurrentState);
      expect(finalState.isCorrect).toBe(false);
      expect(startPenaltyMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("Multi-Select", () => {
    it("should add multiple options and allow deselecting", () => {
      const { result } = renderHook(() =>
        useQuizLogic({
          unitId: "u1" as UnitId,
          lessonId: "l1" as LessonId,
          section: mockMsqSection,
          isMultiSelect: true,
        })
      );

      act(() => result.current.handleOptionChange(0)); // Select "A"
      act(() => result.current.handleOptionChange(2)); // Select "C"

      const addUpdater1 = setPersistedQuizStateMock.mock.calls[0][0];
      const addUpdater2 = setPersistedQuizStateMock.mock.calls[1][0];
      mockCurrentState = addUpdater2(addUpdater1(mockCurrentState));
      expect(mockCurrentState.selectedIndices).toEqual([0, 2]);

      act(() => result.current.handleOptionChange(0)); // Deselect "A"
      const removeUpdater = setPersistedQuizStateMock.mock.calls[2][0];
      mockCurrentState = removeUpdater(mockCurrentState);
      expect(mockCurrentState.selectedIndices).toEqual([2]);
    });

    it("should correctly identify a correct set of answers", () => {
      mockCurrentState.selectedIndices = [0, 2]; // Correct answers
      const { result } = renderHook(() =>
        useQuizLogic({
          unitId: "u1" as UnitId,
          lessonId: "l1" as LessonId,
          section: mockMsqSection,
          isMultiSelect: true,
        })
      );

      act(() => result.current.handleSubmit());

      const finalStateUpdater = setPersistedQuizStateMock.mock.calls[0][0];
      const finalState = finalStateUpdater(mockCurrentState);
      expect(finalState.isCorrect).toBe(true);
      expect(startPenaltyMock).not.toHaveBeenCalled();
    });
  });

  describe("Try Again Logic", () => {
    it("should reset the state when handleTryAgain is called", () => {
      mockCurrentState = {
        selectedIndices: [0],
        submitted: true,
        isCorrect: false,
      };
      const { result } = renderHook(() =>
        useQuizLogic({
          unitId: "u1" as UnitId,
          lessonId: "l1" as LessonId,
          section: mockMcqSection,
          isMultiSelect: false,
        })
      );

      act(() => result.current.handleTryAgain());

      const resetState = setPersistedQuizStateMock.mock.calls[0][0];
      expect(resetState).toEqual({
        selectedIndices: [],
        submitted: false,
        isCorrect: null,
      });
    });
  });
});
