import { test, expect } from "@playwright/test";

test.describe("TestingSection `procedure` / `__main__` output tests", () => {
  test("Test can click `Run Code` button", async ({ page }) => {
    await page.goto("/python/lesson/00_intro/lessons/00_intro_strings");

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Challenge: Who Goes There?",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .locator("div")
      .filter({ hasText: /^912›print\(\)print\(\)$/ })
      .nth(1)
      .click();
    await page.getByText("print()print()").press("ControlOrMeta+a");
    await page
      .getByText("print()print()")
      .fill('print("Who\'s out there?")\nprint(\'I heard Eric say "me".');
    await page
      .locator("#problem1-task-grammatical-greeting")
      .getByRole("button", { name: "Run Code" })
      .click();
    await expect(
      page
        .locator("#problem1-task-grammatical-greeting")
        .getByText('Who\'s out there?\nI heard Eric say "me".')
    ).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });

  test("Test can click `Run Tests` button (w/o doing anything) and get failure", async ({
    page,
  }) => {
    await page.goto("/python/lesson/00_intro/lessons/00_intro_strings");

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Challenge: Who Goes There?",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .locator("div")
      .filter({ hasText: /^912›print\(\)print\(\)$/ })
      .nth(1)
      .click();
    await page
      .locator("#problem1-task-grammatical-greeting")
      .getByRole("button", { name: "Run Tests" })
      .click();
    await expect(
      page.getByText("Test 1 failed. Fix the issue and try again!")
    ).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });

  test("Test can click `Run Tests` button and get pass", async ({ page }) => {
    await page.goto("/python/lesson/00_intro/lessons/00_intro_strings");

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Challenge: Who Goes There?",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
    await page
      .locator("div")
      .filter({ hasText: /^912›print\(\)print\(\)$/ })
      .nth(1)
      .click();
    await page.getByText("print()print()").press("ControlOrMeta+a");
    await page
      .getByText("print()print()")
      .fill('print("Who\'s out there?")\nprint(\'I heard Eric say "me".\')');
    await page
      .locator("#problem1-task-grammatical-greeting")
      .getByRole("button", { name: "Run Tests" })
      .click();
    await expect(page.getByText("All tests passed!")).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });

  test("Test can click `Run Tests` button and get failure", async ({
    page,
  }) => {
    await page.goto("/python/lesson/00_intro/lessons/00_intro_strings");

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Challenge: Who Goes There?",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .locator("div")
      .filter({ hasText: /^912›print\(\)print\(\)$/ })
      .nth(1)
      .click();
    await page.getByText("print()print()").press("ControlOrMeta+a");
    await page
      .getByText("print()print()")
      .fill("print(\"Who's out there?\")\nprint(\"I heard Eric say 'me'.");
    await page
      .locator("#problem1-task-grammatical-greeting")
      .getByRole("button", { name: "Run Tests" })
      .click();
    await expect(
      page.getByText("Test 1 failed. Fix the issue and try again!")
    ).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });

  test("Test can have faulty program and get SyntaxError", async ({ page }) => {
    await page.goto("/python/lesson/00_intro/lessons/00_intro_strings");

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Challenge: Who Goes There?",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .locator("div")
      .filter({ hasText: /^912›print\(\)print\(\)$/ })
      .nth(1)
      .click();
    await page.getByText("print()print()").press("ControlOrMeta+a");
    await page.getByText("print()print()").fill("print(a)");
    await page
      .locator("#problem1-task-grammatical-greeting")
      .getByRole("button", { name: "Run Tests" })
      .click();
    await expect(page.getByText("name 'a' is not defined")).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });
});

test.describe("TestingSection `procedure` / `function_name` tests", () => {
  test("Test can click `Run Tests` button and get pass", async ({ page }) => {
    await page.goto("/python/lesson/03_functions/lessons/03_func_wrap_up");

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Challenge: Create a Two Input Function",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .locator("#multi-input-testing div")
      .filter({ hasText: "def do_math(num_1," })
      .nth(3)
      .click();
    await page
      .getByText("def do_math(num_1, num_2): #")
      .press("ControlOrMeta+a");
    await page.waitForTimeout(1000);
    await page
      .getByText("def do_math(num_1, num_2):")
      .fill(
        "def do_math(num_1, num_2):\n  print(num_1 * num_2 + 1)\n\n\ndo_math(2, 2)\ndo_math(4, 2)\ndo_math(4, 1)\ndo_math(6, 1)"
      );
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Run Tests" }).click();
    await expect(page.getByText("All tests passed!")).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });

  test("Test can click `Run Tests` button and get fail", async ({ page }) => {
    await page.goto("/python/lesson/03_functions/lessons/03_func_wrap_up");

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Challenge: Create a Two Input Function",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .locator("#multi-input-testing div")
      .filter({ hasText: "def do_math(num_1," })
      .nth(3)
      .click();
    await page
      .getByText("def do_math(num_1, num_2): #")
      .press("ControlOrMeta+a");
    await page.waitForTimeout(1000);
    await page
      .getByText("def do_math(num_1, num_2):")
      .fill(
        "def do_math(num_1, num_2):\n  print(5)\n\n\ndo_math(2, 2)\ndo_math(4, 2)\ndo_math(4, 1)\ndo_math(6, 1)"
      );
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Run Tests" }).click();
    await expect(
      page.getByText("Test 2 failed. Fix the issue and try again!")
    ).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });

  test("Test can click the `Run Tests` button (w/o doing anything) and get fail", async ({
    page,
  }) => {
    await page.goto("/python/lesson/03_functions/lessons/03_func_wrap_up");

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Challenge: Create a Two Input Function",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page.getByRole("button", { name: "Run Tests" }).click();
    await expect(page.getByText("IndentationError")).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });
});

