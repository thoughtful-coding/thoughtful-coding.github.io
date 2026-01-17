import { test, expect } from "@playwright/test";
import {
  fillCodeEditor,
  runCode,
  runTests,
  expectSectionCompleted,
  expectSectionNotCompleted,
  expectError,
  expectTestFail,
  expectTurtleTestsPass,
  expectTurtleTestFail,
  fillRunAndExpectOutput,
  fillRunAndExpectPass,
  fillRunAndExpectTestFail,
  fillRunAndExpectError,
} from "../../../utils/testHelpers";

test.describe("TestingSection `procedure` / `__main__` output tests", () => {
  test("Test can click `Run Code` button an get **empty** output", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await expect(
      page
        .getByTestId("code-editor-single-vs-double-testing")
        .locator("div")
        .filter({ hasText: "print()print()" })
        .nth(1)
    ).toBeVisible();
    await runCode(page, "single-vs-double-testing");
    await expect(page.locator("pre")).toBeVisible();
  });

  test("Test can click `Run Code` button and get **non-empty** output", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await fillRunAndExpectOutput(
      page,
      "code-editor-single-vs-double-testing",
      "single-vs-double-testing",
      'print("Who\'s out there?")\nprint(\'I heard Eric say "me".',
      'Who\'s out there?\nI heard Eric say "me".'
    );
  });

  test("Test can click `Run Tests` button (w/o doing anything) and get failure", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await runTests(page, "single-vs-double-testing");
    await expectTestFail(page, 1);
  });

  test("Test can click `Run Tests` button and get failure", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await fillRunAndExpectTestFail(
      page,
      "code-editor-single-vs-double-testing",
      "single-vs-double-testing",
      'print("Who\'s out there?")\nprint("I heard Eric say \'me\'.")',
      1
    );
  });

  test("Test can have faulty program and get SyntaxError", async ({ page }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await fillRunAndExpectError(
      page,
      "code-editor-single-vs-double-testing",
      "single-vs-double-testing",
      "print(a)",
      "name 'a' is not defined"
    );
  });

  test("Test can click `Run Tests` button and get pass", async ({ page }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await fillRunAndExpectPass(
      page,
      "code-editor-single-vs-double-testing",
      "single-vs-double-testing",
      'print("Who\'s out there?")\nprint(\'I heard Eric say "me".\')'
    );
  });
});

test.describe("TestingSection `procedure` / `function_name` tests", () => {
  test("Test can click `Run Tests` button and get fail", async ({ page }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await fillRunAndExpectTestFail(
      page,
      "code-editor-multi-input-testing",
      "multi-input-testing",
      "def do_math(num_1, num_2):\n  print(4)\n\n\ndo_math(2, 2)\ndo_math(4, 2)\ndo_math(4, 1)\ndo_math(6, 1)",
      2
    );
  });

  test("Test can click the `Run Tests` button (w/o doing anything) and get fail", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await runTests(page, "multi-input-testing");
    await expectError(page, "IndentationError");
  });

  test("Test can click `Run Tests` button and get pass", async ({ page }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await expectSectionNotCompleted(
      page,
      "Challenge: Create a Two Input Function"
    );

    await fillRunAndExpectPass(
      page,
      "code-editor-multi-input-testing",
      "multi-input-testing",
      "def do_math(num_1, num_2):\n  print(num_1 + num_2)\n\n\ndo_math(2, 2)\ndo_math(4, 2)\ndo_math(4, 1)\ndo_math(6, 1)",
      "Challenge: Create a Two Input Function"
    );
  });
});

test.describe("TestingSection `function` / `function_name` tests", () => {
  test("Test can click `Run Tests` button and get fail", async ({ page }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await fillRunAndExpectTestFail(
      page,
      "code-editor-return-functions-test",
      "return-functions-test",
      "def do_math(num_1, num_2):\n  return 5\n\n\ndo_math(2, 2)\ndo_math(4, 2)\ndo_math(4, 1)\ndo_math(6, 1)",
      2
    );
  });

  test("Test can click `Run Tests` button (w/o doing anything) and get fail", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await runTests(page, "return-functions-test");
    await expectError(page, "IndentationError");
  });

  test("Test that can click the `Run Tests` button and get a pass", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await expectSectionNotCompleted(
      page,
      "Challenge: Create a Two Input Return Function"
    );

    await fillRunAndExpectPass(
      page,
      "code-editor-return-functions-test",
      "return-functions-test",
      "def do_math(num_1, num_2):\n  return num_1 * num_2 + 1\n\n\ndo_math(2, 2)\ndo_math(4, 2)\ndo_math(4, 1)\ndo_math(6, 1)",
      "Challenge: Create a Two Input Return Function"
    );
  });
});

