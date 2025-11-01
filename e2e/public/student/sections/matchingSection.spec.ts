import { test, expect } from "@playwright/test";

test.describe("MatchingSection tests", () => {
  test("Test can get a right answer from the MatchingSection", async ({
    page,
  }) => {
    await page.goto("/python/lesson/xx_learning/lessons/00_learning_primm");

    const sectionItem = page
      .getByRole("listitem")
      .filter({ hasText: "Matching PRIMM" });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    const predictBlock = page.getByText(
      "Force yourself to try and understand a program"
    );
    const runBlock = page.getByText(
      "Generate results to compare them with your expectations"
    );
    const interpretBlock = page.getByText(
      "Understand any mistakes in your mental model"
    );
    const modifyBlock = page.getByText(
      "Challenge yourself to expand on the existing ideas"
    );
    const makeBlock = page.getByText(
      "Challenge yourself to implement your own ideas"
    );

    const dropZone = () =>
      page.locator("div").filter({ hasText: /^Drop here$/ });

    // Use tap-to-select instead of drag-and-drop for reliability
    await makeBlock.click();
    await dropZone().nth(4).click();

    await modifyBlock.click();
    await dropZone().nth(3).click();

    await interpretBlock.click();
    await dropZone().nth(2).click();

    await runBlock.click();
    await dropZone().nth(1).click();

    await predictBlock.click();
    await dropZone().nth(0).click();

    await expect(page.getByText("Correct!")).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });

  test("Test can get a wrong answer from the MatchingSection", async ({
    page,
  }) => {
    await page.goto("/python/lesson/xx_learning/lessons/00_learning_primm");

    const sectionItem = page
      .getByRole("listitem")
      .filter({ hasText: "Matching PRIMM" });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    const predictBlock = page.getByText(
      "Force yourself to try and understand a program"
    );
    const runBlock = page.getByText(
      "Generate results to compare them with your expectations"
    );
    const interpretBlock = page.getByText(
      "Understand any mistakes in your mental model"
    );
    const modifyBlock = page.getByText(
      "Challenge yourself to expand on the existing ideas"
    );
    const makeBlock = page.getByText(
      "Challenge yourself to implement your own ideas"
    );

    const dropZone = () =>
      page.locator("div").filter({ hasText: /^Drop here$/ });

    // Use tap-to-select instead of drag-and-drop for reliability
    // Place items in wrong order
    await makeBlock.click();
    await dropZone().nth(4).click();

    await modifyBlock.click();
    await dropZone().nth(3).click();

    await interpretBlock.click();
    await dropZone().nth(2).click();

    await predictBlock.click();
    await dropZone().nth(1).click();

    await runBlock.click();
    await dropZone().nth(0).click();

    await expect(
      page.getByText(
        "Not quite right. You can drag the answers to rearrange them."
      )
    ).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });
});
