import { test, expect } from "@playwright/test";
import { expectAuthenticated } from "../../../utils/testHelpers";

test.describe("Progress View - Authenticated Tests", () => {
  test("Test can navigate from the main banner", async ({ page }) => {
    await expectAuthenticated(page);

    await page.goto("/instructor-dashboard");

    await expect(
      page.getByRole("heading", { name: "Thoughtful Dashboard" })
    ).toBeVisible();

    // Select `Science of Learning` lesson
    await page.getByRole("link", { name: "Class Progress" }).click();
    await page.getByRole("combobox").first().selectOption("getting-started");
    await page.getByRole("combobox").nth(1).selectOption("science_of_learning");

    // Assert parts of the view
    await expect(
      page.getByRole("link", { name: "instructor-test@thoughtful." })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "A Guided Tour: PRIMM ↗" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Reflective Learning ↗" })
    ).toBeVisible();
    await expect(page.getByText("The Science Behind the Method")).toBeVisible();
    await expect(page.getByRole("cell", { name: "33%" })).toBeVisible();
  });

  test("Test can use URL to jump to given unit/data", async ({ page }) => {
    // Verify we're authenticated and on the dashboard
    await expectAuthenticated(page);

    await page.goto(
      "/instructor-dashboard/progress?course=getting-started&unit=science_of_learning"
    );

    await expect(
      page.getByRole("heading", { name: "Thoughtful Dashboard" })
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: "instructor-test@thoughtful." })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "A Guided Tour: PRIMM ↗" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Reflective Learning ↗" })
    ).toBeVisible();
    await expect(page.getByText("The Science Behind the Method")).toBeVisible();
    await expect(page.getByRole("cell", { name: "33%" })).toBeVisible();
  });
});
