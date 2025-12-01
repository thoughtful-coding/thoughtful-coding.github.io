import type {
  CoverageSectionData,
  InformationSectionData,
  Lesson,
  LessonId,
  PredictionSectionData,
  SectionId,
  TestingSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Returning to Functions",
  guid: "d6b6048d-ebb0-4ac8-9b06-60ad1134eaaa" as LessonId,
  description:
    "Learn about return statements and how they are different from what you've seen before.",
  sections: [
    {
      kind: "Information",
      id: "review-intro" as SectionId,
      title: "Practicing with Interleaving",
      content: [
        {
          kind: "text",
          value:
            "You've learned a lot in the previous three lessons: how to create functions, how to call functions, and how to use function input values. As with the previous review section, this lesson uses **interleaving** to help solidify your understanding. By pulling in everything you've learned so far and asking questions about it in a mixed up order, your brain will be able to make stronger connections between the concepts. Be sure to take your time and think carefully about each problem!",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Testing",
      id: "return-functions-test" as SectionId,
      title: "Challenge: Create a Two Input Function",
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
      kind: "Coverage",
      id: "age-coverage" as SectionId,
      title: "Make It Return That!",
      content: [
        {
          kind: "text",
          value:
            "The code below is a simple function that determines, based on age, whether you're an adult or a minor. An `if`/`else` is perfect for this situation because you can only be one of these two things. It's a \"binary\" choice. Provide ages that will produce each output shown:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def categorize_age(age):\n    if age < 18:\n        return "You\'re a minor"\n    else:\n        return "You\'re an adult"',
      },
      testMode: "function",
      functionToTest: "categorize_age",
      coverageTable: {
        columns: [
          {
            variableName: "age",
            variableType: "number",
          },
        ],
        rows: [
          {
            fixedInputs: {},
            expectedOutput: "You're a minor",
            hint: "What age is less than 18?",
          },
          {
            fixedInputs: {},
            expectedOutput: "You're an adult",
            hint: "What age is 18 or more?",
          },
        ],
      },
    } as CoverageSectionData,
    {
      kind: "Prediction",
      id: "multi-output-testing" as SectionId,
      title: "Predict the Outputs",
      content: [
        {
          kind: "text",
          value: "Guess what the outputs will be",
        },
      ],
      example: {
        visualization: "console",
        initialCode: "def fn(x):\n  return x",
      },
      testMode: "function",
      functionToTest: "fn",
      predictionTable: {
        columns: [{ variableName: "x", variableType: "number" }],
        rows: [{ inputs: [2] }, { inputs: [4] }, { inputs: [6] }],
      },
    } as PredictionSectionData,
  ],
};

export default lessonData;
