import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  ObservationSectionData,
  PRIMMSectionData,
  TestingSectionData,
  MultipleChoiceSectionData,
  MultipleSelectionSectionData,
  MatchingSectionData,
  ReflectionSectionData,
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
      kind: "MultipleChoice",
      id: "abstraction-check",
      title: "Where is the Code?",
      content: [
        {
          kind: "text",
          value:
            "In the example above, you used `draw_square(50, 'blue')`. Why didn't you see the lines `turtle.forward` or `turtle.right`?",
        },
      ],
      options: [
        "Because the computer forgot them",
        "Because `draw_square` is a built-in Python command like `print`",
        "Because the detailed code is 'hidden' inside the function definition provided by the teacher",
        "Because `draw_square` uses magic, not code",
      ],
      correctAnswer: 2,
      feedback: {
        correct:
          "Correct! This is Abstraction. You use the tool without needing to see exactly how it was built every time.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "PRIMM",
      id: "house-logic-primm",
      title: "Planning the House",
      content: [
        {
          kind: "text",
          value:
            "We want to combine these shapes to make a house. Read the code below. It draws a square and a triangle, but something is wrong with the positioning. Predict what it will look like:",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          'import turtle\n# draw_square and draw_triangle are provided\n\ndraw_square(100, "gray")\ndraw_triangle(100, "black")',
      },
      predictPrompt:
        "The code draws a square, then immediately draws a triangle. Where will the triangle appear relative to the square?",
      conclusion:
        "The triangle draws right on top of the square's bottom line! This is because the turtle ended at the bottom-left corner after the square. We need to move it!",
    } as PRIMMSectionData,
    {
      kind: "Matching",
      id: "position-planning" as SectionId,
      title: "Navigating the House",
      content: [
        {
          kind: "text",
          value:
            "To put the roof on top, we need to move the turtle from where the square finishes (bottom-left) to where the roof starts (top-left). Match the turtle command to the movement needed:",
        },
      ],
      prompts: [
        { "`turtle.left(90)`": "Face Up" },
        { "`turtle.forward(100)`": "Move to Top Corner" },
        { "`turtle.right(90)`": "Face Right (Ready to draw roof)" },
      ],
      feedback: {
        correct:
          "Perfect! Drawing complex objects is mostly about moving the turtle to the right start position between shapes.",
      },
    } as MatchingSectionData,
    {
      kind: "Testing",
      id: "create-house-func" as SectionId,
      title: "Challenge: The Basic House",
      content: [
        {
          kind: "text",
          value:
            "Now write the actual function. Create `draw_house()` using the helper functions. \n\n1. Draw a gray square (size 100)\n2. Move the turtle to the top-left corner of the square (don't draw lines while moving!)\n3. Draw a black triangle (size 100) for the roof",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\n# draw_square(size, color) and draw_triangle(size, color) are provided\n\ndef draw_house():\n    # 1. Draw Body\n\n    # 2. Move to top-left (Use left, forward, right)\n\n    # 3. Draw Roof\n\n# Test it\ndraw_house()",
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
      kind: "MultipleSelection",
      id: "naming-conventions",
      title: "Naming Functions",
      content: [
        {
          kind: "text",
          value:
            "You just created a function called `draw_house`. Which of the following are good reasons for this name? Select all that apply.",
        },
      ],
      options: [
        "It describes WHAT the function creates",
        "It hides the details of squares and triangles",
        "It is short (like `d_h`) so it is fast to type",
        "It follows the `verb_noun` pattern (draw + house)",
      ],
      correctAnswers: [0, 1, 3],
      feedback: {
        correct:
          "Correct! A good name is descriptive. `d_h` is bad because no one knows what it means. `draw_house` is perfect because it explains the 'Black Box'.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Information",
      id: "adding-detail",
      title: "Adding Complexity",
      content: [
        {
          kind: "text",
          value:
            "One of the best things about functions is that you can upgrade them later. Right now, your `draw_house` is simple. But if we add a door to the `draw_house` function, *every time* we use it, we get a door. We don't have to rewrite the rest of our program.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Testing",
      id: "modify-house-door" as SectionId,
      title: "Challenge: Adding a Door",
      content: [
        {
          kind: "text",
          value:
            "Let's upgrade our abstraction. Modify your `draw_house` function to add a door.\n\n1. Use the provided `draw_rectangle(width, height, color)` helper.\n2. After drawing the house body, move the turtle to the bottom-center.\n3. Draw a brown door (width 20, height 40).\n\nHint: The square is 100 wide. The door is 20 wide. To center it, how far should you move in?",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\ndef draw_house():\n    # ... previous house code ...\n    draw_square(100, 'gray')\n    # ... roof code ...\n    \n    # Move back to start of square\n    # Move forward to center the door\n    # draw_rectangle(20, 40, 'brown')",
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
    {
      kind: "Reflection",
      id: "composition-reflection",
      title: "Reflection: Combining Tools",
      content: [
        {
          kind: "text",
          value:
            "You just built a House out of a Square, a Triangle, and a Rectangle. You didn't really write much 'drawing' code yourself; you mostly organized other functions.\n\nWhy is this 'organizing' approach better than writing one giant list of `forward` and `right` commands? Think about what would happen if you messed up the Door size. Where would you fix it?",
        },
      ],
      topic: "Composition and Organization",
      isTopicPredefined: true,
      code: "draw_house() # Made of square, triangle, rectangle",
      isCodePredefined: true,
      explanation:
        "Explain why building with helper functions is easier than writing raw code (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
  ],
};

export default lessonData;
