import { test, expect, type Page } from "@playwright/test";
import {
  fillCodeEditor,
  expectSectionCompleted,
  expectSectionNotCompleted,
} from "../../../utils/testHelpers";

const LESSON_URL =
  "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/11_refactor_tests";

/** Wait for pyodide + pylint to finish loading so "Run Tests" is clickable. */
async function waitForReady(page: Page, sectionId: string) {
  await expect(
    page.locator(`#${sectionId}`).getByRole("button", { name: "Run Tests" })
  ).toBeEnabled({ timeout: 30000 });
}

async function clickTab(page: Page, sectionId: string, label: string) {
  await page.locator(`#${sectionId}`).getByRole("button", { name: label }).click();
}

async function runRefactorTests(page: Page, sectionId: string) {
  await page.locator(`#${sectionId}`).getByRole("button", { name: "Run Tests" }).click();
}

async function fillRefactorEditor(
  page: Page,
  sectionId: string,
  style: string,
  code: string
) {
  await fillCodeEditor(page, `refactor-editor-${sectionId}-${style}`, code);
}

// ---------------------------------------------------------------------------
// Shipping Calculator — 2 tabs: Function + Annotated
// ---------------------------------------------------------------------------
test.describe("RefactorSection — shipping calculator (function + annotated tabs)", () => {
  const SECTION = "shipping-refactor";

  test("shows original code read-only panel", async ({ page }) => {
    await page.goto(LESSON_URL);
    await expect(
      page.locator(`#${SECTION}`).getByText("weight1 = 5")
    ).toBeVisible();
  });

  test("clicking the Annotated tab switches the active editor", async ({
    page,
  }) => {
    await page.goto(LESSON_URL);
    await clickTab(page, SECTION, "Annotated");
    await expect(
      page.getByTestId(`refactor-editor-${SECTION}-annotated`)
    ).toBeVisible();
  });

  test("run tests with wrong return value → test 1 fails", async ({ page }) => {
    await page.goto(LESSON_URL);
    await waitForReady(page, SECTION);
    await fillRefactorEditor(
      page,
      SECTION,
      "function",
      "def shipping_cost(weight):\n    return 999"
    );
    await runRefactorTests(page, SECTION);
    await expect(
      page.locator(`#${SECTION}`).getByText("Test 1 failed. Fix the issue and try again!")
    ).toBeVisible({ timeout: 15000 });
  });

  test("function tab: correct code → Tab complete", async ({ page }) => {
    await page.goto(LESSON_URL);
    await waitForReady(page, SECTION);
    await fillRefactorEditor(
      page,
      SECTION,
      "function",
      "def shipping_cost(weight):\n    return weight * 2.50 + 3.00"
    );
    await runRefactorTests(page, SECTION);
    await expect(
      page.locator(`#${SECTION}`).getByText("Tab complete!")
    ).toBeVisible({ timeout: 15000 });
    await expect(
      page
        .locator(`#${SECTION}`)
        .getByText("All tests passed and code matches the Function style.")
    ).toBeVisible();
  });

  test("annotated tab: correct code without docstring → style issues found", async ({
    page,
  }) => {
    await page.goto(LESSON_URL);
    await waitForReady(page, SECTION);
    await clickTab(page, SECTION, "Annotated");
    await fillRefactorEditor(
      page,
      SECTION,
      "annotated",
      "def shipping_cost(weight):\n    return weight * 2.50 + 3.00"
    );
    await runRefactorTests(page, SECTION);
    await expect(
      page.locator(`#${SECTION}`).getByText("Style issues found:")
    ).toBeVisible({ timeout: 15000 });
  });

  test("annotated tab: correct code with docstring → Tab complete", async ({
    page,
  }) => {
    await page.goto(LESSON_URL);
    await waitForReady(page, SECTION);
    await clickTab(page, SECTION, "Annotated");
    await fillRefactorEditor(
      page,
      SECTION,
      "annotated",
      'def shipping_cost(weight):\n    """Calculate shipping cost."""\n    return weight * 2.50 + 3.00'
    );
    await runRefactorTests(page, SECTION);
    await expect(
      page.locator(`#${SECTION}`).getByText("Tab complete!")
    ).toBeVisible({ timeout: 15000 });
  });

  test("all tabs passed → section marked complete @flaky", async ({ page }) => {
    await page.goto(LESSON_URL);
    await expectSectionNotCompleted(page, "Refactoring: Shipping Calculator");
    await waitForReady(page, SECTION);

    // Pass function tab
    await fillRefactorEditor(
      page,
      SECTION,
      "function",
      "def shipping_cost(weight):\n    return weight * 2.50 + 3.00"
    );
    await runRefactorTests(page, SECTION);
    await expect(
      page.locator(`#${SECTION}`).getByText("Tab complete!")
    ).toBeVisible({ timeout: 15000 });

    // Pass annotated tab
    await clickTab(page, SECTION, "Annotated");
    await fillRefactorEditor(
      page,
      SECTION,
      "annotated",
      'def shipping_cost(weight):\n    """Calculate shipping cost."""\n    return weight * 2.50 + 3.00'
    );
    await runRefactorTests(page, SECTION);
    await expect(
      page.locator(`#${SECTION}`).getByText("All styles complete! Well done.")
    ).toBeVisible({ timeout: 15000 });

    await expectSectionCompleted(page, "Refactoring: Shipping Calculator");
  });
});

