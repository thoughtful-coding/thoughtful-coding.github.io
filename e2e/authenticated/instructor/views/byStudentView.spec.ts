import { test, expect } from "@playwright/test";
import { expectAuthenticated } from "../../../utils/testHelpers";

test.describe("Student View Dashboard - Authenticated Tests", () => {
  test("Test can navigate from the main banner", async ({ page }) => {
    await expectAuthenticated(page);

    await page.goto("/instructor-dashboard");
    await expect(
      page.getByRole("heading", { name: "Thoughtful Dashboard" })
    ).toBeVisible();

    // Select `Science of Learning` lesson
    await page.getByRole("link", { name: "By Student" }).click();
    await page
      .getByRole("combobox")
      .first()
      .selectOption("instructor-test@thoughtful.local");
    await page.getByRole("combobox").nth(1).selectOption("getting-started");

    // Assert parts of the view
    await expect(
      page.getByRole("heading", { name: "A Guided Tour: PRIMM" })
    ).toBeVisible();
    await expect(page.getByText("Running Code")).toBeVisible();
    await expect(page.getByText("completed")).toBeVisible();
  });

  test("Can use URL to jump to given unit/data", async ({ page }) => {
    await expectAuthenticated(page);

    // Select `Science of Learning` lesson
    await page.goto(
      "instructor-dashboard/students?course=getting-started&student=instructor-test%40thoughtful.local"
    );

    // Assert parts of the view
    await expect(
      page.getByRole("heading", { name: "A Guided Tour: PRIMM" })
    ).toBeVisible();
    await expect(page.getByText("Running Code")).toBeVisible();
    await expect(page.getByText("completed")).toBeVisible();
  });
});
