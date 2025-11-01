import { test, expect } from "@playwright/test";

test.describe("ObservationSection tests for regular code", () => {
  test("Test can click the `Run Code` button for regular code", async ({
    page,
  }) => {
    await page.goto("/python/lesson/xx_learning/lessons/00_learning_primm");

    const sectionItem = page
      .getByRole("listitem")
      .filter({ hasText: "Running Code" });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .locator("#running-code")
      .getByRole("button", { name: "Run Code" })
      .click();
    await expect(page.getByText("Hello, World! Can I call")).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });

  test("Test can get a Syntax error when clicking `Run Code` for faulty code", async ({
    page,
  }) => {
    await page.goto("/python/lesson/xx_learning/lessons/00_learning_primm");

    const sectionItem = page
      .getByRole("listitem")
      .filter({ hasText: "Running Code" });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

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

    await page
      .locator("#running-code")
      .getByRole("button", { name: "Run Code" })
      .click();
    await expect(page.getByText("SyntaxError: Traceback")).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });
});

test.describe("ObservationSection tests for turtles code", () => {
  test("Test can click the `Run Code` button for Turtle", async ({ page }) => {
    await page.goto(
      "/python/lesson/04_functions_advanced/lessons/01_func_turtles"
    );

    const sectionItem = page
      .getByRole("listitem")
      .filter({ hasText: "Your First Turtle Program" });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .locator("#first-turtle")
      .getByRole("button", { name: "Run Code" })
      .click();
    // Wait for animation to run
    await page.waitForTimeout(2000);
    await expect(
      page.locator("#first-turtle").getByRole("button", { name: "Run Code" })
    ).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });

  test("Test can click the `Run Code` button for Turtle and catch error in turtle", async ({
    page,
  }) => {
    await page.goto(
      "/python/lesson/04_functions_advanced/lessons/01_func_turtles"
    );

    const sectionItem = page
      .getByRole("listitem")
      .filter({ hasText: "Your First Turtle Program" });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page.locator(".cm-content > div:nth-child(3)").first().click();
    await page
      .getByText(
        "import turtledef make_T(): turtle.forward(100) turtle.right(90) turtle."
      )
      .fill("import turtle\n\nturtle.righ()");
    await page
      .locator("#first-turtle")
      .getByRole("button", { name: "Run Code" })
      .click();
    await expect(page.getByText("has no attribute 'righ'")).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });

  test("Test can click the `Run Code` button for Turtle and catch SyntaxError", async ({
    page,
  }) => {
    await page.goto(
      "/python/lesson/04_functions_advanced/lessons/01_func_turtles"
    );

    const sectionItem = page
      .getByRole("listitem")
      .filter({ hasText: "Your First Turtle Program" });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

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
    await page
      .locator("#first-turtle")
      .getByRole("button", { name: "Run Code" })
      .click();
    await expect(page.getByText("SyntaxError: Traceback (")).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });
});
