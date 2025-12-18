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

    await expect(page.getByText("Select a final learning entry")).toBeVisible();
    await expect(
      page.getByRole("listitem").getByText("How Print Works")
    ).toBeVisible();
    await expect(page.getByText("/18/2025, 6:47:57 AM")).toBeVisible();
    await expect(page.getByText("Print works by outputting")).toBeVisible();
  });

  test("Can use URL to jump to given unit/data", async ({ page }) => {
    await expectAuthenticated(page);

    // Select specific student
    await page.goto(
      "/instructor-dashboard/learning-entries?student=instructor-test%40thoughtful.local&filter=lesson"
    );

    await expect(page.getByText("Select a final learning entry")).toBeVisible();
    await expect(
      page.getByRole("listitem").getByText("How Print Works")
    ).toBeVisible();
    await expect(page.getByText("/18/2025, 6:47:57 AM")).toBeVisible();
    await expect(page.getByText("Print works by outputting")).toBeVisible();
  });
});
