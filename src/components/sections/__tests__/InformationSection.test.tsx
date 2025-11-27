import { render, screen } from "../../../test-utils";
import { describe, it, expect } from "vitest";
import InformationSection from "../InformationSection";
import type { InformationSectionData } from "../../../types/data";

// Mock data that matches the structure the component expects

describe("InformationSection", () => {
  const mockLessonPath = "00_intro/lessons/intro_strings";

  it("should render the title and content from its props", () => {
    // ARRANGE: Render the component with the mock data.
    // Note: The props now correctly match the component's interface.
    const mockSectionData: InformationSectionData = {
      kind: "Information",
      id: "info-1",
      title: "Welcome to Python!",
      content: [
        {
          kind: "text",
          value: "This is the first lesson.",
        },
      ],
    };
    render(<InformationSection section={mockSectionData} lessonPath={mockLessonPath} />);

    // ASSERT
    expect(
      screen.getByRole("heading", { name: /welcome to python!/i })
    ).toBeInTheDocument();
    expect(screen.getByText("This is the first lesson.")).toBeInTheDocument();
  });

  it("should render code blocks correctly", () => {
    // ARRANGE: Create mock data that includes a code block.
    const mockSectionWithCode: InformationSectionData = {
      kind: "Information",
      id: "info-2",
      title: "Code Example",
      content: [
        {
          kind: "code",
          language: "python",
          value: 'print("Hello, World!")',
        },
      ],
    };

    render(<InformationSection section={mockSectionWithCode} lessonPath={mockLessonPath} />);

    // ASSERT
    // The syntax highlighter can break code into multiple elements,
    // so a simple getByText for the whole string might fail.
    // A more robust approach is to find a unique part of the code,
    // get its parent container, and then check the full text content.
    const codeLine = screen.getByText(/"Hello, World!"/i).closest("div");
    expect(codeLine).toHaveTextContent('print("Hello, World!")');
  });
});
