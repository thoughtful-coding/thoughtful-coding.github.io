import { screen } from "@testing-library/react";
import { vi } from "vitest";

import { render } from "../../../test-utils";
import ObservationSection from "../ObservationSection";
import CodeExecutor from "../CodeExecutor"; // Import the actual component for mocking
import type {
  ObservationSectionData,
  UnitId,
  LessonId,
  SectionId,
} from "../../../types/data";

// Mock the child CodeExecutor component to isolate the ObservationSection
vi.mock("../CodeExecutor", () => ({
  // The default export is a function component
  default: vi.fn(() => <div>Mocked CodeExecutor</div>),
}));

const mockSectionData: ObservationSectionData = {
  kind: "Observation",
  id: "obs-1" as SectionId,
  title: "Observe the Code",
  content: [{ kind: "text", value: "See what this Python code does." }],
  example: {
    initialCode: "print('Hello, Observer!')",
    visualization: "text",
  },
};

describe("ObservationSection", () => {
  const mockLessonPath = "00_intro/lessons/intro_strings";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render title, content, and pass correct props to CodeExecutor", () => {
    const unitId: UnitId = "unit-1" as UnitId;
    const lessonId: LessonId = "lesson-1" as LessonId;

    render(
      <ObservationSection
        section={mockSectionData}
        unitId={unitId}
        lessonId={lessonId}
        lessonPath={mockLessonPath}
      />
    );

    // 1. Assert that the ObservationSection's own content is rendered
    expect(
      screen.getByRole("heading", { name: /observe the code/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText("See what this Python code does.")
    ).toBeInTheDocument();

    // 2. Assert that our mocked child component is on the screen
    expect(screen.getByText("Mocked CodeExecutor")).toBeInTheDocument();

    // 3. Assert that the child component was called with the correct props
    expect(CodeExecutor).toHaveBeenCalledTimes(1);
    // Assert only on the props object (the first argument) to avoid issues with the 'ref' argument.
    const calledProps = vi.mocked(CodeExecutor).mock.calls[0][0];
    expect(calledProps).toMatchObject({
      example: mockSectionData.example,
      unitId: unitId,
      lessonId: lessonId,
      sectionId: mockSectionData.id,
    });
    // onTurtleInstanceReady should be a function
    expect(typeof calledProps.onTurtleInstanceReady).toBe("function");
  });
});
