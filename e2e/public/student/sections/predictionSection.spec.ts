import { test, expect } from "@playwright/test";

test.describe("PredictionSection tests", () => {
  test("Test get complete if all predictions are right", async ({ page }) => {
    await page.goto("/python/lesson/03_functions/lessons/03_func_wrap_up");

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Predict the Outputs",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .getByRole("row", { name: "2 Run", exact: true })
      .getByPlaceholder("Predict the output")
      .click();
    await page
      .getByRole("row", { name: "2 Run", exact: true })
      .getByPlaceholder("Predict the output")
      .fill("2");
    await page
      .getByRole("row", { name: "2 2 Run" })
      .getByRole("button")
      .click();
    await page
      .locator("tr")
      .filter({ hasText: "4 Run" })
      .getByPlaceholder("Predict the output")
      .click();
    await page
      .locator("tr")
      .filter({ hasText: "4 Run" })
      .getByPlaceholder("Predict the output")
      .fill("4");
    await page
      .getByRole("row", { name: "4 4 Run" })
      .getByRole("button")
      .click();
    await page
      .getByRole("row", { name: "6 Run" })
      .getByPlaceholder("Predict the output")
      .click();
    await page
      .getByRole("row", { name: "6 Run" })
      .getByPlaceholder("Predict the output")
      .fill("6");
    await page.getByRole("row", { name: "6 Run" }).getByRole("button").click();
    await expect(page.getByText("3 / 3 predictions correct")).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });

  test("Test get 2/3 if predictions are mostly right", async ({ page }) => {
    await page.goto("/python/lesson/03_functions/lessons/03_func_wrap_up");

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Predict the Outputs",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .getByRole("row", { name: "2 Run", exact: true })
      .getByPlaceholder("Predict the output")
      .click();
    await page
      .getByRole("row", { name: "2 Run", exact: true })
      .getByPlaceholder("Predict the output")
      .fill("2");
    await page
      .getByRole("row", { name: "2 2 Run" })
      .getByRole("button")
      .click();
    await page
      .locator("tr")
      .filter({ hasText: "4 Run" })
      .getByPlaceholder("Predict the output")
      .click();
    // Intentional mistake
    await page
      .locator("tr")
      .filter({ hasText: "4 Run" })
      .getByPlaceholder("Predict the output")
      .fill("5");
    await page
      .getByRole("row", { name: "4 5 Run" })
      .getByRole("button")
      .click();
    await page
      .getByRole("row", { name: "6 Run" })
      .getByPlaceholder("Predict the output")
      .click();
    await page
      .getByRole("row", { name: "6 Run" })
      .getByPlaceholder("Predict the output")
      .fill("6");
    await page.getByRole("row", { name: "6 Run" }).getByRole("button").click();
    await expect(page.getByText("2 / 3 predictions correct")).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });

  test("Test get 3/3 if predictions for `return` functions", async ({
    page,
  }) => {
    await page.goto(
      "/python/lesson/10_functions_return/lessons/00_return_intro"
    );

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Predict the Outputs",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .getByRole("row", { name: "2 Run", exact: true })
      .getByPlaceholder("Predict the output")
      .click();
    await page
      .getByRole("row", { name: "2 Run", exact: true })
      .getByPlaceholder("Predict the output")
      .fill("2");
    await page
      .getByRole("row", { name: "2 2 Run" })
      .getByRole("button")
      .click();
    await page
      .locator("tr")
      .filter({ hasText: "4 Run" })
      .getByPlaceholder("Predict the output")
      .click();
    await page
      .locator("tr")
      .filter({ hasText: "4 Run" })
      .getByPlaceholder("Predict the output")
      .fill("4");
    await page
      .getByRole("row", { name: "4 4 Run" })
      .getByRole("button")
      .click();
    await page
      .getByRole("row", { name: "6 Run" })
      .getByPlaceholder("Predict the output")
      .click();
    await page
      .getByRole("row", { name: "6 Run" })
      .getByPlaceholder("Predict the output")
      .fill("6");
    await page.getByRole("row", { name: "6 Run" }).getByRole("button").click();
    await expect(page.getByText("3 / 3 predictions correct")).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });
});
