import type {
  Lesson,
  LessonId,
  ReflectionSectionData,
} from "../../../../src/types/data";

const lessonData: Lesson = {
  title: "ReflectionSection Testing",
  guid: "a19b574a-a63f-40ae-a53e-4a59223ef34f" as LessonId,
  description:
    "A sample lesson to allow end-to-end tests to test the ReflectionSection.",
  sections: [
    {
      kind: "Reflection",
      id: "print-reflection",
      title: "Using Reflection for Learning",
      content: [
        {
          kind: "text",
          value: "Explain in your own words how print statements work.",
        },
      ],
      topic: "How Print Works",
      isTopicPredefined: true,
      code: 'print("Hello, World!")\nprint("Can I call myself a programmer now?")',
      isCodePredefined: true,
      explanation: "Explain how your example works (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
  ],
};

export default lessonData;
