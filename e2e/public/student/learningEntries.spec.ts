import { test, expect } from "@playwright/test";

test.describe("Various learning entries tests", () => {
  test("No learning entries via header", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Learning Entries" }).click();
    await expect(
      page.getByText("Please log in to view your learning journal.")
    ).toBeVisible();
  });

  test("No learning entries via direct link", async ({ page }) => {
    await page.goto("/learning-entries");

    await page.getByRole("link", { name: "Learning Entries" }).click();
    await expect(
      page.getByText("Please log in to view your learning journal.")
    ).toBeVisible();
  });
});
