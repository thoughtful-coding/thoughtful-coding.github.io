import { test, expect } from "@playwright/test";

test.describe("Check can navigate into and out of lessons", () => {
  test("Can go from units -> lessons -> lesson -> home", async ({ page }) => {
    await page.goto("/python/");
    await page.getByRole("button", { name: "I'm a Student" }).click();
    await page.getByRole("link", { name: "Learning to Learn image" }).click();
    await page
      .getByRole("link", { name: "Lesson 1 A Guided Tour: PRIMM" })
      .click();
    await page.getByRole("link", { name: "Home" }).click();
    await expect(
      page.getByRole("heading", { name: "A Thoughtful Approach to" })
    ).toBeVisible();
  });

  test("Can go from units -> lessons -> units", async ({ page }) => {
    await page.goto("/python/");
    await page.getByRole("button", { name: "I'm a Student" }).click();
    await page.getByRole("link", { name: "Learning to Learn image" }).click();
    await page.getByRole("link", { name: "← Back to Learning Paths" }).click();
    await expect(
      page.getByRole("heading", { name: "A Thoughtful Approach to" })
    ).toBeVisible();
  });

  test("Can go from units -> lessons -> lesson -> lessons -> units", async ({
    page,
  }) => {
    await page.goto("/python/");
    await page.getByRole("button", { name: "I'm a Student" }).click();
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
    await page.goto("/python/");
    await page.getByRole("button", { name: "I'm a Student" }).click();
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
    await page.goto("/python/");
    await page.getByRole("button", { name: "I'm a Student" }).click();
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
    await page.goto("/python/");
    await page.getByRole("button", { name: "I'm a Student" }).click();
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
});
