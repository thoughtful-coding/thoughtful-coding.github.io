import type {
  Lesson,
  LessonId,
  MultipleChoiceSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "MultipleChoiceSection Testing",
  guid: "f25cabfd-95ce-4bc2-96b6-80725f0cbae1" as LessonId,
  description:
    "A sample lesson to allow end-to-end tests to test the MultipleChoiceSection.",
  sections: [
    {
      kind: "MultipleChoice",
      id: "reflection-quiz",
      title: "Why Reflection?",
      content: [
        {
          kind: "text",
          value:
            "Why do you think reflection such a powerful tool in learning?",
        },
      ],
      options: [
        "It proves to the teacher that you did the work.",
        "It forces you to retrieve information and organize it in your own words.",
        "It's the fastest way to get through a lesson.",
        "It allows you to skip the parts of the code you don't understand.",
      ],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! Re-organizing and explaining concepts is a proven way to build stronger, more durable knowledge.",
      },
    } as MultipleChoiceSectionData,
  ],
};

export default lessonData;
