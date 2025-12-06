import type {
  Lesson,
  LessonId,
  SectionId,
  TestingSectionData,
} from "../../../../src/types/data";

const lessonData: Lesson = {
  title: "TestingSection Testing",
  guid: "cf54ab5f-e1f4-4b12-8f9f-f393c95771d1" as LessonId,
  description:
    "A sample lesson to allow end-to-end tests to test the TestingSection.",
  sections: [
    {
      kind: "Testing",
      id: "single-vs-double-testing" as SectionId,
      title: "Make: Who Goes There?",
      content: [
        {
          kind: "text",
          value:
            "Now it's your turn to write a complete program! Write a program that outputs the following two sentences, one after the other:\n\n1. `Who's out there?`\n2. `I heard Eric say \"me\".`\n\nYou should be able to create this program by adding two different strings to the `print()` statements below.\n\nOnce you're ready, check that your program works by clicking the `Run Code` button. Then, if everything looks right, click the `Run Tests` button. If the generated output matches expectations, the section will be marked complete. If there's an error, look for where the generated output differs from expectations, fix the issue, and rerun the tests.",
        },
      ],
      example: {
        visualization: "console",
        initialCode: "print()\nprint()",
      },
      testCases: [
        {
          input: [null],
          expected: 'Who\'s out there?\nI heard Eric say "me".',
          description: "Test that program produces expected output",
        },
      ],
      testMode: "procedure",
      functionToTest: "__main__",
    } as TestingSectionData,
    {
      kind: "Testing",
      id: "multi-input-testing" as SectionId,
      title: "Challenge: Create a Two Input Function",
      content: [
        {
          kind: "text",
          value:
            "Create a function that takes two inputs, adds them together, and then prints their result. To be very clear, this is what inputs should lead to which outputs:\n- 2 and 2 prints 4\n- 4 and 2 prints 6\n- 4 and 1 prints 5\n- 2 and 6 prints 8",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "def do_math(num_1, num_2):\n    # Your code here\n\ndo_math(2, 2)\ndo_math(4, 2)\ndo_math(4, 1)\ndo_math(6, 1)",
      },

      testCases: [
        {
          input: [2, 2],
          expected: "4",
          description: "Test 2, 2 -> 4",
        },
        {
          input: [4, 2],
          expected: "6",
          description: "Test 4, 2 -> 6",
        },
        {
          input: [4, 1],
          expected: "5",
          description: "Test 4, 1 -> 5",
        },
        {
          input: [2, 6],
          expected: "8",
          description: "Test 6, 1 -> 8",
        },
      ],
      testMode: "procedure",
      functionToTest: "do_math",
    } as TestingSectionData,
    {
      kind: "Testing",
      id: "return-functions-test" as SectionId,
      title: "Challenge: Create a Two Input Return Function",
      content: [
        {
          kind: "text",
          value:
            "Create a function that takes two inputs that matches the following input/output patterns:\n- 2 and 2 outputs 5\n- 4 and 2 outputs 9\n- 4 and 1 outputs 5\n- 6 and 1 outputs 7",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "def do_math(num_1, num_2):\n    # Your code here\n\nprint(do_math(2, 2))\nprint(do_math(4, 2))\nprint(do_math(4, 1))\nprint(do_math(6, 1))",
      },

      testCases: [
        {
          input: [2, 2],
          expected: "5",
          description: "Test 2, 2 -> 5",
        },
        {
          input: [4, 2],
          expected: "9",
          description: "Test 4, 2 -> 9",
        },
        {
          input: [4, 1],
          expected: "5",
          description: "Test 4, 1 -> 5",
        },
        {
          input: [6, 1],
          expected: "7",
          description: "Test 6, 1 -> 7",
        },
      ],
      testMode: "function",
      functionToTest: "do_math",
    } as TestingSectionData,

    {
      kind: "Testing",
      id: "hexagon-testing" as SectionId,
      title: "Challenge: Hexagon",
      content: [
        {
          kind: "text",
          value:
            "Now it's time to see if you can create a shape of your own without any hints! You goal is to a hexagon: a shape with 6 sides. To accomplish this goal, do the following:\n- Create a function called `make_hexagon()` that takes no inputs\n- Inside the function, use a loop to draw a six-sided figure that has **side length of 50**.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\n# Create make_hexagon() function here\n\n\n# Call your function\n",
      },
      testMode: "procedure",
      functionToTest: "make_hexagon",
      visualThreshold: 0.999,
      testCases: [
        {
          description: "Hexagon with side length 50",
          input: [],
          expected: null,
          referenceImage: "images/turtle_hexagon_50.png",
        },
      ],
    } as TestingSectionData,
    {
      kind: "Testing",
      id: "octagon-testing" as SectionId,
      title: "Challenge: Octagon with Input",
      content: [
        {
          kind: "text",
          value:
            "Now let's make your loops more flexible by using function inputs. Create an octagon (8-sided shape) that can be any size:\n- Create a function called `make_octagon(size)` that takes a single input: size\n- Inside the function, use a loop to draw an eight-sided figure where each side has length `size`\n- Call `make_octagon(55)` to test it",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\n# Create make_octagon(size) function here\n\n\n# Call your function with size 55\n",
      },
      testMode: "procedure",
      functionToTest: "make_octagon",
      visualThreshold: 0.999,
      testCases: [
        {
          description: "Octagon with side length 55",
          input: [55],
          expected: null,
          referenceImage: "images/turtle_octagon_55.png",
        },
        {
          description: "Octagon with side length 20",
          input: [20],
          expected: null,
          referenceImage: "images/turtle_octagon_20.png",
        },
      ],
    } as TestingSectionData,
  ],
};

export default lessonData;