test.describe("TestingSection `function` / `function_name` tests", () => {
  test("Test that can click the `Run Tests` button and get a pass", async ({
    page,
  }) => {
    await page.goto(
      "/python/lesson/10_functions_return/lessons/00_return_intro"
    );

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Challenge: Create a Two Input Function",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .locator("#return-functions-test div")
      .filter({ hasText: "def do_math(num_1," })
      .nth(3)
      .click();
    await page
      .getByText("def do_math(num_1, num_2): #")
      .press("ControlOrMeta+a");
    await page.waitForTimeout(1000);
    await page
      .getByText("def do_math(num_1, num_2):")
      .fill(
        "def do_math(num_1, num_2):\n  return num_1 * num_2 + 1\n\n\ndo_math(2, 2)\ndo_math(4, 2)\ndo_math(4, 1)\ndo_math(6, 1)"
      );
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Run Tests" }).click();
    await expect(page.getByText("All tests passed!")).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });

  test("Test can click `Run Tests` button and get fail", async ({ page }) => {
    await page.goto(
      "/python/lesson/10_functions_return/lessons/00_return_intro"
    );

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Challenge: Create a Two Input Function",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .locator("#return-functions-test div")
      .filter({ hasText: "def do_math(num_1," })
      .nth(3)
      .click();
    await page
      .getByText("def do_math(num_1, num_2): #")
      .press("ControlOrMeta+a");
    await page.waitForTimeout(1000);
    await page
      .getByText("def do_math(num_1, num_2):")
      .fill(
        "def do_math(num_1, num_2):\n  return 5\n\n\ndo_math(2, 2)\ndo_math(4, 2)\ndo_math(4, 1)\ndo_math(6, 1)"
      );
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Run Tests" }).click();
    await expect(
      page.getByText("Test 2 failed. Fix the issue and try again!")
    ).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });

  test("Test can click `Run Tests` button (w/o doing anything) and get fail", async ({
    page,
  }) => {
    await page.goto(
      "/python/lesson/10_functions_return/lessons/00_return_intro"
    );

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Challenge: Create a Two Input Function",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page.getByRole("button", { name: "Run Tests" }).click();
    await expect(page.getByText("IndentationError")).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });
});

