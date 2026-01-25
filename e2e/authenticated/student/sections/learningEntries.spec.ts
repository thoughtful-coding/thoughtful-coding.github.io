import { test, expect } from "@playwright/test";
import { expectAuthenticated } from "../../../utils/testHelpers";

test.describe("Various learning entries tests", () => {
  test("Learning entries via header", async ({ page }) => {
    await expectAuthenticated(page);

    await page.goto("/");
    await page.getByRole("link", { name: "Learning Entries" }).click();

    await expect(
      page.getByRole("heading", { name: "Your Learning Journal" })
    ).toBeVisible();
    await expect(page.getByText("This page displays all your")).toBeVisible();
    await expect(page.getByText("How Print Works")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "from section: print-reflection" })
    ).toBeVisible();
    await expect(page.getByText("/18/2025, 6:47:57 AM")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Code Example:" })
    ).toBeVisible();
    await expect(page.getByText('print("Hello, World!") print')).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Student's Explanation:" })
    ).toBeVisible();
    await expect(page.getByText("Print works by outputting")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "+ Add New Custom Entry" })
    ).toBeVisible();
  });

  test("No learning entries via direct link", async ({ page }) => {
    await expectAuthenticated(page);

    await page.goto("/learning-entries");

    await expect(
      page.getByRole("heading", { name: "Your Learning Journal" })
    ).toBeVisible();
    await expect(page.getByText("This page displays all your")).toBeVisible();
    await expect(page.getByText("How Print Works")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "from section: print-reflection" })
    ).toBeVisible();
    await expect(page.getByText("/18/2025, 6:47:57 AM")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Code Example:" })
    ).toBeVisible();
    await expect(page.getByText('print("Hello, World!") print')).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Student's Explanation:" })
    ).toBeVisible();
    await expect(page.getByText("Print works by outputting")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "+ Add New Custom Entry" })
    ).toBeVisible();
  });
});
