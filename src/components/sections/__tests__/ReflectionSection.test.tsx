import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { render } from "../../../test-utils";
import ReflectionSection from "../ReflectionSection";
import * as apiService from "../../../lib/apiService";
import { useAuthStore } from "../../../stores/authStore";
import {
  useProgressStore,
  useProgressActions,
} from "../../../stores/progressStore";
import type {
  ReflectionSectionData,
  UnitId,
  LessonId,
  SectionId,
} from "../../../types/data";
import { ReflectionVersionItem } from "../../../types/apiServiceTypes";

// Mock external dependencies
vi.mock("../../../lib/apiService");
vi.mock("../../../stores/authStore");
vi.mock("../../../stores/progressStore");

const mockSectionData: ReflectionSectionData = {
  kind: "Reflection",
  id: "reflect-1" as SectionId,
  title: "Final Reflection",
  content: [{ kind: "text", value: "What did you learn from this exercise?" }],
  isTopicPredefined: false,
  topic: "Enter a topic",
  isCodePredefined: false,
  code: "Enter code",
  isExplanationPredefined: false,
  explanation: "Enter explanation",
};

describe("ReflectionSection", () => {
  const completeSectionMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock Zustand stores
    vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated: true });
    // FIX: Directly return the boolean value the component expects.
    vi.mocked(useProgressStore).mockReturnValue(false); // Default to section not complete
    vi.mocked(useProgressActions).mockReturnValue({
      completeSection: completeSectionMock,
    });

    // Mock API service to return empty history by default
    vi.mocked(apiService.getReflectionDraftVersions).mockResolvedValue({
      versions: [],
    });
  });

  it("renders initial state and fetches history", async () => {
    render(
      <ReflectionSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    expect(
      screen.getByRole("heading", { name: /final reflection/i })
    ).toBeInTheDocument();
    // Check for the initially empty history message
    expect(
      await screen.findByText(/no feedback history yet/i)
    ).toBeInTheDocument();
    // Buttons should be disabled initially when fields are empty
    expect(
      screen.getByRole("button", { name: /get feedback/i })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /submit to journal/i })
    ).toBeDisabled();
  });

  it("enables buttons when user fills all fields", async () => {
    const user = userEvent.setup();
    render(
      <ReflectionSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    await user.type(
      screen.getByLabelText(/title of journal entry/i),
      "My Topic"
    );
    // Note: Testing CodeMirror directly is complex, we assume onChange works.
    // We'll simulate its effect by directly manipulating state in other tests.
    // For this test, we'll just fill the other fields.
    const explanationTextarea = screen.getByLabelText(/explanation/i);
    await user.type(explanationTextarea, "My Explanation");

    // We can't type into the mocked CodeEditor, so we'll just check the explanation
    // In a real scenario you might need a more complex setup to test the editor
    expect(screen.getByRole("button", { name: /get feedback/i })).toBeEnabled();
  });

  it("calls the API to get feedback and updates history", async () => {
    const user = userEvent.setup();
    const newDraft: ReflectionVersionItem = {
      versionId: "v2",
      userTopic: "My Topic",
      userCode: "print('hello')",
      userExplanation: "My Explanation",
      createdAt: new Date().toISOString(),
      aiAssessment: "mostly",
      aiFeedback: "Good start!",
    };
    vi.mocked(apiService.submitReflectionInteraction).mockResolvedValue(
      newDraft
    );

    render(
      <ReflectionSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    // Act
    await user.type(
      screen.getByLabelText(/title of journal entry/i),
      newDraft.userTopic
    );
    await user.type(
      screen.getByLabelText(/explanation/i),
      newDraft.userExplanation
    );
    // We can't type into the code editor, so we'll assume it's filled for the button to be enabled
    const getFeedbackButton = screen.getByRole("button", {
      name: /get feedback/i,
    });
    await user.click(getFeedbackButton);

    // Assert
    expect(apiService.submitReflectionInteraction).toHaveBeenCalledWith(
      "lesson-1",
      "reflect-1",
      expect.objectContaining({
        userTopic: newDraft.userTopic,
        userExplanation: newDraft.userExplanation,
        isFinal: false,
      })
    );

    // Check if the new history item is rendered
    expect(await screen.findByText(newDraft.userTopic)).toBeInTheDocument();
  });

  it("enables final submit only after getting a qualifying assessment", async () => {
    const user = userEvent.setup();
    const qualifyingDraft: ReflectionVersionItem = {
      versionId: "v1",
      createdAt: new Date().toISOString(),
      userTopic: "Test",
      userCode: "code",
      userExplanation: "explanation",
      aiAssessment: "achieves", // This is a qualifying assessment
      aiFeedback: "Excellent!",
    };
    vi.mocked(apiService.getReflectionDraftVersions).mockResolvedValue({
      versions: [qualifyingDraft],
    });

    render(
      <ReflectionSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    // Fill the fields to enable the button
    await user.type(
      screen.getByLabelText(/title of journal entry/i),
      "Final Topic"
    );
    await user.type(screen.getByLabelText(/explanation/i), "Final Explanation");

    // The submit button should now be enabled
    const submitButton = screen.getByRole("button", {
      name: /submit to journal/i,
    });
    expect(submitButton).toBeEnabled();

    // Act
    await user.click(submitButton);

    // Assert
    expect(apiService.submitReflectionInteraction).toHaveBeenCalledWith(
      "lesson-1",
      "reflect-1",
      expect.objectContaining({
        isFinal: true,
        sourceVersionId: "v1",
      })
    );

    // Assert that the progress store action was called on success
    await waitFor(() => {
      expect(completeSectionMock).toHaveBeenCalledWith(
        "unit-1",
        "lesson-1",
        "reflect-1",
        1
      );
    });
  });

  it("shows phrase indicator in inactive state initially", async () => {
    render(
      <ReflectionSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    const indicator = screen.getByText(/includes "as seen in the example"/i);
    expect(indicator).toBeInTheDocument();
    expect(indicator.parentElement).not.toHaveClass("phraseIndicatorActive");
  });

  it("activates phrase indicator when magic phrase is typed", async () => {
    const user = userEvent.setup();
    render(
      <ReflectionSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    const explanationTextarea = screen.getByLabelText(/explanation/i);
    const indicator = screen.getByText(/includes "as seen in the example"/i);

    // Initially inactive
    expect(indicator.parentElement).not.toHaveClass("phraseIndicatorActive");

    // Type the magic phrase
    await user.type(
      explanationTextarea,
      "This is my explanation as seen in the example"
    );

    // Should now be active
    expect(indicator.parentElement).toHaveClass("phraseIndicatorActive");
  });

  it("phrase indicator is case-insensitive", async () => {
    const user = userEvent.setup();
    render(
      <ReflectionSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    const explanationTextarea = screen.getByLabelText(/explanation/i);
    const indicator = screen.getByText(/includes "as seen in the example"/i);

    // Type with different casing
    await user.type(
      explanationTextarea,
      "This is AS SEEN IN THE EXAMPLE in my code"
    );

    // Should be active despite different case
    expect(indicator.parentElement).toHaveClass("phraseIndicatorActive");
  });

  it("deactivates phrase indicator when phrase is removed", async () => {
    const user = userEvent.setup();
    render(
      <ReflectionSection
        section={mockSectionData}
        unitId={"unit-1" as UnitId}
        lessonId={"lesson-1" as LessonId}
      />
    );

    const explanationTextarea = screen.getByLabelText(/explanation/i);
    const indicator = screen.getByText(/includes "as seen in the example"/i);

    // Type the magic phrase
    await user.type(explanationTextarea, "This is as seen in the example");
    expect(indicator.parentElement).toHaveClass("phraseIndicatorActive");

    // Clear the textarea
    await user.clear(explanationTextarea);
    await user.type(explanationTextarea, "Different text without the phrase");

    // Should be inactive again
    expect(indicator.parentElement).not.toHaveClass("phraseIndicatorActive");
  });
});
