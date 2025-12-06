import { screen } from "@testing-library/react";

import { render } from "../../../test-utils";
import ImageBlock from "../ImageBlock";
import type { ImageBlock as ImageBlockData, CourseId } from "../../../types/data";

describe("ImageBlock", () => {
  const mockCourseId = "getting-started" as CourseId;
  const mockLessonPath = "00_science_of_learning/lessons/00_learning_primm";

  it("constructs the correct URL for a local image source", () => {
    const mockBlock: ImageBlockData = {
      kind: "image",
      src: "images/python-logo.png",
      alt: "A local Python logo",
    };

    render(<ImageBlock block={mockBlock} courseId={mockCourseId} lessonPath={mockLessonPath} />);

    const img = screen.getByAltText("A local Python logo");
    expect(img).toBeInTheDocument();
    // Verify that the path is resolved relative to the course and unit directory
    expect(img).toHaveAttribute("src", "/data/getting-started/00_science_of_learning/images/python-logo.png");
  });

  it("uses the source URL directly for an external image", () => {
    const mockBlock: ImageBlockData = {
      kind: "image",
      src: "https://example.com/some-image.jpg",
      alt: "An external image",
    };

    render(<ImageBlock block={mockBlock} courseId={mockCourseId} lessonPath={mockLessonPath} />);

    const img = screen.getByAltText("An external image");
    expect(img).toBeInTheDocument();
    // Verify that the src is used as-is
    expect(img).toHaveAttribute("src", "https://example.com/some-image.jpg");
  });

  it("applies the maxWidth style when maxWidthPercentage is provided", () => {
    const mockBlock: ImageBlockData = {
      kind: "image",
      src: "images/another-image.png",
      alt: "A sized image",
      maxWidthPercentage: 50,
    };

    render(<ImageBlock block={mockBlock} courseId={mockCourseId} lessonPath={mockLessonPath} />);

    const img = screen.getByAltText("A sized image");
    // Use .toHaveStyle to check for inline styles
    expect(img).toHaveStyle("max-width: 50%");
  });

  it("does not apply the maxWidth style when maxWidthPercentage is not provided", () => {
    const mockBlock: ImageBlockData = {
      kind: "image",
      src: "images/full-width-image.png",
      alt: "A full-width image",
    };

    render(<ImageBlock block={mockBlock} courseId={mockCourseId} lessonPath={mockLessonPath} />);

    const img = screen.getByAltText("A full-width image");
    // FIX: Directly check the style property on the element. If it wasn't set,
    // it will be an empty string.
    expect(img.style.maxWidth).toBe("");
  });
});
