import { test, expect } from "@playwright/test";
import { expectAuthenticated } from "../../utils/testHelpers";

test.describe("Instructor Dashboard - Authenticated Tests", () => {
  test("Can see data on self navigating to `Class Progress` view", async ({
    page,
  }) => {
    // Verify we're authenticated and on the dashboard
    await expectAuthenticated(page);

    await page.goto("/instructor-dashboard");

    await expect(
      page.getByRole("heading", { name: "Thoughtful Dashboard" })
    ).toBeVisible();

    // Select `Science of Learning` lesson
    await page.getByRole("combobox").first().selectOption("getting-started");
    await page.getByRole("combobox").nth(1).selectOption("science_of_learning");

    // Assert parts of the dashboard
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

  test("Can see student-centric data by clicking in left-most column", async ({
    page,
  }) => {
    await expectAuthenticated(page);

    await page.goto("/instructor-dashboard");

    await expect(
      page.getByRole("heading", { name: "Thoughtful Dashboard" })
    ).toBeVisible();

    // Select `Science of Learning` lesson
    await page.getByRole("combobox").first().selectOption("getting-started");
    await page.getByRole("combobox").nth(1).selectOption("science_of_learning");
    await expect(
      page.getByRole("link", { name: "instructor-test@thoughtful." })
    ).toBeVisible();

    // Click on name of student (self) and make sure page taken to is correct
    const page1Promise = page.waitForEvent("popup");
    await page
      .getByRole("link", { name: "instructor-test@thoughtful." })
      .click();
    const page1 = await page1Promise;
    await expect(page1.getByRole("combobox").first()).toBeVisible();
    await expect(page1.getByRole("combobox").nth(1)).toBeVisible();
    await expect(
      page1.getByText("Running CodeA Guided Tour: PRIMM")
    ).toBeVisible();
    await expect(page1.getByText("completed")).toBeVisible();
  });

  test("Can see assignment-centric data by clicking in left-most column", async ({
    page,
  }) => {
    await expectAuthenticated(page);

    await page.goto("/instructor-dashboard");

    await expect(
      page.getByRole("heading", { name: "Thoughtful Dashboard" })
    ).toBeVisible();

    // Select `Science of Learning` lesson
    await page.getByRole("combobox").first().selectOption("getting-started");
    await page.getByRole("combobox").nth(1).selectOption("science_of_learning");
    await expect(
      page.getByRole("link", { name: "instructor-test@thoughtful." })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "A Guided Tour: PRIMM ↗" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Reflective Learning ↗" })
    ).toBeVisible();

    // Click on name of assignment and make sure page taken to is correct
    const page1Promise = page.waitForEvent("popup");
    await page.getByRole("link", { name: "A Guided Tour: PRIMM ↗" }).click();
    const page1 = await page1Promise;
    await expect(page1.getByText('PRIMM: "Using PRIMM on Code')).toBeVisible();
    await expect(
      page1.getByText('Reflection: "Using Reflection')
    ).toBeVisible();
    await expect(
      page1.getByText("No submissions found for this")
    ).toBeVisible();
  });
});
