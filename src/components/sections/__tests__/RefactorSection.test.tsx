import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { render } from "../../../test-utils";
import RefactorSection from "../RefactorSection";
import { usePyodide } from "../../../contexts/PyodideContext";
import { useProgressStore } from "../../../stores/progressStore";
import { useStyleCheck } from "../../../hooks/useStyleCheck";
import { executeTests } from "../../../hooks/useTestingLogic";
import type {
  RefactorSectionData,
  UnitId,
  LessonId,
  CourseId,
  SectionId,
} from "../../../types/data";

vi.mock("../../../contexts/PyodideContext");
vi.mock("../../../stores/progressStore");
vi.mock("../../../hooks/useStyleCheck");
vi.mock("../../../hooks/useTestingLogic", () => ({
  executeTests: vi.fn(),
}));

const mockSectionData: RefactorSectionData = {
  kind: "Refactor",
  id: "refactor-1" as SectionId,
  title: "Refactor This Program",
  content: [
    { kind: "text", value: "Rewrite this program in different styles." },
  ],
  originalCode: "x = 5\nprint(x * 2)",
  testCases: [{ input: null, expected: "10", description: "prints 10" }],
  tabs: [
    {
      style: "function",
      instructions: [{ kind: "text", value: "Write a function version." }],
      testMode: "function",
      functionToTest: "double",
    },
    {
      style: "oop",
      instructions: [{ kind: "text", value: "Write an OOP version." }],
      testMode: "function",
      functionToTest: "ignored",
    },
  ],
};

