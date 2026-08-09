import type {
  Lesson,
  LessonId,
  ClozeSectionData,
} from "../../../../src/types/data";

const lessonData: Lesson = {
  title: "ClozeSection Testing",
  guid: "0d47505b-62f7-439c-97dc-9da7ea229834" as LessonId,
  description:
    "A sample lesson to allow end-to-end tests to test the ClozeSection.",
  sections: [
    {
      kind: "Cloze",
      id: "cloze-basic",
      title: "Fill in the Blanks",
      content: [
        {
          kind: "text",
          value:
            "Recall the core idea: fill each blank with the missing word. Grading is case-insensitive and ignores surrounding spaces.",
        },
      ],
      // Blanks are marked [[answer]]; alternatives use a pipe: [[6|six]].
      body: "A Python [[function]] is defined with the [[def]] keyword and returns a value using [[return]].",
    } as ClozeSectionData,
    {
      kind: "Cloze",
      id: "cloze-alternatives",
      title: "Accepting Alternatives",
      content: [
        {
          kind: "text",
          value:
            "A blank can accept more than one answer. Either spelling below is marked correct.",
        },
      ],
      body: "The low-tidal-volume target is [[6|six]] mL/kg of [[predicted|ideal]] body weight.",
    } as ClozeSectionData,
  ],
};

export default lessonData;
