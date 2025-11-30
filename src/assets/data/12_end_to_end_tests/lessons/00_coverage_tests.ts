import type {
  CoverageSectionData,
  CoverageTableRow,
  InputParam,
  Lesson,
  LessonId,
  SectionId,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "CoverageSection Testing",
  guid: "570d73bc-f5cb-4c56-a1b5-7620037a0e93" as LessonId,
  description:
    "A sample lesson to allow end-to-end tests to test the CoverageSection.",
  sections: [
    {
      kind: "Coverage",
      id: "simple-coverage-single1",
      title: "Different Inputs",
      content: [
        {
          kind: "text",
          value: "Provide inputs that will produce the desired output.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "def do_math(x):\n  y = x + x\n  z = y + y\n  print(z)\n\n",
      },
      testMode: "procedure",
      functionToTest: "do_math",
      coverageTable: {
        columns: [
          {
            variableName: "x",
            variableType: "number",
          } as InputParam,
        ],
        rows: [
          {
            fixedInputs: {},
            expectedOutput: "12",
            hint: "12 = ? + ? + ? + ?",
          } as CoverageTableRow,
          {
            fixedInputs: {},
            expectedOutput: "4",
            hint: "4 = ? + ? + ? + ?",
          } as CoverageTableRow,
          {
            fixedInputs: {},
            expectedOutput: "28",
            hint: "28 = ? + ? + ? + ?",
          },
        ],
      },
    } as CoverageSectionData,
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
      kind: "Coverage",
      id: "free-admission" as SectionId,
      title: "Free Admission",
      content: [
        {
          kind: "text",
          value:
            "The discount function above used `or` with a single input (age). Now let's practice with TWO inputs. This function gives free entry if you're under 5 OR you have a membership. Provide combinations that produce each output:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def free_entry(age, has_membership):\n    if age < 5 or has_membership:\n        print("Free entry!")\n    else:\n        print("Please pay admission")',
      },
      testMode: "procedure",
      functionToTest: "free_entry",
      coverageTable: {
        columns: [
          { variableName: "age", variableType: "number" },
          { variableName: "has_membership", variableType: "boolean" },
        ],
        rows: [
          {
            fixedInputs: { has_membership: false },
            expectedOutput: "Free entry!",
            hint: "Young child without membership",
          },
          {
            fixedInputs: { has_membership: true },
            expectedOutput: "Free entry!",
            hint: "Adult with membership",
          },
          {
            fixedInputs: { age: 45 },
            expectedOutput: "Please pay admission",
            hint: "Adult without membership",
          },
          {
            fixedInputs: { age: 6 },
            expectedOutput: "Free entry!",
            hint: "Young child with membership (both True!)",
          },
        ],
      },
    } as CoverageSectionData,
  ],
};

export default lessonData;
