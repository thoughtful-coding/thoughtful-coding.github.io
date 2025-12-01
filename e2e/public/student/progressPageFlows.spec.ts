import { test, expect } from "@playwright/test";

test.describe("Various progress page tests", () => {
  test("Progress page doesn't show anything via header", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "I'm a Student" }).click();
    await page
      .getByRole("link", { name: "End-to-End Tests course End-" })
      .click();
    await page.getByRole("link", { name: "Progress" }).click();
    await expect(
      page.getByText("Please log in to access this page and its functionality.")
    ).toBeVisible();
  });

  test("No learning entries via direct link", async ({ page }) => {
    await page.goto("/end-to-end-tests/progress");

    await expect(
      page.getByText("Please log in to access this page and its functionality.")
    ).toBeVisible();
  });
});
