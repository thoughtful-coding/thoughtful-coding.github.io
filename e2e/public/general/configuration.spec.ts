import { test, expect } from "@playwright/test";

test.describe("Test can configure website", () => {
  test("Test that can switch to Dark Mode", async ({ page }) => {
    await page.goto("/");

    // Configure Dark Mode and save it
    await page.getByRole("link", { name: "Configure Settings" }).click();
    await expect(page.getByText("Manage your application")).toBeVisible();
    await expect(page.getByRole("radio", { name: "Light" })).toBeChecked();
    await expect(page.getByRole("radio", { name: "Dark" })).not.toBeChecked();
    await expect(page.getByRole("radio", { name: "System" })).not.toBeChecked();
    await page.getByRole("radio", { name: "Dark" }).check();
    await page.getByRole("button", { name: "Save Configuration" }).click();

    // Go Home
    await page.getByRole("link", { name: "Thoughtful Coding" }).click();

    // Verify still in Dark Mode
    await page.getByRole("link", { name: "Configure Settings" }).click();
    await expect(page.getByRole("radio", { name: "Light" })).not.toBeChecked();
    await expect(page.getByRole("radio", { name: "Dark" })).toBeChecked();
    await expect(page.getByRole("radio", { name: "System" })).not.toBeChecked();
  });
});
