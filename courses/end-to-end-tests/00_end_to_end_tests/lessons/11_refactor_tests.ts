import type {
  Lesson,
  LessonId,
  SectionId,
  RefactorSectionData,
} from "../../../../src/types/data";

const lessonData: Lesson = {
  title: "RefactorSection Testing",
  guid: "429c9e1d-c76a-4679-9140-75f9dfd336a9" as LessonId,
  description:
    "Sample lesson with three RefactorSection examples for end-to-end testing.",
  sections: [
    // --- Example 1: Functions and Comments (Shipping Calculator) ---
    {
      kind: "Refactor",
      id: "shipping-refactor" as SectionId,
      title: "Refactoring: Shipping Calculator",
      content: [
        {
          kind: "text",
          value:
            'The program below calculates shipping costs for three different packages. Look closely - the same formula (`weight * 2.50 + 3.00`) appears three times. The problem with this code is that it doesn\'t handle change well. What if you want to calculate different weights or what if prices go up? Adapting to this new situation would require a lot of work.\n\nThis is where functions come in. Turning code into useful functions can make programs much easier to work with and understand. Your job in this section is to turn the program step by step into a "professional looking" function.',
        },
      ],
      originalCode: [
        "weight1 = 5",
        "cost1 = weight1 * 2.50 + 3.00",
        'print(f"Package 1: ${cost1:.2f}")',
        "",
        "weight2 = 8",
        "cost2 = weight2 * 2.50 + 3.00",
        'print(f"Package 2: ${cost2:.2f}")',
        "",
        "weight3 = 3",
        "cost3 = weight3 * 2.50 + 3.00",
        'print(f"Package 3: ${cost3:.2f}")',
      ].join("\n"),
      testCases: [
        {
          input: [5],
          expected: 15.5,
          description: "5 lb package costs $15.50",
        },
        { input: [0], expected: 3.0, description: "0 lb package costs $3.00" },
        {
          input: [10],
          expected: 28.0,
          description: "10 lb package costs $28.00",
        },
      ],
      tabs: [
        {
          style: "function",
          instructions: [
            {
              kind: "text",
              value:
                "Turn the code above into a single function called `shipping_cost` that takes `weight` and returns the total cost. Your function will be tested with different weights to make sure it can handle different package sizes.",
            },
          ],
          testMode: "function",
          functionToTest: "shipping_cost",
          maxLines: 5,
        },
        {
          style: "annotated",
          instructions: [
            {
              kind: "text",
              value:
                "Your function works, but would a reader know the cost is in dollars? That the weight is in pounds? That there's a flat base fee?\n\nIn this portion, you're going to practice your documentation writing skills to make things clear to other programmers what is going on. Copy your code from the previous section and add a **docstring** explaining what the function calculates, what `weight` represents, and what it returns.\n\nNote: A good docstring answers the questions that the code can't answer on its own.",
            },
          ],
          testMode: "function",
          functionToTest: "shipping_cost",
          maxLines: 9,
        },
      ],
    } as RefactorSectionData,

    // --- Example 2: Simplify and Document (Grade Calculator) ---
    {
      kind: "Refactor",
      id: "grade-refactor" as SectionId,
      title: "Refactoring: Grade Calculator",
      content: [
        {
          kind: "text",
          value:
            "This program below works. It can be used to determine a letter grade and prints whether a student passed. But read through the code carefully. Do you notice anything... excessive?\n\nIn the program there are variables that never need to exist, variables that always hold the opposite of each other, and comparisons that could be expressed more simply. This is what developers call **code smell** — the code works, but it's overly complex.\n\nYour challenge: make this program do the same thing in fewer lines.",
        },
      ],
      originalCode: [
        "def grade_report(name, score):",
        '    result = ""',
        "    passed = False",
        "    failed = False",
        '    grade_letter = ""',
        "    temp = score",
        '    country = "USA"',
        '    state = "New York"',
        "",
        "    if temp >= 90:",
        '        grade_letter = "A"',
        '        result = "excellent"',
        "        passed = True",
        "        failed = False",
        "    elif temp >= 80:",
        '        grade_letter = "B"',
        '        result = "good"',
        "        passed = True",
        "        failed = False",
        "    elif temp >= 70:",
        '        grade_letter = "C"',
        '        result = "satisfactory"',
        "        passed = True",
        "        failed = False",
        "    elif temp >= 60:",
        '        grade_letter = "D"',
        '        result = "needs improvement"',
        "        passed = True",
        "        failed = False",
        "    else:",
        '        grade_letter = "F"',
        '        result = "failing"',
        "        passed = False",
        "        failed = True",
        "",
        "    if passed == True and failed == False:",
        '        print(f"{name}: {grade_letter} ({result}) - PASSED")',
        "    else:",
        '        print(f"{name}: {grade_letter} ({result}) - FAILED")',
      ].join("\n"),
      testCases: [
        {
          input: ["Alice", 85],
          expected: "Alice: B (good) - PASSED",
          description: "85 → B (passed)",
        },
        {
          input: ["Bob", 95],
          expected: "Bob: A (excellent) - PASSED",
          description: "95 → A (passed)",
        },
        {
          input: ["Carol", 42],
          expected: "Carol: F (failing) - FAILED",
          description: "42 → F (failed)",
        },
        {
          input: ["Dave", 60],
          expected: "Dave: D (needs improvement) - PASSED",
          description: "60 → D (boundary)",
        },
      ],
      tabs: [
        {
          style: "minimalist",
          instructions: [
            {
              kind: "text",
              value:
                "Your first task is to make the `grade_report` function easier to read. As written, it's overly complex with entire lines that aren't needed. Focus on removing things that don't add anything:\n- `failed` is always the opposite of `passed` — do you need both?\n- `temp` is just a copy of another variable\n- Some variables are initialized to empty strings but immediately overwritten",
            },
          ],
          testMode: "procedure",
          functionToTest: "grade_report",
        },
        {
          style: "simple",
          instructions: [
            {
              kind: "text",
              value:
                "You've removed the dead weight — now simplify the logic itself:\n- Is `if passed == True` the simplest way to check a boolean?\n- Do you need a `passed` variable at all, or can you derive it from the score?\n- Can you reduce the number of variables set in each branch?\n\nYour goal is to minimize the program to be under 20 lines without breaking it.",
            },
          ],
          testMode: "procedure",
          functionToTest: "grade_report",
          maxLines: 20,
        },
        {
          style: "annotated",
          instructions: [
            {
              kind: "text",
              value:
                "Now add a docstring to your `grade_report` function describing what it does and what its parameters mean.",
            },
          ],
          testMode: "procedure",
          functionToTest: "grade_report",
          maxLines: 20,
        },
      ],
    } as RefactorSectionData,

    // --- Example 3: All the Way (Find the Maximum) ---
    {
      kind: "Refactor",
      id: "findmax-refactor" as SectionId,
      title: "Refactoring: Find the Maximum",
      content: [
        {
          kind: "text",
          value:
            "The program below finds the largest number in a list — but only *this particular* list. Every value is hard-coded. It can't handle a different list, a longer list, or even a shorter one.\n\nIn this section, you're going to transform the program through three forms: a loop-based function, a recursive function, and a fully documented function. Each form produces the same correct results — only the approach changes.\n\nNote: you can assume the list always contains at least one positive number.",
        },
      ],
      originalCode: [
        "numbers = [3, 7, 2, 8, 4]",
        "biggest = 0",
        "if numbers[0] > biggest:",
        "    biggest = numbers[0]",
        "if numbers[1] > biggest:",
        "    biggest = numbers[1]",
        "if numbers[2] > biggest:",
        "    biggest = numbers[2]",
        "if numbers[3] > biggest:",
        "    biggest = numbers[3]",
        "if numbers[4] > biggest:",
        "    biggest = numbers[4]",
        "print(biggest)",
      ].join("\n"),
      testCases: [
        {
          input: [[3, 7, 2, 8, 4]],
          expected: 8,
          description: "finds max of [3, 7, 2, 8, 4]",
        },
        {
          input: [[1]],
          expected: 1,
          description: "single-element list",
        },
        {
          input: [[5, 5, 5]],
          expected: 5,
          description: "all equal",
        },
      ],
      tabs: [
        {
          style: "function",
          instructions: [
            {
              kind: "text",
              value:
                "Write a function called `find_max` that takes any list of numbers and returns the largest. Use a loop to iterate through the list.",
            },
          ],
          testMode: "function",
          functionToTest: "find_max",
          maxLines: 8,
        },
        {
          style: "recursive",
          instructions: [
            {
              kind: "text",
              value:
                "Rewrite `find_max` using **recursion** — your function must call itself.\n\nThe key insight: the maximum of a list is either the first element or the maximum of everything after it — whichever is larger. You'll also need a base case: what's the maximum of a single-element list?",
            },
          ],
          testMode: "function",
          functionToTest: "find_max",
          maxLines: 8,
        },
        {
          style: "annotated",
          instructions: [
            {
              kind: "text",
              value:
                "Make your recursive function self-documenting. Add:\n1. **Type hints**: annotate the parameter as `list[int]` and the return type as `int`\n2. **A docstring**: one or two clear sentences describing what the function does",
            },
          ],
          testMode: "function",
          functionToTest: "find_max",
          maxLines: 8,
        },
      ],
    } as RefactorSectionData,
  ],
};

export default lessonData;
