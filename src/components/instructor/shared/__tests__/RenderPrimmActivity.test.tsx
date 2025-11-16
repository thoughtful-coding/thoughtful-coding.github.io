import { screen } from "@testing-library/react";
import { vi } from "vitest";

import { render } from "../../../../test-utils";
import RenderPrimmActivity from "../RenderPrimmActivity";
import * as dataLoader from "../../../../lib/dataLoader";
import type { StoredPrimmSubmissionItem } from "../../../../types/apiServiceTypes";
import type { LessonId, SectionId } from "../../../../types/data";

// Mock the dataLoader module
vi.mock("../../../../lib/dataLoader");

// --- Mock Data ---
const mockSubmission: StoredPrimmSubmissionItem = {
  lessonId: "lesson-123" as LessonId,
  exampleId: "ex-1",
  codeSnippet: "for i in range(3):\n  print(i)",
  userPredictionPromptText: "What will this code print?",
  userPredictionText: "It will print 0, 1, 2.",
  actualOutputSummary: "It printed 0, 1, and 2, each on a new line.",
  userExplanationText: "The loop runs three times.",
  aiPredictionAssessment: "achieves",
  aiExplanationAssessment: "mostly",
  aiOverallComment: "Good job on both the prediction and explanation.",
};

describe("RenderPrimmActivity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Provide a default successful return value for the sync function
    vi.mocked(dataLoader.getLessonPathSync).mockReturnValue(
      "unit-1/primm-lesson-path"
    );
  });

  it("renders all details of a complete PRIMM submission", () => {
    render(
      <RenderPrimmActivity
        submission={mockSubmission}
        lessonTitle="Looping Constructs"
        sectionId={"sec-abc" as SectionId}
      />
    );

    // Check for titles and headers
    expect(
      screen.getByRole("heading", {
        name: /lesson\/section: looping constructs/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/sec-abc/)).toBeInTheDocument();

    // Check for student's work
    expect(screen.getByText("It will print 0, 1, 2.")).toBeInTheDocument();
    expect(screen.getByText("The loop runs three times.")).toBeInTheDocument();

    // Check for AI evaluation
    expect(screen.getByText("ACHIEVES")).toBeInTheDocument();
    expect(screen.getByText("MOSTLY")).toBeInTheDocument();
    expect(
      screen.getByText("Good job on both the prediction and explanation.")
    ).toBeInTheDocument();

    // Check for the context link
    const link = screen.getByRole("link", {
      name: "View Original Section in Lesson",
    });
    expect(link).toHaveAttribute("href", "/lesson/unit-1/primm-lesson-path");
  });

  it("handles a submission with missing optional AI feedback", () => {
    // ARRANGE: Create a submission with no explanation assessment or overall comment
    const partialSubmission: StoredPrimmSubmissionItem = {
      ...mockSubmission,
      aiExplanationAssessment: null,
      aiOverallComment: null,
    };

    render(
      <RenderPrimmActivity
        submission={partialSubmission}
        lessonTitle="Looping Constructs"
        sectionId={"sec-abc" as SectionId}
      />
    );

    // The prediction assessment should still be there
    expect(screen.getByText("ACHIEVES")).toBeInTheDocument();

    // The other AI sections should be absent
    expect(
      screen.queryByText("Explanation Assessment:")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Overall Comment:")).not.toBeInTheDocument();
    // Check for the specific fallback message
    expect(
      screen.getByText(/no detailed textual feedback provided by ai/i)
    ).toBeInTheDocument();
  });

  it("renders 'Not Assessed' when prediction assessment is missing", () => {
    const noAssessmentSubmission: StoredPrimmSubmissionItem = {
      ...mockSubmission,
      aiPredictionAssessment: null,
    };

    render(
      <RenderPrimmActivity
        submission={noAssessmentSubmission}
        lessonTitle="Looping Constructs"
        sectionId={"sec-abc" as SectionId}
      />
    );

    expect(screen.getByText("Not Assessed")).toBeInTheDocument();
  });
});