// ---------------------------------------------------------------------------
// Find the Maximum — 3 tabs: Function + Recursive + Annotated
// ---------------------------------------------------------------------------
test.describe("RefactorSection — find the maximum (function + recursive + annotated tabs)", () => {
  const SECTION = "findmax-refactor";

  const FUNCTION_CODE =
    "def find_max(numbers):\n    result = numbers[0]\n    for n in numbers:\n        if n > result:\n            result = n\n    return result";

  const RECURSIVE_CODE =
    "def find_max(numbers):\n    if len(numbers) == 1:\n        return numbers[0]\n    return max(numbers[0], find_max(numbers[1:]))";

  const ANNOTATED_CODE =
    'def find_max(numbers: list[int]) -> int:\n    """Return the largest number in a non-empty list."""\n    if len(numbers) == 1:\n        return numbers[0]\n    return max(numbers[0], find_max(numbers[1:]))';

  test("function tab: correct loop solution → Tab complete", async ({
    page,
  }) => {
    await page.goto(LESSON_URL);
    await waitForReady(page, SECTION);
    await fillRefactorEditor(page, SECTION, "function", FUNCTION_CODE);
    await runRefactorTests(page, SECTION);
    await expect(
      page.locator(`#${SECTION}`).getByText("Tab complete!")
    ).toBeVisible({ timeout: 15000 });
  });

  test("recursive tab: correct recursive solution → Tab complete", async ({
    page,
  }) => {
    await page.goto(LESSON_URL);
    await waitForReady(page, SECTION);
    await clickTab(page, SECTION, "Recursive");
    await fillRefactorEditor(page, SECTION, "recursive", RECURSIVE_CODE);
    await runRefactorTests(page, SECTION);
    await expect(
      page.locator(`#${SECTION}`).getByText("Tab complete!")
    ).toBeVisible({ timeout: 15000 });
  });

  test("recursive tab: non-recursive solution fails style check", async ({
    page,
  }) => {
    await page.goto(LESSON_URL);
    await waitForReady(page, SECTION);
    await clickTab(page, SECTION, "Recursive");
    // Loop solution: passes tests but fails recursive style check
    await fillRefactorEditor(page, SECTION, "recursive", FUNCTION_CODE);
    await runRefactorTests(page, SECTION);
    await expect(
      page.locator(`#${SECTION}`).getByText("Style issues found:")
    ).toBeVisible({ timeout: 15000 });
  });

  test("all three tabs passed → section marked complete @flaky", async ({
    page,
  }) => {
    await page.goto(LESSON_URL);
    await expectSectionNotCompleted(page, "Refactoring: Find the Maximum");
    await waitForReady(page, SECTION);

    // Function tab
    await fillRefactorEditor(page, SECTION, "function", FUNCTION_CODE);
    await runRefactorTests(page, SECTION);
    await expect(
      page.locator(`#${SECTION}`).getByText("Tab complete!")
    ).toBeVisible({ timeout: 15000 });

    // Recursive tab
    await clickTab(page, SECTION, "Recursive");
    await fillRefactorEditor(page, SECTION, "recursive", RECURSIVE_CODE);
    await runRefactorTests(page, SECTION);
    await expect(
      page.locator(`#${SECTION}`).getByText("Tab complete!")
    ).toBeVisible({ timeout: 15000 });

    // Annotated tab
    await clickTab(page, SECTION, "Annotated");
    await fillRefactorEditor(page, SECTION, "annotated", ANNOTATED_CODE);
    await runRefactorTests(page, SECTION);
    await expect(
      page.locator(`#${SECTION}`).getByText("All styles complete! Well done.")
    ).toBeVisible({ timeout: 15000 });

    await expectSectionCompleted(page, "Refactoring: Find the Maximum");
  });
});
