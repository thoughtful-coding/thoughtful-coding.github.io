import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { usePredictionLogic } from "../usePredictionLogic";
import { usePyodide } from "../../contexts/PyodideContext";
import { useSectionProgress } from "../useSectionProgress";
import type {
  PredictionTableRow,
  UnitId,
  LessonId,
  SectionId,
} from "../../types/data";

// Mock dependencies
vi.mock("../../contexts/PyodideContext");
vi.mock("../useSectionProgress");

const mockRunPythonCode = vi.fn();
const mockSetSavedState = vi.fn();
const mockedUsePyodide = vi.mocked(usePyodide);
const mockedUseSectionProgress = vi.mocked(useSectionProgress);

describe("usePredictionLogic", () => {
  const defaultProps = {
    unitId: "unit-1" as UnitId,
    lessonId: "lesson-1" as LessonId,
    sectionId: "section-1" as SectionId,
    testMode: "procedure" as const,
    functionCode: "def add(a, b):\n    print(a + b)",
    predictionRows: [
      { inputs: [2, 3], id: "row-1" },
      { inputs: [5, 10], id: "row-2" },
    ] as PredictionTableRow[],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUsePyodide.mockReturnValue({
      runPythonCode: mockRunPythonCode,
      isLoading: false,
      error: null,
      loadPackages: vi.fn(),
    });

    mockedUseSectionProgress.mockImplementation(((...args: any[]) => {
      const checkCompletion = args[5];
      const initialState = args[4];
      let state = initialState;

      const setSavedState = (updater: any) => {
        mockSetSavedState(updater);
        state = typeof updater === "function" ? updater(state) : updater;
      };

      return [state, setSavedState, checkCompletion(state)];
    }) as any);
  });

  it("should initialize with empty predictions", () => {
    const { result } = renderHook(() => usePredictionLogic(defaultProps));

    expect(result.current.predictions).toEqual({});
    expect(result.current.isSectionComplete).toBe(false);
  });

  it("should handle prediction text change", () => {
    const { result } = renderHook(() => usePredictionLogic(defaultProps));

    act(() => {
      result.current.handlePredictionChange(0, "5");
    });

    expect(mockSetSavedState).toHaveBeenCalled();
    const updater = mockSetSavedState.mock.calls[0][0];
    const newState = updater({ predictions: {} });

    expect(newState.predictions[0]).toEqual({
      userAnswer: "5",
      isCorrect: null,
      actualOutput: null,
    });
  });

  it("should reset correctness when prediction changes", () => {
    const { result } = renderHook(() => usePredictionLogic(defaultProps));

    act(() => {
      result.current.handlePredictionChange(0, "new value");
    });

    const updater = mockSetSavedState.mock.calls[0][0];
    const prevState = {
      predictions: {
        0: { userAnswer: "old", isCorrect: true, actualOutput: "5" },
      },
    };
    const newState = updater(prevState);

    expect(newState.predictions[0].isCorrect).toBe(null);
    expect(newState.predictions[0].actualOutput).toBe(null);
  });

  it("should run prediction and mark correct answer", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: "5",
      stderr: "",
      error: null,
      result: null,
    });

    mockedUseSectionProgress.mockImplementation(((...args: any[]) => {
      const state = { predictions: { 0: { userAnswer: "5" } } };
      return [state, mockSetSavedState, false];
    }) as any);

    const { result } = renderHook(() => usePredictionLogic(defaultProps));

    await act(async () => {
      await result.current.runPrediction(0);
    });

    expect(mockRunPythonCode).toHaveBeenCalledWith(
      "def add(a, b):\n    print(a + b)\n\nprint(add(2, 3))",
      undefined
    );

    expect(mockSetSavedState).toHaveBeenCalled();
    const updater = mockSetSavedState.mock.calls[0][0];
    const newState = updater({ predictions: { 0: { userAnswer: "5" } } });

    expect(newState.predictions[0].isCorrect).toBe(true);
    expect(newState.predictions[0].actualOutput).toBe("5");
  });

  it("should run prediction and mark incorrect answer", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: "5",
      stderr: "",
      error: null,
      result: null,
    });

    mockedUseSectionProgress.mockImplementation(((...args: any[]) => {
      const state = { predictions: { 0: { userAnswer: "10" } } };
      return [state, mockSetSavedState, false];
    }) as any);

    const { result } = renderHook(() => usePredictionLogic(defaultProps));

    await act(async () => {
      await result.current.runPrediction(0);
    });

    const updater = mockSetSavedState.mock.calls[0][0];
    const newState = updater({ predictions: { 0: { userAnswer: "10" } } });

    expect(newState.predictions[0].isCorrect).toBe(false);
    expect(newState.predictions[0].actualOutput).toBe("5");
  });

  it("should handle Python execution errors", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: false,
      stdout: "",
      stderr: "",
      error: {
        type: "NameError",
        message: "name 'x' is not defined",
      },
      result: null,
    });

    mockedUseSectionProgress.mockImplementation(((...args: any[]) => {
      const state = { predictions: { 0: { userAnswer: "5" } } };
      return [state, mockSetSavedState, false];
    }) as any);

    const { result } = renderHook(() => usePredictionLogic(defaultProps));

    await act(async () => {
      await result.current.runPrediction(0);
    });

    const updater = mockSetSavedState.mock.calls[0][0];
    const newState = updater({ predictions: { 0: { userAnswer: "5" } } });

    expect(newState.predictions[0].isCorrect).toBe(false);
    expect(newState.predictions[0].actualOutput).toContain("Error:");
  });

  it("should handle function name parsing errors", async () => {
    const propsWithBadCode = {
      ...defaultProps,
      functionCode: "not a valid function",
    };

    mockedUseSectionProgress.mockImplementation(((...args: any[]) => {
      const state = { predictions: { 0: { userAnswer: "5" } } };
      return [state, mockSetSavedState, false];
    }) as any);

    const { result } = renderHook(() => usePredictionLogic(propsWithBadCode));

    await act(async () => {
      await result.current.runPrediction(0);
    });

    const updater = mockSetSavedState.mock.calls[0][0];
    const newState = updater({ predictions: { 0: { userAnswer: "5" } } });

    expect(newState.predictions[0].isCorrect).toBe(false);
    expect(newState.predictions[0].actualOutput).toContain(
      "Could not parse function name"
    );
  });

  it("should track running states during execution", async () => {
    let resolvePromise: any;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockRunPythonCode.mockReturnValue(promise);

    mockedUseSectionProgress.mockImplementation(((...args: any[]) => {
      const state = { predictions: { 0: { userAnswer: "5" } } };
      return [state, mockSetSavedState, false];
    }) as any);

    const { result } = renderHook(() => usePredictionLogic(defaultProps));

    // Start execution
    act(() => {
      result.current.runPrediction(0);
    });

    // Should show as running
    expect(result.current.runningStates[0]).toBe(true);

    // Resolve and finish
    await act(async () => {
      resolvePromise({
        success: true,
        stdout: "5",
        stderr: "",
        result: null,
        error: null,
      });
      await promise;
    });

    // Should no longer be running
    expect(result.current.runningStates[0]).toBe(false);
  });

  it("should check completion when all predictions are correct", () => {
    mockedUseSectionProgress.mockImplementation(((...args: any[]) => {
      const checkCompletion = args[5];
      const state = {
        predictions: {
          0: { userAnswer: "5", isCorrect: true, actualOutput: "5" },
          1: { userAnswer: "15", isCorrect: true, actualOutput: "15" },
        },
      };
      return [state, mockSetSavedState, checkCompletion(state)];
    }) as any);

    const { result } = renderHook(() => usePredictionLogic(defaultProps));

    expect(result.current.isSectionComplete).toBe(true);
  });

  it("should not be complete if any prediction is incorrect", () => {
    mockedUseSectionProgress.mockImplementation(((...args: any[]) => {
      const checkCompletion = args[5];
      const state = {
        predictions: {
          0: { userAnswer: "5", isCorrect: true, actualOutput: "5" },
          1: { userAnswer: "10", isCorrect: false, actualOutput: "15" },
        },
      };
      return [state, mockSetSavedState, checkCompletion(state)];
    }) as any);

    const { result } = renderHook(() => usePredictionLogic(defaultProps));

    expect(result.current.isSectionComplete).toBe(false);
  });

  it("should handle empty user answer", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: "5",
      stderr: "",
      error: null,
      result: null,
    });

    mockedUseSectionProgress.mockImplementation(((...args: any[]) => {
      const state = { predictions: {} };
      return [state, mockSetSavedState, false];
    }) as any);

    const { result } = renderHook(() => usePredictionLogic(defaultProps));

    await act(async () => {
      await result.current.runPrediction(0);
    });

    const updater = mockSetSavedState.mock.calls[0][0];
    const newState = updater({ predictions: {} });

    expect(newState.predictions[0].isCorrect).toBe(false);
    expect(newState.predictions[0].actualOutput).toBe("5");
  });

  it("should trim whitespace when comparing predictions", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: "  5  ",
      stderr: "",
      error: null,
      result: null,
    });

    mockedUseSectionProgress.mockImplementation(((...args: any[]) => {
      const state = { predictions: { 0: { userAnswer: "  5  " } } };
      return [state, mockSetSavedState, false];
    }) as any);

    const { result } = renderHook(() => usePredictionLogic(defaultProps));

    await act(async () => {
      await result.current.runPrediction(0);
    });

    const updater = mockSetSavedState.mock.calls[0][0];
    const newState = updater({ predictions: { 0: { userAnswer: "  5  " } } });

    expect(newState.predictions[0].isCorrect).toBe(true);
  });

  it("should handle Python output with None", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: "",
      stderr: "",
      error: null,
      result: null,
    });

    mockedUseSectionProgress.mockImplementation(((...args: any[]) => {
      const state = { predictions: { 0: { userAnswer: "None" } } };
      return [state, mockSetSavedState, false];
    }) as any);

    const { result } = renderHook(() => usePredictionLogic(defaultProps));

    await act(async () => {
      await result.current.runPrediction(0);
    });

    const updater = mockSetSavedState.mock.calls[0][0];
    const newState = updater({ predictions: { 0: { userAnswer: "None" } } });

    expect(newState.predictions[0].actualOutput).toBe("None");
  });
});
