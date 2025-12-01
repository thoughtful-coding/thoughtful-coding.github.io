import { test, expect } from "@playwright/test";

test.describe("DebuggerSection tests", () => {
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
});
