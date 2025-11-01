import { test, expect } from "@playwright/test";

test.describe("ReflectionSection tests", () => {
  test("Test can run the PRIMM section up to requiring AI", async ({
    page,
  }) => {
    await page.goto(
      "/python/lesson/xx_learning/lessons/01_learning_reflection"
    );
    await expect(
      page.getByText("Please Log In to Get AI Feedback")
    ).toBeVisible();
    await expect(
      page.getByText("Please Log In to Submit to Journal")
    ).toBeVisible();
  });
});
