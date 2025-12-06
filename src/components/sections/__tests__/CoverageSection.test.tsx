import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { render } from "../../../test-utils";
import CoverageSection from "../CoverageSection";
import { useInteractiveTableLogic } from "../../../hooks/useInteractiveTableLogic";
import type {
  CoverageSectionData,
  UnitId,
  LessonId,
  SectionId,
  SavedCoverageState,
  CourseId,
} from "../../../types/data";

// Mock the custom hook that provides all the logic
vi.mock("../../../hooks/useInteractiveTableLogic");

// Create mock data for the section
const mockSectionData: CoverageSectionData = {
  kind: "Coverage",
  id: "cov-1" as SectionId,
  title: "Code Coverage Challenge",
  content: [{ kind: "text", value: "Find inputs to produce the outputs." }],
  example: {
    initialCode:
      "def check_temp(t):\n  if t > 25:\n    return 'Hot'\n  return 'Normal'",
    visualization: "console" as const,
  },
  testMode: "function" as const,
  functionToTest: "check_temp",
  coverageTable: {
    columns: [{ variableName: "t", variableType: "number" }],
    rows: [
      { fixedInputs: {}, expectedOutput: "Hot" },
      { fixedInputs: {}, expectedOutput: "Normal" },
    ],
  },
};

// Default state for the mocked hook
const mockSavedState: SavedCoverageState = {
  challengeStates: {},
};

