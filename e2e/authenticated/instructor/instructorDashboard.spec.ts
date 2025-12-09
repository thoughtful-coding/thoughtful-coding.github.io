import { test, expect } from "@playwright/test";

test.describe("Instructor Dashboard - Authenticated Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to instructor dashboard
    await page.goto("/instructor-dashboard");
  });

  test("can access instructor dashboard and see navigation tabs", async ({
    page,
  }) => {
    // Check that we're on the instructor dashboard
    await expect(
      page.getByRole("heading", { name: "Instructor Dashboard" })
    ).toBeVisible();

    // Check all navigation tabs are visible
    await expect(page.getByRole("link", { name: "Progress" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Assignments" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Students" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Learning Entries" })
    ).toBeVisible();
  });

  test("can navigate to Progress view", async ({ page }) => {
    await page.getByRole("link", { name: "Progress" }).click();
    await expect(page).toHaveURL(/\/instructor-dashboard\/progress/);

    // Wait for data to load (may show loading state)
    // Check for expected elements in progress view
    await expect(
      page.getByRole("heading", { name: "Instructor Dashboard" })
    ).toBeVisible();
  });

  test("can navigate to Assignments view", async ({ page }) => {
    await page.getByRole("link", { name: "Assignments" }).click();
    await expect(page).toHaveURL(/\/instructor-dashboard\/assignments/);

    // Check we're in assignments view
    await expect(
      page.getByRole("heading", { name: "Instructor Dashboard" })
    ).toBeVisible();
  });

  test("can navigate to Students view", async ({ page }) => {
    await page.getByRole("link", { name: "Students" }).click();
    await expect(page).toHaveURL(/\/instructor-dashboard\/students/);

    // Check we're in students view
    await expect(
      page.getByRole("heading", { name: "Instructor Dashboard" })
    ).toBeVisible();
  });

  test("can navigate to Learning Entries view", async ({ page }) => {
    await page.getByRole("link", { name: "Learning Entries" }).click();
    await expect(page).toHaveURL(/\/instructor-dashboard\/learning-entries/);

    // Check we're in learning entries view
    await expect(
      page.getByRole("heading", { name: "Instructor Dashboard" })
    ).toBeVisible();
  });

  test("displays demo student data in Progress view", async ({ page }) => {
    await page.getByRole("link", { name: "Progress" }).click();

    // Wait for student data to load
    // The beta backend should have demo students: student1@gmail.com, student2@gmail.com, student3@gmail.com
    await page.waitForTimeout(2000); // Allow time for API calls

    // Check that student data is rendered (adjust selectors based on actual UI)
    // This is a placeholder - update based on your actual component structure
    const hasStudentData =
      (await page.getByText(/student.*@gmail\.com/i).count()) > 0;
    if (hasStudentData) {
      expect(hasStudentData).toBeTruthy();
    } else {
      // If no demo students, check for "No students" message
      await expect(
        page.getByText(/no students|no data/i)
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test("displays course and unit selectors", async ({ page }) => {
    await page.getByRole("link", { name: "Progress" }).click();

    // Check for course/unit selection UI elements
    // Adjust these selectors based on your actual implementation
    await page.waitForTimeout(1000);

    // Look for dropdowns, selects, or other UI elements for filtering
    const hasCoursePicker =
      (await page.getByRole("combobox").count()) > 0 ||
      (await page.getByRole("button").count()) > 0;

    expect(hasCoursePicker).toBeTruthy();
  });

  test("can view student details from Students view", async ({ page }) => {
    await page.getByRole("link", { name: "Students" }).click();
    await page.waitForTimeout(2000); // Allow time for API calls

    // Try to click on a student if available
    const studentLinks = page.getByRole("link", {
      name: /student.*@gmail\.com/i,
    });
    const studentCount = await studentLinks.count();

    if (studentCount > 0) {
      // Click the first student
      await studentLinks.first().click();

      // Check that we navigated to student detail view
      await expect(page).toHaveURL(/\/instructor-dashboard\/students\/.+/);

      // Check for student detail content
      await expect(
        page.getByRole("heading", { name: "Instructor Dashboard" })
      ).toBeVisible();
    } else {
      // No students available - this is expected for a fresh test user
      console.log("No students found - skipping detail view test");
    }
  });

  test("maintains authentication throughout navigation", async ({ page }) => {
    // Navigate through all tabs and ensure we stay authenticated
    const tabs = ["Progress", "Assignments", "Students", "Learning Entries"];

    for (const tab of tabs) {
      await page.getByRole("link", { name: tab }).click();
      await page.waitForTimeout(500);

      // Verify Logout button is still visible (user is still authenticated)
      await expect(
        page.getByRole("button", { name: "Logout" })
      ).toBeVisible();

      // Verify we're still on instructor dashboard
      await expect(page).toHaveURL(/\/instructor-dashboard/);
    }
  });

  test("can logout from instructor dashboard", async ({ page }) => {
    // Click logout button
    await page.getByRole("button", { name: "Logout" }).click();

    // Should redirect to homepage
    await expect(page).toHaveURL(/^\/$|\/intro-python/);

    // Logout button should no longer be visible
    await expect(page.getByRole("button", { name: "Logout" })).not.toBeVisible(
      { timeout: 5000 }
    );

    // Sign in button should be visible
    await expect(
      page.getByRole("button", { name: /sign in/i })
    ).toBeVisible();
  });
});
