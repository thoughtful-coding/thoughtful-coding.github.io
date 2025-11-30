import type {
  Lesson,
  LessonId,
  MatchingSectionData,
  SectionId,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "MatchingSection Testing",
  guid: "e7cafa72-23d7-4e37-821c-b2f3dba4b262" as LessonId,
  description:
    "A sample lesson to allow end-to-end tests to test the MatchingSection.",
  sections: [
    {
      kind: "Matching",
      id: "primm-matching" as SectionId,
      title: "Matching PRIMM",
      content: [
        {
          kind: "text",
          value:
            "Based on the definition above, match each part of PRIMM with what you think its purpose is:",
        },
      ],
      prompts: [
        { PREDICT: "Force yourself to try and understand a program" },
        {
          RUN: "Generate results to compare them with your expectations",
        },
        { INVESTIGATE: "Understand any mistakes in your mental model" },
        { MODIFY: "Challenge yourself to expand on the existing ideas" },
        { MAKE: "Challenge yourself to implement your own ideas" },
      ],
    } as MatchingSectionData,
  ],
};

export default lessonData;
