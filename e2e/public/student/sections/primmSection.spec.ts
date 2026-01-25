import { test, expect } from "@playwright/test";
import { expectSectionNotCompleted } from "../../../utils/testHelpers";

test.describe("PrimmSection tests with regular code", () => {
  test("Test can run the PRIMM section up to requiring AI", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/08_primm_tests"
    );

    const sectionItem = page
      .getByRole("listitem")
      .filter({ hasText: "Using PRIMM on Code" });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .getByRole("textbox", { name: "What do you think the program" })
      .click();
    await page
      .getByRole("textbox", { name: "What do you think the program" })
      .fill("I think it will print out two lines: a greeting and a question");
    await page
      .locator("#print-primm")
      .getByRole("button", { name: "Run Code" })
      .click();
    await page
      .getByRole("textbox", { name: "Your Reflection/Explanation:" })
      .click();
    await page
      .getByRole("textbox", { name: "Your Reflection/Explanation:" })
      .fill("I was right");
    await page
      .getByRole("button", { name: "Get AI Feedback", exact: true })
      .click();
    await expect(page.getByText("Authentication required")).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });
});

test.describe("PrimmSection tests with turtles", () => {
  test("Test can run the PRIMM turtle section up to requiring AI", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/08_primm_tests"
    );

    await expectSectionNotCompleted(page, "Drawing A Shape");

    await expect(
      page.locator("#square-primm #defaultCanvas0").first()
    ).toBeVisible();
    await page
      .getByRole("textbox", {
        name: "Look at the pattern of forward() and right() function calls. What shape do you",
      })
      .click();
    await page
      .getByRole("textbox", {
        name: "Look at the pattern of forward() and right() function calls. What shape do you",
      })
      .fill("It will make a square");
    await page
      .locator("#square-primm")
      .getByRole("button", { name: "Run Code" })
      .click();
    // Turtles take a while
    await page.waitForTimeout(2000);
    await expect(
      page.locator("#square-primm #defaultCanvas0").first()
    ).toBeVisible();
    await page
      .getByRole("textbox", { name: "Your Reflection/Explanation:" })
      .click();
    await page
      .getByRole("textbox", { name: "Your Reflection/Explanation:" })
      .fill("I was right");
    await page
      .getByRole("button", { name: "Get AI Feedback", exact: true })
      .click();
    await expect(page.getByText("Authentication required")).toBeVisible();

    await expectSectionNotCompleted(page, "Drawing A Shape");
  });

  test("Test can run the PRIMM turtle section with libraries", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/08_primm_tests"
    );

    await expectSectionNotCompleted(page, "PRIMM Turtle Library Works");

    await expect(
      page.locator("#primm-turtle-library-works #defaultCanvas0").first()
    ).toBeVisible();
    await page
      .getByRole("textbox", {
        name: "The code draws a square, then immediately draws a triangle. What shape will this produce?",
      })
      .click();
    await page
      .getByRole("textbox", {
        name: "The code draws a square, then immediately draws a triangle. What shape will this produce?",
      })
      .fill("Stuff");
    await page
      .locator("#primm-turtle-library-works")
      .getByRole("button", { name: "Run Code" })
      .click();
    // Turtles take a while
    await page.waitForTimeout(2000);
    await expect(
      page.locator("#primm-turtle-library-works #defaultCanvas0").first()
    ).toBeVisible();
    await page
      .getByRole("textbox", { name: "Your Reflection/Explanation:" })
      .click();
    await page
      .getByRole("textbox", { name: "Your Reflection/Explanation:" })
      .fill("I was right");
    await page
      .getByRole("button", { name: "Get AI Feedback", exact: true })
      .click();
    await expect(page.getByText("Authentication required")).toBeVisible();

    await expectSectionNotCompleted(page, "PRIMM Turtle Library Works");
  });

  test("Test can run the PRIMM turtle section with libraries that are broken", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/08_primm_tests"
    );

    await expectSectionNotCompleted(page, "PRIMM Turtle Library Broken");

    await expect(
      page.locator("#primm-turtle-library-broken #defaultCanvas0").first()
    ).toBeVisible();
    await page
      .getByRole("textbox", {
        name: "The code is broken intentionally.",
      })
      .click();
    await page
      .getByRole("textbox", {
        name: "The code is broken intentionally.",
      })
      .fill("Stuff");
    await page
      .locator("#primm-turtle-library-broken")
      .getByRole("button", { name: "Run Code" })
      .click();

    await page.waitForTimeout(2000);

    // TODO: need to output something here
  });
});
