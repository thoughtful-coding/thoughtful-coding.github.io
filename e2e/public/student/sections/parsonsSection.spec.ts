import { test, expect } from "@playwright/test";

test.describe("Parsons `procedure` / `__main__` output tests", () => {
  test("Test can click `Run Code` button", async ({ page }) => {
    await page.goto(
      "/python/lesson/12_end_to_end_tests/lessons/06_parsons_tests"
    );

    await page.getByTestId("parsons-unplaced-block-1").click();
    await page.getByTestId("parsons-empty-drop-zone").click();
    await page.getByTestId("parsons-unplaced-block-3").click();
    await page.getByTestId("parsons-drop-zone-1").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-2").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-3").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-4").click();
    await page.getByTestId("parsons-run-code-button").click();

    await expect(page.getByText("8 5")).toBeVisible();
  });

  test("Test can click `Run Tests` button with an error and get an Error", async ({
    page,
  }) => {
    await page.goto(
      "/python/lesson/12_end_to_end_tests/lessons/06_parsons_tests"
    );

    await page.getByTestId("parsons-unplaced-block-3").click();
    await page.getByTestId("parsons-empty-drop-zone").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-1").click();
    await page.getByTestId("parsons-run-code-button").click();

    await expect(page.getByText("NameError: Traceback (most")).toBeVisible();
  });

  test("Test can have faulty program and get Error during test", async ({
    page,
  }) => {
    await page.goto(
      "/python/lesson/12_end_to_end_tests/lessons/06_parsons_tests"
    );

    await page.getByTestId("parsons-unplaced-block-3").click();
    await page.getByTestId("parsons-empty-drop-zone").click();
    await page.getByTestId("parsons-run-tests-button").click();

    await expect(
      page.getByText("Error: name 'x' is not defined")
    ).toBeVisible();
  });

  test("Test can click `Run Tests` button and get failure", async ({
    page,
  }) => {
    await page.goto(
      "/python/lesson/12_end_to_end_tests/lessons/06_parsons_tests"
    );

    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-empty-drop-zone").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-1").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-2").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-2").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-3").click();
    await page.getByTestId("parsons-run-tests-button").click();

    await expect(page.getByText("Test 1 failed. Fix the issue")).toBeVisible();
    await expect(page.getByText("7 8")).toBeVisible();
  });

  test("Test can click `Run Tests` button and get pass", async ({ page }) => {
    await page.goto(
      "/python/lesson/12_end_to_end_tests/lessons/06_parsons_tests"
    );

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Order Matters",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page.getByTestId("parsons-unplaced-block-1").click();
    await page.getByTestId("parsons-empty-drop-zone").click();
    await page.getByTestId("parsons-unplaced-block-3").click();
    await page.getByTestId("parsons-drop-zone-1").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-2").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-3").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-4").click();
    await page.getByTestId("parsons-run-tests-button").click();

    await expect(page.getByText("Great job! You've arranged")).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });
});
