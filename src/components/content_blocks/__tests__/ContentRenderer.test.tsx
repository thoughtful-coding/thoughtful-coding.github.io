import { screen } from "@testing-library/react";
import { vi } from "vitest";

import { render } from "../../../test-utils";
import ContentRenderer from "../ContentRenderer";
import TextBlock from "../TextBlock";
import CodeBlock from "../CodeBlock";
import ImageBlock from "../ImageBlock";
import VideoBlock from "../VideoBlock";
import type { ContentBlock as ContentBlockData, CourseId } from "../../../types/data";

// Mock all the child components to isolate the ContentRenderer's logic
vi.mock("../TextBlock", () => ({
  default: vi.fn(() => <div>Mocked TextBlock</div>),
}));
vi.mock("../CodeBlock", () => ({
  default: vi.fn(() => <div>Mocked CodeBlock</div>),
}));
vi.mock("../ImageBlock", () => ({
  default: vi.fn(() => <div>Mocked ImageBlock</div>),
}));
vi.mock("../VideoBlock", () => ({
  default: vi.fn(() => <div>Mocked VideoBlock</div>),
}));

describe("ContentRenderer", () => {
  const mockCourseId = "getting-started" as CourseId;
  const mockLessonPath = "00_science_of_learning/lessons/00_learning_primm";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the correct component for each block type", () => {
    // ARRANGE: Create an array with one of each type of content block
    const mockContent: ContentBlockData[] = [
      { kind: "text", value: "Hello" },
      { kind: "code", value: "print('Hello')" },
      { kind: "image", src: "image.png", alt: "alt text" },
      { kind: "video", src: "video.mp4" },
    ];

    render(
      <ContentRenderer content={mockContent} courseId={mockCourseId} lessonPath={mockLessonPath} />
    );

    // ASSERT: Check that each mocked child was rendered
    expect(screen.getByText("Mocked TextBlock")).toBeInTheDocument();
    expect(screen.getByText("Mocked CodeBlock")).toBeInTheDocument();
    expect(screen.getByText("Mocked ImageBlock")).toBeInTheDocument();
    expect(screen.getByText("Mocked VideoBlock")).toBeInTheDocument();

    // Assert that each child component was called with the correct props
    // FIX: Access the first argument (props) of the first call to be more specific
    expect(vi.mocked(TextBlock).mock.calls[0][0]).toEqual({
      block: mockContent[0],
    });
    expect(vi.mocked(CodeBlock).mock.calls[0][0]).toEqual({
      block: mockContent[1],
    });
    expect(vi.mocked(ImageBlock).mock.calls[0][0]).toEqual({
      block: mockContent[2],
      courseId: mockCourseId,
      lessonPath: mockLessonPath,
    });
    expect(vi.mocked(VideoBlock).mock.calls[0][0]).toEqual({
      block: mockContent[3],
    });
  });

  it("should render a fallback message for an unknown block type", () => {
    // ARRANGE: Create an array with an unsupported block kind
    // We need to cast to 'any' to bypass TypeScript's type checking for the test
    const mockContent: ContentBlockData[] = [
      { kind: "unsupported_kind" } as any,
    ];

    render(
      <ContentRenderer content={mockContent} courseId={mockCourseId} lessonPath={mockLessonPath} />
    );

    // ASSERT
    expect(screen.getByText("Unsupported content block")).toBeInTheDocument();
  });
});
