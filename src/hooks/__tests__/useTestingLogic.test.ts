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
      // Each test is self-contained - no separate setup step
      mockRunPythonCode
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
        defaultProps.sectionId,
        undefined,
        "def add(a, b):\n    return a + b"
      );
    });

    it("should mark tests as failed when function returns wrong value", async () => {
      mockRunPythonCode.mockResolvedValueOnce({
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
      // When function is not defined, the test script itself returns an error in JSON
      mockRunPythonCode.mockResolvedValueOnce({
        success: true,
        stdout: JSON.stringify({
          success: false,
          error: "Function 'add' is not defined.",
          input: [2, 3],
          expected: 5,
        }),
        stderr: "",
        error: null,
        result: null,
      });

      const { result } = renderHook(() => useTestingLogic(defaultProps));

      await act(async () => {
        await result.current.runTests("# no function defined");
      });

      expect(result.current.testResults).toHaveLength(1);
      expect(result.current.testResults![0].passed).toBe(false);
      expect(result.current.testResults![0].actual).toContain(
        "Function 'add' is not defined"
      );
    });

    it("should handle runtime errors in test execution", async () => {
      mockRunPythonCode.mockResolvedValueOnce({
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
      // Each test is self-contained - no separate setup step
      mockRunPythonCode
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
        procedureProps.sectionId,
        undefined,
        'def greet(name):\n    print(f"Hello, {name}!")'
      );
    });

    it("should mark tests as failed when function prints wrong value", async () => {
      mockRunPythonCode.mockResolvedValueOnce({
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
      // When function is not defined, the test script itself returns an error in JSON
      mockRunPythonCode.mockResolvedValueOnce({
        success: true,
        stdout: JSON.stringify({
          success: false,
          error: "Function 'greet' is not defined.",
          input: ["Alice"],
          expected: "Hello, Alice!",
        }),
        stderr: "",
        error: null,
        result: null,
      });

      const { result } = renderHook(() => useTestingLogic(procedureProps));

      await act(async () => {
        await result.current.runTests("# no function defined");
      });

      expect(result.current.testResults).toHaveLength(1);
      expect(result.current.testResults![0].passed).toBe(false);
      expect(result.current.testResults![0].actual).toContain(
        "Function 'greet' is not defined"
      );
    });

    it("should handle runtime errors in test execution", async () => {
      mockRunPythonCode.mockResolvedValueOnce({
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
      // Each test is self-contained - no separate setup step
      mockRunPythonCode.mockResolvedValueOnce({
        success: true,
        stdout: "invalid json {",
        stderr: "",
        error: null,
        result: null,
      });
      // Note: Second test is not mocked because stop-on-failure means it won't run

      const { result } = renderHook(() => useTestingLogic(defaultProps));

      await act(async () => {
        await result.current.runTests("def add(a, b):\n    return a + b");
      });

      expect(result.current.testResults).not.toBeNull();
      expect(result.current.testResults![0].passed).toBe(false);
      expect(result.current.testResults![0].actual).toContain("Parse error");
    });

    it("should handle Pyodide execution errors", async () => {
      mockRunPythonCode.mockResolvedValueOnce({
        success: false,
        stdout: "",
        stderr: "",
        error: {
          type: "PythonError",
          message: "Pyodide internal error",
        },
        result: null,
      });
      // Note: Second test is not mocked because stop-on-failure means it won't run

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
      // Each test is self-contained - no separate setup step
      mockRunPythonCode
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
      mockRunPythonCode.mockResolvedValueOnce({
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
        });
        await promise;
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("should not complete section if not all tests pass", async () => {
      // Each test is self-contained - no separate setup step
      mockRunPythonCode
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

  describe("isolation and error formatting", () => {
    it("should display error with exception type (not generic 'Error:')", async () => {
      // Simulates Python returning "IndentationError: expected an indented block"
      mockRunPythonCode.mockResolvedValueOnce({
        success: true,
        stdout: JSON.stringify({
          success: false,
          error:
            "IndentationError: expected an indented block after function definition on line 1",
          input: [2, 3],
          expected: 5,
        }),
        stderr: "",
        error: null,
        result: null,
      });

      const { result } = renderHook(() => useTestingLogic(defaultProps));

      await act(async () => {
        await result.current.runTests("def add(a, b):\nreturn a + b"); // Missing indent
      });

      expect(result.current.testResults![0].passed).toBe(false);
      // Should show "IndentationError:" not just "Error:"
      expect(result.current.testResults![0].actual).toContain(
        "IndentationError:"
      );
      expect(result.current.testResults![0].actual).not.toMatch(/^Error:/);
    });

    it("should display NameError with exception type", async () => {
      mockRunPythonCode.mockResolvedValueOnce({
        success: true,
        stdout: JSON.stringify({
          success: false,
          error: "NameError: name 'undefined_var' is not defined",
          input: [2, 3],
          expected: 5,
        }),
        stderr: "",
        error: null,
        result: null,
      });

      const { result } = renderHook(() => useTestingLogic(defaultProps));

      await act(async () => {
        await result.current.runTests(
          "def add(a, b):\n    return undefined_var"
        );
      });

      expect(result.current.testResults![0].actual).toContain("NameError:");
    });

    it("should isolate state between consecutive test cases", async () => {
      // Test 1 passes, test 2 should NOT see any variables from test 1
      // This verifies each test runs in its own _user_globals namespace
      mockRunPythonCode
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
        // Code that might leave state if not isolated
        await result.current.runTests(
          "leaked_var = 999\ndef add(a, b):\n    return a + b"
        );
      });

      // Both tests should pass - if isolation failed, test 2 might see leaked_var
      expect(result.current.testResults).toHaveLength(2);
      expect(result.current.testResults![0].passed).toBe(true);
      expect(result.current.testResults![1].passed).toBe(true);

      // Verify runPythonCode was called twice (once per test, not once for setup + once per test)
      expect(mockRunPythonCode).toHaveBeenCalledTimes(2);
    });

    it("should not capture output from example function calls in user code (procedure mode)", async () => {
      const procedureProps = {
        unitId: "unit-1" as UnitId,
        lessonId: "lesson-1" as LessonId,
        sectionId: "section-1" as SectionId,
        testMode: "procedure" as const,
        functionToTest: "greet",
        testCases: [
          {
            input: ["Alice"],
            expected: "Hello, Alice!",
            description: "greets Alice",
          },
        ] as TestCase[],
      };

      // The test harness should clear output buffer after exec'ing user code,
      // so example calls like greet("Example") don't pollute the test output
      mockRunPythonCode.mockResolvedValueOnce({
        success: true,
        stdout: JSON.stringify({
          success: true,
          actual: "Hello, Alice!", // Only from test call, not from example calls
          expected: "Hello, Alice!",
          input: ["Alice"],
          passed: true,
        }),
        stderr: "",
        error: null,
        result: null,
      });

      const { result } = renderHook(() => useTestingLogic(procedureProps));

      await act(async () => {
        // User code includes example calls at bottom that should NOT affect test output
        const userCode = `def greet(name):
    print(f"Hello, {name}!")

# Example calls that should be ignored by tests
greet("Example1")
greet("Example2")`;
        await result.current.runTests(userCode);
      });

      expect(result.current.testResults![0].passed).toBe(true);
      expect(result.current.testResults![0].actual).toBe("Hello, Alice!");
      // Should NOT contain output from example calls
      expect(result.current.testResults![0].actual).not.toContain("Example1");
      expect(result.current.testResults![0].actual).not.toContain("Example2");
    });

    it("should generate test script with isolated namespace (exec with _user_globals)", async () => {
      mockRunPythonCode.mockResolvedValueOnce({
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
      });

      const { result } = renderHook(() => useTestingLogic(defaultProps));

      await act(async () => {
        await result.current.runTests("def add(a, b):\n    return a + b");
      });

      // Verify the generated script uses isolated namespace
      const generatedScript = mockRunPythonCode.mock.calls[0][0];
      expect(generatedScript).toContain("_user_globals = {}");
      expect(generatedScript).toContain("exec('''");
      expect(generatedScript).toContain("_user_globals)");
    });
  });
});
