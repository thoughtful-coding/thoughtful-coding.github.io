import { expect, type Page, type Locator } from "@playwright/test";

/**
 * Fills a CodeMirror editor with the given code.
 * Automatically selects all existing text before filling.
 */
export async function fillCodeEditor(page: Page, testId: string, code: string) {
  const editor = page.getByTestId(testId);
  await editor.locator(".cm-content").click();
  await editor.press("ControlOrMeta+a");
  await editor.locator(".cm-content").fill(code);
}

/**
 * Clicks the "Run Code" button for a given section.
 */
export async function runCode(page: Page, sectionId: string) {
  await page
    .locator(`#${sectionId}`)
    .getByRole("button", { name: "Run Code" })
    .click();
}

/**
 * Clicks the "Run Tests" button for a given section.
 */
export async function runTests(page: Page, sectionId: string) {
  await page
    .locator(`#${sectionId}`)
    .getByRole("button", { name: "Run Tests" })
    .click();
}

/**
 * Expects a section to be marked as completed.
 */
export async function expectSectionCompleted(page: Page, sectionText: string) {
  const section = page.getByRole("listitem").filter({ hasText: sectionText });
  await expect(section).toHaveClass(/sectionItemCompleted/);
}

/**
 * Expects a section to NOT be marked as completed.
 */
export async function expectSectionNotCompleted(
  page: Page,
  sectionText: string
) {
  const section = page.getByRole("listitem").filter({ hasText: sectionText });
  await expect(section).not.toHaveClass(/sectionItemCompleted/);
}

/**
 * Gets a locator for a specific section container.
 */
export function getSection(page: Page, sectionId: string): Locator {
  return page.locator(`#${sectionId}`);
}

/**
 * Expects output to be visible in a section.
 */
export async function expectOutput(
  page: Page,
  sectionId: string,
  outputText: string | RegExp
) {
  await expect(
    page.locator(`#${sectionId}`).getByText(outputText)
  ).toBeVisible();
}

/**
 * Expects an error message to be visible (anywhere on page).
 */
export async function expectError(page: Page, errorText: string | RegExp) {
  await expect(page.getByText(errorText)).toBeVisible();
}

/**
 * Expects tests to pass with the given message.
 */
export async function expectTestsPass(
  page: Page,
  message: string = "All tests passed!"
) {
  await expect(page.getByText(message)).toBeVisible();
}

/**
 * Expects a specific test to fail.
 */
export async function expectTestFail(page: Page, testNumber: number) {
  await expect(
    page.getByText(`Test ${testNumber} failed. Fix the issue and try again!`)
  ).toBeVisible();
}

/**
 * Expects turtle visual tests to pass.
 */
export async function expectTurtleTestsPass(page: Page, testCount: number) {
  await expect(
    page.getByText(
      `Your drawing matched the target! All ${testCount} tests passed.`
    )
  ).toBeVisible();
}

/**
 * Expects turtle visual tests to fail at a specific test number.
 */
export async function expectTurtleTestFail(page: Page, testNumber: number) {
  await expect(
    page.getByText(
      `Test ${testNumber} failed. Fix the issue above and try again!`
    )
  ).toBeVisible();
}

/**
 * Navigates through the student portal to a specific lesson.
 */
export async function navigateToLesson(
  page: Page,
  unitName: string,
  unitImageText: string,
  lessonName: string
) {
  await page.goto("/");
  await page.getByRole("button", { name: "I'm a Student" }).click();
  await page.getByRole("link", { name: unitName }).click();
  await page.getByRole("link", { name: unitImageText }).click();
  await page.getByRole("link", { name: lessonName }).click();
}

/**
 * Clicks the "Back to Unit Overview" link.
 */
export async function backToUnitOverview(page: Page) {
  await page.getByRole("link", { name: "← Back to Unit Overview" }).click();
}

/**
 * Clicks the "Back to Learning Paths" link.
 */
export async function backToLearningPaths(page: Page) {
  await page.getByRole("link", { name: "← Back to Learning Paths" }).click();
}

/**
 * Combined helper: Fill editor, run code, expect output.
 */
export async function fillRunAndExpectOutput(
  page: Page,
  editorTestId: string,
  sectionId: string,
  code: string,
  expectedOutput: string | RegExp
) {
  await fillCodeEditor(page, editorTestId, code);
  await runCode(page, sectionId);
  await expectOutput(page, sectionId, expectedOutput);
}

/**
 * Combined helper: Fill editor, run tests, expect pass.
 */
export async function fillRunAndExpectPass(
  page: Page,
  editorTestId: string,
  sectionId: string,
  code: string,
  sectionName?: string
) {
  await fillCodeEditor(page, editorTestId, code);
  await runTests(page, sectionId);
  await expectTestsPass(page);
  if (sectionName) {
    await expectSectionCompleted(page, sectionName);
  }
}

/**
 * Combined helper: Fill editor, run tests, expect specific test to fail.
 */
export async function fillRunAndExpectTestFail(
  page: Page,
  editorTestId: string,
  sectionId: string,
  code: string,
  testNumber: number
) {
  await fillCodeEditor(page, editorTestId, code);
  await runTests(page, sectionId);
  await expectTestFail(page, testNumber);
}

/**
 * Combined helper: Fill editor, run tests, expect error.
 */
export async function fillRunAndExpectError(
  page: Page,
  editorTestId: string,
  sectionId: string,
  code: string,
  errorText: string | RegExp
) {
  await fillCodeEditor(page, editorTestId, code);
  await runTests(page, sectionId);
  await expectError(page, errorText);
}

/**
 * Waits for Pyodide to finish executing (button re-enabled).
 * Use this instead of waitForTimeout when you need to ensure code execution completes.
 */
export async function waitForCodeExecution(page: Page, sectionId: string) {
  await expect(
    page.locator(`#${sectionId}`).getByRole("button", { name: "Run Code" })
  ).toBeEnabled({ timeout: 15000 });
}

/**
 * Waits for test execution to complete (button re-enabled).
 */
export async function waitForTestExecution(page: Page, sectionId: string) {
  await expect(
    page.locator(`#${sectionId}`).getByRole("button", { name: "Run Tests" })
  ).toBeEnabled({ timeout: 15000 });
}

/**
 * Clears localStorage (useful for test isolation).
 */
export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

/**
 * Checks if user is authenticated (logout button visible).
 */
export async function expectAuthenticated(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
}

/**
 * Checks if user is NOT authenticated (sign in button visible).
 */
export async function expectNotAuthenticated(page: Page) {
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
}
