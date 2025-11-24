import { renderHook, act, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useActiveTestSuite, ActiveTest } from "../useActiveTestSuite";
import { usePyodide } from "../../contexts/PyodideContext";
import * as localStorageUtils from "../../lib/localStorageUtils";
import type { UserId } from "../../types/data";

// --- Mocks Setup ---
vi.mock("../../contexts/PyodideContext");
vi.mock("../../lib/localStorageUtils");
vi.mock("uuid", () => ({
  v4: () => "mock-uuid-123", // Use a static ID for predictable tests
}));

const mockedUsePyodide = vi.mocked(usePyodide);
const mockedLoadProgress = vi.mocked(localStorageUtils.loadProgress);
const mockedSaveProgress = vi.mocked(localStorageUtils.saveProgress);

describe("useActiveTestSuite", () => {
  const runPythonCodeMock = vi.fn();
  const userId = "test-user" as UserId;

  beforeEach(() => {
    vi.clearAllMocks();
    // Provide a default mock for usePyodide
    mockedUsePyodide.mockReturnValue({
      runPythonCode: runPythonCodeMock,
      isLoading: false,
      error: null,
    });
    // Default mock for localStorage
    mockedLoadProgress.mockReturnValue([]);
  });

  it("should load initial tests from localStorage on mount", () => {
    const initialTests: ActiveTest[] = [
      {
        id: "1",
        name: "test_one",
        code: "def test_one(): pass",
        status: "pending",
      },
    ];
    mockedLoadProgress.mockReturnValue(initialTests);

    const { result } = renderHook(() => useActiveTestSuite(userId));

    expect(mockedLoadProgress).toHaveBeenCalledWith(userId, expect.any(String));
    expect(result.current.activeTests).toEqual(initialTests);
  });

  it("should add a new test to the suite via addTestToSuite", () => {
    const { result } = renderHook(() => useActiveTestSuite(userId));

    act(() => {
      result.current.addTestToSuite("def test_new():\n  assert 1 == 1");
    });

    expect(result.current.activeTests).toHaveLength(1);
    expect(result.current.activeTests[0]).toEqual({
      id: "mock-uuid-123",
      name: "test_new",
      code: "def test_new():\n  assert 1 == 1",
      status: "pending",
      output: "",
    });
  });

  it("should delete a test from the suite via deleteTestFromSuite", () => {
    const initialTests: ActiveTest[] = [
      { id: "1", name: "test_one", code: "code1", status: "pending" },
      { id: "2", name: "test_two", code: "code2", status: "pending" },
    ];
    mockedLoadProgress.mockReturnValue(initialTests);

    const { result } = renderHook(() => useActiveTestSuite(userId));

    act(() => {
      result.current.deleteTestFromSuite("1");
    });

    expect(result.current.activeTests).toHaveLength(1);
    expect(result.current.activeTests[0].id).toBe("2");
  });

  it("should save tests to localStorage whenever they change", () => {
    const { result } = renderHook(() => useActiveTestSuite(userId));

    act(() => {
      result.current.addTestToSuite("def test_save(): pass");
    });

    expect(mockedSaveProgress).toHaveBeenCalledWith(
      userId,
      expect.any(String), // The storage key
      expect.any(Array) // The array of tests
    );
  });

  describe("runActiveTests", () => {
    // Each test now runs mainCode + testCode in a single combined script
    it("should execute all active tests and update their status to passed", async () => {
      const { result } = renderHook(() => useActiveTestSuite(userId));
      act(() => {
        result.current.addTestToSuite("def test_passing(): pass");
      });

      // Single combined script execution per test
      runPythonCodeMock.mockResolvedValueOnce({
        success: true,
        stdout: `===PYTEST_SINGLE_RESULT_JSON===\n${JSON.stringify({
          name: "test_passing",
          status: "PASSED",
          output: "",
        })}\n===END_PYTEST_SINGLE_RESULT_JSON===`,
        stderr: "",
        result: null,
        error: null,
      });

      await act(async () => {
        await result.current.runActiveTests("main_code = True");
      });

      await waitFor(() => {
        expect(result.current.isRunningTests).toBe(false);
      });

      expect(result.current.activeTests[0].status).toBe("passed");
      expect(result.current.activeTests[0].output).toBe("");
    });

    it("should mark a test as failed if it returns a FAILED status", async () => {
      const { result } = renderHook(() => useActiveTestSuite(userId));
      act(() => {
        result.current.addTestToSuite("def test_failing(): assert False");
      });

      // Single combined script execution per test
      runPythonCodeMock.mockResolvedValueOnce({
        success: true,
        stdout: `===PYTEST_SINGLE_RESULT_JSON===\n${JSON.stringify({
          name: "test_failing",
          status: "FAILED",
          output: "AssertionError: assert False",
        })}\n===END_PYTEST_SINGLE_RESULT_JSON===`,
        stderr: "",
        result: null,
        error: null,
      });

      await act(async () => {
        await result.current.runActiveTests("main_code = True");
      });

      await waitFor(() => {
        expect(result.current.activeTests[0].status).toBe("failed");
      });
      expect(result.current.activeTests[0].output).toContain("AssertionError");
    });

    it("should mark test as error if the main code has a syntax error", async () => {
      const { result } = renderHook(() => useActiveTestSuite(userId));
      act(() => {
        result.current.addTestToSuite("def test_one(): pass");
      });

      // Main code error is now caught inside the combined script
      runPythonCodeMock.mockResolvedValueOnce({
        success: true,
        stdout: `===PYTEST_SINGLE_RESULT_JSON===\n${JSON.stringify({
          name: "test_one",
          status: "ERROR",
          output: "SyntaxError: invalid syntax",
        })}\n===END_PYTEST_SINGLE_RESULT_JSON===`,
        stderr: "",
        result: null,
        error: null,
      });

      await act(async () => {
        await result.current.runActiveTests("invalid main code");
      });

      await waitFor(() => {
        expect(result.current.isRunningTests).toBe(false);
      });

      expect(result.current.activeTests[0].status).toBe("error");
      expect(result.current.activeTests[0].output).toContain("SyntaxError");
    });

    it("should allow test code to access mainCode definitions via shared namespace", async () => {
      const { result } = renderHook(() => useActiveTestSuite(userId));
      act(() => {
        // Test code references greet() which is defined in mainCode
        result.current.addTestToSuite(
          'def test_greet():\n  assert greet("World") == "Hello, World!"'
        );
      });

      // Single combined script execution - mainCode and testCode share namespace
      runPythonCodeMock.mockResolvedValueOnce({
        success: true,
        stdout: `===PYTEST_SINGLE_RESULT_JSON===\n${JSON.stringify({
          name: "test_greet",
          status: "PASSED",
          output: "",
        })}\n===END_PYTEST_SINGLE_RESULT_JSON===`,
        stderr: "",
        result: null,
        error: null,
      });

      await act(async () => {
        // mainCode defines greet(), testCode should be able to call it
        await result.current.runActiveTests(
          'def greet(name):\n  return f"Hello, {name}!"'
        );
      });

      await waitFor(() => {
        expect(result.current.isRunningTests).toBe(false);
      });

      expect(result.current.activeTests[0].status).toBe("passed");
    });

    it("should generate combined script with isolated namespace", async () => {
      const { result } = renderHook(() => useActiveTestSuite(userId));
      act(() => {
        result.current.addTestToSuite("def test_foo(): pass");
      });

      runPythonCodeMock.mockResolvedValueOnce({
        success: true,
        stdout: `===PYTEST_SINGLE_RESULT_JSON===\n${JSON.stringify({
          name: "test_foo",
          status: "PASSED",
          output: "",
        })}\n===END_PYTEST_SINGLE_RESULT_JSON===`,
        stderr: "",
        result: null,
        error: null,
      });

      await act(async () => {
        await result.current.runActiveTests("x = 1");
      });

      // Verify the generated script uses isolated namespace
      const generatedScript = runPythonCodeMock.mock.calls[0][0];
      expect(generatedScript).toContain("_test_globals = {}");
      expect(generatedScript).toContain("exec('''");
      expect(generatedScript).toContain("_test_globals)");
    });

    it("should run multiple tests independently", async () => {
      // Load initial tests via localStorage mock (avoids uuid issues)
      const initialTests: ActiveTest[] = [
        {
          id: "1",
          name: "test_one",
          code: "def test_one(): pass",
          status: "pending",
        },
        {
          id: "2",
          name: "test_two",
          code: "def test_two(): assert False",
          status: "pending",
        },
      ];
      mockedLoadProgress.mockReturnValue(initialTests);

      const { result } = renderHook(() => useActiveTestSuite(userId));

      // First test passes
      runPythonCodeMock.mockResolvedValueOnce({
        success: true,
        stdout: `===PYTEST_SINGLE_RESULT_JSON===\n${JSON.stringify({
          name: "test_one",
          status: "PASSED",
          output: "",
        })}\n===END_PYTEST_SINGLE_RESULT_JSON===`,
        stderr: "",
        result: null,
        error: null,
      });

      // Second test fails (but should still run - not stop-on-failure like TestingSection)
      runPythonCodeMock.mockResolvedValueOnce({
        success: true,
        stdout: `===PYTEST_SINGLE_RESULT_JSON===\n${JSON.stringify({
          name: "test_two",
          status: "FAILED",
          output: "AssertionError",
        })}\n===END_PYTEST_SINGLE_RESULT_JSON===`,
        stderr: "",
        result: null,
        error: null,
      });

      await act(async () => {
        await result.current.runActiveTests("main_code = True");
      });

      await waitFor(() => {
        expect(result.current.isRunningTests).toBe(false);
      });

      // Both tests should have run
      expect(runPythonCodeMock).toHaveBeenCalledTimes(2);
      expect(result.current.activeTests[0].status).toBe("passed");
      expect(result.current.activeTests[1].status).toBe("failed");
    });
  });
});
