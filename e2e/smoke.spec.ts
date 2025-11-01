import { test, expect } from "@playwright/test";

test.describe("Matching Section tests", () => {
  test("Make sure homepage has a title", async ({ page }) => {
    await page.goto("/python/");
    await expect(page).toHaveTitle(/Thoughtful Python/);
    await expect(page.locator("#root h1")).toContainText("Thoughtful Python");
  });
});