describe("RefactorSection", () => {
  const mockRunPythonCode = vi.fn();
  const mockLoadPylint = vi.fn().mockResolvedValue(undefined);
  const mockGetDraft = vi.fn().mockReturnValue(null);
  const mockSaveDraft = vi.fn();
  const mockCompleteSection = vi.fn();
  const mockCheckStyle = vi.fn();

  const defaultProps = {
    section: mockSectionData,
    unitId: "unit-1" as UnitId,
    lessonId: "lesson-1" as LessonId,
    courseId: "course-1" as CourseId,
    lessonPath: "00_intro/lessons/refactor",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(usePyodide).mockReturnValue({
      pyodide: {} as any,
      runPythonCode: mockRunPythonCode,
      loadPylint: mockLoadPylint,
      isLoading: false,
      isInitializing: false,
      error: null,
      loadPackages: vi.fn(),
    });

    vi.mocked(useProgressStore).mockReturnValue({
      getDraft: mockGetDraft,
      saveDraft: mockSaveDraft,
      completeSection: mockCompleteSection,
    });

    vi.mocked(useStyleCheck).mockReturnValue({
      checkStyle: mockCheckStyle,
    });
  });

  it("renders title, content, original code, and tab buttons", () => {
    render(<RefactorSection {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: /refactor this program/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Rewrite this program in different styles.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Function" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "OOP" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Run Tests" })
    ).toBeInTheDocument();
  });

  it("shows the first tab's instructions by default", () => {
    render(<RefactorSection {...defaultProps} />);

    expect(screen.getByText("Write a function version.")).toBeInTheDocument();
  });

  it("switches tabs when clicking tab buttons", async () => {
    const user = userEvent.setup();
    render(<RefactorSection {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "OOP" }));

    expect(screen.getByText("Write an OOP version.")).toBeInTheDocument();
    expect(
      screen.queryByText("Write a function version.")
    ).not.toBeInTheDocument();
  });

  it("shows OOP note when OOP tab is active", async () => {
    const user = userEvent.setup();
    render(<RefactorSection {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "OOP" }));

    expect(
      screen.getByText(/correctness testing is not yet supported for OOP/i)
    ).toBeInTheDocument();
  });

  it("runs executeTests and style check for non-OOP tabs", async () => {
    const user = userEvent.setup();
    vi.mocked(executeTests).mockResolvedValue([
      { description: "prints 10", passed: true, actual: "10", expected: "10" },
    ]);
    mockCheckStyle.mockResolvedValue({ passed: true, feedback: [] });

    render(<RefactorSection {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Run Tests" }));

    await waitFor(() => {
      expect(executeTests).toHaveBeenCalledWith(
        mockRunPythonCode,
        expect.any(String),
        mockSectionData.testCases,
        "function",
        "double"
      );
    });
    await waitFor(() => {
      expect(mockCheckStyle).toHaveBeenCalledWith(
        "function",
        expect.any(String)
      );
    });
    expect(screen.getByText(/tab complete/i)).toBeInTheDocument();
  });

  it("shows test failures without running style check", async () => {
    const user = userEvent.setup();
    vi.mocked(executeTests).mockResolvedValue([
      {
        description: "prints 10",
        passed: false,
        actual: "20",
        expected: "10",
      },
    ]);

    render(<RefactorSection {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Run Tests" }));

    await waitFor(() => {
      expect(executeTests).toHaveBeenCalled();
    });
    expect(mockCheckStyle).not.toHaveBeenCalled();
    expect(screen.queryByText(/tab complete/i)).not.toBeInTheDocument();
  });

  it("shows style feedback when tests pass but style fails", async () => {
    const user = userEvent.setup();
    vi.mocked(executeTests).mockResolvedValue([
      { description: "prints 10", passed: true, actual: "10", expected: "10" },
    ]);
    mockCheckStyle.mockResolvedValue({
      passed: false,
      feedback: ["No top-level function defined."],
    });

    render(<RefactorSection {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Run Tests" }));

    await waitFor(() => {
      expect(
        screen.getByText("No top-level function defined.")
      ).toBeInTheDocument();
    });
    expect(screen.queryByText(/tab complete/i)).not.toBeInTheDocument();
  });

  it("skips executeTests for OOP tab and runs style check only", async () => {
    const user = userEvent.setup();
    mockCheckStyle.mockResolvedValue({ passed: true, feedback: [] });

    render(<RefactorSection {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "OOP" }));
    await user.click(screen.getByRole("button", { name: "Run Tests" }));

    await waitFor(() => {
      expect(mockCheckStyle).toHaveBeenCalledWith("oop", expect.any(String));
    });
    expect(executeTests).not.toHaveBeenCalled();
    expect(screen.getByText(/tab complete/i)).toBeInTheDocument();
  });

  it("restores draft code from progress store", () => {
    mockGetDraft.mockImplementation(
      (_unitId: UnitId, _lessonId: LessonId, key: SectionId) => {
        if (key === ("refactor-1-function" as SectionId)) {
          return { code: "def double(x): return x * 2", isModified: true };
        }
        return null;
      }
    );

    render(<RefactorSection {...defaultProps} />);

    // The draft code should be present (CodeEditor renders it)
    expect(mockGetDraft).toHaveBeenCalledWith(
      "unit-1",
      "lesson-1",
      "refactor-1-function"
    );
  });

  it("shows completion message when all tabs pass", async () => {
    const user = userEvent.setup();

    // Pass function tab
    vi.mocked(executeTests).mockResolvedValue([
      { description: "prints 10", passed: true, actual: "10", expected: "10" },
    ]);
    mockCheckStyle.mockResolvedValue({ passed: true, feedback: [] });

    render(<RefactorSection {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Run Tests" }));
    await waitFor(() => {
      expect(screen.getByText(/tab complete/i)).toBeInTheDocument();
    });

    // Pass OOP tab
    await user.click(screen.getByRole("button", { name: "OOP" }));
    await user.click(screen.getByRole("button", { name: "Run Tests" }));

    await waitFor(() => {
      expect(screen.getByText(/all styles complete/i)).toBeInTheDocument();
    });
    expect(mockCompleteSection).toHaveBeenCalledWith(
      "unit-1",
      "lesson-1",
      "refactor-1"
    );
  });

  describe("maxLines enforcement", () => {
    const sectionWithMaxLines: RefactorSectionData = {
      ...mockSectionData,
      tabs: [
        {
          style: "function",
          instructions: [{ kind: "text", value: "Write a function version." }],
          testMode: "function",
          functionToTest: "double",
          maxLines: 3,
        },
        {
          style: "oop",
          instructions: [{ kind: "text", value: "Write an OOP version." }],
          testMode: "function",
          functionToTest: "ignored",
          maxLines: 5,
        },
      ],
    };

    it("fails when code exceeds maxLines for non-OOP tab", async () => {
      const user = userEvent.setup();
      vi.mocked(executeTests).mockResolvedValue([
        {
          description: "prints 10",
          passed: true,
          actual: "10",
          expected: "10",
        },
      ]);

      // Draft has 5 non-empty, non-comment lines (exceeds maxLines: 3)
      mockGetDraft.mockReturnValue({
        code: "def double(x):\n    result = x * 2\n    print(result)\n    return result\n    pass",
        isModified: true,
      });

      render(
        <RefactorSection {...defaultProps} section={sectionWithMaxLines} />
      );

      await user.click(screen.getByRole("button", { name: "Run Tests" }));

      await waitFor(() => {
        expect(
          screen.getByText(/your solution is 5 lines/i)
        ).toBeInTheDocument();
      });
      expect(mockCheckStyle).not.toHaveBeenCalled();
    });

    it("passes when code is within maxLines", async () => {
      const user = userEvent.setup();
      vi.mocked(executeTests).mockResolvedValue([
        {
          description: "prints 10",
          passed: true,
          actual: "10",
          expected: "10",
        },
      ]);
      mockCheckStyle.mockResolvedValue({ passed: true, feedback: [] });

      // Draft has 2 non-empty lines (within maxLines: 3)
      mockGetDraft.mockReturnValue({
        code: "def double(x):\n    return x * 2",
        isModified: true,
      });

      render(
        <RefactorSection {...defaultProps} section={sectionWithMaxLines} />
      );

      await user.click(screen.getByRole("button", { name: "Run Tests" }));

      await waitFor(() => {
        expect(mockCheckStyle).toHaveBeenCalled();
      });
    });

    it("ignores blank lines and comments in line count", async () => {
      const user = userEvent.setup();
      vi.mocked(executeTests).mockResolvedValue([
        {
          description: "prints 10",
          passed: true,
          actual: "10",
          expected: "10",
        },
      ]);
      mockCheckStyle.mockResolvedValue({ passed: true, feedback: [] });

      // 2 code lines + blanks + comments = still within maxLines: 3
      mockGetDraft.mockReturnValue({
        code: "# A comment\ndef double(x):\n\n    # inline comment\n    return x * 2\n\n",
        isModified: true,
      });

      render(
        <RefactorSection {...defaultProps} section={sectionWithMaxLines} />
      );

      await user.click(screen.getByRole("button", { name: "Run Tests" }));

      await waitFor(() => {
        expect(mockCheckStyle).toHaveBeenCalled();
      });
    });

    it("enforces maxLines on OOP tab", async () => {
      const user = userEvent.setup();

      // Draft has 7 non-empty lines (exceeds maxLines: 5)
      mockGetDraft.mockReturnValue({
        code: "class Doubler:\n    def __init__(self):\n        self.x = 0\n    def set(self, x):\n        self.x = x\n    def get(self):\n        return self.x * 2",
        isModified: true,
      });

      render(
        <RefactorSection {...defaultProps} section={sectionWithMaxLines} />
      );

      await user.click(screen.getByRole("button", { name: "OOP" }));
      await user.click(screen.getByRole("button", { name: "Run Tests" }));

      await waitFor(() => {
        expect(
          screen.getByText(/your solution is 7 lines/i)
        ).toBeInTheDocument();
      });
      expect(mockCheckStyle).not.toHaveBeenCalled();
    });
  });

  it("disables Run Tests button while Pyodide is loading", () => {
    vi.mocked(usePyodide).mockReturnValue({
      pyodide: null,
      runPythonCode: mockRunPythonCode,
      loadPylint: mockLoadPylint,
      isLoading: true,
      isInitializing: true,
      error: null,
      loadPackages: vi.fn(),
    });

    render(<RefactorSection {...defaultProps} />);

    expect(screen.getByRole("button", { name: "Run Tests" })).toBeDisabled();
  });
});
