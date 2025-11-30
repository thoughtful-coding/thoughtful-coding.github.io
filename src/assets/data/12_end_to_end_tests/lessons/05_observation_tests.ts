import type {
  Lesson,
  LessonId,
  ObservationSectionData,
  SectionId,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "ObservationSection Testing",
  guid: "4a88daf7-2737-4b3d-8761-5bc3c2f4446d" as LessonId,
  description:
    "A sample lesson to allow end-to-end tests to test the ObservationSection.",
  sections: [
    {
      kind: "Observation",
      id: "running-code" as SectionId,
      title: "Running Code",
      content: [
        {
          kind: "text",
          value:
            "This website is designed to allow you to quickly write, run, and debug programs. Below is your first program. Run it by clicking the `Run Code` button. Once it is done executing, compare the program with the resulting output to try and understand what is happened.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'print("Hello, World!")\nprint("Can I call myself a programmer?")',
      },
    } as ObservationSectionData,
    {
      kind: "Observation",
      id: "first-turtle" as SectionId,
      title: "Your First Turtle Program",
      content: [
        {
          kind: "text",
          value:
            "Let's start with the basics. The program below imports the `turtle` library. It then uses functions within the library to move the turtle around the screen. Run the program and watch what the turtle does. Pay attention to how each individual function affects the turtle's movement.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\ndef make_T():\n  turtle.forward(100)\n  turtle.right(90)\n  turtle.forward(100)\n  turtle.left(180)\n  turtle.forward(200)\n\nmake_T()",
        allowImageDownload: true,
      },
    } as ObservationSectionData,
  ],
};

export default lessonData;
