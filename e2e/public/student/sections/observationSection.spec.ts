import { test, expect } from "@playwright/test";
import {
  runCode,
  expectSectionCompleted,
  expectSectionNotCompleted,
  expectError,
} from "../../../utils/testHelpers";

test.describe("ObservationSection tests for regular code", () => {
  test("Test can click the `Run Code` button for regular code", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/05_observation_tests"
    );

    await expectSectionNotCompleted(page, "Running Code");
    await runCode(page, "running-code");
    await expect(page.getByText("Hello, World! Can I call")).toBeVisible();
    await expectSectionCompleted(page, "Running Code");
  });

  test("Test can get a Syntax error when clicking `Run Code` for faulty code", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/05_observation_tests"
    );

    await expectSectionNotCompleted(page, "Running Code");

    await page
      .locator("#running-code")
      .getByText('print("Hello, World!")')
      .click();
    await page
      .getByText(
        'print("Hello, World!")print("Can I call myself a programmer?")'
      )
      .fill(
        'print("Hello, World!")aaa\nprint("Can I call myself a programmer?")'
      );

    await runCode(page, "running-code");
    await expectError(page, "SyntaxError: Traceback");
    await expectSectionCompleted(page, "Running Code");
  });
});

test.describe("ObservationSection tests for turtles code", () => {
  test("Test can click the `Run Code` button for Turtle", async ({ page }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/05_observation_tests"
    );

    await expectSectionNotCompleted(page, "Your First Turtle Program");
    await runCode(page, "first-turtle");
    await expect(
      page.locator("#first-turtle").getByRole("button", { name: "Run Code" })
    ).toBeVisible();
    await expectSectionCompleted(page, "Your First Turtle Program");
  });

  test("Test can click the `Run Code` button for Turtle and catch error in turtle", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/05_observation_tests"
    );

    await expectSectionNotCompleted(page, "Your First Turtle Program");

    await page.locator(".cm-content > div:nth-child(3)").first().click();
    await page
      .getByText(
        "import turtledef make_T(): turtle.forward(100) turtle.right(90) turtle."
      )
      .fill("import turtle\n\nturtle.righ()");
    await runCode(page, "first-turtle");
    await expectError(page, "has no attribute 'righ'");
    await expectSectionNotCompleted(page, "Your First Turtle Program");
  });

  test("Test can click the `Run Code` button for Turtle and catch SyntaxError", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/05_observation_tests"
    );

    await expectSectionNotCompleted(page, "Your First Turtle Program");

    await page.locator("#first-turtle").getByText("import turtle").click();
    await page
      .getByText(
        "import turtledef make_T(): turtle.forward(100) turtle.right(90) turtle."
      )
      .press("ControlOrMeta+a");
    await page
      .getByText(
        "import turtledef make_T(): turtle.forward(100) turtle.right(90) turtle."
      )
      .fill("def h t");
    await runCode(page, "first-turtle");
    await expectError(page, "SyntaxError: Traceback (");
    await expectSectionNotCompleted(page, "Your First Turtle Program");
  });
});
