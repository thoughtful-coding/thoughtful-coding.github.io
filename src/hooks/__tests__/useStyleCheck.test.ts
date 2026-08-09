import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useStyleCheck } from "../useStyleCheck";
import { usePyodide } from "../../contexts/PyodideContext";

vi.mock("../../contexts/PyodideContext");

const mockGlobalsSet = vi.fn();
const mockToPy = vi.fn((x) => x);
const mockRunPythonCode = vi.fn();
const mockPyodide = { globals: { set: mockGlobalsSet }, toPy: mockToPy };

const mockedUsePyodide = vi.mocked(usePyodide);

function setupPyodide(ready = true) {
  mockedUsePyodide.mockReturnValue({
    pyodide: ready ? (mockPyodide as any) : null,
    runPythonCode: mockRunPythonCode,
    isLoading: !ready,
    loadPackages: vi.fn(),
  });
}

const SUCCESS = (json: object) => ({
  success: true,
  stdout: JSON.stringify(json),
  stderr: "",
});

describe("useStyleCheck", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupPyodide();
  });

  it("returns error when pyodide is not ready", async () => {
    setupPyodide(false);
    const { result } = renderHook(() => useStyleCheck());
    const out = await result.current.checkStyle("function", "code");
    expect(out).toEqual({
      passed: false,
      feedback: ["Python environment not ready."],
    });
    expect(mockRunPythonCode).not.toHaveBeenCalled();
  });

  it("sets _student_code as a pyodide global before running check", async () => {
    mockRunPythonCode.mockResolvedValue(
      SUCCESS({ passed: true, feedback: [] })
    );
    const { result } = renderHook(() => useStyleCheck());
    await result.current.checkStyle("function", "def foo(): pass");
    expect(mockGlobalsSet).toHaveBeenCalledWith(
      "_student_code",
      "def foo(): pass"
    );
  });

  it.each(["function", "oop", "recursive"] as const)(
    "does not set pylint flags for AST-based style '%s'",
    async (style) => {
      mockRunPythonCode.mockResolvedValue(
        SUCCESS({ passed: true, feedback: [] })
      );
      const { result } = renderHook(() => useStyleCheck());
      await result.current.checkStyle(style, "code");
      expect(mockToPy).not.toHaveBeenCalled();
      expect(mockGlobalsSet).not.toHaveBeenCalledWith(
        "_pylint_flags",
        expect.anything()
      );
    }
  );

  it.each(["pep8", "annotated", "simple", "minimalist"] as const)(
    "sets pylint flags for pylint-based style '%s'",
    async (style) => {
      mockRunPythonCode.mockResolvedValue(
        SUCCESS({ passed: true, feedback: [] })
      );
      const { result } = renderHook(() => useStyleCheck());
      await result.current.checkStyle(style, "code");
      expect(mockToPy).toHaveBeenCalledOnce();
      expect(mockGlobalsSet).toHaveBeenCalledWith(
        "_pylint_flags",
        expect.anything()
      );
    }
  );

  it("returns error feedback when Python execution fails with an error object", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: false,
      stdout: "",
      stderr: "",
      error: new Error("Runtime error"),
    });
    const { result } = renderHook(() => useStyleCheck());
    const out = await result.current.checkStyle("function", "code");
    expect(out).toEqual({ passed: false, feedback: ["Runtime error"] });
  });

  it("returns fallback message when execution fails with no error object", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: false,
      stdout: "",
      stderr: "",
      error: null,
    });
    const { result } = renderHook(() => useStyleCheck());
    const out = await result.current.checkStyle("function", "code");
    expect(out).toEqual({
      passed: false,
      feedback: ["Style check failed unexpectedly."],
    });
  });

  it("parses and returns JSON result from stdout on success", async () => {
    mockRunPythonCode.mockResolvedValue(
      SUCCESS({ passed: false, feedback: ["No top-level function defined."] })
    );
    const { result } = renderHook(() => useStyleCheck());
    const out = await result.current.checkStyle("function", "x = 1");
    expect(out).toEqual({
      passed: false,
      feedback: ["No top-level function defined."],
    });
  });

  it("returns error when stdout is not valid JSON", async () => {
    mockRunPythonCode.mockResolvedValue({
      success: true,
      stdout: "not valid json",
      stderr: "",
    });
    const { result } = renderHook(() => useStyleCheck());
    const out = await result.current.checkStyle("function", "code");
    expect(out).toEqual({
      passed: false,
      feedback: ["Could not parse style check output."],
    });
  });
});
