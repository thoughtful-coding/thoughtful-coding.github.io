import { test as setup, expect } from "@playwright/test";

const authFile = ".playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  const testAuthSecret = process.env.VITE_TEST_AUTH_SECRET;
  const testUserId = process.env.VITE_TEST_USER_ID;

  if (testAuthSecret && testUserId) {
    // Automated test auth flow (beta environment)
    console.log(`Using test auth for user: ${testUserId}`);

    await page.goto("/");

    // Call the test login API directly and store tokens
    const response = await page.evaluate(
      async ({ userId, secret, apiUrl }) => {
        const res = await fetch(`${apiUrl}/auth/test-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            testUserId: userId,
            testAuthSecret: secret,
          }),
        });

        if (!res.ok) {
          const error = await res.text();
          throw new Error(`Test login failed: ${error}`);
        }

        const data = await res.json();
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        return data;
      },
      {
        userId: testUserId,
        secret: testAuthSecret,
        apiUrl:
          process.env.VITE_API_GATEWAY_BASE_URL ||
          "https://txg564rkl8.execute-api.us-west-1.amazonaws.com",
      }
    );

    console.log("Test auth login successful");

    // Reload to pick up auth state
    await page.reload();
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible({
      timeout: 10000,
    });
  } else {
    // Manual Google OAuth flow (local development)
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

  await page.context().storageState({ path: authFile });
  console.log(`Authentication state saved to ${authFile}`);
});
