import { test, expect } from "@playwright/test";
import { expectAuthenticated } from "../../../utils/testHelpers";

test.describe("Assignment View Dashboard - Authenticated Tests", () => {
  test("Test can navigate from the main banner", async ({ page }) => {
    await expectAuthenticated(page);

    await page.goto("/instructor-dashboard");
    await expect(
      page.getByRole("heading", { name: "Thoughtful Dashboard" })
    ).toBeVisible();

    // Select `Science of Learning` lesson
    await page.getByRole("link", { name: "By Assignment" }).click();
    await page.getByRole("combobox").first().selectOption("getting-started");
    await page.getByRole("combobox").nth(1).selectOption("science_of_learning");

    // Assert parts of the view
    await page.getByText('PRIMM: "Using PRIMM on Code').click();
    await expect(page.getByText('PRIMM: "Using PRIMM on Code')).toBeVisible();
    await expect(page.getByText('Reflection: "Using Reflection')).toBeVisible();
    await expect(page.getByText("No submissions found for this")).toBeVisible();
  });

  test("Can use URL to jump to given unit/data", async ({ page }) => {
    await expectAuthenticated(page);

    // Select `Science of Learning` lesson
    await page.goto(
      "/instructor-dashboard/assignments?course=getting-started&unit=science_of_learning"
    );

    // Assert parts of the view
    await page.getByText('PRIMM: "Using PRIMM on Code').click();
    await expect(page.getByText('PRIMM: "Using PRIMM on Code')).toBeVisible();
    await expect(page.getByText('Reflection: "Using Reflection')).toBeVisible();
    await expect(page.getByText("No submissions found for this")).toBeVisible();
  });
});
