import { test, expect } from "@playwright/test";

test.describe("Test can navigate to instructor pages", () => {
  test("Make sure instructor requires auth", async ({ page }) => {
    await page.goto("/instructor-dashboard");
    await expect(
      page.getByText('Click "Sign in with Google" above to explore a live demo')
    ).toBeVisible();
  });
});
