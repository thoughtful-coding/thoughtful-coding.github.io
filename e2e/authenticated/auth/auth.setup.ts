import { test as setup, expect } from "@playwright/test";

const authFile = ".playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/intro-python/");

  // IMPORTANT: Manually complete the Google login in the browser.
  //  The test will pause here until you are logged in and redirected
  //  to the homepage or dashboard.
  console.log("Please log in through the browser window...");

  await expect(page.getByRole("button", { name: "Logout" })).toBeVisible({
    timeout: 5 * 60 * 1000, // 5 minutes to allow for manual login
  });
  console.log("Login successful. Saving authentication state...");

  await page.context().storageState({ path: authFile });
  console.log(`Authentication state saved to ${authFile}`);
});