describe("CoverageSection", () => {
  const mockCourseId = "getting-started" as CourseId;
  const mockLessonPath = "00_intro/lessons/intro_coverage";
  const handleUserInputChangeMock = vi.fn();
  const runRowMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Set up a default mock return value for the hook
    vi.mocked(useInteractiveTableLogic).mockReturnValue({
      savedState: mockSavedState,
      isSectionComplete: false,
      runningStates: {},
      rowReadyStates: { 0: true, 1: true },
      isLoading: false,
      pyodideError: null,
      handleUserInputChange: handleUserInputChangeMock,
      runRow: runRowMock,
    });
  });

  it("should render the initial state correctly", () => {
    render(
      <CoverageSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
        courseId={mockCourseId}
        lessonPath={mockLessonPath}
      />
    );

    // Assert that the title, code, and table headers are rendered
    expect(
      screen.getByRole("heading", { name: /code coverage challenge/i })
    ).toBeInTheDocument();
    // FIX 1: Find the code editor container and check its content
    const codeEditor = screen.getByRole("heading", {
      name: /code to analyze/i,
    }).nextElementSibling;
    expect(codeEditor).toHaveTextContent(/def check_temp\(t\):/);
    expect(codeEditor).toHaveTextContent(/return 'Hot'/);

    expect(
      screen.getByRole("columnheader", { name: "Input: t" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Expected Output" })
    ).toBeInTheDocument();

    // Assert that the progress text is correct for the initial state
    expect(screen.getByText("0 / 2 challenges completed")).toBeInTheDocument();
  });

  it("should call handleUserInputChange when a user types in an input", async () => {
    render(
      <CoverageSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
        courseId={mockCourseId}
        lessonPath={mockLessonPath}
      />
    );

    const inputs = screen.getAllByRole("spinbutton");
    // FIX: Use fireEvent.change for controlled components with static mocked state
    fireEvent.change(inputs[0], { target: { value: "30" } });

    // The first input corresponds to rowIndex 0 and variableName 't'
    expect(handleUserInputChangeMock).toHaveBeenCalledTimes(1);
    expect(handleUserInputChangeMock).toHaveBeenCalledWith(0, "30", "t");
  });

  it("should call runRow when a user clicks the 'Run' button", async () => {
    const user = userEvent.setup();
    render(
      <CoverageSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
        courseId={mockCourseId}
        lessonPath={mockLessonPath}
      />
    );

    const runButtons = screen.getAllByRole("button", { name: "Run" });
    await user.click(runButtons[1]); // Click the button for the second row

    // The second button corresponds to rowIndex 1
    expect(runRowMock).toHaveBeenCalledWith(1);
  });

  it("should display correct and incorrect row states based on hook data", () => {
    // ARRANGE: Mock a state where one row is correct and one is incorrect
    const newState: SavedCoverageState = {
      challengeStates: {
        0: { inputs: { t: "30" }, actualOutput: "Hot", isCorrect: true },
        1: { inputs: { t: "20" }, actualOutput: "Hot", isCorrect: false },
      },
    };
    vi.mocked(useInteractiveTableLogic).mockReturnValue({
      savedState: newState,
      isSectionComplete: false,
      runningStates: {},
      rowReadyStates: { 0: true, 1: true },
      isLoading: false,
      pyodideError: null,
      handleUserInputChange: handleUserInputChangeMock,
      runRow: runRowMock,
    });

    render(
      <CoverageSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
        courseId={mockCourseId}
        lessonPath={mockLessonPath}
      />
    );

    const rows = screen.getAllByRole("row"); // Includes header row

    // ASSERT
    expect(rows[1]).toHaveClass("correctRow");
    expect(rows[2]).toHaveClass("incorrectRow");
    expect(screen.getByText("1 / 2 challenges completed")).toBeInTheDocument();
  });

  it("should apply the 'complete' style to the progress bar when the section is complete", () => {
    // ARRANGE: Mock a state where all challenges are correct and the section is complete
    const completeState: SavedCoverageState = {
      challengeStates: {
        0: { inputs: { t: "30" }, actualOutput: "Hot", isCorrect: true },
        1: { inputs: { t: "20" }, actualOutput: "Normal", isCorrect: true },
      },
    };
    vi.mocked(useInteractiveTableLogic).mockReturnValue({
      savedState: completeState,
      isSectionComplete: true, // Tell the component it's complete
      runningStates: {},
      rowReadyStates: { 0: true, 1: true },
      isLoading: false,
      pyodideError: null,
      handleUserInputChange: vi.fn(),
      runRow: vi.fn(),
    });

    render(
      <CoverageSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
        courseId={mockCourseId}
        lessonPath={mockLessonPath}
      />
    );

    // ASSERT
    const progressBar = screen.getByText("2 / 2 challenges completed")
      .previousElementSibling?.firstChild;

    expect(progressBar).toHaveClass("progressFillComplete");
  });

  describe("boolean inputs", () => {
    const mockSectionWithBoolean: CoverageSectionData = {
      kind: "Coverage",
      id: "cov-bool" as SectionId,
      title: "Boolean Inputs Coverage",
      content: [{ kind: "text", value: "Test with boolean inputs." }],
      example: {
        initialCode:
          "def free_entry(age, has_membership):\n  if age < 12 or has_membership:\n    print('Free entry!')\n  else:\n    print('Please pay admission')",
        visualization: "console" as const,
      },
      testMode: "procedure" as const,
      functionToTest: "free_entry",
      coverageTable: {
        columns: [
          { variableName: "age", variableType: "number" },
          { variableName: "has_membership", variableType: "boolean" },
        ],
        rows: [
          { fixedInputs: {}, expectedOutput: "Free entry!" },
          { fixedInputs: {}, expectedOutput: "Please pay admission" },
        ],
      },
    };

    it("should render boolean inputs as dropdown selects", () => {
      const stateWithBoolean: SavedCoverageState = {
        challengeStates: {
          0: {
            inputs: { age: "", has_membership: "" },
            actualOutput: null,
            isCorrect: null,
          },
          1: {
            inputs: { age: "", has_membership: "" },
            actualOutput: null,
            isCorrect: null,
          },
        },
      };

      vi.mocked(useInteractiveTableLogic).mockReturnValue({
        savedState: stateWithBoolean,
        runningStates: {},
        rowReadyStates: { 0: true },
        isLoading: false,
        pyodideError: null,
        handleUserInputChange: vi.fn(),
        runRow: vi.fn(),
      });

      render(
        <CoverageSection
          section={mockSectionWithBoolean}
          unitId={"unit-1" as UnitId}
          lessonId={"lesson-1" as LessonId}
        />
      );

      // Should have number inputs for age (2 rows)
      const numberInputs = screen.getAllByRole("spinbutton");
      expect(numberInputs).toHaveLength(2);

      // Should have dropdown selects for has_membership (2 rows)
      const booleanSelects = screen.getAllByRole("combobox");
      expect(booleanSelects).toHaveLength(2);

      // Check that boolean selects have the right options
      booleanSelects.forEach((select) => {
        expect(select).toHaveTextContent("Select...");
        expect(select).toHaveTextContent("True");
        expect(select).toHaveTextContent("False");
      });
    });

    it("should call handleUserInputChange when boolean dropdown value changes", () => {
      const handleUserInputChangeMock = vi.fn();
      const stateWithBoolean: SavedCoverageState = {
        challengeStates: {
          0: {
            inputs: { age: "", has_membership: "" },
            actualOutput: null,
            isCorrect: null,
          },
        },
      };

      vi.mocked(useInteractiveTableLogic).mockReturnValue({
        savedState: stateWithBoolean,
        runningStates: {},
        rowReadyStates: { 0: false },
        isLoading: false,
        pyodideError: null,
        handleUserInputChange: handleUserInputChangeMock,
        runRow: vi.fn(),
      });

      render(
        <CoverageSection
          section={{
            ...mockSectionWithBoolean,
            coverageTable: {
              ...mockSectionWithBoolean.coverageTable,
              rows: [{ fixedInputs: {}, expectedOutput: "Free entry!" }],
            },
          }}
          unitId={"unit-1" as UnitId}
          lessonId={"lesson-1" as LessonId}
        />
      );

      const booleanSelect = screen.getByRole("combobox");
      fireEvent.change(booleanSelect, { target: { value: "True" } });

      expect(handleUserInputChangeMock).toHaveBeenCalledWith(
        0,
        "True",
        "has_membership"
      );
    });

    it("should display selected boolean value in dropdown", () => {
      const stateWithBoolean: SavedCoverageState = {
        challengeStates: {
          0: {
            inputs: { age: "25", has_membership: "True" },
            actualOutput: null,
            isCorrect: null,
          },
        },
      };

      vi.mocked(useInteractiveTableLogic).mockReturnValue({
        savedState: stateWithBoolean,
        runningStates: {},
        rowReadyStates: { 0: true },
        isLoading: false,
        pyodideError: null,
        handleUserInputChange: vi.fn(),
        runRow: vi.fn(),
      });

      render(
        <CoverageSection
          section={{
            ...mockSectionWithBoolean,
            coverageTable: {
              ...mockSectionWithBoolean.coverageTable,
              rows: [{ fixedInputs: {}, expectedOutput: "Free entry!" }],
            },
          }}
          unitId={"unit-1" as UnitId}
          lessonId={"lesson-1" as LessonId}
        />
      );

      const booleanSelect = screen.getByRole("combobox") as HTMLSelectElement;
      expect(booleanSelect.value).toBe("True");
    });

    it("should disable boolean dropdown when row is running or pyodide is loading", () => {
      const stateWithBoolean: SavedCoverageState = {
        challengeStates: {
          0: {
            inputs: { age: "", has_membership: "" },
            actualOutput: null,
            isCorrect: null,
          },
        },
      };

      vi.mocked(useInteractiveTableLogic).mockReturnValue({
        savedState: stateWithBoolean,
        runningStates: { 0: true },
        rowReadyStates: { 0: true },
        isLoading: false,
        pyodideError: null,
        handleUserInputChange: vi.fn(),
        runRow: vi.fn(),
      });

      render(
        <CoverageSection
          section={{
            ...mockSectionWithBoolean,
            coverageTable: {
              ...mockSectionWithBoolean.coverageTable,
              rows: [{ fixedInputs: {}, expectedOutput: "Free entry!" }],
            },
          }}
          unitId={"unit-1" as UnitId}
          lessonId={"lesson-1" as LessonId}
        />
      );

      const booleanSelect = screen.getByRole("combobox");
      expect(booleanSelect).toBeDisabled();
    });
  });

  describe("fixed inputs", () => {
    const mockSectionWithFixed: CoverageSectionData = {
      kind: "Coverage",
      id: "cov-fixed" as SectionId,
      title: "Fixed Inputs Coverage",
      content: [{ kind: "text", value: "Test with fixed inputs." }],
      example: {
        initialCode: "def calc(x, y):\n  return x + y",
        visualization: "console" as const,
      },
      testMode: "function" as const,
      functionToTest: "calc",
      coverageTable: {
        columns: [
          { variableName: "x", variableType: "number" },
          { variableName: "y", variableType: "number" },
        ],
        rows: [
          { fixedInputs: { x: 5 }, expectedOutput: "10" }, // x is fixed, y is editable
          { fixedInputs: { x: 10, y: 20 }, expectedOutput: "30" }, // both fixed
          { fixedInputs: {}, expectedOutput: "15" }, // nothing fixed
        ],
      },
    };

    it("should render fixed inputs with readonly styling", () => {
      const stateWithFixed: SavedCoverageState = {
        challengeStates: {
          0: { inputs: { x: "5", y: "" }, actualOutput: null, isCorrect: null },
          1: {
            inputs: { x: "10", y: "20" },
            actualOutput: null,
            isCorrect: null,
          },
          2: { inputs: { x: "", y: "" }, actualOutput: null, isCorrect: null },
        },
      };

      vi.mocked(useInteractiveTableLogic).mockReturnValue({
        savedState: stateWithFixed,
        runningStates: {},
        rowReadyStates: { 0: true },
        isLoading: false,
        pyodideError: null,
        handleUserInputChange: vi.fn(),
        runRow: vi.fn(),
      });

      render(
        <CoverageSection
          section={mockSectionWithFixed}
          unitId={"unit-1" as UnitId}
          lessonId={"lesson-1" as LessonId}
        />
      );

      const inputs = screen.getAllByRole("spinbutton");

      // Row 0: x is fixed (inputs[0]), y is editable (inputs[1])
      expect(inputs[0]).toHaveClass("fixedInput");
      expect(inputs[0]).toHaveAttribute("readonly");
      expect(inputs[0]).toBeDisabled();
      expect(inputs[1]).not.toHaveClass("fixedInput");

      // Row 1: both x (inputs[2]) and y (inputs[3]) are fixed
      expect(inputs[2]).toHaveClass("fixedInput");
      expect(inputs[2]).toHaveAttribute("readonly");
      expect(inputs[3]).toHaveClass("fixedInput");
      expect(inputs[3]).toHaveAttribute("readonly");

      // Row 2: both x (inputs[4]) and y (inputs[5]) are editable
      expect(inputs[4]).not.toHaveClass("fixedInput");
      expect(inputs[5]).not.toHaveClass("fixedInput");
    });

    it("should display fixed values in the input fields", () => {
      const stateWithFixed: SavedCoverageState = {
        challengeStates: {
          0: { inputs: { x: "5", y: "" }, actualOutput: null, isCorrect: null },
          1: {
            inputs: { x: "10", y: "20" },
            actualOutput: null,
            isCorrect: null,
          },
          2: { inputs: { x: "", y: "" }, actualOutput: null, isCorrect: null },
        },
      };

      vi.mocked(useInteractiveTableLogic).mockReturnValue({
        savedState: stateWithFixed,
        runningStates: {},
        rowReadyStates: { 0: true },
        isLoading: false,
        pyodideError: null,
        handleUserInputChange: vi.fn(),
        runRow: vi.fn(),
      });

      render(
        <CoverageSection
          section={mockSectionWithFixed}
          unitId={"unit-1" as UnitId}
          lessonId={"lesson-1" as LessonId}
        />
      );

      const inputs = screen.getAllByRole("spinbutton");

      // Row 0: x=5 (fixed), y=empty
      expect(inputs[0]).toHaveValue(5);
      expect(inputs[1]).toHaveValue(null);

      // Row 1: x=10 (fixed), y=20 (fixed)
      expect(inputs[2]).toHaveValue(10);
      expect(inputs[3]).toHaveValue(20);

      // Row 2: both empty
      expect(inputs[4]).toHaveValue(null);
      expect(inputs[5]).toHaveValue(null);
    });

    it("should call handleUserInputChange even for fixed inputs (hook will reject)", async () => {
      const handleUserInputChangeMock = vi.fn();
      const stateWithFixed: SavedCoverageState = {
        challengeStates: {
          0: { inputs: { x: "5", y: "" }, actualOutput: null, isCorrect: null },
        },
      };

      vi.mocked(useInteractiveTableLogic).mockReturnValue({
        savedState: stateWithFixed,
        runningStates: {},
        rowReadyStates: { 0: false },
        isLoading: false,
        pyodideError: null,
        handleUserInputChange: handleUserInputChangeMock,
        runRow: vi.fn(),
      });

      render(
        <CoverageSection
          section={{
            ...mockSectionWithFixed,
            coverageTable: {
              ...mockSectionWithFixed.coverageTable,
              rows: [{ fixedInputs: { x: 5 }, expectedOutput: "10" }],
            },
          }}
          unitId={"unit-1" as UnitId}
          lessonId={"lesson-1" as LessonId}
        />
      );

      const inputs = screen.getAllByRole("spinbutton");
      const fixedInput = inputs[0]; // x is fixed

      // Try to change the fixed input using fireEvent (bypasses disabled attribute in tests)
      fireEvent.change(fixedInput, { target: { value: "99" } });

      // The onChange handler IS called (fireEvent bypasses disabled)
      // But the hook's defensive check prevents the state change
      expect(handleUserInputChangeMock).toHaveBeenCalledWith(0, "99", "x");
    });
  });
});
