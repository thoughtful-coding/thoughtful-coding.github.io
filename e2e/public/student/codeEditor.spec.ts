import { test, expect } from "@playwright/test";

test.describe("Check can add tests to Code Editor ad top bar", () => {
  test("Add passing test to test suite", async ({ page }) => {
    await page.goto("/");
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
    await page.goto("/");
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
