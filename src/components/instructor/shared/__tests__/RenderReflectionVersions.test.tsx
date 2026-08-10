import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { render } from "../../../../test-utils";
import RenderReflectionVersions from "../RenderReflectionVersions";
import * as dataLoader from "../../../../lib/dataLoader";
import type { ReflectionVersionItem } from "../../../../types/apiServiceTypes";
import type { LessonId, SectionId } from "../../../../types/data";

// Mock the dataLoader module
vi.mock("../../../../lib/dataLoader");

// --- Mock Data ---
const mockVersions: ReflectionVersionItem[] = [
  {
    versionId: "v1-draft",
    lessonId: "lesson-1" as LessonId,
    sectionId: "sec-1" as SectionId,
    userTopic: "Initial Topic",
    userCode: "code v1",
    userExplanation: "explanation v1",
    createdAt: "2024-01-01T10:00:00Z",
    isFinal: false,
    aiAssessment: "mostly",
    aiFeedback: "Good start.",
  },
  {
    versionId: "v2-final",
    lessonId: "lesson-1" as LessonId,
    sectionId: "sec-1" as SectionId,
    userTopic: "Final Topic",
    userCode: "code v2",
    userExplanation: "explanation v2",
    createdAt: "2024-01-02T12:00:00Z",
    isFinal: true, // This is the final version
    aiAssessment: "achieves",
    aiFeedback: "Excellent!",
  },
];

describe("RenderReflectionVersions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dataLoader.getLessonPathSync).mockReturnValue(
      "unit-1/lesson-1-path"
    );
  });

  it("renders a list of reflection versions, with the newest open by default", () => {
    render(
      <RenderReflectionVersions
        versions={mockVersions}
        lessonGuid={"lesson-1" as LessonId}
        sectionId={"sec-1" as SectionId}
      />
    );

    // The main title should use the topic from the final version
    expect(
      screen.getByRole("heading", { name: /reflection: final topic/i })
    ).toBeInTheDocument();

    // Find both summary elements for the details blocks
    const summary1 = screen.getByText(/version 1 \(draft\)/i);
    const summary2 = screen.getByText(/version 2 \(final entry\)/i);
    expect(summary1).toBeInTheDocument();
    expect(summary2).toBeInTheDocument();

    // The newest version (v2) should be open by default
    // Its content should be visible
    expect(screen.getByText("explanation v2")).toBeVisible();

    // The older version (v1) should be closed by default
    // Its content should not be visible
    expect(screen.getByText("explanation v1")).not.toBeVisible();
  });

  it("expands a closed version when its summary is clicked", async () => {
    const user = userEvent.setup();
    render(
      <RenderReflectionVersions
        versions={mockVersions}
        lessonGuid={"lesson-1" as LessonId}
        sectionId={"sec-1" as SectionId}
      />
    );

    // Initially, the older version's content is not visible
    expect(screen.getByText("explanation v1")).not.toBeVisible();

    // Click the summary for the older version
    const summary1 = screen.getByText(/version 1 \(draft\)/i);
    await user.click(summary1);

    // Now, the content should be visible
    expect(screen.getByText("explanation v1")).toBeVisible();
  });

  it("renders a placeholder message when no versions are provided", () => {
    render(
      <RenderReflectionVersions
        versions={[]}
        lessonGuid={"lesson-1" as LessonId}
        sectionId={"sec-1" as SectionId}
      />
    );

    expect(
      screen.getByText("No reflection versions available.")
    ).toBeInTheDocument();
  });

  it("renders a specific message for a draft with no AI feedback", () => {
    const noFeedbackVersion: ReflectionVersionItem[] = [
      {
        ...mockVersions[0],
        aiAssessment: undefined,
        aiFeedback: undefined,
      },
    ];
    render(
      <RenderReflectionVersions
        versions={noFeedbackVersion}
        lessonGuid={"lesson-1" as LessonId}
        sectionId={"sec-1" as SectionId}
      />
    );

    expect(
      screen.getByText(/no ai feedback was requested for this draft version/i)
    ).toBeInTheDocument();
  });

  describe("reflectionKind", () => {
    const renderKind = (kind: ReflectionVersionItem["reflectionKind"]) =>
      render(
        <RenderReflectionVersions
          versions={[
            { ...mockVersions[0], userCode: "", reflectionKind: kind },
          ]}
          lessonGuid={"lesson-1" as LessonId}
          sectionId={"sec-1" as SectionId}
        />
      );

    it("omits the code block entirely for a prose reflection", () => {
      renderKind("prose");
      expect(screen.queryByText("Code:")).toBeNull();
      expect(screen.queryByText(/no code provided/i)).toBeNull();
    });

    it("still says code is missing when a code reflection has none", () => {
      // The distinction the stored kind buys: "this exercise has no code" is not
      // the same as "the student submitted no code".
      renderKind("code");
      expect(screen.getByText("Code:")).toBeInTheDocument();
      expect(screen.getByText(/no code provided/i)).toBeInTheDocument();
    });

    it("treats an entry predating the field as a code reflection", () => {
      renderKind(undefined);
      expect(screen.getByText("Code:")).toBeInTheDocument();
    });
  });
});
