import { test, expect } from "@playwright/test";

test.describe.only("Check can navigate into and out of lessons", () => {
  test("Can go from units -> lessons -> lesson -> home", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "I'm a Student" }).click();
    await page.getByRole("link", { name: "The Science of Learning" }).click();
    await page.getByRole("link", { name: "Learning to Learn image" }).click();
    await page
      .getByRole("link", { name: "Lesson 1 A Guided Tour: PRIMM" })
      .click();
    await page.getByRole("link", { name: "Thoughtful Code" }).click();
    await expect(
      page.getByRole("heading", { name: "Welcome to Thoughtful Code" })
    ).toBeVisible();
  });

  test("Can go from units -> lessons -> units", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "I'm a Student" }).click();
    await page.getByRole("link", { name: "The Science of Learning" }).click();
    await page.getByRole("link", { name: "Learning to Learn image" }).click();
    await page.getByRole("link", { name: "← Back to Learning Paths" }).click();
    await expect(
      page.getByRole("heading", { name: "A Thoughtful Approach to" })
    ).toBeVisible();
  });

  test("Can go from units -> lessons -> lesson -> lessons -> units", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "I'm a Student" }).click();
    await page.getByRole("link", { name: "The Science of Learning" }).click();
    await page.getByRole("link", { name: "Learning to Learn image" }).click();
    await page
      .getByRole("link", { name: "Lesson 1 A Guided Tour: PRIMM" })
      .click();
    await page.getByRole("link", { name: "← Back to Unit Overview" }).click();
    await page.getByRole("link", { name: "← Back to Learning Paths" }).click();
    await expect(
      page.getByRole("heading", { name: "A Thoughtful Approach to" })
    ).toBeVisible();
  });

  test("Can hit `Previous Lesson`", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "I'm a Student" }).click();
    await page.getByRole("link", { name: "The Science of Learning" }).click();
    await page.getByRole("link", { name: "Learning to Learn image" }).click();
    await page
      .getByRole("link", { name: "Lesson 2 Reflective Learning" })
      .click();
    await page
      .locator("div")
      .filter({ hasText: /^Reflective Learning← PreviousLesson 2 of 3Next →$/ })
      .getByLabel("Previous Lesson")
      .click();
    await expect(page.getByText("A Guided Tour: PRIMM")).toBeVisible();
  });

  test("Can hit `Next Lesson`", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "I'm a Student" }).click();
    await page.getByRole("link", { name: "The Science of Learning" }).click();
    await page.getByRole("link", { name: "Learning to Learn image" }).click();
    await page
      .getByRole("link", { name: "Lesson 1 A Guided Tour: PRIMM" })
      .click();
    await page
      .locator("div")
      .filter({
        hasText: /^A Guided Tour: PRIMM← PreviousLesson 1 of 3Next →$/,
      })
      .getByLabel("Next Lesson")
      .click();

    await expect(
      page
        .locator("#reflection-intro")
        .getByRole("heading", { name: "The Importance of Reflection" })
    ).toBeVisible();
  });

  test("Can `Run Code`", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "I'm a Student" }).click();
    await page.getByRole("link", { name: "The Science of Learning" }).click();
    await page.getByRole("link", { name: "Learning to Learn image" }).click();
    await page
      .getByRole("link", { name: "Lesson 1 A Guided Tour: PRIMM" })
      .click();
    // await expect(
    //   page.getByRole("listitem").filter({ hasText: "Running Code" })
    // ).toHaveClass("/sectionItemToBeDone/");
    await page
      .locator("#running-code")
      .getByRole("button", { name: "Run Code" })
      .click();
    await expect(page.getByText("Hello, World! Can I call")).toBeVisible();
    // await expect(
    //   page.getByRole("listitem").filter({ hasText: "Running Code" })
    // ).toHaveClass("/sectionItemCompleted/");
  });

  test("Can go to a lesson by the URL", async ({ page }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/04_multiple_selection_tests"
    );

    await page
      .locator("div")
      .filter({
        hasText:
          /^MultipleSelectionSection Testing← PreviousLesson 5 of 11Next →$/,
      })
      .getByLabel("Previous Lesson")
      .click();
    await page
      .locator("div")
      .filter({
        hasText:
          /^MultipleChoiceSection Testing← PreviousLesson 4 of 11Next →$/,
      })
      .getByLabel("Previous Lesson")
      .click();
    await expect(page.getByText("Based on the definition above")).toBeVisible();
    await page.getByRole("link", { name: "← Back to Unit Overview" }).click();
    await expect(
      page.getByRole("heading", { name: "Section End-To-End Testing" })
    ).toBeVisible();
    await page.getByRole("link", { name: "← Back to Learning Paths" }).click();
    await expect(
      page.getByRole("heading", { name: "A Thoughtful Approach to" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Section End-To-End Testing" })
    ).toBeVisible();
    await page
      .getByRole("link", { name: "Section End-To-End Testing" })
      .click();
    await page.getByRole("link", { name: "Lesson 11 TestingSection" }).click();
    await expect(page.getByText("Lesson 11 of").first()).toBeVisible();
  });

  test("Can go to a unit by the URL", async ({ page }) => {
    await page.goto("/end-to-end-tests/unit/end_to_end_tests");

    await expect(page.getByText("A simulated to test the")).toBeVisible();
    await page.getByRole("link", { name: "Lesson 1 CoverageSection" }).click();
    await page
      .locator("div")
      .filter({
        hasText: /^CoverageSection Testing← PreviousLesson 1 of 11Next →$/,
      })
      .getByLabel("Next Lesson")
      .click();
    await expect(
      page.getByRole("heading", { name: "Watching Variables Change" })
    ).toBeVisible();
    await page.getByRole("link", { name: "← Back to Unit Overview" }).click();
    await page.getByRole("link", { name: "← Back to Learning Paths" }).click();
    await expect(
      page.getByRole("heading", { name: "A Thoughtful Approach to" })
    ).toBeVisible();
  });

  test("Can go to a course by the URL", async ({ page }) => {
    await page.goto("/end-to-end-tests");

    await page
      .getByRole("link", { name: "Section End-To-End Testing" })
      .click();
    await page.getByRole("link", { name: "Lesson 2 DebuggerSection" }).click();
    await expect(
      page.getByRole("heading", { name: "Watching Variables Change" })
    ).toBeVisible();
    await page
      .locator("div")
      .filter({
        hasText: /^DebuggerSection Testing← PreviousLesson 2 of 11Next →$/,
      })
      .getByLabel("Previous Lesson")
      .click();
    await page.getByRole("link", { name: "← Back to Unit Overview" }).click();
    await expect(
      page.getByRole("link", { name: "Lesson 3 MatchingSection" })
    ).toBeVisible();
    await page.getByRole("link", { name: "Learning Entries" }).click();
    await expect(page.getByText("Please log in to view your")).toBeVisible();
  });
});
