import { test, expect } from "@playwright/test";

test.describe("MultipleChoiceSection tests", () => {
  test("Can get answer right with multiple choice", async ({ page }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/03_multiple_choice_tests"
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
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/03_multiple_choice_tests"
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
