import type {
  Lesson,
  LessonId,
  ParsonsSectionData,
  SectionId,
} from "../../../../src/types/data";

const lessonData: Lesson = {
  title: "ParsonsSection Testing",
  guid: "ab5314c7-e31c-40c3-97a0-712c0ffcdd23" as LessonId,
  description:
    "A sample lesson to allow end-to-end tests to test the ParsonsSection.",
  sections: [
    {
      kind: "Parsons",
      id: "order-vars" as SectionId,
      title: "Order Matters",
      content: [
        {
          kind: "text",
          value:
            "Order the following lines of a program so the number `8` is printed out and then the number `5` is printed out.",
        },
      ],
      puzzle: {
        codeBlocks: [
          ["x = 3"],
          ["x = 7"],
          ["x = x + 2"],
          ["print(x)"],
          ["print(x + 1)"],
        ],
        visualization: "console",
      },
      testMode: "procedure",
      functionToTest: "__main__",
      testCases: [
        {
          input: [null],
          expected: "8\n5",
          description: "Test 5 then 8",
        },
      ],
    } as ParsonsSectionData,
    {
      kind: "Parsons",
      id: "indentation-vars" as SectionId,
      title: "Indentation Matters",
      content: [
        {
          kind: "text",
          value: "",
        },
      ],
      puzzle: {
        codeBlocks: [
          ["def test_me(x, y):"],
          ["z = x + y"],
          ["z = z + 1"],
          ["z = z + 2"],
          ["z = z + 3"],
          ["return z"],
          ["print(test_me(5, 7))"],
          ["print(test_me(1, 1))"],
        ],
        visualization: "console",
      },
      testMode: "function",
      functionToTest: "test_me",
      testCases: [
        {
          input: [5, 8],
          expected: "15",
          description: "Test inputs of 5 and 8 outputs 15",
        },
      ],
    } as ParsonsSectionData,
  ],
};

export default lessonData;
