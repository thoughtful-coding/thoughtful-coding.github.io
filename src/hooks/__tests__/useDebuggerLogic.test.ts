import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useDebuggerLogic } from "../useDebuggerLogic";
import { usePyodide } from "../../contexts/PyodideContext";
import type { PythonExecutionPayload } from "../useDebuggerLogic";

// Mock dependencies
vi.mock("../../contexts/PyodideContext");

const mockRunPythonCode = vi.fn();
const mockedUsePyodide = vi.mocked(usePyodide);

describe("useDebuggerLogic", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUsePyodide.mockReturnValue({
      pyodide: {} as any,
      runPythonCode: mockRunPythonCode,
      isLoading: false,
      isInitializing: false,
      error: null,
      loadPackages: vi.fn(),
    });
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useDebuggerLogic());

    expect(result.current.trace).toBeNull();
    expect(result.current.error).toBeFalsy();
    expect(result.current.isLoading).toBe(false);
  });

  it("should execute code and return successful trace", async () => {
    const mockTrace: PythonExecutionPayload = {
      success: true,
      steps: [
        {
          step_number: 1,
          line_number: 1,
          stack_depth: 0,
          variables: { x: "5" },
          changed_variables: ["x"],
          stdout: "",
        },
        {
          step_number: 2,
          line_number: 2,
          stack_depth: 0,
          variables: { x: "5", y: "10" },
          changed_variables: ["y"],
          stdout: "",
        },
        {
          step_number: 3,
          line_number: -1,
          stack_depth: 0,
          variables: { x: "5", y: "10" },
          changed_variables: [],
          stdout: "",
        },
      ],
      output: "",
    };

    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: `---DEBUGGER_TRACE_START---\n${JSON.stringify(mockTrace)}\n---DEBUGGER_TRACE_END---`,
      stderr: "",
      error: null,
      result: null,
    });

    const { result } = renderHook(() => useDebuggerLogic());

    let returnedPayload: PythonExecutionPayload | null = null;
    await act(async () => {
      returnedPayload = await result.current.runAndTrace("x = 5\ny = 10");
    });

    expect(result.current.trace).toEqual(mockTrace);
    expect(result.current.error).toBeFalsy();
    expect(returnedPayload).toEqual(mockTrace);
  });

  it("should handle execution errors from Python", async () => {
    const mockTrace: PythonExecutionPayload = {
      success: false,
      steps: [
        {
          step_number: 1,
          line_number: 1,
          stack_depth: 0,
          variables: {},
          changed_variables: [],
          stdout: "NameError: name 'undefined_var' is not defined\n",
        },
      ],
      output: "NameError: name 'undefined_var' is not defined\n",
      error: "name 'undefined_var' is not defined",
      error_type: "NameError",
    };

    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: `---DEBUGGER_TRACE_START---\n${JSON.stringify(mockTrace)}\n---DEBUGGER_TRACE_END---`,
      stderr: "",
      error: null,
      result: null,
    });

    const { result } = renderHook(() => useDebuggerLogic());

    await act(async () => {
      await result.current.runAndTrace("print(undefined_var)");
    });

    expect(result.current.trace).toEqual(mockTrace);
    expect(result.current.error).toContain("NameError");
    expect(result.current.error).toContain(
      "name 'undefined_var' is not defined"
    );
  });

  it("should handle Pyodide execution errors", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: false,
      stdout: "",
      stderr: "",
      error: {
        type: "SystemError",
        message: "Pyodide internal error",
      },
      result: null,
    });

    const { result } = renderHook(() => useDebuggerLogic());

    await act(async () => {
      await result.current.runAndTrace("x = 5");
    });

    expect(result.current.trace).toBeNull();
    expect(result.current.error).toContain("Error during Python execution");
    expect(result.current.error).toContain("Pyodide internal error");
  });

  it("should handle missing trace markers in output", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: "Some output without trace markers",
      stderr: "",
      error: null,
      result: null,
    });

    const { result } = renderHook(() => useDebuggerLogic());

    await act(async () => {
      await result.current.runAndTrace("x = 5");
    });

    expect(result.current.trace).toBeNull();
    expect(result.current.error).toBe(
      "Could not find trace markers in Pyodide output."
    );
  });

  it("should handle JSON parse errors", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout:
        "---DEBUGGER_TRACE_START---\n{invalid json}\n---DEBUGGER_TRACE_END---",
      stderr: "",
      error: null,
      result: null,
    });

    const { result } = renderHook(() => useDebuggerLogic());

    await act(async () => {
      await result.current.runAndTrace("x = 5");
    });

    expect(result.current.trace).toBeNull();
    expect(result.current.error).toContain("Error parsing trace from Python");
  });

  it("should track loading state during execution", async () => {
    let resolvePromise: any;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockRunPythonCode.mockReturnValue(promise);

    const { result } = renderHook(() => useDebuggerLogic());

    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.runAndTrace("x = 5");
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolvePromise({
        success: true,
        stdout: `---DEBUGGER_TRACE_START---\n${JSON.stringify({ success: true, steps: [], output: "" })}\n---DEBUGGER_TRACE_END---`,
        stderr: "",
        error: null,
        result: null,
      });
      await promise;
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("should reset state when running new trace", async () => {
    const firstTrace: PythonExecutionPayload = {
      success: true,
      steps: [
        {
          step_number: 1,
          line_number: 1,
          stack_depth: 0,
          variables: { x: "5" },
          changed_variables: ["x"],
          stdout: "",
        },
      ],
      output: "",
    };

    mockRunPythonCode.mockResolvedValueOnce({
      success: true,
      stdout: `---DEBUGGER_TRACE_START---\n${JSON.stringify(firstTrace)}\n---DEBUGGER_TRACE_END---`,
      stderr: "",
      error: null,
      result: null,
    });

    const { result } = renderHook(() => useDebuggerLogic());

    await act(async () => {
      await result.current.runAndTrace("x = 5");
    });

    expect(result.current.trace).toEqual(firstTrace);
    expect(result.current.error).toBeFalsy();

    // Run again with error
    mockRunPythonCode.mockResolvedValueOnce({
      success: false,
      stdout: "",
      stderr: "",
      error: {
        type: "Error",
        message: "New error",
      },
      result: null,
    });

    await act(async () => {
      await result.current.runAndTrace("y = 10");
    });

    expect(result.current.trace).toBeNull();
    expect(result.current.error).toContain("New error");
  });

  it("should handle Pyodide hook loading state", () => {
    mockedUsePyodide.mockReturnValue({
      pyodide: {} as any,
      runPythonCode: mockRunPythonCode,
      isLoading: true,
      isInitializing: false,
      error: null,
      loadPackages: vi.fn(),
    });

    const { result } = renderHook(() => useDebuggerLogic());

    expect(result.current.isLoading).toBe(true);
  });

  it("should handle Pyodide hook error", () => {
    mockedUsePyodide.mockReturnValue({
      pyodide: {} as any,
      runPythonCode: mockRunPythonCode,
      isLoading: false,
      isInitializing: false,
      error: new Error("Pyodide failed to load"),
      loadPackages: vi.fn(),
    });

    const { result } = renderHook(() => useDebuggerLogic());

    expect(result.current.error).toBe("Pyodide failed to load");
  });

  it("should handle trace with multiple steps showing variable changes", async () => {
    const mockTrace: PythonExecutionPayload = {
      success: true,
      steps: [
        {
          step_number: 1,
          line_number: 1,
          stack_depth: 0,
          variables: { x: "0" },
          changed_variables: ["x"],
          stdout: "",
        },
        {
          step_number: 2,
          line_number: 2,
          stack_depth: 0,
          variables: { x: "1" },
          changed_variables: ["x"],
          stdout: "",
        },
        {
          step_number: 3,
          line_number: 2,
          stack_depth: 0,
          variables: { x: "2" },
          changed_variables: ["x"],
          stdout: "",
        },
        {
          step_number: 4,
          line_number: -1,
          stack_depth: 0,
          variables: { x: "2" },
          changed_variables: [],
          stdout: "",
        },
      ],
      output: "",
    };

    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: `---DEBUGGER_TRACE_START---\n${JSON.stringify(mockTrace)}\n---DEBUGGER_TRACE_END---`,
      stderr: "",
      error: null,
      result: null,
    });

    const { result } = renderHook(() => useDebuggerLogic());

    await act(async () => {
      await result.current.runAndTrace("x = 0\nfor i in range(2):\n  x = i");
    });

    expect(result.current.trace).toEqual(mockTrace);
    expect(result.current.trace?.steps).toHaveLength(4);
    expect(result.current.trace?.steps[0].variables.x).toBe("0");
    expect(result.current.trace?.steps[2].variables.x).toBe("2");
  });

  it("should handle trace with stdout output", async () => {
    const mockTrace: PythonExecutionPayload = {
      success: true,
      steps: [
        {
          step_number: 1,
          line_number: 1,
          stack_depth: 0,
          variables: {},
          changed_variables: [],
          stdout: "Hello, World!\n",
        },
        {
          step_number: 2,
          line_number: -1,
          stack_depth: 0,
          variables: {},
          changed_variables: [],
          stdout: "Hello, World!\n",
        },
      ],
      output: "Hello, World!\n",
    };

    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: `---DEBUGGER_TRACE_START---\n${JSON.stringify(mockTrace)}\n---DEBUGGER_TRACE_END---`,
      stderr: "",
      error: null,
      result: null,
    });

    const { result } = renderHook(() => useDebuggerLogic());

    await act(async () => {
      await result.current.runAndTrace('print("Hello, World!")');
    });

    expect(result.current.trace?.output).toBe("Hello, World!\n");
    expect(result.current.trace?.steps[0].stdout).toBe("Hello, World!\n");
  });

  it("should handle trace with stack depth changes", async () => {
    const mockTrace: PythonExecutionPayload = {
      success: true,
      steps: [
        {
          step_number: 1,
          line_number: 3,
          stack_depth: 0,
          variables: {},
          changed_variables: [],
          stdout: "",
        },
        {
          step_number: 2,
          line_number: 2,
          stack_depth: 1,
          variables: { x: "5" },
          changed_variables: ["x"],
          stdout: "",
        },
        {
          step_number: 3,
          line_number: 3,
          stack_depth: 0,
          variables: { result: "10" },
          changed_variables: ["result"],
          stdout: "",
        },
        {
          step_number: 4,
          line_number: -1,
          stack_depth: 0,
          variables: { result: "10" },
          changed_variables: [],
          stdout: "",
        },
      ],
      output: "",
    };

    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: `---DEBUGGER_TRACE_START---\n${JSON.stringify(mockTrace)}\n---DEBUGGER_TRACE_END---`,
      stderr: "",
      error: null,
      result: null,
    });

    const { result } = renderHook(() => useDebuggerLogic());

    await act(async () => {
      await result.current.runAndTrace(
        "def double(x):\n  return x * 2\nresult = double(5)"
      );
    });

    expect(result.current.trace?.steps[1].stack_depth).toBe(1);
    expect(result.current.trace?.steps[2].stack_depth).toBe(0);
  });

  it("should handle empty code execution", async () => {
    const mockTrace: PythonExecutionPayload = {
      success: true,
      steps: [
        {
          step_number: 1,
          line_number: -1,
          stack_depth: 0,
          variables: {},
          changed_variables: [],
          stdout: "",
        },
      ],
      output: "",
    };

    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: `---DEBUGGER_TRACE_START---\n${JSON.stringify(mockTrace)}\n---DEBUGGER_TRACE_END---`,
      stderr: "",
      error: null,
      result: null,
    });

    const { result } = renderHook(() => useDebuggerLogic());

    await act(async () => {
      await result.current.runAndTrace("");
    });

    expect(result.current.trace).toEqual(mockTrace);
    expect(result.current.error).toBeFalsy();
  });
});
