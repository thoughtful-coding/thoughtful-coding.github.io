import { renderHook, act, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useTestingLogic } from "../useTestingLogic";
import { usePyodide } from "../../contexts/PyodideContext";
import { useProgressActions } from "../../stores/progressStore";
import type { TestCase, UnitId, LessonId, SectionId } from "../../types/data";

// Mock dependencies
vi.mock("../../contexts/PyodideContext");
vi.mock("../../stores/progressStore");

const mockRunPythonCode = vi.fn();
const mockCompleteSection = vi.fn();
const mockIncrementAttemptCounter = vi.fn();
const mockedUsePyodide = vi.mocked(usePyodide);
const mockedUseProgressActions = vi.mocked(useProgressActions);

describe("useTestingLogic", () => {
  const defaultProps = {
    unitId: "unit-1" as UnitId,
    lessonId: "lesson-1" as LessonId,
    sectionId: "section-1" as SectionId,
    testMode: "function" as const,
    functionToTest: "add",
    testCases: [
      { input: [2, 3], expected: 5, description: "adds 2 and 3" },
      { input: [5, 10], expected: 15, description: "adds 5 and 10" },
    ] as TestCase[],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.error to suppress error logging in tests
    vi.spyOn(console, "error").mockImplementation(() => {});

    mockedUsePyodide.mockReturnValue({
      runPythonCode: mockRunPythonCode,
      isLoading: false,
      error: null,
      loadPackages: vi.fn(),
    });

    mockedUseProgressActions.mockReturnValue({
      completeSection: mockCompleteSection,
      incrementAttemptCounter: mockIncrementAttemptCounter,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("function testing mode", () => {
    it("should run tests for a function and mark all as passed", async () => {
      mockRunPythonCode
        .mockResolvedValueOnce({
          success: true,
          stdout: "Setup complete",
          stderr: "",
          error: null,
          result: null,
        })
        .mockResolvedValueOnce({
          success: true,
          stdout: JSON.stringify({
            success: true,
            actual: 5,
            expected: 5,
            input: [2, 3],
            passed: true,
          }),
          stderr: "",
          error: null,
          result: null,
        })
        .mockResolvedValueOnce({
          success: true,
          stdout: JSON.stringify({
            success: true,
            actual: 15,
            expected: 15,
            input: [5, 10],
            passed: true,
          }),
          stderr: "",
          error: null,
          result: null,
        });

      const { result } = renderHook(() => useTestingLogic(defaultProps));

      await act(async () => {
        await result.current.runTests("def add(a, b):\n    return a + b");
      });

      expect(result.current.testResults).toHaveLength(2);
      expect(result.current.testResults![0].passed).toBe(true);
      expect(result.current.testResults![1].passed).toBe(true);
      expect(mockCompleteSection).toHaveBeenCalledWith(
        defaultProps.unitId,
        defaultProps.lessonId,
        defaultProps.sectionId
      );
    });

    it("should mark tests as failed when function returns wrong value", async () => {
      mockRunPythonCode
        .mockResolvedValueOnce({
          success: true,
          stdout: "Setup complete",
          stderr: "",
          error: null,
          result: null,
        })
        .mockResolvedValueOnce({
          success: true,
          stdout: JSON.stringify({
            success: true,
            actual: 6,
            expected: 5,
            input: [2, 3],
            passed: false,
          }),
          stderr: "",
          error: null,
          result: null,
        });
      // Note: Second test is not mocked because stop-on-failure means it won't run

      const { result } = renderHook(() => useTestingLogic(defaultProps));

      await act(async () => {
        await result.current.runTests("def add(a, b):\n    return a * b");
      });

      // Only first test runs due to stop-on-failure
      expect(result.current.testResults).toHaveLength(1);
      expect(result.current.testResults![0].passed).toBe(false);
      expect(result.current.testResults![0].actual).toBe(6);
      expect(mockCompleteSection).not.toHaveBeenCalled();
    });

    it("should handle function not defined error", async () => {
      mockRunPythonCode.mockResolvedValueOnce({
        success: false,
        stdout: "",
        stderr: "",
        error: {
          type: "NameError",
          message: "Function 'add' is not defined.",
        },
        result: null,
      });

      const { result } = renderHook(() => useTestingLogic(defaultProps));

      await act(async () => {
        await result.current.runTests("# no function defined");
      });

      expect(result.current.error).toContain("Function 'add' is not defined");
    });

    it("should handle runtime errors in test execution", async () => {
      mockRunPythonCode
        .mockResolvedValueOnce({
          success: true,
          stdout: "Setup complete",
          stderr: "",
          error: null,
          result: null,
        })
        .mockResolvedValueOnce({
          success: true,
          stdout: JSON.stringify({
            success: false,
            error: "TypeError: unsupported operand type(s)",
            input: [2, 3],
            expected: 5,
          }),
          stderr: "",
          error: null,
          result: null,
        });
      // Note: Second test is not mocked because stop-on-failure means it won't run

      const { result } = renderHook(() => useTestingLogic(defaultProps));

      await act(async () => {
        await result.current.runTests(
          "def add(a, b):\n    return a + 'string'"
        );
      });

      // Only first test runs due to stop-on-failure
      expect(result.current.testResults).toHaveLength(1);
      expect(result.current.testResults![0].passed).toBe(false);
      expect(result.current.testResults![0].actual).toContain("Error:");
    });
  });

  describe("procedure testing mode", () => {
    const procedureProps = {
      ...defaultProps,
      testMode: "procedure" as const,
      functionToTest: "greet",
      testCases: [
        {
          input: ["Alice"],
          expected: "Hello, Alice!",
          description: "greets Alice",
        },
        { input: ["Bob"], expected: "Hello, Bob!", description: "greets Bob" },
      ] as TestCase[],
    };

    it("should run tests capturing stdout from function and mark all as passed", async () => {
      mockRunPythonCode
        .mockResolvedValueOnce({
          success: true,
          stdout: "Setup complete",
          stderr: "",
          error: null,
          result: null,
        })
        .mockResolvedValueOnce({
          success: true,
          stdout: JSON.stringify({
            success: true,
            actual: "Hello, Alice!",
            expected: "Hello, Alice!",
            input: ["Alice"],
            passed: true,
          }),
          stderr: "",
          error: null,
          result: null,
        })
        .mockResolvedValueOnce({
          success: true,
          stdout: JSON.stringify({
            success: true,
            actual: "Hello, Bob!",
            expected: "Hello, Bob!",
            input: ["Bob"],
            passed: true,
          }),
          stderr: "",
          error: null,
          result: null,
        });

      const { result } = renderHook(() => useTestingLogic(procedureProps));

      await act(async () => {
        await result.current.runTests(
          'def greet(name):\n    print(f"Hello, {name}!")'
        );
      });

      expect(result.current.testResults).toHaveLength(2);
      expect(result.current.testResults![0].passed).toBe(true);
      expect(result.current.testResults![1].passed).toBe(true);
      expect(mockCompleteSection).toHaveBeenCalledWith(
        procedureProps.unitId,
        procedureProps.lessonId,
        procedureProps.sectionId
      );
    });

    it("should mark tests as failed when function prints wrong value", async () => {
      mockRunPythonCode
        .mockResolvedValueOnce({
          success: true,
          stdout: "Setup complete",
          stderr: "",
          error: null,
          result: null,
        })
        .mockResolvedValueOnce({
          success: true,
          stdout: JSON.stringify({
            success: true,
            actual: "Goodbye, Alice!",
            expected: "Hello, Alice!",
            input: ["Alice"],
            passed: false,
          }),
          stderr: "",
          error: null,
          result: null,
        });
      // Note: Second test is not mocked because stop-on-failure means it won't run

      const { result } = renderHook(() => useTestingLogic(procedureProps));

      await act(async () => {
        await result.current.runTests(
          'def greet(name):\n    print(f"Goodbye, {name}!")'
        );
      });

      // Only first test runs due to stop-on-failure
      expect(result.current.testResults).toHaveLength(1);
      expect(result.current.testResults![0].passed).toBe(false);
      expect(result.current.testResults![0].actual).toBe("Goodbye, Alice!");
      expect(mockCompleteSection).not.toHaveBeenCalled();
    });

    it("should handle function not defined error", async () => {
      mockRunPythonCode.mockResolvedValueOnce({
        success: false,
        stdout: "",
        stderr: "",
        error: {
          type: "NameError",
          message: "Function 'greet' is not defined.",
        },
        result: null,
      });

      const { result } = renderHook(() => useTestingLogic(procedureProps));

      await act(async () => {
        await result.current.runTests("# no function defined");
      });

      expect(result.current.error).toContain("Function 'greet' is not defined");
    });

    it("should handle runtime errors in test execution", async () => {
      mockRunPythonCode
        .mockResolvedValueOnce({
          success: true,
          stdout: "Setup complete",
          stderr: "",
          error: null,
          result: null,
        })
        .mockResolvedValueOnce({
          success: true,
          stdout: JSON.stringify({
            success: false,
            error: "TypeError: unsupported operand type(s)",
            input: ["Alice"],
            expected: "Hello, Alice!",
          }),
          stderr: "",
          error: null,
          result: null,
        });
      // Note: Second test is not mocked because stop-on-failure means it won't run

      const { result } = renderHook(() => useTestingLogic(procedureProps));

      await act(async () => {
        await result.current.runTests(
          "def greet(name):\n    print(name + 123)"
        );
      });

      // Only first test runs due to stop-on-failure
      expect(result.current.testResults).toHaveLength(1);
      expect(result.current.testResults![0].passed).toBe(false);
      expect(result.current.testResults![0].actual).toContain("Error:");
    });
  });

  describe("__main__ testing (procedure mode)", () => {
    const mainProps = {
      ...defaultProps,
      testMode: "procedure" as const,
      functionToTest: "__main__",
      testCases: [
        {
          input: null,
          expected: "Hello, World!",
          description: "prints greeting",
        },
      ] as TestCase[],
    };

    it("should test program output", async () => {
      mockRunPythonCode.mockResolvedValueOnce({
        success: true,
        stdout: JSON.stringify({
          success: true,
          actual: "Hello, World!",
          expected: "Hello, World!",
          passed: true,
        }),
        stderr: "",
        error: null,
        result: null,
      });

      const { result } = renderHook(() => useTestingLogic(mainProps));

      await act(async () => {
        await result.current.runTests('print("Hello, World!")');
      });

      expect(result.current.testResults).toHaveLength(1);
      expect(result.current.testResults![0].passed).toBe(true);
      expect(mockCompleteSection).toHaveBeenCalled();
    });

    it("should detect incorrect program output", async () => {
      mockRunPythonCode.mockResolvedValueOnce({
        success: true,
        stdout: JSON.stringify({
          success: true,
          actual: "Goodbye!",
          expected: "Hello, World!",
          passed: false,
        }),
        stderr: "",
        error: null,
        result: null,
      });

      const { result } = renderHook(() => useTestingLogic(mainProps));

      await act(async () => {
        await result.current.runTests('print("Goodbye!")');
      });

      expect(result.current.testResults![0].passed).toBe(false);
      expect(mockCompleteSection).not.toHaveBeenCalled();
    });

    it("should handle execution errors in __main__ mode", async () => {
      mockRunPythonCode.mockResolvedValueOnce({
        success: true,
        stdout: JSON.stringify({
          success: false,
          error: "NameError: name 'undefined_var' is not defined",
          actual: "",
          expected: "Hello, World!",
        }),
        stderr: "",
        error: null,
        result: null,
      });

      const { result } = renderHook(() => useTestingLogic(mainProps));

      await act(async () => {
        await result.current.runTests("print(undefined_var)");
      });

      expect(result.current.testResults![0].passed).toBe(false);
      expect(result.current.testResults![0].actual).toContain("Error:");
    });
  });

  describe("edge cases", () => {
    it("should handle JSON parse errors", async () => {
      mockRunPythonCode
        .mockResolvedValueOnce({
          success: true,
          stdout: "Setup complete",
          stderr: "",
          error: null,
          result: null,
        })
        .mockResolvedValueOnce({
          success: true,
          stdout: "invalid json {",
          stderr: "",
          error: null,
          result: null,
        })
        .mockResolvedValueOnce({
          success: true,
          stdout: JSON.stringify({
            success: true,
            actual: 15,
            expected: 15,
            input: [5, 10],
            passed: true,
          }),
          stderr: "",
          error: null,
          result: null,
        });

      const { result } = renderHook(() => useTestingLogic(defaultProps));

      await act(async () => {
        await result.current.runTests("def add(a, b):\n    return a + b");
      });

      expect(result.current.testResults).not.toBeNull();
      expect(result.current.testResults![0].passed).toBe(false);
      expect(result.current.testResults![0].actual).toContain("Parse error");
    });

    it("should handle Pyodide execution errors", async () => {
      mockRunPythonCode
        .mockResolvedValueOnce({
          success: true,
          stdout: "Setup complete",
          stderr: "",
          error: null,
          result: null,
        })
        .mockResolvedValueOnce({
          success: false,
          stdout: "",
          stderr: "",
          error: {
            type: "PythonError",
            message: "Pyodide internal error",
          },
          result: null,
        })
        .mockResolvedValueOnce({
          success: true,
          stdout: JSON.stringify({
            success: true,
            actual: 15,
            expected: 15,
            input: [5, 10],
            passed: true,
          }),
          stderr: "",
          error: null,
          result: null,
        });

      const { result } = renderHook(() => useTestingLogic(defaultProps));

      await act(async () => {
        await result.current.runTests("def add(a, b):\n    return a + b");
      });

      expect(result.current.testResults).not.toBeNull();
      expect(result.current.testResults![0].passed).toBe(false);
      expect(result.current.testResults![0].actual).toContain(
        "Execution error"
      );
    });

    it("should reset state when running new tests", async () => {
      mockRunPythonCode
        .mockResolvedValueOnce({
          success: true,
          stdout: "Setup complete",
          stderr: "",
          error: null,
          result: null,
        })
        .mockResolvedValueOnce({
          success: true,
          stdout: JSON.stringify({
            success: true,
            actual: 5,
            expected: 5,
            input: [2, 3],
            passed: true,
          }),
          stderr: "",
          error: null,
          result: null,
        })
        .mockResolvedValueOnce({
          success: true,
          stdout: JSON.stringify({
            success: true,
            actual: 15,
            expected: 15,
            input: [5, 10],
            passed: true,
          }),
          stderr: "",
          error: null,
          result: null,
        });

      const { result } = renderHook(() => useTestingLogic(defaultProps));

      await act(async () => {
        await result.current.runTests("def add(a, b):\n    return a + b");
      });

      expect(result.current.testResults).toHaveLength(2);
      expect(result.current.error).toBeFalsy();

      // Run again
      mockRunPythonCode
        .mockResolvedValueOnce({
          success: true,
          stdout: "Setup complete",
          stderr: "",
          error: null,
          result: null,
        })
        .mockResolvedValueOnce({
          success: true,
          stdout: JSON.stringify({
            success: false,
            error: "some error",
            input: [2, 3],
            expected: 5,
          }),
          stderr: "",
          error: null,
          result: null,
        });
      // Note: Second test is not mocked because stop-on-failure means it won't run

      await act(async () => {
        await result.current.runTests("def add(a, b):\n    return a + b");
      });

      // Only first test runs due to stop-on-failure
      expect(result.current.testResults).toHaveLength(1);
      expect(result.current.testResults![0].passed).toBe(false);
    });

    it("should track isLoading state during execution", async () => {
      let resolvePromise: any;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockRunPythonCode.mockReturnValue(promise);

      const { result } = renderHook(() => useTestingLogic(defaultProps));

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.runTests("def add(a, b):\n    return a + b");
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise({
          success: true,
          stdout: "Setup complete",
          stderr: "",
          error: null,
          result: null,
        });
        await promise;
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("should not complete section if not all tests pass", async () => {
      mockRunPythonCode
        .mockResolvedValueOnce({
          success: true,
          stdout: "Setup complete",
          stderr: "",
          error: null,
          result: null,
        })
        .mockResolvedValueOnce({
          success: true,
          stdout: JSON.stringify({
            success: true,
            actual: 5,
            expected: 5,
            input: [2, 3],
            passed: true,
          }),
          stderr: "",
          error: null,
          result: null,
        })
        .mockResolvedValueOnce({
          success: true,
          stdout: JSON.stringify({
            success: true,
            actual: 10,
            expected: 15,
            input: [5, 10],
            passed: false,
          }),
          stderr: "",
          error: null,
          result: null,
        });

      const { result } = renderHook(() => useTestingLogic(defaultProps));

      await act(async () => {
        await result.current.runTests("def add(a, b):\n    return a + b");
      });

      expect(mockCompleteSection).not.toHaveBeenCalled();
    });
  });
});
