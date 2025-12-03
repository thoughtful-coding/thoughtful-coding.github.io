import { test, expect } from "@playwright/test";

test.describe("Base sanity tests", () => {
  test("Make sure homepage has a title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Thoughtful Python/);
    await expect(page.locator("#root h1")).toContainText("Thoughtful Coding");
  });
});
