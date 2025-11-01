import { test, expect } from "@playwright/test";

test.describe("MultipleChoiceSection tests", () => {
  test("Can get answer right with multiple choice", async ({ page }) => {
    await page.goto(
      "/python/lesson/xx_learning/lessons/01_learning_reflection"
    );

    const sectionItem = page
      .getByRole("listitem")
      .filter({ hasText: "Why Reflection?" });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page.getByLabel("It forces you to retrieve").check();
    await page
      .locator("#reflection-quiz")
      .getByRole("button", { name: "Submit Answer" })
      .click();
    await expect(page.getByText("Correct! Re-organizing and")).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });

  test("Can get answer wrong with multiple choice", async ({ page }) => {
    await page.goto(
      "/python/lesson/xx_learning/lessons/01_learning_reflection"
    );

    const sectionItem = page
      .getByRole("listitem")
      .filter({ hasText: "Why Reflection?" });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .locator("div")
      .filter({
        hasText:
          /^It allows you to skip the parts of the code you don't understand\.$/,
      })
      .click();
    await page
      .locator("#reflection-quiz")
      .getByRole("button", { name: "Submit Answer" })
      .click();
    await expect(
      page.locator("#reflection-quiz").getByText("Oops! Time penalty active.")
    ).toBeVisible();
    await expect(page.getByText("Incorrect!")).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });
});
