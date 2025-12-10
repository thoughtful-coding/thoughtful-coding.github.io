import { test, expect } from "@playwright/test";
import { expectAuthenticated } from "../../../utils/testHelpers";

test.describe("Final Entry View Dashboard - Authenticated Tests", () => {
  test("Test can navigate from the main banner", async ({ page }) => {
    await expectAuthenticated(page);

    await page.goto("/instructor-dashboard");
    await expect(
      page.getByRole("heading", { name: "Thoughtful Dashboard" })
    ).toBeVisible();

    // Select specific student
    await page.getByRole("link", { name: "Final Learning Entries" }).click();
    await page
      .locator("#student-select-learning-entries")
      .selectOption("instructor-test@thoughtful.local");
    await page.locator("#entry-type-filter").selectOption("lesson");

    // Assert parts of the view
    await expect(page.getByText("No lesson learning entries")).toBeVisible();
  });

  test("Can use URL to jump to given unit/data", async ({ page }) => {
    await expectAuthenticated(page);

    // Select specific student
    await page.goto(
      "/instructor-dashboard/learning-entries?student=instructor-test%40thoughtful.local&filter=lesson"
    );

    // Assert parts of the view
    await expect(page.getByText("No lesson learning entries")).toBeVisible();
  });
});
