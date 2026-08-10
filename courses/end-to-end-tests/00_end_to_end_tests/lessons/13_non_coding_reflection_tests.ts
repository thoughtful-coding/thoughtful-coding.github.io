import type { Lesson, LessonId, SectionId } from "../../../../src/types/data";

const lessonData: Lesson = {
  title: "NonCodingReflectionSection Testing",
  guid: "6f2b9c41-8d3a-4e57-9b0c-1a7d5e2f8c93" as LessonId,
  description:
    "A sample lesson to allow end-to-end tests to test the NonCodingReflectionSection.",
  sections: [
    {
      kind: "Information",
      id: "non-coding-reflection-intro" as SectionId,
      title: "About This Section",
      content: [
        {
          kind: "text",
          value:
            "The reflection below is graded by the server's prose rubric — no code is involved.\n\nAI feedback requires being logged in. Signed out, the button explains that rather than failing on submit.",
        },
      ],
    },
    {
      kind: "NonCodingReflection",
      id: "non-coding-reflection-basic" as SectionId,
      title: "Explaining a Concept",
      content: [
        {
          kind: "text",
          value:
            "Write for someone who has just met this idea. Naming a concrete consequence beats restating the definition.",
        },
      ],
      topic:
        "Why does a function need a `return` statement if it already prints its result?",
      minLength: 150,
      placeholder:
        "Start with what print does, then what the caller can and cannot do with the value...",
      extraContext:
        "Learner is a beginner who has met functions and print but not yet variables holding call results.",
    },
  ],
};

export default lessonData;
