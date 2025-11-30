import { test, expect } from "@playwright/test";

test.describe("ReflectionSection tests", () => {
  test("Test can run the PRIMM section up to requiring AI", async ({
    page,
  }) => {
    await page.goto(
      "/python/lesson/12_end_to_end_tests/lessons/09_reflection_tests"
    );
    await expect(
      page.getByText("Please Log In to Get AI Feedback")
    ).toBeVisible();
    await expect(
      page.getByText("Please Log In to Submit to Journal")
    ).toBeVisible();
  });
});
