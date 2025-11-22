import { test, expect } from "@playwright/test";

test.describe("Parsons `procedure` / `__main__` output tests", () => {
  test("Test can click `Run Code` button", async ({ page }) => {
    await page.goto("/python/lesson/01_variables/lessons/04_var_wrap_up");

    await page.getByTestId("parsons-unplaced-block-2").click();
    await page.getByTestId("parsons-empty-drop-zone").click();
    await page.getByTestId("parsons-unplaced-block-2").click();
    await page.getByTestId("parsons-drop-zone-1").click();
    await page.getByTestId("parsons-unplaced-block-3").click();
    await page.getByTestId("parsons-drop-zone-2").click();
    await page.getByTestId("parsons-unplaced-block-1").click();
    await page.getByTestId("parsons-drop-zone-2").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-3").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-2").click();
    await page
      .getByTestId("parsons-placed-block-3")
      .getByRole("button", { name: "✕" })
      .click();
    await page.getByTestId("parsons-run-code-button").click();
    await expect(page.getByText("5 7")).toBeVisible();
  });

  test("Test can click `Run Tests` button with an error and get an Error", async ({
    page,
  }) => {
    await page.goto("/python/lesson/01_variables/lessons/04_var_wrap_up");

    await page.getByTestId("parsons-unplaced-block-1").click();
    await page.getByTestId("parsons-empty-drop-zone").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-1").click();
    await page.getByTestId("parsons-run-code-button").click();
    await expect(page.getByText("NameError: Traceback (most")).toBeVisible();
  });

  test("Test can have faulty program and get Error during test", async ({
    page,
  }) => {
    await page.goto("/python/lesson/01_variables/lessons/04_var_wrap_up");

    await page.getByTestId("parsons-unplaced-block-1").click();
    await page.getByTestId("parsons-empty-drop-zone").click();
    await page.getByTestId("parsons-run-tests-button").click();
    await expect(
      page.getByText("Error: name 'x' is not defined")
    ).toBeVisible();
  });

  test("Test can click `Run Tests` button and get failure", async ({
    page,
  }) => {
    await page.goto("/python/lesson/01_variables/lessons/04_var_wrap_up");

    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-empty-drop-zone").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-1").click();
    await page.getByTestId("parsons-unplaced-block-1").click();
    await page.getByTestId("parsons-drop-zone-2").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-2").click();
    await page.getByTestId("parsons-unplaced-block-1").click();
    await page.getByTestId("parsons-drop-zone-3").click();
    await page.getByTestId("parsons-run-tests-button").click();
    await expect(page.getByText("Test 1 failed. Fix the issue")).toBeVisible();
    await expect(page.getByText("8 3")).toBeVisible();
  });

  test("Test can click `Run Tests` button and get pass", async ({ page }) => {
    await page.goto("/python/lesson/01_variables/lessons/04_var_wrap_up");

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Order Matters",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page.getByTestId("parsons-unplaced-block-5").click();
    await page.getByTestId("parsons-empty-drop-zone").click();
    await page.getByTestId("parsons-unplaced-block-1").click();
    await page.getByTestId("parsons-drop-zone-0").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-0").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-2").click();
    await page.getByTestId("parsons-unplaced-block-0").click();
    await page.getByTestId("parsons-drop-zone-3").click();
    await page.getByTestId("parsons-run-tests-button").click();
    await expect(page.getByText("Great job! You've arranged")).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });
});
