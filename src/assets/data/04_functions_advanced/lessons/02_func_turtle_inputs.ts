import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  ObservationSectionData,
  PRIMMSectionData,
  TestingSectionData,
  MultipleChoiceSectionData,
  MatchingSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "The Architect",
  guid: "architect-composition-lesson-uuid" as LessonId,
  description:
    "Learn to combine small functions into complex objects and place them precisely using coordinates.",
  sections: [
    {
      kind: "Information",
      id: "architect-intro",
      title: "From Bricks to Buildings",
      content: [
        {
          kind: "text",
          value:
            "In previous lessons, you wrote functions to draw basic shapes like squares and triangles. Think of these as your 'bricks.' Now, you are going to become an Architect. You will combine these simple bricks to build complex structures like Trees, Street Lamps, and Houses.\n\nTo do this, you need to master two skills:\n1. **Composition:** Calling one function inside another function.\n2. **Coordinates:** Telling the turtle exactly *where* to start drawing.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Observation",
      id: "coordinate-system-obs" as SectionId,
      title: "The Coordinate Grid",
      content: [
        {
          kind: "text",
          value:
            "The turtle lives on a grid. The very center of the screen is `(0, 0)`. \n- **X-axis:** Positive numbers move Right, negative numbers move Left.\n- **Y-axis:** Positive numbers move Up, negative numbers move Down.\n\nRun the code below. Notice how the `goto(x, y)` function moves the turtle to specific spots without drawing (because we use `penup()`).",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\ndef mark_spot(x, y):\n    turtle.penup()\n    turtle.goto(x, y)\n    turtle.pendown()\n    turtle.dot(20, 'red')\n    turtle.write(f'  ({x}, {y})')\n\n# Center\nmark_spot(0, 0)\n\n# Four corners\nmark_spot(100, 100)\nmark_spot(-100, 100)\nmark_spot(-100, -100)\nmark_spot(100, -100)",
      },
    } as ObservationSectionData,
    {
      kind: "MultipleChoice",
      id: "coordinate-quiz",
      title: "Predicting Position",
      content: [
        {
          kind: "text",
          value:
            "If you wanted to move the turtle to the **top-left** corner of the screen, which coordinates would you likely use?",
        },
      ],
      options: [
        "x = 100, y = 100",
        "x = -100, y = -100",
        "x = -100, y = 100",
        "x = 100, y = -100",
      ],
      correctAnswer: 2,
      feedback: {
        correct: "Correct! Negative X is Left, Positive Y is Up.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Matching",
      id: "quadrant-matching" as SectionId,
      title: "Map the Grid",
      content: [
        {
          kind: "text",
          value:
            "Architects need to know the land. Match the coordinate examples to their location on the screen.",
        },
      ],
      prompts: [
        { "(150, 150)": "Top Right" },
        { "(-150, 150)": "Top Left" },
        { "(-150, -150)": "Bottom Left" },
        { "(150, -150)": "Bottom Right" },
        { "(0, 0)": "Dead Center" },
      ],
      feedback: {
        correct: "Perfect! You now know how to navigate the turtle's world.",
      },
    } as MatchingSectionData,
    {
      kind: "Observation",
      id: "composition-obs" as SectionId,
      title: "Functions Calling Functions",
      content: [
        {
          kind: "text",
          value:
            "Architects don't explain how to make a brick every time they design a wall. They just say 'build a wall.' In programming, we do the same. We write `draw_square` once, and then use it inside `draw_window`.\n\nObserve how the `draw_window` function below calls `draw_square` four times. This is called **Composition**.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\ndef draw_square(size):\n    # Draw a square manually\n    turtle.forward(size)\n    turtle.left(90)\n    turtle.forward(size)\n    turtle.left(90)\n    turtle.forward(size)\n    turtle.left(90)\n    turtle.forward(size)\n    turtle.left(90)\n\ndef draw_window(x, y, size):\n    turtle.penup()\n    turtle.goto(x, y)\n    turtle.pendown()\n    \n    # Draw four small squares to make a window pane\n    draw_square(size)\n    turtle.forward(size)\n    draw_square(size)\n    turtle.left(90)\n    turtle.forward(size)\n    draw_square(size)\n    turtle.left(90)\n    turtle.forward(size)\n    draw_square(size)\n\n# Draw a window at a specific location\ndraw_window(-50, 0, 30)",
      },
    } as ObservationSectionData,
    {
      kind: "MultipleChoice",
      id: "execution-flow-quiz",
      title: "Who is in charge?",
      content: [
        {
          kind: "text",
          value:
            "When the computer is running `draw_window` and hits the line `draw_square(size)`, what happens?",
        },
      ],
      options: [
        "It ignores draw_square and keeps going",
        "It stops draw_window, jumps to draw_square, runs it completely, then returns",
        "It runs both functions at the exact same time",
        "It deletes the draw_square function",
      ],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! The computer 'pauses' the outer function, jumps into the inner function to do the work, and then jumps back.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "PRIMM",
      id: "lamp-primm" as SectionId,
      title: "The Street Lamp",
      content: [
        {
          kind: "text",
          value:
            "Here is a function `draw_lamp`. It uses two helper functions: `draw_line` (for the pole) and `draw_circle` (for the light). Predict where the lamp will appear on the screen based on the coordinates in the function call.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          'import turtle\n\ndef draw_line(height):\n    turtle.width(5)\n    turtle.left(90)\n    turtle.forward(height)\n    turtle.right(90)\n    turtle.width(1)\n\ndef draw_light(radius, color):\n    turtle.color(color)\n    turtle.begin_fill()\n    turtle.circle(radius)\n    turtle.end_fill()\n\ndef draw_lamp(x, y):\n    # Move to start\n    turtle.penup()\n    turtle.goto(x, y)\n    turtle.pendown()\n    \n    # Draw Pole\n    turtle.color("gray")\n    draw_line(100)\n    \n    # Move to top of pole\n    turtle.penup()\n    turtle.goto(x, y + 100)\n    turtle.pendown()\n    \n    # Draw Light\n    draw_light(20, "yellow")\n\ndraw_lamp(50, -50)',
      },
      predictPrompt:
        "The coordinates are (50, -50). Will the lamp be in the top-right, bottom-right, top-left, or bottom-left?",
      conclusion:
        "It appears in the bottom-right! X is positive (right) and Y is negative (down). Notice how `draw_lamp` organized the whole process.",
    } as PRIMMSectionData,
    {
      kind: "Matching",
      id: "construction-steps-match" as SectionId,
      title: "Ordering Construction",
      content: [
        {
          kind: "text",
          value:
            "To build a complex object, order matters. Imagine you are writing a function `draw_lollipop(x, y)`. Put the steps in the logical order.",
        },
      ],
      prompts: [
        { "Step 1": "Move turtle to (x, y)" },
        { "Step 2": "Draw the stick (vertical line)" },
        { "Step 3": "Move turtle to top of stick" },
        { "Step 4": "Draw the candy (circle)" },
      ],
      feedback: {
        correct:
          "Correct! You always move to the start position first, then build from the ground up.",
      },
    } as MatchingSectionData,
    {
      kind: "Testing",
      id: "complex-tree-challenge" as SectionId,
      title: "Challenge: The Tree",
      content: [
        {
          kind: "text",
          value:
            "Now you will be the Architect. You need to write a `draw_tree` function that combines a trunk (rectangle) and leaves (circle).\n\n1. Use the provided `draw_rectangle` and `draw_circle` helper functions.\n2. Your `draw_tree(x, y)` function must move the turtle to `x, y` before starting.\n3. Draw a brown trunk, then move up, then draw green leaves.\n\nDraw one tree at `(-50, -50)`.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\n# --- Helpers (Do not change) ---\ndef draw_rectangle(width, height, color):\n    turtle.color(color)\n    turtle.begin_fill()\n    # Draw rectangle manually\n    turtle.forward(width)\n    turtle.left(90)\n    turtle.forward(height)\n    turtle.left(90)\n    turtle.forward(width)\n    turtle.left(90)\n    turtle.forward(height)\n    turtle.left(90)\n    turtle.end_fill()\n\ndef draw_circle(radius, color):\n    turtle.color(color)\n    turtle.begin_fill()\n    turtle.circle(radius)\n    turtle.end_fill()\n# -------------------------------\n\ndef draw_tree(x, y):\n    # 1. Move to x, y\n    \n    # 2. Draw Trunk (width 20, height 60, brown)\n    \n    # 3. Move to top of trunk\n    \n    # 4. Draw Leaves (radius 40, green)\n    pass\n\n# Test Code\ndraw_tree(-50, -50)",
      },
      testMode: "procedure",
      functionToTest: "__main__",
      visualThreshold: 0.95,
      testCases: [
        {
          input: [null],
          expected: "SHAPE:tree_simple",
          description: "Draw a tree at the correct location",
        },
      ],
    } as TestingSectionData,
    {
      kind: "Information",
      id: "architect-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "You just practiced **Abstraction**. You hid the details of 'how to draw a rectangle' inside a helper function, allowing you to focus on the bigger picture: 'How to draw a tree.'\n\nIn the next lesson, we will become City Planners. We will take your Houses, Trees, and Lamps and arrange them into a complete, randomized neighborhood.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
