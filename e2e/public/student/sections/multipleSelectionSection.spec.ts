import { test, expect } from "@playwright/test";

test.describe("MultipleSelectionSection tests", () => {
  test("Can get answer right with multiple selection", async ({ page }) => {
    await page.goto(
      "/python/lesson/xx_learning/lessons/00_learning_primm"
    );

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Getting the Most Out of",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page.getByLabel("Be specific in your prediction").check();
    await page
      .locator("div")
      .filter({ hasText: /^Be critical in your interpretation$/ })
      .click();
    await page.getByLabel("Be careful when reading the").check();
    await page.getByRole("button", { name: "Submit Answer" }).click();
    await expect(page.getByText("Correct! The more you open")).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });

  test("Can get answer wrong with multiple selection", async ({ page }) => {
    await page.goto(
      "/python/lesson/xx_learning/lessons/00_learning_primm"
    );

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Getting the Most Out of",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page.getByLabel("Be specific in your prediction").check();
    await page.getByLabel("Be verbose to let the AI know").check();
    await page
      .locator("div")
      .filter({ hasText: /^Be critical in your interpretation$/ })
      .click();
    await page.getByRole("button", { name: "Submit Answer" }).click();
    await expect(page.getByText("Incorrect!")).toBeVisible();
    await expect(page.getByText("Oops! Time penalty active.")).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });
});