test.describe("TestingSection for turtles", () => {
  test("Test that can click `Run Tests` button and get fail for turtles for __main__ procedures", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await fillCodeEditor(
      page,
      "code-editor-hexagon-testing",
      "import turtle\n\nturtle.speed(0)\ndef make_hexagon():\n  # Your code here converting the code above to a loop\n  for i in range(6):\n    turtle.forward(50)\n    turtle.right(61)\n\n\nmake_hexagon()"
    );
    await runCode(page, "hexagon-testing");
    await runTests(page, "hexagon-testing");
    await expectTurtleTestFail(page, 1);
  });

  test("Test that an error in the program shows up when `Run Button` clicked ", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await fillCodeEditor(
      page,
      "code-editor-hexagon-testing",
      "import turtle\n\nturtle.speed(0)\ndef make_hexagon(size)\n  # Your code here converting the code above to a loop\n  for i in range(6):\n    turtle.forward(size)\n    turtle.right(61)\n\n\nmake_hexagon(55)"
    );
    await runCode(page, "hexagon-testing");
    await expectError(page, "SyntaxError");
  });

  test("Test that an error in the program shows up when `Run Tests` clicked ", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await fillCodeEditor(
      page,
      "code-editor-hexagon-testing",
      "import turtle\n\nturtle.speed(0)\ndef make_hexagon(size)\n  # Your code here converting the code above to a loop\n  for i in range(6):\n    turtle.forward(size)\n    turtle.right(61)\n\n\nmake_hexagon(55)"
    );
    await runTests(page, "hexagon-testing");
    await expectError(page, "SyntaxError");
  });

  test("Test can click `Run Tests` button and get pass for turtles for __main__ procedures @flaky", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await expectSectionNotCompleted(page, "Challenge: Hexagon");

    await fillCodeEditor(
      page,
      "code-editor-hexagon-testing",
      "import turtle\n\nturtle.speed(0)\ndef make_hexagon():\n  # Your code here converting the code above to a loop\n  for i in range(6):\n    turtle.forward(50)\n    turtle.right(60)\n\n\nmake_hexagon()"
    );
    await runCode(page, "hexagon-testing");
    await runTests(page, "hexagon-testing");
    await expectTurtleTestsPass(page, 1);
    await expectSectionCompleted(page, "Challenge: Hexagon");
  });
});

test.describe("TestingSection for turtles non-`__main__`", () => {
  test("Test can click `Run Tests` button and get fail for turtles for non-__main__ procedures @flaky", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await fillCodeEditor(
      page,
      "code-editor-octagon-testing",
      "import turtle\n\nturtle.speed(0)\ndef make_octagon(size):\n  # Your code here converting the code above to a loop\n  for i in range(8):\n    turtle.forward(55)\n    turtle.right(45)\n\n\nmake_octagon(55)"
    );
    await runCode(page, "octagon-testing");
    await runTests(page, "octagon-testing");
    await expectTurtleTestFail(page, 2);
  });

  test("Test can click `Run Tests` button and get pass for turtles for non-__main__ procedures @flaky", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await expectSectionNotCompleted(page, "Challenge: Octagon with Input");

    await fillCodeEditor(
      page,
      "code-editor-octagon-testing",
      "import turtle\n\nturtle.speed(0)\ndef make_octagon(size):\n  # Your code here converting the code above to a loop\n  for i in range(8):\n    turtle.forward(size)\n    turtle.right(45)\n\n\nmake_octagon(55)"
    );
    await runCode(page, "octagon-testing");
    await runTests(page, "octagon-testing");
    await expectTurtleTestsPass(page, 2);
    await expectSectionCompleted(page, "Challenge: Octagon with Input");
  });

  test.only("Test can click `Run Tests` button and get fail for turtle section using library", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await expectSectionNotCompleted(page, "Turtle Library Works");

    await fillCodeEditor(
      page,
      "code-editor-testing-turtle-library-works",
      "import turtle\nimport thoughtful_code\n\n# `thoughtful_code.draw_square_right(size, color)` and `thoughtful_code.draw_triangle(size, color)` are provided\n\ndef draw_house():\n    thoughtful_code.draw_square_right(50, 'yellow')\n    turtle.forward(40)\n    turtle.right(90)\n    thoughtful_code.draw_triangle_left(50, 'black')\n\n# Test the Blueprint\ndraw_house()"
    );
    await runTests(page, "testing-turtle-library-works");
    await expectTurtleTestFail(page, 1);
    await expectSectionNotCompleted(page, "Turtle Library Works");
  });

  test.only("Test can click `Run Tests` button and get pass for turtle section using library", async ({
    page,
  }) => {
    await page.goto(
      "/end-to-end-tests/lesson/00_end_to_end_tests/lessons/10_testing_tests"
    );

    await expectSectionNotCompleted(page, "Turtle Library Works");

    await fillCodeEditor(
      page,
      "code-editor-testing-turtle-library-works",
      "import turtle\nimport thoughtful_code\n\n# `thoughtful_code.draw_square_right(size, color)` and `thoughtful_code.draw_triangle_left(size, color)` are provided\n\ndef draw_house():\n    thoughtful_code.draw_square_right(50, 'yellow')\n    turtle.forward(50)\n    turtle.right(90)\n    thoughtful_code.draw_triangle_left(50, 'black')\n\n# Test the Blueprint\ndraw_house()"
    );
    await runCode(page, "testing-turtle-library-works");
    await expectSectionNotCompleted(page, "Turtle Library Works");
    await runTests(page, "testing-turtle-library-works");
    await expectTurtleTestsPass(page, 1);
    await expectSectionCompleted(page, "Turtle Library Works");
  });
});
