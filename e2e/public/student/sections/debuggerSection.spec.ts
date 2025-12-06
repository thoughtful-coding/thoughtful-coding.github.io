import { test, expect } from "@playwright/test";

test.describe("DebuggerSection non-advanced tests", () => {
  test("Test can step through a simple program", async ({ page }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/01_debugger_tests"
    );

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Watching Variables Change",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page.locator("#variable-debugging").getByRole("button").click();
    await page.getByRole("button", { name: "Next Step →" }).click();
    await page.getByRole("button", { name: "Next Step →" }).click();
    await page.getByRole("button", { name: "Next Step →" }).click();
    await page.getByRole("button", { name: "Next Step →" }).click();
    await expect(page.getByText("Line: 5")).toBeVisible();
    await expect(page.getByText("10 20")).toBeVisible();

    // Double check that since not done debugging, don't get complete
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page.getByRole("button", { name: "Next Step →" }).click();
    await page.getByRole("button", { name: "Next Step →" }).click();
    await expect(
      page.locator("pre").filter({ hasText: "score: 25" })
    ).toBeVisible();
    await expect(page.getByText("Line: N/A")).toBeVisible();
    await expect(page.getByText("20 25")).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });

  test("Test can step through a simple program w/ Error", async ({ page }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/01_debugger_tests"
    );

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Watching Errors",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .locator("section")
      .filter({ hasText: "Watching ErrorsIntentionally" })
      .getByRole("button")
      .click();
    await page.getByRole("button", { name: "Next Step →" }).click();
    await page.getByRole("button", { name: "Next Step →" }).click();
    await page.getByRole("button", { name: "Next Step →" }).click();
    await expect(page.getByText("score: 20")).toBeVisible();
    await expect(page.getByText("Line: 4")).toBeVisible();

    await page.getByRole("button", { name: "Next Step →" }).click();
    await expect(page.getByText("Line: N/A")).toBeVisible();
    await expect(page.getByText("NameError: name 'score_x' is")).toBeVisible();
    await expect(page.locator("pre").filter({ hasText: "10" })).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });
});

test.describe("DebuggerSection non-advanced tests", () => {
  test("Test can step-into program w/ functions", async ({ page }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/01_debugger_tests"
    );

    await page
      .locator("section")
      .filter({ hasText: "Advanced Controls for" })
      .getByRole("button")
      .click();
    await page.getByRole("button", { name: "Step Into" }).click();
    await page.getByRole("button", { name: "Step Into" }).click();
    await page.getByRole("button", { name: "Step Into" }).click();
    await page.getByRole("button", { name: "Step Into" }).click();
    await expect(page.getByText("Erica", { exact: true })).toBeVisible();
    await expect(page.getByText("Line: 3")).toBeVisible();
  });

  test("Test can step-over program w/ functions", async ({ page }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/01_debugger_tests"
    );

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Advanced Controls for Debugging",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .locator("section")
      .filter({ hasText: "Advanced Controls for" })
      .getByRole("button")
      .click();
    await page.getByRole("button", { name: "Step Over" }).click();
    await page.getByRole("button", { name: "Step Over" }).click();
    await page.getByRole("button", { name: "Step Over" }).click();
    await page.getByRole("button", { name: "Step Over" }).click();
    await expect(page.getByText("Erica Erica bye bye")).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });
});
