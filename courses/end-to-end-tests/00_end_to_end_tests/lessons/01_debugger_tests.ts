import type {
  DebuggerSectionData,
  Lesson,
  LessonId,
  SectionId,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "DebuggerSection Testing",
  guid: "753118c5-2fda-476f-809f-68a90085f856" as LessonId,
  description:
    "A sample lesson to allow end-to-end tests to test the DebuggerSection.",
  sections: [
    {
      kind: "Debugger",
      id: "variable-debugging" as SectionId,
      title: "Watching Variables Change",
      content: [
        {
          kind: "text",
          value:
            "The program below has all the different patterns we've seen so far: a set, a read, and a reset. Use the debugging tool to step line-by-line through the code and observe how the value of the `score` variable changes. Pay particular attention to the following:\n- When `score` is set, it shows up in the `Variables` side-panel with its given, initial value\n- When the value of `score` is reset, the variable is highlighted in the `Variables` side-panel with its new value",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "score = 10\nprint(score)\nscore = 20\nprint(score)\nscore = score + 5\nprint(score)\n",
      },
    } as DebuggerSectionData,

    {
      kind: "Debugger",
      id: "error-debugging" as SectionId,
      title: "Watching Errors",
      content: [
        {
          kind: "text",
          value: "Intentionally have an error in the debugger",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "score = 10\nprint(score)\nscore = 20\nprint(score_x)\nscore = score + 5\nprint(score)\n",
      },
    } as DebuggerSectionData,
  ],
};

export default lessonData;
