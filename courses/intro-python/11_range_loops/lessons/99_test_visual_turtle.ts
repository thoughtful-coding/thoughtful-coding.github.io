import type {
  InformationSectionData,
  Lesson,
  LessonId,
  ObservationSectionData,
  SectionId,
  TestingSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  guid: "test-visual-turtle-lesson" as LessonId,
  title: "Test: Visual Turtle Testing",
  description: "Test lesson for visual turtle graphics testing feature",
  sections: [
    {
      kind: "Information",
      id: "test_visual_info" as SectionId,
      title: "Testing Visual Turtle Graphics",
      content: [
        {
          kind: "text",
          value:
            "This is a test lesson to verify the visual turtle testing feature works correctly.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Observation",
      id: "create_reference" as SectionId,
      title: "Create Reference Image",
      content: [
        {
          kind: "text",
          value:
            "Run this code and click 'Download Image' to create a reference image for testing.",
        },
        {
          kind: "text",
          value:
            "After downloading, save the file to: `src/assets/data/07_loops_advanced/images/turtle_square.png`",
        },
      ],
      example: {
        initialCode: `import turtle

turtle.speed(0)

# Draw a simple square
for i in range(4):
    turtle.forward(100)
    turtle.right(90)
`,
        visualization: "turtle",
        allowImageDownload: true,
      },
    } as ObservationSectionData,
    {
      kind: "Testing",
      id: "test_visual_square" as SectionId,
      title: "Draw a Square (Visual Test)",
      content: [
        {
          kind: "text",
          value:
            "Write code that draws a square with side length 100. Your drawing must match the target image shown below. **Note:** Make sure you've created the reference image from the previous section first!",
        },
      ],
      example: {
        initialCode: `import turtle

turtle.speed(0)

# Your code here - draw a square with side length 100
`,
        visualization: "turtle",
      },
      testMode: "procedure",
      functionToTest: "__main__",
      visualThreshold: 0.999,
      testCases: [
        {
          description: "Square with side length 100",
          input: [],
          expected: null,
          referenceImage: "images/turtle_square.png",
        },
      ],
    } as TestingSectionData,
  ],
};

export default lessonData;
