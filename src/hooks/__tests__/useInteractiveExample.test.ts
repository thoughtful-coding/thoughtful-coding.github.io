import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useInteractiveExample } from "../useInteractiveExample";
import { usePyodide } from "../../contexts/PyodideContext";
import {
  useProgressStore,
  useProgressActions,
} from "../../stores/progressStore";
import type { UnitId, LessonId, SectionId } from "../../types/data";

// Mock dependencies
vi.mock("../../contexts/PyodideContext");
vi.mock("../../stores/progressStore");

const mockRunPythonCode = vi.fn();
const mockCompleteSection = vi.fn();
const mockedUsePyodide = vi.mocked(usePyodide);
const mockedUseProgressStore = vi.mocked(useProgressStore);
const mockedUseProgressActions = vi.mocked(useProgressActions);

describe("useInteractiveExample", () => {
  const defaultProps = {
    unitId: "unit-1" as UnitId,
    lessonId: "lesson-1" as LessonId,
    sectionId: "section-1" as SectionId,
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
      completeSection: mockCompleteSection,
    });

    mockedUseProgressStore.mockReturnValue(false);
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useInteractiveExample(defaultProps));

    expect(result.current.output).toBeNull(); // null = hasn't run yet
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isSectionComplete).toBe(false);
  });

  it("should run Python code successfully", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: "Hello, World!",
      stderr: "",
      result: null,
      error: null,
    });

    const { result } = renderHook(() => useInteractiveExample(defaultProps));

    let returnValue: any;
    await act(async () => {
      returnValue = await result.current.runCode('print("Hello, World!")');
    });

    expect(mockRunPythonCode).toHaveBeenCalledWith(
      'print("Hello, World!")',
      undefined
    );
    expect(result.current.output).toBe("Hello, World!");
    expect(returnValue).toEqual({
      output: "Hello, World!",
      error: null,
    });
  });

  it("should complete section after successful run with autoComplete=true", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: "42",
      stderr: "",
      result: null,
      error: null,
    });

    const { result } = renderHook(() => useInteractiveExample(defaultProps));

    await act(async () => {
      await result.current.runCode("print(42)");
    });

    expect(mockCompleteSection).toHaveBeenCalledWith(
      defaultProps.unitId,
      defaultProps.lessonId,
      defaultProps.sectionId,
      1
    );
  });

  it("should not complete section when autoComplete=false", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: "42",
      stderr: "",
      result: null,
      error: null,
    });

    const { result } = renderHook(() =>
      useInteractiveExample({ ...defaultProps, autoComplete: false })
    );

    await act(async () => {
      await result.current.runCode("print(42)");
    });

    expect(mockCompleteSection).not.toHaveBeenCalled();
  });

  it("should handle Python execution errors", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: false,
      stdout: "",
      stderr: "",
      result: null,
      error: {
        type: "NameError",
        message: "name 'undefined_var' is not defined",
      },
    });

    const { result } = renderHook(() => useInteractiveExample(defaultProps));

    let returnValue: any;
    await act(async () => {
      returnValue = await result.current.runCode("print(undefined_var)");
    });

    expect(result.current.output).toBe(
      "NameError: name 'undefined_var' is not defined"
    );
    expect(returnValue).toEqual({
      output: "NameError: name 'undefined_var' is not defined",
      error: "NameError: name 'undefined_var' is not defined",
    });
  });

  it("should complete section even with Python errors when autoComplete=true", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: false,
      stdout: "",
      stderr: "",
      result: null,
      error: {
        type: "SyntaxError",
        message: "invalid syntax",
      },
    });

    const { result } = renderHook(() => useInteractiveExample(defaultProps));

    await act(async () => {
      await result.current.runCode("print(");
    });

    expect(mockCompleteSection).toHaveBeenCalledWith(
      defaultProps.unitId,
      defaultProps.lessonId,
      defaultProps.sectionId,
      1
    );
  });

  it("should reset output when running new code", async () => {
    mockRunPythonCode
      .mockResolvedValueOnce({
        success: true,
        stdout: "First output",
        stderr: "",
        result: null,
        error: null,
      })
      .mockResolvedValueOnce({
        success: true,
        stdout: "Second output",
        stderr: "",
        result: null,
        error: null,
      });

    const { result } = renderHook(() => useInteractiveExample(defaultProps));

    await act(async () => {
      await result.current.runCode("print('first')");
    });

    expect(result.current.output).toBe("First output");

    await act(async () => {
      await result.current.runCode("print('second')");
    });

    expect(result.current.output).toBe("Second output");
  });

  it("should handle empty output", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: "",
      stderr: "",
      result: null,
      error: null,
    });

    const { result } = renderHook(() => useInteractiveExample(defaultProps));

    await act(async () => {
      await result.current.runCode("x = 5");
    });

    expect(result.current.output).toBe("");
    expect(mockCompleteSection).toHaveBeenCalled();
  });

  it("should handle null output from Pyodide", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: "",
      stderr: "",
      result: null,
      error: null,
    });

    const { result } = renderHook(() => useInteractiveExample(defaultProps));

    await act(async () => {
      await result.current.runCode("x = 5");
    });

    expect(result.current.output).toBe("");
  });

  it("should track Pyodide loading state", () => {
    mockedUsePyodide.mockReturnValue({
      runPythonCode: mockRunPythonCode,
      isLoading: true,
      error: null,
      loadPackages: vi.fn(),
    });

    const { result } = renderHook(() => useInteractiveExample(defaultProps));

    expect(result.current.isLoading).toBe(true);
  });

  it("should expose Pyodide error", () => {
    mockedUsePyodide.mockReturnValue({
      runPythonCode: mockRunPythonCode,
      isLoading: false,
      error: new Error("Pyodide failed to load"),
      loadPackages: vi.fn(),
    });

    const { result } = renderHook(() => useInteractiveExample(defaultProps));

    expect(result.current.error?.message).toBe("Pyodide failed to load");
  });

  it("should track section completion status", () => {
    mockedUseProgressStore.mockReturnValue(true);

    const { result } = renderHook(() => useInteractiveExample(defaultProps));

    expect(result.current.isSectionComplete).toBe(true);
  });

  it("should handle section completion status changes", () => {
    mockedUseProgressStore.mockReturnValue(false);

    const { result, rerender } = renderHook(() =>
      useInteractiveExample(defaultProps)
    );

    expect(result.current.isSectionComplete).toBe(false);

    // Simulate section completion
    mockedUseProgressStore.mockReturnValue(true);
    rerender();

    expect(result.current.isSectionComplete).toBe(true);
  });

  it("should handle both output and error being null", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: "",
      stderr: "",
      result: null,
      error: null,
    });

    const { result } = renderHook(() => useInteractiveExample(defaultProps));

    let returnValue: any;
    await act(async () => {
      returnValue = await result.current.runCode("pass");
    });

    expect(result.current.output).toBe("");
    expect(returnValue).toEqual({
      output: "",
      error: null,
    });
  });

  it("should prefer error over output when both exist", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: false,
      stdout: "Some output",
      stderr: "",
      result: null,
      error: {
        type: "RuntimeError",
        message: "Some error",
      },
    });

    const { result } = renderHook(() => useInteractiveExample(defaultProps));

    await act(async () => {
      await result.current.runCode("print(x)");
    });

    // When both stdout and error exist, both should be shown with error at the end
    expect(result.current.output).toBe("Some output\nRuntimeError: Some error");
  });

  it("should handle rapid successive code executions", async () => {
    mockRunPythonCode
      .mockResolvedValueOnce({
        success: true,
        stdout: "1",
        stderr: "",
        result: null,
        error: null,
      })
      .mockResolvedValueOnce({
        success: true,
        stdout: "2",
        stderr: "",
        result: null,
        error: null,
      })
      .mockResolvedValueOnce({
        success: true,
        stdout: "3",
        stderr: "",
        result: null,
        error: null,
      });

    const { result } = renderHook(() => useInteractiveExample(defaultProps));

    await act(async () => {
      await result.current.runCode("print(1)");
      await result.current.runCode("print(2)");
      await result.current.runCode("print(3)");
    });

    expect(result.current.output).toBe("3");
    expect(mockCompleteSection).toHaveBeenCalledTimes(3);
  });

  it("should work with different unit/lesson/section IDs", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: "test",
      stderr: "",
      result: null,
      error: null,
    });

    const customProps = {
      unitId: "unit-99" as UnitId,
      lessonId: "lesson-99" as LessonId,
      sectionId: "section-99" as SectionId,
    };

    const { result } = renderHook(() => useInteractiveExample(customProps));

    await act(async () => {
      await result.current.runCode("print('test')");
    });

    expect(mockCompleteSection).toHaveBeenCalledWith(
      "unit-99",
      "lesson-99",
      "section-99",
      1
    );
  });
});