test.describe("TestingSection for turtles", () => {
  test("Test can click `Run Tests` button and get pass for turtles for __main__ procedures @flaky", async ({
    page,
  }) => {
    await page.goto("/python/lesson/06_loops/lessons/01_loops_challenges");

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Challenge: Hexagon",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .getByRole("textbox")
      .filter({ hasText: "# Create make_hexagon() function here" })
      .locator("div")
      .nth(1)
      .click();
    await page
      .getByRole("textbox")
      .filter({ hasText: "# Create make_hexagon() function here" })
      .fill(
        "import turtle\n\nturtle.speed(0)\ndef make_hexagon():\n  # Your code here converting the code above to a loop\n  for i in range(6):\n    turtle.forward(50)\n    turtle.right(60)\n\n\nmake_hexagon()"
      );
    await page
      .locator("#hexagon-builder")
      .getByRole("button", { name: "Run Code" })
      .click();
    await page.waitForTimeout(2000);
    await page
      .locator("#hexagon-builder")
      .getByRole("button", { name: "Run Tests" })
      .click();
    await page.waitForTimeout(2000);
    await expect(
      page.getByText("Your drawing matched the target! All 1 tests passed.")
    ).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });

  test("Test that can click `Run Tests` button and get fail for turtles for __main__ procedures", async ({
    page,
  }) => {
    await page.goto("/python/lesson/06_loops/lessons/01_loops_challenges");

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Challenge: Hexagon",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .getByRole("textbox")
      .filter({ hasText: "# Create make_hexagon() function here" })
      .locator("div")
      .nth(1)
      .click();
    await page
      .getByRole("textbox")
      .filter({ hasText: "# Create make_hexagon() function here" })
      .fill(
        "import turtle\n\nturtle.speed(0)\ndef make_hexagon():\n  # Your code here converting the code above to a loop\n  for i in range(6):\n    turtle.forward(50)\n    turtle.right(61)\n\n\nmake_hexagon()"
      );
    await page
      .locator("#hexagon-builder")
      .getByRole("button", { name: "Run Code" })
      .click();
    await page.waitForTimeout(1000);
    await page
      .locator("#hexagon-builder")
      .getByRole("button", { name: "Run Tests" })
      .click();
    await page.waitForTimeout(1000);
    await expect(
      page.getByText("Test 1 failed. Fix the issue above and try again!")
    ).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });

  test("Test that an error in the program shows up when `Run Button` clicked ", async ({
    page,
  }) => {
    await page.goto("/python/lesson/06_loops/lessons/01_loops_challenges");

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Challenge: Hexagon",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .getByRole("textbox")
      .filter({ hasText: "# Create make_hexagon() function here" })
      .locator("div")
      .nth(1)
      .click();
    await page
      .getByRole("textbox")
      .filter({ hasText: "# Create make_hexagon() function here" })
      .fill(
        "import turtle\n\nturtle.speed(0)\ndef make_hexagon(size)\n  # Your code here converting the code above to a loop\n  for i in range(6):\n    turtle.forward(size)\n    turtle.right(61)\n\n\nmake_hexagon(55)"
      );
    await page
      .locator("#hexagon-builder")
      .getByRole("button", { name: "Run Code" })
      .click();
    await page.waitForTimeout(1000);
    await expect(page.getByText("SyntaxError")).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });

  test("Test that an error in the program shows up when `Run Tests` clicked ", async ({
    page,
  }) => {
    await page.goto("/python/lesson/06_loops/lessons/01_loops_challenges");

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Challenge: Hexagon",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .getByRole("textbox")
      .filter({ hasText: "# Create make_hexagon() function here" })
      .locator("div")
      .nth(1)
      .click();
    await page
      .getByRole("textbox")
      .filter({ hasText: "# Create make_hexagon() function here" })
      .fill(
        "import turtle\n\nturtle.speed(0)\ndef make_hexagon(size)\n  # Your code here converting the code above to a loop\n  for i in range(6):\n    turtle.forward(size)\n    turtle.right(61)\n\n\nmake_hexagon(55)"
      );
    await page
      .locator("#hexagon-builder")
      .getByRole("button", { name: "Run Tests" })
      .click();
    await page.waitForTimeout(1000);
    await expect(page.getByText("SyntaxError")).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });

  test("Test can click `Run Tests` button and get pass for turtles for non-__main__ procedures @flaky", async ({
    page,
  }) => {
    await page.goto("/python/lesson/06_loops/lessons/01_loops_challenges");

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Challenge: Octagon with Input",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .getByRole("textbox")
      .filter({ hasText: "# Create make_octagon(size) function here" })
      .locator("div")
      .nth(1)
      .click();
    await page
      .getByRole("textbox")
      .filter({ hasText: "# Create make_octagon(size) function here" })
      .fill(
        "import turtle\n\nturtle.speed(0)\ndef make_octagon(size):\n  # Your code here converting the code above to a loop\n  for i in range(8):\n    turtle.forward(size)\n    turtle.right(45)\n\n\nmake_octagon(55)"
      );
    await page
      .locator("#octagon-builder")
      .getByRole("button", { name: "Run Code" })
      .click();
    await page.waitForTimeout(2000);
    await page
      .locator("#octagon-builder")
      .getByRole("button", { name: "Run Tests" })
      .click();
    await page.waitForTimeout(2000);
    await expect(
      page.getByText("Your drawing matched the target! All 2 tests passed.")
    ).toBeVisible();

    await expect(sectionItem).toHaveClass(/sectionItemCompleted/);
  });

  test("Test can click `Run Tests` button and get fail for turtles for non-__main__ procedures @flaky", async ({
    page,
  }) => {
    await page.goto("/python/lesson/06_loops/lessons/01_loops_challenges");

    const sectionItem = page.getByRole("listitem").filter({
      hasText: "Challenge: Octagon with Input",
    });
    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);

    await page
      .getByRole("textbox")
      .filter({ hasText: "# Create make_octagon(size) function here" })
      .locator("div")
      .nth(1)
      .click();
    await page
      .getByRole("textbox")
      .filter({ hasText: "# Create make_octagon(size) function here" })
      .fill(
        "import turtle\n\nturtle.speed(0)\ndef make_octagon(size):\n  # Your code here converting the code above to a loop\n  for i in range(8):\n    turtle.forward(55)\n    turtle.right(45)\n\n\nmake_octagon(55)"
      );
    await page
      .locator("#octagon-builder")
      .getByRole("button", { name: "Run Code" })
      .click();
    await page.waitForTimeout(2000);
    await page
      .locator("#octagon-builder")
      .getByRole("button", { name: "Run Tests" })
      .click();
    await page.waitForTimeout(2000);
    await expect(
      page.getByText("Test 2 failed. Fix the issue above and try again!")
    ).toBeVisible();

    await expect(sectionItem).not.toHaveClass(/sectionItemCompleted/);
  });
});
