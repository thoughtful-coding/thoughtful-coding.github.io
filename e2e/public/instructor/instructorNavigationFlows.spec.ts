import { test, expect } from "@playwright/test";

test("Make sure instructor requires auth", async ({ page }) => {
  await page.goto("/python/");
  await page.getByRole("button", { name: "I'm an Instructor" }).click();
  await expect(
    page.getByText(
      "explore a live demo of the instructor dashboard with three sample students"
    )
  ).toBeVisible();
});
