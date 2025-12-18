import { test, expect } from "@playwright/test";

test.describe("ReflectionSection tests", () => {
  test("Test can run the PRIMM section up to requiring AI", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/09_reflection_tests"
    );

    await expect(
      page.getByRole("textbox", { name: "Title of Journal Entry" })
    ).toBeVisible();
    await expect(
      page.getByText('"Hello, World!"', { exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Explanation" })
    ).toBeVisible();
    await expect(
      page.getByText("12/18/2025, 6:47:53 AM", { exact: true })
    ).toBeVisible();
    await page.getByText("Show Submitted Content & AI").click();
    await expect(page.getByText('print("Hello, World!") print')).toBeVisible();
    await expect(
      page
        .getByRole("paragraph")
        .filter({ hasText: "Print works by outputting" })
    ).toBeVisible();
    await expect(page.getByText("AI Assessment: Achieves")).toBeVisible();
    await expect(page.getByText("Your explanation is accurate")).toBeVisible();
  });

  test.only('Test "as seen in example" checker', async ({ page }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/09_reflection_tests"
    );

    await expect(
      page.getByRole("textbox", { name: "Title of Journal Entry" })
    ).toBeVisible();
    await expect(
      page.getByText('"Hello, World!"', { exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Explanation" })
    ).toBeVisible();
    await expect(
      page.getByText("12/18/2025, 6:47:53 AM", { exact: true })
    ).toBeVisible();
    await page.getByText("Show Submitted Content & AI").click();
    await expect(page.getByText('print("Hello, World!") print')).toBeVisible();

    // Make sure old explanation is populated (and causes check to be green)
    const textChecker = page.getByText('Includes "as seen in the example"');
    const colorFirst = await textChecker.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    expect(colorFirst).toBe("rgb(40, 167, 69)");

    // Check that delete causes check to go grey
    await page.getByRole("textbox", { name: "Explanation" }).click();
    await page
      .getByRole("textbox", { name: "Explanation" })
      .press("ControlOrMeta+a");
    await page.getByRole("textbox", { name: "Explanation" }).fill("");
    const colorSecond = await textChecker.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    expect(colorSecond).not.toBe("rgb(40, 167, 69)");

    // Check that filling stuff back in causes check to be green
    await page.getByRole("textbox", { name: "Explanation" }).click();
    await page
      .getByRole("textbox", { name: "Explanation" })
      .fill("As seen in the example above");
    const colorThird = await textChecker.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    expect(colorThird).toBe("rgb(40, 167, 69)");
  });
});
