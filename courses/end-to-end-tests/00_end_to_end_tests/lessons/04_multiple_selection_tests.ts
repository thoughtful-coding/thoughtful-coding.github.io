import type {
  Lesson,
  LessonId,
  MultipleSelectionSectionData,
} from "../../../../src/types/data";

const lessonData: Lesson = {
  title: "MultipleSelectionSection Testing",
  guid: "879aff41-b6c5-4ded-9fe8-48c824fbc8f2" as LessonId,
  description:
    "A sample lesson to allow end-to-end tests to test the MultipleSelectionSection.",
  sections: [
    {
      kind: "MultipleSelection",
      id: "learning-through-primm-quiz",
      title: "Getting the Most Out of PRIMM",
      content: [
        {
          kind: "text",
          value:
            "Which of the following will allow you to get the most out of a PRIMM + AI combo? Select all that apply.",
        },
      ],
      options: [
        "Be specific in your prediction",
        "Be verbose to let the AI know you're smart",
        "Be critical in your interpretation",
        "Be careful when reading the AI's feedback",
      ],
      correctAnswers: [0, 2, 3],
      feedback: {
        correct:
          "Correct! The more you open yourself up to feedback, the more opportunity there is to learn.",
      },
    } as MultipleSelectionSectionData,
  ],
};

export default lessonData;
