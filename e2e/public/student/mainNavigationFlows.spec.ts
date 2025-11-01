import { test, expect } from "@playwright/test";

test.describe("Check can navigate to various top-level pages (e.g., Progress", () => {
  test("No learning entries", async ({ page }) => {
    await page.goto("/python/");
    await page.getByRole("button", { name: "I'm a Student" }).click();
    await page.getByRole("link", { name: "Learning Entries" }).click();
    await expect(
      page.getByText("Please log in to view your learning journal.")
    ).toBeVisible();
  });

  test("Add passing test to test suite", async ({ page }) => {
    await page.goto("/python/");
    await page.getByRole("button", { name: "I'm a Student" }).click();
    await page.getByRole("link", { name: "Code Editor" }).click();
    await page.getByRole("button", { name: "Add Test to Suite" }).click();
    await page.getByRole("textbox").filter({ hasText: /^$/ }).click();
    await page
      .getByRole("textbox")
      .filter({ hasText: /^$/ })
      .fill('def test_great_other():\n  assert greet("Eric) == "Hello, Eric"');
    await page.getByRole("button", { name: "Add Test to Suite" }).click();
    await page.waitForTimeout(2000);
    await page.getByRole("button", { name: "Run Active Tests" }).click();
    await expect(page.getByText("SyntaxError")).toBeVisible();
  });

  test("Add failing test to test suite", async ({ page }) => {
    await page.goto("/python/");
    await page.getByRole("button", { name: "I'm a Student" }).click();
    await page.getByRole("link", { name: "Code Editor" }).click();
    await page.getByRole("button", { name: "Add Test to Suite" }).click();
    await page.getByRole("textbox").filter({ hasText: /^$/ }).click();
    await page
      .getByRole("textbox")
      .filter({ hasText: /^$/ })
      .fill('def test_great_other():\n  assert greet("Eric") == "Eric"');
    await page.getByRole("button", { name: "Add Test to Suite" }).click();
    await page.waitForTimeout(2000);
    await page.getByRole("button", { name: "Run Active Tests" }).click();
    await expect(page.getByText("AssertionError")).toBeVisible();
  });
});
