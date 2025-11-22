import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import React from "react";

import { render } from "../../../test-utils";
import TestingSection from "../TestingSection";
import { useInteractiveExample } from "../../../hooks/useInteractiveExample";
import { useTestingLogic } from "../../../hooks/useTestingLogic";
import { useTurtleVisualization } from "../../../hooks/useTurtleTesting";
import type {
  TestingSectionData,
  UnitId,
  LessonId,
  SectionId,
} from "../../../types/data";

// Mock the hooks that provide the core logic
vi.mock("../../../hooks/useInteractiveExample");
vi.mock("../../../hooks/useTestingLogic");
vi.mock("../../../hooks/useTurtleTesting", () => ({
  useTurtleVisualization: vi.fn(),
  TurtleTestResult: {},
}));

const mockSectionData: TestingSectionData = {
  kind: "Testing",
  id: "test-1" as SectionId,
  title: "Function Testing Challenge",
  content: [{ kind: "text", value: "Write a function to add two numbers." }],
  example: {
    initialCode: "def add(a, b):\n  return a + b",
    visualization: "console",
  },
  testMode: "function",
  functionToTest: "add",
  testCases: [
    {
      description: "adds two positive numbers",
      input: [2, 3],
      expected: 5,
    },
  ],
};

describe("TestingSection", () => {
  const runCodeMock = vi.fn();
  const runTestsMock = vi.fn();
  const runTurtleCodeMock = vi.fn();
  const stopExecutionMock = vi.fn();
  const turtleCanvasRef = React.createRef<HTMLDivElement>();

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up default return values for the mocked hooks
    vi.mocked(useInteractiveExample).mockReturnValue({
      runCode: runCodeMock,
      isLoading: false,
      output: null,
      error: null,
    });
    vi.mocked(useTestingLogic).mockReturnValue({
      runTests: runTestsMock,
      testResults: null,
      isLoading: false,
      error: null,
    });
    vi.mocked(useTurtleVisualization).mockReturnValue({
      turtleCanvasRef,
      turtleInstance: null,
      isVisualTurtleTest: false,
      resolvedTestCases: [],
      runTurtleCode: runTurtleCodeMock,
      stopExecution: stopExecutionMock,
      isRunningTurtle: false,
      turtleRunError: null,
      turtleTestingHook: {
        runTests: runTestsMock,
        testResults: null,
        isLoading: false,
        error: null,
      },
    });
  });

  it("renders the initial state with code editor and buttons", () => {
    render(
      <TestingSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    expect(
      screen.getByRole("heading", { name: /your solution/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Run Code" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Run Tests" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Output:" })
    ).toBeInTheDocument();
  });

  it("calls runCode from the hook when 'Run Code' button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <TestingSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    const runCodeButton = screen.getByRole("button", { name: "Run Code" });
    await user.click(runCodeButton);

    expect(runCodeMock).toHaveBeenCalledTimes(1);
    expect(runCodeMock).toHaveBeenCalledWith(
      mockSectionData.example.initialCode
    );
  });

  it("calls runTests from the hook when 'Run Tests' button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <TestingSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    const runTestsButton = screen.getByRole("button", { name: "Run Tests" });
    await user.click(runTestsButton);

    expect(runTestsMock).toHaveBeenCalledTimes(1);
    expect(runTestsMock).toHaveBeenCalledWith(
      mockSectionData.example.initialCode
    );
  });

  it("displays the output when code is run successfully", () => {
    // ARRANGE: Mock the hook to return a successful run output
    vi.mocked(useInteractiveExample).mockReturnValue({
      runCode: runCodeMock,
      isLoading: false,
      output: "Hello from run!",
      error: null,
    });

    render(
      <TestingSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    // ACT: Simulate clicking the button to set the lastAction state
    const runCodeButton = screen.getByRole("button", { name: "Run Code" });
    fireEvent.click(runCodeButton);

    // ASSERT
    expect(screen.getByText("Hello from run!")).toBeInTheDocument();
  });

  it("displays failing test results correctly", () => {
    // ARRANGE: Mock the hook to return failing test results
    vi.mocked(useTestingLogic).mockReturnValue({
      runTests: runTestsMock,
      testResults: [
        {
          description: "adds two positive numbers",
          passed: false,
          input: [2, 3],
          expected: 5,
          actual: 6,
        },
      ],
      isLoading: false,
      error: null,
    });

    render(
      <TestingSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    // ACT: Simulate clicking the button to set the lastAction state
    const runTestsButton = screen.getByRole("button", { name: "Run Tests" });
    fireEvent.click(runTestsButton);

    // ASSERT
    expect(screen.getByText(/almost there/i)).toBeInTheDocument();
    expect(
      screen.getByText("Test 1 failed. Fix the issue and try again!")
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "6" })).toBeInTheDocument(); // Check for actual result
  });

  it("displays passing test results and completion message", () => {
    // ARRANGE: Mock the hook to return passing test results
    vi.mocked(useTestingLogic).mockReturnValue({
      runTests: runTestsMock,
      testResults: [
        {
          description: "adds two positive numbers",
          passed: true,
          input: [2, 3],
          expected: 5,
          actual: 5,
        },
      ],
      isLoading: false,
      error: null,
    });

    render(
      <TestingSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    // ACT: Simulate clicking the button
    const runTestsButton = screen.getByRole("button", { name: "Run Tests" });
    fireEvent.click(runTestsButton);

    // ASSERT
    expect(screen.getByText(/all tests passed!/i)).toBeInTheDocument();
  });
});
