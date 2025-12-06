import type {
  Lesson,
  LessonId,
  PRIMMSectionData,
  SectionId,
} from "../../../../src/types/data";

const lessonData: Lesson = {
  title: "PrimmSection Testing",
  guid: "2f089710-7f8f-48f2-a88f-ce04e8e85889" as LessonId,
  description:
    "A sample lesson to allow end-to-end tests to test the PrimmSection.",
  sections: [
    {
      kind: "PRIMM",
      id: "print-primm" as SectionId,
      title: "Using PRIMM on Code",
      content: [
        {
          kind: "text",
          value:
            "Now, let's try the PRIMM way of learning so you can experience the difference. Below is a PRIMM-ified version of the code you ran above. To complete this section, you must:\n1. Predict what will happen\n2. Run the program\n3. Investigate the output and explain what (if anything) was wrong with your prediction\n\n\nThe key is to be as **specific as possible** in your prediction and interpretation.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'print("Hello, World!")\nprint("Now can I call myself a programmer?")',
      },
      predictPrompt: "What do you think the program will print out?",
      conclusion:
        "PRIMM increases learning by making you read code carefully and then address anything you got wrong",
    } as PRIMMSectionData,
    {
      kind: "PRIMM",
      id: "square-primm" as SectionId,
      title: "Drawing A Shape",
      content: [
        {
          kind: "text",
          value:
            "Now let's try a more complex shape. The code below has three main parts. First, the `turtle` library is imported, giving us the ability to draw. Second, there's a `make_shape()` function that has the turtle draw some mysterious shape. Finally, there's a `make_shape()` function call that results in the shape being drawn once. Given all this, predict what shape will be drawn, then run the program to check you prediction.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\ndef make_shape():\n  turtle.forward(100)\n  turtle.right(90)\n  turtle.forward(100)\n  turtle.right(90)\n  turtle.forward(100)\n  turtle.right(90)\n  turtle.forward(100)\n\nmake_shape()",
      },
      predictPrompt:
        "Look at the pattern of `forward()` and `right()` function calls. What shape do you think this will draw?",
      conclusion:
        "It draws a square! Each `right(90)` function call makes a 90-degree turn, and four 90-degree turns bring you back to where you started.",
    } as PRIMMSectionData,
  ],
};

export default lessonData;
