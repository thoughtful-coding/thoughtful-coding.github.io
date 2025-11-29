import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useInteractiveTableLogic } from "../useInteractiveTableLogic";
import { usePyodide } from "../../contexts/PyodideContext";
import { useProgressActions } from "../../stores/progressStore";
import type {
  UnitId,
  LessonId,
  SectionId,
  InputParam,
  CoverageTableRow,
  PredictionTableRow,
} from "../../types/data";

// Mock dependencies
vi.mock("../../contexts/PyodideContext");
vi.mock("../../stores/progressStore");

const mockRunPythonCode = vi.fn();
const mockIncrementAttemptCounter = vi.fn();
const mockedUsePyodide = vi.mocked(usePyodide);
const mockedUseProgressActions = vi.mocked(useProgressActions);

describe("useInteractiveTableLogic", () => {
  const defaultColumns: InputParam[] = [
    { variableName: "a", variableType: "number" },
    { variableName: "b", variableType: "number" },
  ];

  const coverageRows: CoverageTableRow[] = [
    { fixedInputs: {}, expectedOutput: "5" },
    { fixedInputs: {}, expectedOutput: "10" },
  ];

  const predictionRows: PredictionTableRow[] = [
    { inputs: [2, 3] },
    { inputs: [5, 5] },
  ];

  const coverageProps = {
    unitId: "unit-1" as UnitId,
    lessonId: "lesson-1" as LessonId,
    sectionId: "section-1" as SectionId,
    mode: "coverage" as const,
    testMode: "function" as const,
    functionCode: "def add(a, b):\n  return a + b",
    functionToTest: "add",
    columns: defaultColumns,
    rows: coverageRows,
  };

  const predictionProps = {
    unitId: "unit-1" as UnitId,
    lessonId: "lesson-1" as LessonId,
    sectionId: "section-1" as SectionId,
    mode: "prediction" as const,
    testMode: "function" as const,
    functionCode: "def add(a, b):\n  return a + b",
    functionToTest: "add",
    columns: defaultColumns,
    rows: predictionRows,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUsePyodide.mockReturnValue({
      runPythonCode: mockRunPythonCode,
      isLoading: false,
      error: null,
      loadPackages: vi.fn(),
    });

    mockedUseProgressActions.mockReturnValue({
      incrementAttemptCounter: mockIncrementAttemptCounter,
    });
  });

  describe("coverage mode", () => {
    it("should initialize with empty coverage state", () => {
      const { result } = renderHook(() =>
        useInteractiveTableLogic(coverageProps)
      );

      expect(result.current.savedState).toEqual({
        challengeStates: {
          0: { inputs: { a: "", b: "" }, actualOutput: null, isCorrect: null },
          1: { inputs: { a: "", b: "" }, actualOutput: null, isCorrect: null },
        },
      });
    });

    it("should handle input change for coverage mode", () => {
      const { result } = renderHook(() =>
        useInteractiveTableLogic(coverageProps)
      );

      act(() => {
        result.current.handleUserInputChange(0, "2", "a");
      });

      const state = result.current.savedState as any;
      expect(state.challengeStates[0].inputs.a).toBe("2");
    });

    it("should run coverage row and check correctness", async () => {
      mockRunPythonCode.mockResolvedValue({
        success: true,
        stdout: "5",
        stderr: "",
        result: null,
        error: null,
      });

      const { result } = renderHook(() =>
        useInteractiveTableLogic(coverageProps)
      );

      // Set inputs first
      act(() => {
        result.current.handleUserInputChange(0, "2", "a");
        result.current.handleUserInputChange(0, "3", "b");
      });

      await act(async () => {
        await result.current.runRow(0);
      });

      expect(mockRunPythonCode).toHaveBeenCalledWith(
        "def add(a, b):\n  return a + b\n\nprint(add(2, 3))",
        undefined
      );

      const state = result.current.savedState as any;
      expect(state.challengeStates[0].actualOutput).toBe("5");
      expect(state.challengeStates[0].isCorrect).toBe(true);
    });

    it("should mark coverage row as incorrect when output doesn't match", async () => {
      mockRunPythonCode.mockResolvedValue({
        success: true,
        stdout: "6",
        stderr: "",
        result: null,
        error: null,
      });

      const { result } = renderHook(() =>
        useInteractiveTableLogic(coverageProps)
      );

      act(() => {
        result.current.handleUserInputChange(0, "2", "a");
        result.current.handleUserInputChange(0, "3", "b");
      });

      await act(async () => {
        await result.current.runRow(0);
      });

      const state = result.current.savedState as any;
      expect(state.challengeStates[0].actualOutput).toBe("6");
      expect(state.challengeStates[0].isCorrect).toBe(false);
    });

    it("should handle Python errors in coverage mode", async () => {
      mockRunPythonCode.mockResolvedValue({
        success: false,
        stdout: "",
        stderr: "",
        result: null,
        error: {
          type: "NameError",
          message: "name 'x' is not defined",
        },
      });

      const { result } = renderHook(() =>
        useInteractiveTableLogic(coverageProps)
      );

      act(() => {
        result.current.handleUserInputChange(0, "2", "a");
        result.current.handleUserInputChange(0, "3", "b");
      });

      await act(async () => {
        await result.current.runRow(0);
      });

      const state = result.current.savedState as any;
      expect(state.challengeStates[0].actualOutput).toContain("Error:");
      expect(state.challengeStates[0].isCorrect).toBe(false);
    });

    it("should reset correctness when input changes", () => {
      const { result } = renderHook(() =>
        useInteractiveTableLogic(coverageProps)
      );

      // Manually set a previous state with correctness
      act(() => {
        result.current.handleUserInputChange(0, "2", "a");
        result.current.handleUserInputChange(0, "3", "b");
      });

      const state = result.current.savedState as any;
      expect(state.challengeStates[0].isCorrect).toBe(null);
      expect(state.challengeStates[0].actualOutput).toBe(null);
    });

    it("should parse number inputs correctly", async () => {
      mockRunPythonCode.mockResolvedValue({
        success: true,
        stdout: "7",
        stderr: "",
        result: null,
        error: null,
      });

      const { result } = renderHook(() =>
        useInteractiveTableLogic(coverageProps)
      );

      act(() => {
        result.current.handleUserInputChange(0, "3.5", "a");
        result.current.handleUserInputChange(0, "3.5", "b");
      });

      await act(async () => {
        await result.current.runRow(0);
      });

      expect(mockRunPythonCode).toHaveBeenCalledWith(
        "def add(a, b):\n  return a + b\n\nprint(add(3.5, 3.5))",
        undefined
      );
    });

    describe("boolean inputs", () => {
      const booleanColumns: InputParam[] = [
        { variableName: "age", variableType: "number" },
        { variableName: "has_membership", variableType: "boolean" },
      ];

      const booleanRows: CoverageTableRow[] = [
        { fixedInputs: {}, expectedOutput: "Free entry!" },
        { fixedInputs: {}, expectedOutput: "Please pay admission" },
      ];

      const booleanProps = {
        ...coverageProps,
        functionCode:
          "def free_entry(age, has_membership):\n  if age < 12 or has_membership:\n    print('Free entry!')\n  else:\n    print('Please pay admission')",
        functionToTest: "free_entry",
        testMode: "procedure" as const,
        columns: booleanColumns,
        rows: booleanRows,
      };

      it("should parse 'True' string as Python True", async () => {
        mockRunPythonCode.mockResolvedValue({
          success: true,
          stdout: "Free entry!",
          stderr: "",
          result: null,
          error: null,
        });

        const { result } = renderHook(() =>
          useInteractiveTableLogic(booleanProps)
        );

        act(() => {
          result.current.handleUserInputChange(0, "25", "age");
          result.current.handleUserInputChange(0, "True", "has_membership");
        });

        await act(async () => {
          await result.current.runRow(0);
        });

        // Should call with Python True, not JavaScript true
        expect(mockRunPythonCode).toHaveBeenCalledWith(
          expect.stringContaining("free_entry(25, True)"),
          undefined
        );
      });

      it("should parse 'False' string as Python False", async () => {
        mockRunPythonCode.mockResolvedValue({
          success: true,
          stdout: "Please pay admission",
          stderr: "",
          result: null,
          error: null,
        });

        const { result } = renderHook(() =>
          useInteractiveTableLogic(booleanProps)
        );

        act(() => {
          result.current.handleUserInputChange(0, "25", "age");
          result.current.handleUserInputChange(0, "False", "has_membership");
        });

        await act(async () => {
          await result.current.runRow(0);
        });

        // Should call with Python False, not JavaScript false
        expect(mockRunPythonCode).toHaveBeenCalledWith(
          expect.stringContaining("free_entry(25, False)"),
          undefined
        );
      });

      it("should parse boolean values case-insensitively", async () => {
        mockRunPythonCode.mockResolvedValue({
          success: true,
          stdout: "Free entry!",
          stderr: "",
          result: null,
          error: null,
        });

        const { result } = renderHook(() =>
          useInteractiveTableLogic(booleanProps)
        );

        act(() => {
          result.current.handleUserInputChange(0, "25", "age");
          result.current.handleUserInputChange(0, "true", "has_membership"); // lowercase
        });

        await act(async () => {
          await result.current.runRow(0);
        });

        expect(mockRunPythonCode).toHaveBeenCalledWith(
          expect.stringContaining("free_entry(25, True)"),
          undefined
        );
      });

      it("should treat empty string as false for boolean inputs", async () => {
        mockRunPythonCode.mockResolvedValue({
          success: true,
          stdout: "Please pay admission",
          stderr: "",
          result: null,
          error: null,
        });

        const { result } = renderHook(() =>
          useInteractiveTableLogic(booleanProps)
        );

        act(() => {
          result.current.handleUserInputChange(0, "25", "age");
          result.current.handleUserInputChange(0, "", "has_membership");
        });

        await act(async () => {
          await result.current.runRow(0);
        });

        expect(mockRunPythonCode).toHaveBeenCalledWith(
          expect.stringContaining("free_entry(25, False)"),
          undefined
        );
      });

      it("should handle fixed boolean inputs and initialize with 'False' string", async () => {
        const fixedBooleanRows: CoverageTableRow[] = [
          {
            fixedInputs: { has_membership: false },
            expectedOutput: "Free entry!",
          },
        ];

        const fixedBooleanProps = {
          ...booleanProps,
          rows: fixedBooleanRows,
        };

        mockRunPythonCode.mockResolvedValue({
          success: true,
          stdout: "Free entry!",
          stderr: "",
          result: null,
          error: null,
        });

        const { result } = renderHook(() =>
          useInteractiveTableLogic(fixedBooleanProps)
        );

        // Check that fixed boolean is initialized as "False" string for dropdown
        const state = result.current.savedState as any;
        expect(state.challengeStates[0].inputs.has_membership).toBe("False");

        // Set only the editable input
        act(() => {
          result.current.handleUserInputChange(0, "5", "age");
        });

        await act(async () => {
          await result.current.runRow(0);
        });

        // Should use fixed boolean value (Python False)
        expect(mockRunPythonCode).toHaveBeenCalledWith(
          expect.stringContaining("free_entry(5, False)"),
          undefined
        );
      });

      it("should handle fixed boolean inputs with True value", async () => {
        const fixedBooleanRows: CoverageTableRow[] = [
          {
            fixedInputs: { has_membership: true },
            expectedOutput: "Free entry!",
          },
        ];

        const fixedBooleanProps = {
          ...booleanProps,
          rows: fixedBooleanRows,
        };

        mockRunPythonCode.mockResolvedValue({
          success: true,
          stdout: "Free entry!",
          stderr: "",
          result: null,
          error: null,
        });

        const { result } = renderHook(() =>
          useInteractiveTableLogic(fixedBooleanProps)
        );

        // Check that fixed boolean is initialized as "True" string for dropdown
        const state = result.current.savedState as any;
        expect(state.challengeStates[0].inputs.has_membership).toBe("True");

        // Set only the editable input
        act(() => {
          result.current.handleUserInputChange(0, "25", "age");
        });

        await act(async () => {
          await result.current.runRow(0);
        });

        // Should use fixed boolean value (Python True)
        expect(mockRunPythonCode).toHaveBeenCalledWith(
          expect.stringContaining("free_entry(25, True)"),
          undefined
        );
      });
    });

    describe("fixed inputs", () => {
      const coverageRowsWithFixed: CoverageTableRow[] = [
        { fixedInputs: { a: 2 }, expectedOutput: "7" }, // 'a' is fixed at 2, 'b' is editable
        { fixedInputs: { a: 5, b: 5 }, expectedOutput: "10" }, // Both fixed
        { fixedInputs: {}, expectedOutput: "15" }, // Nothing fixed
      ];

      const propsWithFixed = {
        ...coverageProps,
        rows: coverageRowsWithFixed,
      };

      it("should initialize fixed inputs with correct values", () => {
        const { result } = renderHook(() =>
          useInteractiveTableLogic(propsWithFixed)
        );

        const state = result.current.savedState as any;
        // Row 0: 'a' is fixed at 2, 'b' is empty
        expect(state.challengeStates[0].inputs.a).toBe("2");
        expect(state.challengeStates[0].inputs.b).toBe("");

        // Row 1: Both are fixed
        expect(state.challengeStates[1].inputs.a).toBe("5");
        expect(state.challengeStates[1].inputs.b).toBe("5");

        // Row 2: Both are empty (no fixed inputs)
        expect(state.challengeStates[2].inputs.a).toBe("");
        expect(state.challengeStates[2].inputs.b).toBe("");
      });

      it("should not allow changing fixed inputs", () => {
        const { result } = renderHook(() =>
          useInteractiveTableLogic(propsWithFixed)
        );

        // Try to change the fixed input 'a' in row 0
        act(() => {
          result.current.handleUserInputChange(0, "99", "a");
        });

        const state = result.current.savedState as any;
        // Value should remain unchanged
        expect(state.challengeStates[0].inputs.a).toBe("2");
      });

      it("should allow changing non-fixed inputs in rows with mixed fixed/editable inputs", () => {
        const { result } = renderHook(() =>
          useInteractiveTableLogic(propsWithFixed)
        );

        // Change the editable input 'b' in row 0
        act(() => {
          result.current.handleUserInputChange(0, "5", "b");
        });

        const state = result.current.savedState as any;
        // 'b' should change
        expect(state.challengeStates[0].inputs.b).toBe("5");
        // 'a' should remain fixed
        expect(state.challengeStates[0].inputs.a).toBe("2");
      });

      it("should use fixed values when running the code", async () => {
        mockRunPythonCode.mockResolvedValue({
          success: true,
          stdout: "7",
          stderr: "",
          result: null,
          error: null,
        });

        const { result } = renderHook(() =>
          useInteractiveTableLogic(propsWithFixed)
        );

        // Set the editable input 'b' for row 0 (a=2 is fixed)
        act(() => {
          result.current.handleUserInputChange(0, "5", "b");
        });

        await act(async () => {
          await result.current.runRow(0);
        });

        // Should call with fixed 'a' value of 2 and editable 'b' value of 5
        expect(mockRunPythonCode).toHaveBeenCalledWith(
          "def add(a, b):\n  return a + b\n\nprint(add(2, 5))",
          undefined
        );
      });

      it("should run rows with all inputs fixed", async () => {
        mockRunPythonCode.mockResolvedValue({
          success: true,
          stdout: "10",
          stderr: "",
          result: null,
          error: null,
        });

        const { result } = renderHook(() =>
          useInteractiveTableLogic(propsWithFixed)
        );

        await act(async () => {
          await result.current.runRow(1); // Row 1 has both a=5 and b=5 fixed
        });

        expect(mockRunPythonCode).toHaveBeenCalledWith(
          "def add(a, b):\n  return a + b\n\nprint(add(5, 5))",
          undefined
        );

        const state = result.current.savedState as any;
        expect(state.challengeStates[1].actualOutput).toBe("10");
        expect(state.challengeStates[1].isCorrect).toBe(true);
      });

      it("should handle string fixed values correctly", () => {
        const stringFixedRows: CoverageTableRow[] = [
          { fixedInputs: { a: "hello" }, expectedOutput: "hello world" },
        ];

        const stringColumns: InputParam[] = [
          { variableName: "a", variableType: "string" },
          { variableName: "b", variableType: "string" },
        ];

        const stringProps = {
          ...coverageProps,
          columns: stringColumns,
          rows: stringFixedRows,
        };

        const { result } = renderHook(() =>
          useInteractiveTableLogic(stringProps)
        );

        const state = result.current.savedState as any;
        expect(state.challengeStates[0].inputs.a).toBe("hello");
      });
    });
  });

  describe("prediction mode", () => {
    it("should initialize with empty prediction state", () => {
      const { result } = renderHook(() =>
        useInteractiveTableLogic(predictionProps)
      );

      expect(result.current.savedState).toEqual({
        predictions: {
          0: { userAnswer: "", actualOutput: null, isCorrect: null },
          1: { userAnswer: "", actualOutput: null, isCorrect: null },
        },
      });
    });

    it("should handle user answer change for prediction mode", () => {
      const { result } = renderHook(() =>
        useInteractiveTableLogic(predictionProps)
      );

      act(() => {
        result.current.handleUserInputChange(0, "5");
      });

      const state = result.current.savedState as any;
      expect(state.predictions[0].userAnswer).toBe("5");
    });

    it("should run prediction row and check correctness", async () => {
      mockRunPythonCode.mockResolvedValue({
        success: true,
        stdout: "5",
        stderr: "",
        result: null,
        error: null,
      });

      const { result } = renderHook(() =>
        useInteractiveTableLogic(predictionProps)
      );

      act(() => {
        result.current.handleUserInputChange(0, "5");
      });

      await act(async () => {
        await result.current.runRow(0);
      });

      expect(mockRunPythonCode).toHaveBeenCalledWith(
        "def add(a, b):\n  return a + b\n\nprint(add(2, 3))",
        undefined
      );

      const state = result.current.savedState as any;
      expect(state.predictions[0].actualOutput).toBe("5");
      expect(state.predictions[0].isCorrect).toBe(true);
    });

    it("should mark prediction as incorrect when answer doesn't match", async () => {
      mockRunPythonCode.mockResolvedValue({
        success: true,
        stdout: "5",
        stderr: "",
        result: null,
        error: null,
      });

      const { result } = renderHook(() =>
        useInteractiveTableLogic(predictionProps)
      );

      act(() => {
        result.current.handleUserInputChange(0, "10");
      });

      await act(async () => {
        await result.current.runRow(0);
      });

      const state = result.current.savedState as any;
      expect(state.predictions[0].actualOutput).toBe("5");
      expect(state.predictions[0].isCorrect).toBe(false);
    });

    it("should handle Python errors in prediction mode", async () => {
      mockRunPythonCode.mockResolvedValue({
        success: false,
        stdout: "",
        stderr: "",
        result: null,
        error: {
          type: "TypeError",
          message: "unsupported operand type(s)",
        },
      });

      const { result } = renderHook(() =>
        useInteractiveTableLogic(predictionProps)
      );

      act(() => {
        result.current.handleUserInputChange(0, "5");
      });

      await act(async () => {
        await result.current.runRow(0);
      });

      const state = result.current.savedState as any;
      expect(state.predictions[0].actualOutput).toContain("Error:");
      expect(state.predictions[0].isCorrect).toBe(false);
    });

    it("should reset correctness when user answer changes", () => {
      const { result } = renderHook(() =>
        useInteractiveTableLogic(predictionProps)
      );

      act(() => {
        result.current.handleUserInputChange(0, "new answer");
      });

      const state = result.current.savedState as any;
      expect(state.predictions[0].isCorrect).toBe(null);
      expect(state.predictions[0].actualOutput).toBe(null);
    });

    it("should trim whitespace when comparing predictions", async () => {
      mockRunPythonCode.mockResolvedValue({
        success: true,
        stdout: "  5  ",
        stderr: "",
        result: null,
        error: null,
      });

      const { result } = renderHook(() =>
        useInteractiveTableLogic(predictionProps)
      );

      act(() => {
        result.current.handleUserInputChange(0, "  5  ");
      });

      await act(async () => {
        await result.current.runRow(0);
      });

      const state = result.current.savedState as any;
      expect(state.predictions[0].isCorrect).toBe(true);
    });

    it("should handle None output", async () => {
      mockRunPythonCode.mockResolvedValue({
        success: true,
        stdout: "",
        stderr: "",
        result: null,
        error: null,
      });

      const { result } = renderHook(() =>
        useInteractiveTableLogic(predictionProps)
      );

      act(() => {
        result.current.handleUserInputChange(0, "None");
      });

      await act(async () => {
        await result.current.runRow(0);
      });

      const state = result.current.savedState as any;
      expect(state.predictions[0].actualOutput).toBe("None");
      expect(state.predictions[0].isCorrect).toBe(true);
    });
  });

  describe("common functionality", () => {
    it("should track running state during execution", async () => {
      let resolvePromise: any;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockRunPythonCode.mockReturnValue(promise);

      const { result } = renderHook(() =>
        useInteractiveTableLogic(predictionProps)
      );

      act(() => {
        result.current.handleUserInputChange(0, "5");
        result.current.runRow(0);
      });

      expect(result.current.runningStates[0]).toBe(true);

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

      expect(result.current.runningStates[0]).toBe(false);
    });

    it("should handle exception thrown during execution", async () => {
      mockRunPythonCode.mockRejectedValue(new Error("Pyodide crash"));

      const { result } = renderHook(() =>
        useInteractiveTableLogic(predictionProps)
      );

      act(() => {
        result.current.handleUserInputChange(0, "5");
      });

      await act(async () => {
        await result.current.runRow(0);
      });

      const state = result.current.savedState as any;
      expect(state.predictions[0].actualOutput).toContain(
        "Error: Pyodide crash"
      );
      expect(state.predictions[0].isCorrect).toBe(false);
    });

    it("should handle Pyodide loading state", () => {
      mockedUsePyodide.mockReturnValue({
        runPythonCode: mockRunPythonCode,
        isLoading: true,
        error: null,
        loadPackages: vi.fn(),
      });

      const { result } = renderHook(() =>
        useInteractiveTableLogic(predictionProps)
      );

      expect(result.current.isLoading).toBe(true);
    });

    it("should handle Pyodide error", () => {
      mockedUsePyodide.mockReturnValue({
        runPythonCode: mockRunPythonCode,
        isLoading: false,
        error: new Error("Pyodide failed to load"),
        loadPackages: vi.fn(),
      });

      const { result } = renderHook(() =>
        useInteractiveTableLogic(predictionProps)
      );

      expect(result.current.pyodideError?.message).toBe(
        "Pyodide failed to load"
      );
    });

    it("should handle multiple rows independently", async () => {
      mockRunPythonCode
        .mockResolvedValueOnce({
          success: true,
          stdout: "5",
          stderr: "",
          result: null,
          error: null,
        })
        .mockResolvedValueOnce({
          success: true,
          stdout: "10",
          stderr: "",
          result: null,
          error: null,
        });

      const { result } = renderHook(() =>
        useInteractiveTableLogic(predictionProps)
      );

      act(() => {
        result.current.handleUserInputChange(0, "5");
        result.current.handleUserInputChange(1, "10");
      });

      await act(async () => {
        await result.current.runRow(0);
      });

      await act(async () => {
        await result.current.runRow(1);
      });

      const state = result.current.savedState as any;
      expect(state.predictions[0].actualOutput).toBe("5");
      expect(state.predictions[0].isCorrect).toBe(true);
      expect(state.predictions[1].actualOutput).toBe("10");
      expect(state.predictions[1].isCorrect).toBe(true);
    });

    it("should handle empty function output", async () => {
      mockRunPythonCode.mockResolvedValue({
        success: true,
        stdout: "",
        stderr: "",
        result: null,
        error: null,
      });

      const { result } = renderHook(() =>
        useInteractiveTableLogic(predictionProps)
      );

      act(() => {
        result.current.handleUserInputChange(0, "None");
      });

      await act(async () => {
        await result.current.runRow(0);
      });

      const state = result.current.savedState as any;
      // Empty stdout gets converted to "None"
      expect(state.predictions[0].actualOutput).toBe("None");
      expect(state.predictions[0].isCorrect).toBe(true);
    });
  });
});
