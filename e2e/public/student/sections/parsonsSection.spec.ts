import { test, expect } from "@playwright/test";

test.describe("Parsons `procedure` / `__main__` output tests", () => {
  test("Test can click `Run Code` button", async ({ page }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/06_parsons_tests"
    );

    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-unplaced-block-1")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-empty-drop-zone")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-unplaced-block-3")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-drop-zone-1")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-drop-zone-2")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-drop-zone-3")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-drop-zone-4")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-run-code-button")
      .click();

    await expect(
      page
        .locator("section")
        .filter({ hasText: "Order Matters" })
        .getByText("8 5")
    ).toBeVisible();
  });

  test("Test can click `Run Tests` button with an error and get an Error", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/06_parsons_tests"
    );

    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-unplaced-block-3")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-empty-drop-zone")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-drop-zone-1")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-run-code-button")
      .click();

    await expect(
      page
        .locator("section")
        .filter({ hasText: "Order Matters" })
        .getByText("NameError: Traceback (most")
    ).toBeVisible();
  });

  test("Test can have faulty program and get Error during test", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/06_parsons_tests"
    );

    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-unplaced-block-3")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-empty-drop-zone")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-run-tests-button")
      .click();

    await expect(
      page
        .locator("section")
        .filter({ hasText: "Order Matters" })
        .getByText("Error: name 'x' is not defined")
    ).toBeVisible();
  });

  test("Test can click `Run Tests` button and get failure", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/06_parsons_tests"
    );

    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-empty-drop-zone")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-drop-zone-1")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-drop-zone-2")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-drop-zone-2")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-drop-zone-3")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-run-tests-button")
      .click();

    await expect(
      page
        .locator("section")
        .filter({ hasText: "Order Matters" })
        .getByText("Test 1 failed. Fix the issue")
    ).toBeVisible();
    await expect(
      page
        .locator("section")
        .filter({ hasText: "Order Matters" })
        .getByText("7 8")
    ).toBeVisible();
  });

  test("Test can click `Run Tests` button and get pass", async ({ page }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/06_parsons_tests"
    );

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Order Matters",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-unplaced-block-1")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-empty-drop-zone")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-unplaced-block-3")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-drop-zone-1")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-drop-zone-2")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-drop-zone-3")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-drop-zone-4")
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Order Matters" })
      .getByTestId("parsons-run-tests-button")
      .click();

    await expect(
      page
        .locator("section")
        .filter({ hasText: "Order Matters" })
        .getByText("Great job! You've arranged")
    ).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });
});

test.describe("Parsons `function` / `test_me()` output tests", () => {
  test("Test can run `Run Code` and get IndentationError", async ({ page }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/06_parsons_tests"
    );

    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page.getByText("Click here to place selected").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page.getByTestId("parsons-drop-zone-1").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-1")
      .click();
    await page.getByTestId("parsons-drop-zone-2").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-2")
      .click();
    await page.getByTestId("parsons-drop-zone-3").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-2")
      .click();
    await page.getByTestId("parsons-drop-zone-4").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-run-code-button")
      .click();

    await expect(
      page
        .locator("section")
        .filter({ hasText: "Indentation Matters" })
        .getByText("IndentationError: Traceback (most")
    ).toBeVisible();
  });

  test("Test can run `Run Code` and with proper indentation", async ({
    page,
  }) => {
    await page.goto(
      "http://localhost:5173/end-to-end-tests/lesson/00_end_to_end_tests/lessons/06_parsons_tests"
    );
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page.getByText("Click here to place selected").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page.getByTestId("parsons-drop-zone-1").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page.getByTestId("parsons-drop-zone-2").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-2")
      .click();
    await page.getByTestId("parsons-drop-zone-3").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-3")
      .click();
    await page.getByTestId("parsons-drop-zone-4").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-2")
      .click();
    await page.getByTestId("parsons-drop-zone-5").click();
    await page
      .getByTestId("parsons-placed-block-1")
      .getByRole("button", { name: "▶" })
      .click();
    await page
      .getByTestId("parsons-placed-block-2")
      .getByRole("button", { name: "▶" })
      .click();
    await page
      .getByTestId("parsons-placed-block-3")
      .getByRole("button", { name: "▶" })
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-run-code-button")
      .click();

    await expect(page.getByText("3 13")).toBeVisible();
  });

  test("Test can run `Run Tests` and get IndentationError", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/06_parsons_tests"
    );

    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page.getByText("Click here to place selected").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page.getByTestId("parsons-drop-zone-1").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-1")
      .click();
    await page.getByTestId("parsons-drop-zone-2").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-2")
      .click();
    await page.getByTestId("parsons-drop-zone-3").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-2")
      .click();
    await page.getByTestId("parsons-drop-zone-4").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-run-tests-button")
      .click();

    await expect(
      page
        .locator("section")
        .filter({ hasText: "Indentation Matters" })
        .getByText("IndentationError:")
    ).toBeVisible();
  });

  test("Test can `Run Tests` by properly setting indentation w/ failure", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/06_parsons_tests"
    );
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page.getByText("Click here to place selected").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page.getByTestId("parsons-drop-zone-1").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page.getByTestId("parsons-drop-zone-2").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-2")
      .click();
    await page.getByTestId("parsons-drop-zone-3").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-3")
      .click();
    await page.getByTestId("parsons-drop-zone-4").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-2")
      .click();
    await page.getByTestId("parsons-drop-zone-5").click();
    await page
      .getByTestId("parsons-placed-block-1")
      .getByRole("button", { name: "▶" })
      .click();
    await page
      .getByTestId("parsons-placed-block-2")
      .getByRole("button", { name: "▶" })
      .click();
    await page
      .getByTestId("parsons-placed-block-3")
      .getByRole("button", { name: "▶" })
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-run-tests-button")
      .click();

    await expect(page.getByText("14")).toBeVisible();
    await expect(page.getByText("Test 1 failed. Fix the issue")).toBeVisible();
  });

  test("Test can `Run Tests` by properly setting indentation w/ pass", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/06_parsons_tests"
    );

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Indentation Matters",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page.getByText("Click here to place selected").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-2")
      .click();
    await page.getByTestId("parsons-drop-zone-1").click();
    await page
      .getByTestId("parsons-placed-block-1")
      .getByRole("button", { name: "▶" })
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-0")
      .click();
    await page.getByTestId("parsons-drop-zone-1").click();
    await page
      .getByTestId("parsons-placed-block-1")
      .getByRole("button", { name: "▶" })
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-2")
      .click();
    await page.getByTestId("parsons-drop-zone-3").click();
    await page
      .getByTestId("parsons-placed-block-3")
      .getByRole("button", { name: "▶" })
      .click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-unplaced-block-3")
      .click();
    await page.getByTestId("parsons-drop-zone-4").click();
    await page
      .locator("section")
      .filter({ hasText: "Indentation MattersYour" })
      .getByTestId("parsons-run-tests-button")
      .click();
    await expect(page.getByText("Great job! You've arranged")).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "Test inputs of 5 and 8 outputs" })
    ).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });
});
