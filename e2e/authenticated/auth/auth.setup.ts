import { test as setup, expect } from "@playwright/test";

const authFile = ".playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  const testAuthSecret = process.env.VITE_TEST_AUTH_SECRET;
  const testUserId = process.env.VITE_TEST_USER_ID;

  if (testAuthSecret && testUserId) {
    // Automated test auth flow (beta environment)
    console.log(`Using test auth for user: ${testUserId}`);

    // Navigate to test login page
    await page.goto("/test-login");

    // Click the login button
    await page.getByRole("button", { name: "Login as Test User" }).click();

    // Wait for redirect to instructor dashboard to complete
    await page.waitForURL(/instructor-dashboard/);

    // Verify we're authenticated
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible({
      timeout: 10000,
    });

    console.log("Test auth login successful");
  } else {
    // Manual Google OAuth flow (local development without test credentials)
    console.log("No test auth credentials found. Using manual login flow...");
    await page.goto("/intro-python/");

    // IMPORTANT: Manually complete the Google login in the browser.
    //  The test will pause here until you are logged in and redirected
    //  to the homepage or dashboard.
    console.log("Please log in through the browser window...");

    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible({
      timeout: 5 * 60 * 1000, // 5 minutes to allow for manual login
    });
    console.log("Login successful. Saving authentication state...");
  }

  // Save authentication state to file
  await page.context().storageState({ path: authFile });
  console.log(`Authentication state saved to ${authFile}`);
});
