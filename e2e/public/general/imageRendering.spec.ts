import { test, expect } from "@playwright/test";

test.describe("Test that images exist/are rendered properly", () => {
  test('Should show an actual image from a "local" path', async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "I'm a Student" }).click();
    await page
      .getByRole("link", { name: "End-to-End Tests course End-" })
      .click();
    await page
      .getByRole("link", { name: "Section End-To-End Testing" })
      .click();
    await page.getByRole("link", { name: "Lesson 11 TestingSection" }).click();
    await expect(
      page.getByRole("img", { name: "Hexagon with side length" })
    ).toBeVisible();
  });
});
