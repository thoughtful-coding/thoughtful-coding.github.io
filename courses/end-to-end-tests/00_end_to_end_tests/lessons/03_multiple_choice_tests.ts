import type {
  Lesson,
  LessonId,
  MultipleChoiceSectionData,
} from "../../../../src/types/data";

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
        {
          text: "It proves to the teacher that you did the work.",
          feedback:
            "Reflection is for you, not the teacher — its value is in the retrieval, not the record of it.",
        },
        {
          text: "It forces you to retrieve information and organize it in your own words.",
        },
        {
          text: "It's the fastest way to get through a lesson.",
          feedback:
            "It is deliberately slower than reading. The effort is the point: easy review feels productive but sticks poorly.",
        },
        {
          text: "It allows you to skip the parts of the code you don't understand.",
          feedback:
            "The opposite — reflection surfaces the parts you cannot yet explain, which is what makes the gaps visible.",
        },
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
