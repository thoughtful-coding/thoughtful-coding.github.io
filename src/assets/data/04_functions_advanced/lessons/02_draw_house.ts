import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  ObservationSectionData,
  TestingSectionData,
  MultipleChoiceSectionData,
  ParsonsSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Building a House",
  guid: "advanced-func-house-uuid" as LessonId,
  description:
    "Learn to combine existing functions to create complex objects, the first step in abstraction.",
  sections: [
    {
      kind: "Information",
      id: "abstraction-intro",
      title: "The Power of Pre-made Tools",
      content: [
        {
          kind: "text",
          value:
            "In the real world, construction workers don't bake their own bricks; they use bricks provided by a factory. In programming, we do the same. \n\nFor this lesson, we have pre-loaded two functions for you: `draw_square(size, color)` and `draw_triangle(size, color)`. You don't need to define them—they are ready to use! This lets you focus on the bigger picture.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Observation",
      id: "observe-helpers" as SectionId,
      title: "Testing the Tools",
      content: [
        {
          kind: "text",
          value:
            "Let's verify that our tools work. Run the code below. Notice that `draw_square` and `draw_triangle` are NOT defined in the code window, but they work anyway because the teacher has loaded them in the background.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          'import turtle\n\n# These functions are hidden in the background:\n# draw_square(size, color)\n# draw_triangle(size, color)\n\ndraw_square(50, "blue")\n\n# Move over\nturtle.penup()\nturtle.forward(70)\nturtle.pendown()\n\ndraw_triangle(50, "red")',
      },
    } as ObservationSectionData,
    {
      kind: "Parsons",
      id: "house-logic-parsons",
      title: "Logic: Building a House",
      content: [
        {
          kind: "text",
          value:
            "We want to create a `draw_house()` function. We need to draw a square body, move to the top-left corner, and then draw a triangle roof. Organize the code blocks to achieve this.",
        },
      ],
      codeBlocks: [
        ["def draw_house():"],
        ["  draw_square(100, 'gray')"],
        ["  turtle.left(90)"],
        ["  turtle.forward(100)"],
        ["  turtle.right(90)"],
        ["  draw_triangle(100, 'black')"],
      ],
      visualization: "turtle",
      testMode: "procedure",
      functionToTest: "draw_house",
      testCases: [
        {
          input: [null],
          expected: "SHAPE:house_basic",
          description: "Draw a square with a triangle on top",
        },
      ],
    } as ParsonsSectionData,
    {
      kind: "Testing",
      id: "create-house-func" as SectionId,
      title: "Challenge: The Basic House",
      content: [
        {
          kind: "text",
          value:
            "Now write the actual function. Create `draw_house()` using the helper functions. \n\n1. Draw a gray square (size 100)\n2. Move the turtle to the top-left corner of the square\n3. Draw a black triangle (size 100) for the roof",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\n# draw_square(size, color) and draw_triangle(size, color) are provided\n\ndef draw_house():\n    # 1. Draw Body\n\n    # 2. Move to top-left\n\n    # 3. Draw Roof\n\n# Test it\ndraw_house()",
      },
      testMode: "procedure",
      functionToTest: "draw_house",
      visualThreshold: 0.95,
      testCases: [
        {
          input: [null],
          expected: "SHAPE:house_basic",
          description: "Draw the house",
        },
      ],
    } as TestingSectionData,
    {
      kind: "MultipleChoice",
      id: "naming-conventions",
      title: "Naming Functions",
      content: [
        {
          kind: "text",
          value:
            "You just created a function called `draw_house`. Why didn't we call it `function_one` or `do_it`?",
        },
      ],
      options: [
        "Python requires functions to have underscores",
        "It doesn't matter, the computer ignores names",
        "Descriptive names help humans understand what the 'Black Box' does",
        "Functions must be named after the shape they draw",
      ],
      correctAnswer: 2,
      feedback: {
        correct:
          "Correct! Abstraction is about hiding details. A good name tells the programmer WHAT the function does so they don't have to look at HOW it does it.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Testing",
      id: "modify-house-door" as SectionId,
      title: "Challenge: Adding a Door",
      content: [
        {
          kind: "text",
          value:
            "Let's upgrade our abstraction. Modify your `draw_house` function to add a door.\n\n1. Use the provided `draw_rectangle(width, height, color)` helper.\n2. After drawing the house body, move the turtle to the bottom-center.\n3. Draw a brown door (width 20, height 40).\n\nNotice: You are making the house more complex, but anyone *calling* `draw_house()` doesn't need to know that!",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\ndef draw_house():\n    # ... previous house code ...\n    draw_square(100, 'gray')\n    \n    # Add code to move to position (40, 0) and draw a door\n    # draw_rectangle(20, 40, 'brown')",
      },
      testMode: "procedure",
      functionToTest: "draw_house",
      visualThreshold: 0.95,
      testCases: [
        {
          input: [null],
          expected: "SHAPE:house_with_door",
          description: "House now has a door",
        },
      ],
    } as TestingSectionData,
  ],
};

export default lessonData;
