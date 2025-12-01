import type {
  Lesson,
  LessonId,
  ParsonsSectionData,
  SectionId,
} from "../../../../types/data";

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
  ],
};

export default lessonData;
