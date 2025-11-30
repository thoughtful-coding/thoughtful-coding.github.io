import { test, expect } from "@playwright/test";

test.describe("Check can navigate to various top-level pages (e.g., Progress)", () => {
  test("No learning entries", async ({ page }) => {
    await page.goto("/python/");
    await page.getByRole("button", { name: "I'm a Student" }).click();
    await page.getByRole("link", { name: "Learning Entries" }).click();
    await expect(
      page.getByText("Please log in to view your learning journal.")
    ).toBeVisible();
  });

  test("Progress page doesn't show anything if not logged in", async ({
    page,
  }) => {
    await page.goto("/python/");
    await page.getByRole("button", { name: "I'm a Student" }).click();
    await page.getByRole("link", { name: "Progress" }).click();
    await expect(
      page.getByText("Please log in to access this page and its functionality.")
    ).toBeVisible();
  });
});
