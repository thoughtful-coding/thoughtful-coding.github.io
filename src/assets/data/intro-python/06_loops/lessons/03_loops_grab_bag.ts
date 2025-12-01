import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  ObservationSectionData,
  PRIMMSectionData,
  MultipleChoiceSectionData,
  MultipleSelectionSectionData,
  TestingSectionData,
  ReflectionSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Rows and Grids",
  guid: "a7c3e945-8d82-4b90-a634-2f8e0g9h3j67" as LessonId,
  description:
    "Learn to arrange shapes in rows and grids using nested loops with penup and pendown for positioning.",
  sections: [
    {
      kind: "Information",
      id: "grids-intro",
      title: "From Circles to Grids",
      content: [
        {
          kind: "text",
          value:
            "In the previous lesson, you used nested loops with rotation to arrange shapes in circles. But what if you want shapes arranged in rows? Or in a grid like a checkerboard?\n\nThe key to arranging shapes in lines and grids is **positioning**. You need to move the turtle to a new location without drawing a line between shapes. This is where two new commands come in:\n- `turtle.penup()` lifts the pen so the turtle moves without drawing\n- `turtle.pendown()` puts the pen back down to resume drawing\n\nThink of it like lifting a real pen off paper to move it, then putting it back down to draw again.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "PRIMM",
      id: "staircase-primm" as SectionId,
      title: "The Staircase",
      content: [
        {
          kind: "text",
          value:
            "Let's start with a pattern that uses penup and pendown. This program draws squares, but instead of rotating between them, it repositions to create a diagonal staircase effect:",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\nfor i in range(8):\n    # Draw a square\n    for j in range(4):\n        turtle.forward(30)\n        turtle.right(90)\n    \n    # Move to next position (down and right)\n    turtle.penup()\n    turtle.forward(35)\n    turtle.right(90)\n    turtle.forward(35)\n    turtle.left(90)\n    turtle.pendown()",
      },
      predictPrompt:
        "The inner loop draws a square. After each square, the turtle lifts its pen, moves down and to the right, then puts the pen back down. What pattern emerges after 8 squares?",
      conclusion:
        "A staircase! Using penup and pendown lets us reposition the turtle without drawing lines between shapes. This is essential for creating rows and grids.",
    } as PRIMMSectionData,
    {
      kind: "MultipleChoice",
      id: "penup-understanding",
      title: "Understanding Penup and Pendown",
      content: [
        {
          kind: "text",
          value:
            "The commands `turtle.penup()` and `turtle.pendown()` are critical for positioning shapes without leaving trails. What happens when you call `turtle.penup()`?",
        },
      ],
      options: [
        "The turtle stops moving completely",
        "The turtle moves but doesn't draw",
        "The turtle draws a dotted line",
        "The turtle jumps to a new random position",
      ],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! Penup lifts the pen so the turtle can move to a new position without drawing. Pendown puts it back to resume drawing.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Testing",
      id: "row-of-stars" as SectionId,
      title: "Challenge: Row of Stars",
      content: [
        {
          kind: "text",
          value:
            "Create a horizontal row of stars using nested loops and positioning:\n\n1. Draw 4 stars in a horizontal row\n2. Each star should have 5 points with sides of 40 pixels\n3. Remember: stars use 144° turns at each point\n4. Stars should be 80 pixels apart horizontally\n5. Use `turtle.penup()` and `turtle.pendown()` to move between stars without drawing\n\nHint: The outer loop positions each star, the inner loop draws the star.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\n# Draw 4 stars in a row\n# Your code here\n",
      },
      testMode: "procedure",
      functionToTest: "__main__",
      visualThreshold: 0.999,
      testCases: [
        {
          description: "4 stars in a horizontal row, 80 pixels apart",
          input: [],
          expected: null,
          referenceImage: "images/turtle_row_stars_4.png",
        },
      ],
    } as TestingSectionData,
    {
      kind: "Observation",
      id: "grid-pattern" as SectionId,
      title: "Creating a Grid",
      content: [
        {
          kind: "text",
          value:
            "Now let's see how to create a 2D grid. This requires **three nested loops**:\n- The outermost loop controls the rows\n- The middle loop controls the columns (how many shapes per row)\n- The innermost loop draws each individual shape\n\nRun this code and watch how it creates a 3×4 grid (3 rows, 4 columns = 12 squares total):",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\n# Starting position\nturtle.penup()\nturtle.goto(-100, 100)\nturtle.pendown()\n\nfor row in range(3):\n    for col in range(4):\n        # Draw a small square\n        for side in range(4):\n            turtle.forward(20)\n            turtle.right(90)\n        \n        # Move to next column position\n        turtle.penup()\n        turtle.forward(30)\n        turtle.pendown()\n    \n    # Move to next row (back to left, down one row)\n    turtle.penup()\n    turtle.backward(120)  # 30 * 4 = 120\n    turtle.right(90)\n    turtle.forward(30)\n    turtle.left(90)\n    turtle.pendown()",
      },
    } as ObservationSectionData,
    {
      kind: "MultipleSelection",
      id: "grid-concepts",
      title: "Grid Concepts",
      content: [
        {
          kind: "text",
          value:
            "For a grid pattern using nested loops, which of these statements are true? Select all that apply.",
        },
      ],
      options: [
        "The outermost loop typically controls rows",
        "The middle loop typically controls columns",
        "You need penup/pendown to move between positions",
        "Grids always require exactly 3 nested loops",
        "A 4×5 grid would draw 20 shapes total",
      ],
      correctAnswers: [0, 1, 2, 4],
      feedback: {
        correct:
          "Excellent! Grids use nested loops for 2D positioning. The number of nested loops depends on the pattern—grids typically need 3 (rows, columns, shape), but simpler patterns might need only 2.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "MultipleChoice",
      id: "counting-grid",
      title: "Counting Grid Elements",
      content: [
        {
          kind: "text",
          value:
            "If you create a grid with this code, how many triangles will be drawn in total?",
        },
        {
          kind: "code",
          value:
            "for row in range(3):\n    for col in range(5):\n        # Draw a triangle\n        for side in range(3):\n            turtle.forward(20)\n            turtle.left(120)\n        # Move to next position",
        },
      ],
      options: ["3 triangles", "5 triangles", "8 triangles", "15 triangles"],
      correctAnswer: 3,
      feedback: {
        correct:
          "Right! 3 rows × 5 columns = 15 triangles. The innermost loop just draws each individual triangle—it doesn't add to the count.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Testing",
      id: "grid-hexagons" as SectionId,
      title: "Challenge: Grid of Hexagons",
      content: [
        {
          kind: "text",
          value:
            "Create a grid of hexagons:\n\n1. Make a 3×3 grid (3 rows, 3 columns = 9 hexagons total)\n2. Each hexagon should have 6 sides of 25 pixels each\n3. Remember: hexagons turn 60° at each corner\n4. Space hexagons 40 pixels apart horizontally and vertically\n5. Start at position `turtle.goto(-80, 80)` for better centering\n6. Use penup/pendown to position between hexagons\n\nHint: You'll need three nested loops—one for rows, one for columns, and one to draw each hexagon.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\n# Position turtle at starting point\nturtle.penup()\nturtle.goto(-80, 80)\nturtle.pendown()\n\n# Create 3×3 grid of hexagons\n# Your code here\n",
      },
      testMode: "procedure",
      functionToTest: "__main__",
      visualThreshold: 0.999,
      testCases: [
        {
          description: "3×3 grid of hexagons, evenly spaced",
          input: [],
          expected: null,
          referenceImage: "images/turtle_grid_hexagons_3x3.png",
        },
      ],
    } as TestingSectionData,
    {
      kind: "PRIMM",
      id: "sunburst-primm" as SectionId,
      title: "The Sunburst Returns",
      content: [
        {
          kind: "text",
          value:
            "Nested loops aren't just for grids! Here's a radial pattern where lines shoot out from the center. The inner loop draws segments to make each ray longer, and the outer loop rotates to create multiple rays:",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\nfor i in range(12):\n    # Draw one ray with multiple segments\n    for j in range(3):\n        turtle.forward(20)\n        turtle.forward(20)\n    \n    # Return to center\n    turtle.backward(120)\n    \n    # Rotate for next ray\n    turtle.right(30)",
      },
      predictPrompt:
        "Each inner loop draws one ray outward using multiple forward commands, then the turtle returns to center and rotates 30°. With 12 repetitions, what pattern emerges?",
      conclusion:
        "A sunburst or windmill! Nested loops can create radial patterns that aren't closed shapes. The inner loop builds up each ray, and the outer loop arranges them in a circle.",
    } as PRIMMSectionData,
    {
      kind: "Testing",
      id: "custom-grid-design" as SectionId,
      title: "Challenge: Your Grid Design",
      content: [
        {
          kind: "text",
          value:
            "Create your own pattern using nested loops with positioning! Choose ONE of these options:\n\n**Option 1: Grid Pattern**\n- Create a grid of any regular shape (triangles, squares, pentagons, etc.)\n- At least 2 rows and 2 columns\n- Use penup/pendown for positioning\n\n**Option 2: Staircase Pattern**\n- Create a diagonal arrangement like the first example\n- At least 6 shapes\n- Each shape offset from the previous one\n\n**Option 3: Radial Pattern**\n- Create a sunburst or wheel design\n- At least 8 rays/spokes\n- Return to center between each ray\n\nBe creative with your shapes, spacing, and colors!",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\n# Create your pattern here\n# Remember: use penup/pendown to position shapes\n",
      },
      testMode: "procedure",
      functionToTest: "__main__",
      visualThreshold: 0.95,
      testCases: [
        {
          description:
            "A pattern with nested loops and positioning (at least 8 shapes)",
          input: [],
          expected: null,
          referenceImage: "images/turtle_custom_grid.png",
        },
      ],
    } as TestingSectionData,
    {
      kind: "Reflection",
      id: "nested-loops-reflection" as SectionId,
      title: "Nested Loops Reflection",
      content: [
        {
          kind: "text",
          value:
            "You've now mastered two types of nested loop patterns: circular arrangements (using rotation) and grid arrangements (using positioning with penup/pendown).\n\nCreate a simple example of nested loops that uses positioning to arrange shapes, and explain how your inner and outer loops work together to create the pattern. Be specific about what each loop controls.",
        },
      ],
      topic: "How Nested Loops Create Complex Patterns",
      isTopicPredefined: true,
      code: "Create an example with nested loops and positioning",
      isCodePredefined: false,
      explanation:
        "Explain how your inner and outer loops work together, and what role penup/pendown plays (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "grids-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "Fantastic work! You've now mastered two powerful applications of nested loops:\n- **Circular patterns** using rotation (from Lesson 3)\n- **Grid and row patterns** using positioning with penup/pendown (from this lesson)\n\nYou learned:\n- How to use `turtle.penup()` and `turtle.pendown()` for positioning\n- How three nested loops can create 2D grids (rows × columns)\n- How to calculate total elements in a grid (rows × columns = total)\n- That nested loops work for many patterns: circles, grids, staircases, and radial designs\n\nYou've been using variables like `i` and `j` in your loops without really thinking about them. In the next unit, you'll discover how to USE these loop variables to make each repetition different from the last—creating gradients, spirals, and dynamic patterns!",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
