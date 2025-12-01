import { test, expect } from "@playwright/test";

test.describe("Test various routing issues", () => {
  test("should display a 404 page for a non-existent route", async ({
    page,
  }) => {
    // 1. Navigate to a URL that you know doesn't exist
    await page.goto("/intro-python/this-page-does-not-exist");

    // 2. Assert that the 404 message is visible
    //    The h2 makes this a robust selector
    await expect(
      page.getByRole("heading", { name: "404 - Page Not Found" })
    ).toBeVisible();
  });
});
