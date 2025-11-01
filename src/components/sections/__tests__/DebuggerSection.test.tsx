import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { render } from "../../../test-utils";
import DebuggerSection from "../DebuggerSection";
import { useDebuggerLogic } from "../../../hooks/useDebuggerLogic";
import type {
  DebuggerSectionData,
  SectionId,
  Trace,
  UnitId,
  LessonId,
} from "../../../types/data";

// Mock the hook that contains all the complex logic
vi.mock("../../../hooks/useDebuggerLogic");

const mockUnitId = "test-unit" as UnitId;
const mockLessonId = "test-lesson" as LessonId;

const mockSectionData: DebuggerSectionData = {
  kind: "Debugger",
  id: "debug-1" as SectionId,
  title: "Debugging Challenge",
  content: [{ kind: "text", value: "Find the bug in this code." }],
  example: {
    initialCode: "x = 10\ny = 20\nprint(x + y)",
  },
};

// A detailed mock trace object to simulate an active debugging session
const mockTrace: Trace = {
  success: true,
  steps: [
    {
      line_number: 2,
      stack_depth: 0,
      variables: { x: 10 },
      changed_variables: ["x"],
      stdout: "",
    },
    {
      line_number: 3,
      stack_depth: 0,
      variables: { x: 10, y: 20 },
      changed_variables: ["y"],
      stdout: "",
    },
    {
      line_number: 4,
      stack_depth: 0,
      variables: { x: 10, y: 20 },
      changed_variables: [],
      stdout: "30\n",
    },
  ],
};

describe("DebuggerSection", () => {
  const runAndTraceMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation for the hook
    vi.mocked(useDebuggerLogic).mockReturnValue({
      runAndTrace: runAndTraceMock,
      trace: null,
      isLoading: false,
      error: null,
    });
  });

  it("renders the initial state before debugging starts", () => {
    render(
      <DebuggerSection
        section={mockSectionData}
        unitId={mockUnitId}
        lessonId={mockLessonId}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Debugging Challenge" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Enter Debug Mode" })
    ).toBeInTheDocument();
    // The simulation area should not be visible yet
    expect(screen.queryByRole("heading", { name: "Variables" })).toBeNull();
  });

  it("enters debug mode and allows navigation between steps", async () => {
    const user = userEvent.setup();
    // FIX: Create a promise that we can explicitly await later
    const tracePromise = Promise.resolve(mockTrace);
    runAndTraceMock.mockReturnValue(tracePromise);

    const { rerender } = render(
      <DebuggerSection
        section={mockSectionData}
        unitId={mockUnitId}
        lessonId={mockLessonId}
      />
    );

    // 1. Click the button to enter debug mode
    const debugButton = screen.getByRole("button", {
      name: "Enter Debug Mode",
    });
    await user.click(debugButton);

    // 2. Assert that the trace function was called
    expect(runAndTraceMock).toHaveBeenCalledTimes(1);

    // 3. IMPORTANT: Await the promise to ensure the component's internal .then() has fired
    await tracePromise;

    // 4. Now that the internal state is set, update the mock and re-render
    vi.mocked(useDebuggerLogic).mockReturnValue({
      runAndTrace: runAndTraceMock,
      trace: mockTrace,
      isLoading: false,
      error: null,
    });
    rerender(
      <DebuggerSection
        section={mockSectionData}
        unitId={mockUnitId}
        lessonId={mockLessonId}
      />
    );

    // 5. Now the state is consistent, and we can reliably find the elements
    expect(screen.getByText("Line: 2")).toBeInTheDocument();
    expect(screen.getByText(/x: 10/)).toBeInTheDocument();

    const nextButton = screen.getByRole("button", { name: /next step/i });
    const prevButton = screen.getByRole("button", { name: /prev step/i });

    // 6. Navigate forward
    await user.click(nextButton);
    expect(await screen.findByText("Line: 3")).toBeInTheDocument();
    expect(screen.getByText(/y: 20/)).toBeInTheDocument();

    // 7. Navigate backward
    await user.click(prevButton);
    expect(await screen.findByText("Line: 2")).toBeInTheDocument();
  });

  it("displays an error message if the trace fails", () => {
    // ARRANGE: Mock the hook to return an error
    vi.mocked(useDebuggerLogic).mockReturnValue({
      runAndTrace: runAndTraceMock,
      trace: null,
      isLoading: false,
      error: "SyntaxError: Invalid syntax",
    });

    render(
      <DebuggerSection
        section={mockSectionData}
        unitId={mockUnitId}
        lessonId={mockLessonId}
      />
    );

    expect(screen.getByText("Error:")).toBeInTheDocument();
    expect(screen.getByText("SyntaxError: Invalid syntax")).toBeInTheDocument();
  });
});
