import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  ObservationSectionData,
  PRIMMSectionData,
  MultipleChoiceSectionData,
  TestingSectionData,
  DebuggerSectionData,
  MatchingSectionData,
  ReflectionSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Loop-Powered Functions",
  guid: "f8a2c754-9d63-4e87-b912-7c5a8f9e3d21" as LessonId,
  description:
    "Combine functions with loops to create powerful, reusable pattern generators that can adapt to any input.",
  sections: [
    {
      kind: "Information",
      id: "loops-functions-intro",
      title: "The Ultimate Combination",
      content: [
        {
          kind: "text",
          value:
            "You've mastered loops that repeat, nest, and vary. You've built functions that take inputs and create outputs. Now it's time to combine these superpowers!\n\nThink about the polygon pattern from Lesson 1. You discovered that any regular shape uses the angle 360÷sides. But you had to manually create different loops for triangles, squares, and pentagons. What if one function could draw ANY polygon?\n\nThat's what we'll build today: functions that use loops intelligently. Instead of hard-coding repetitions, your functions will adapt to their inputs, creating everything from simple shapes to complex algorithmic art.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Observation",
      id: "polygon-function" as SectionId,
      title: "The Universal Polygon Function",
      content: [
        {
          kind: "text",
          value:
            "Remember drawing different polygons in Lesson 1? Here's a function that can draw ANY regular polygon using the pattern you discovered. This is the power of combining functions with loops:",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\ndef draw_polygon(sides, size):\n    '''Draw any regular polygon'''\n    angle = 360 / sides\n    \n    for i in range(sides):\n        turtle.forward(size)\n        turtle.right(angle)\n\n# Test with different shapes\ndraw_polygon(3, 80)   # Triangle\n\nturtle.penup()\nturtle.forward(120)\nturtle.pendown()\n\ndraw_polygon(5, 60)   # Pentagon\n\nturtle.penup()\nturtle.forward(100)\nturtle.pendown()\n\ndraw_polygon(8, 40)   # Octagon",
      },
    } as ObservationSectionData,
    {
      kind: "MultipleChoice",
      id: "function-loop-understanding",
      title: "Function Loop Logic",
      content: [
        {
          kind: "text",
          value:
            "If you call `draw_polygon(6, 50)`, how many times will the loop inside the function run?",
        },
      ],
      options: ["3 times", "5 times", "6 times", "50 times"],
      correctAnswer: 2,
      feedback: {
        correct:
          "Correct! The first parameter (6) becomes `sides`, so `range(sides)` means `range(6)`, which runs 6 times.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "PRIMM",
      id: "star-function-primm" as SectionId,
      title: "Parameterized Stars",
      content: [
        {
          kind: "text",
          value:
            "Let's create a function that draws stars with any number of points. The function calculates the correct angle based on the input:",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\ndef draw_star(points, size):\n    '''Draw a star with any number of points'''\n    angle = 180 - (180 / points)\n    \n    for i in range(points):\n        turtle.forward(size)\n        turtle.right(angle)\n\n# Draw three different stars\ndraw_star(5, 100)\n\nturtle.penup()\nturtle.goto(-150, 0)\nturtle.pendown()\n\ndraw_star(7, 80)\n\nturtle.penup()\nturtle.goto(150, 0)\nturtle.pendown()\n\ndraw_star(9, 60)",
      },
      predictPrompt:
        "This function draws stars with different numbers of points. How does changing the `points` parameter affect the shape?",
      conclusion:
        "More points create more complex stars! The angle formula ensures the turtle returns to its starting position after drawing all points.",
    } as PRIMMSectionData,
    {
      kind: "Testing",
      id: "spiral-function" as SectionId,
      title: "Challenge: Spiral Generator",
      content: [
        {
          kind: "text",
          value:
            "Create a function `draw_spiral(turns, growth_rate)` that:\n\n1. Uses `turns` to determine how many lines to draw\n2. Each line should be `i * growth_rate` pixels long\n3. Turns 90° after each line (square spiral)\n\nFor example:\n- `draw_spiral(20, 3)` creates 20 lines, growing by 3 pixels each\n- `draw_spiral(50, 2)` creates 50 lines, growing by 2 pixels each",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\ndef draw_spiral(turns, growth_rate):\n    '''Draw a square spiral with custom parameters'''\n    # Your code here\n    pass\n\n# Test your function\ndraw_spiral(30, 3)",
      },
      testCases: [
        {
          input: [30, 3],
          expected: "PATTERN:spiral[30,3]",
          description: "Test spiral with 30 turns growing by 3",
        },
        {
          input: [20, 5],
          expected: "PATTERN:spiral[20,5]",
          description: "Test spiral with 20 turns growing by 5",
        },
      ],
      testMode: "procedure",
      functionToTest: "draw_spiral",
    } as TestingSectionData,
    {
      kind: "Observation",
      id: "nested-loop-function" as SectionId,
      title: "Functions with Nested Loops",
      content: [
        {
          kind: "text",
          value:
            "Functions become even more powerful when they contain nested loops. This function creates a flower with customizable petals:",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\ndef draw_flower(num_petals, petal_sides, petal_size):\n    '''Draw a flower with custom petals'''\n    rotation_angle = 360 / num_petals\n    \n    for petal in range(num_petals):\n        # Draw one petal (a polygon)\n        for side in range(petal_sides):\n            turtle.forward(petal_size)\n            turtle.right(360 / petal_sides)\n        \n        # Rotate for next petal\n        turtle.right(rotation_angle)\n\n# Draw different flowers\ndraw_flower(6, 4, 30)  # 6 square petals\n\nturtle.penup()\nturtle.goto(-150, 0)\nturtle.pendown()\n\ndraw_flower(8, 3, 25)  # 8 triangular petals\n\nturtle.penup()\nturtle.goto(150, 0)\nturtle.pendown()\n\ndraw_flower(12, 6, 20)  # 12 hexagonal petals",
      },
    } as ObservationSectionData,
    {
      kind: "Debugger",
      id: "debug-function-loops" as SectionId,
      title: "Watching Function Loops",
      content: [
        {
          kind: "text",
          value:
            "Let's step through a function that uses both loops and the loop variable. Watch how the function parameters control the loop behavior:",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\ndef draw_growing_pattern(shapes, start_size, growth):\n    '''Draw shapes that grow in size'''\n    for i in range(shapes):\n        # Calculate current size\n        current_size = start_size + (i * growth)\n        print(f\"Drawing shape {i} with size {current_size}\")\n        \n        # Draw a square with current size\n        for j in range(4):\n            turtle.forward(current_size)\n            turtle.right(90)\n        \n        # Move to next position\n        turtle.penup()\n        turtle.forward(current_size + 10)\n        turtle.pendown()\n\n# Draw 4 squares, starting at 20, growing by 15\ndraw_growing_pattern(4, 20, 15)",
      },
    } as DebuggerSectionData,
    {
      kind: "PRIMM",
      id: "grid-function-primm" as SectionId,
      title: "Grid Generator Function",
      content: [
        {
          kind: "text",
          value:
            "This function creates a grid of shapes. Notice how the parameters control both the grid structure AND what gets drawn:",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\ndef draw_shape_grid(rows, cols, shape_size, spacing):\n    '''Draw a grid of shapes'''\n    start_x = -(cols * spacing) / 2\n    start_y = (rows * spacing) / 2\n    \n    for row in range(rows):\n        for col in range(cols):\n            # Calculate position\n            x = start_x + (col * spacing)\n            y = start_y - (row * spacing)\n            \n            # Move to position\n            turtle.penup()\n            turtle.goto(x, y)\n            turtle.pendown()\n            \n            # Draw a shape (triangle in this case)\n            for side in range(3):\n                turtle.forward(shape_size)\n                turtle.left(120)\n\n# Create a 3x4 grid of triangles\ndraw_shape_grid(3, 4, 25, 40)",
      },
      predictPrompt:
        "This creates a 3x4 grid. How many total triangles will be drawn? How does the `spacing` parameter affect the result?",
      conclusion:
        "It draws 12 triangles (3×4)! The spacing parameter controls how far apart they are. This shows how functions can organize complex patterns using multiple parameters.",
    } as PRIMMSectionData,
    {
      kind: "Testing",
      id: "pattern-ring-function" as SectionId,
      title: "Challenge: Pattern Ring Function",
      content: [
        {
          kind: "text",
          value:
            "Create a function `draw_pattern_ring(num_shapes, shape_sides, shape_size)` that:\n\n1. Draws `num_shapes` polygons in a circle\n2. Each polygon has `shape_sides` sides\n3. Each polygon has sides of length `shape_size`\n4. The shapes are evenly distributed (360° ÷ num_shapes)\n\nFor example:\n- `draw_pattern_ring(6, 4, 30)` draws 6 squares in a circle\n- `draw_pattern_ring(8, 3, 25)` draws 8 triangles in a circle",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\ndef draw_pattern_ring(num_shapes, shape_sides, shape_size):\n    '''Draw shapes arranged in a circle'''\n    # Calculate rotation between shapes\n    \n    # Loop to draw each shape\n    # Your code here\n    pass\n\n# Test your function\ndraw_pattern_ring(8, 5, 30)  # 8 pentagons in a circle",
      },
      testCases: [
        {
          input: [8, 5, 30],
          expected: "PATTERN:ring[8,5,30]",
          description: "Test ring of 8 pentagons",
        },
        {
          input: [6, 6, 25],
          expected: "PATTERN:ring[6,6,25]",
          description: "Test ring of 6 hexagons",
        },
      ],
      testMode: "procedure",
      functionToTest: "draw_pattern_ring",
    } as TestingSectionData,
    {
      kind: "Matching",
      id: "function-purposes" as SectionId,
      title: "Function Design Patterns",
      content: [
        {
          kind: "text",
          value: "Match each function design pattern with its purpose:",
        },
      ],
      prompts: [
        { "Single loop with parameter": "Repeat n times (like draw_polygon)" },
        {
          "Nested loops with parameters": "Create 2D patterns (like draw_grid)",
        },
        {
          "Loop using parameter in calculation":
            "Create variation (like draw_spiral)",
        },
        {
          "Multiple parameters controlling one loop":
            "Flexible behavior (like draw_star)",
        },
        {
          "Function calling other functions in loop":
            "Build complex from simple",
        },
      ],
      feedback: {
        correct:
          "Excellent! You understand how different parameter and loop combinations create different capabilities.",
      },
    } as MatchingSectionData,
    {
      kind: "Testing",
      id: "mandala-function" as SectionId,
      title: "Challenge: Mandala Maker",
      content: [
        {
          kind: "text",
          value:
            "Create the ultimate function: `draw_mandala(layers, shapes_per_layer, shape_sides, base_size)`\n\n1. Draw `layers` concentric rings\n2. Each ring has `shapes_per_layer` shapes\n3. Each shape is a polygon with `shape_sides` sides\n4. The first layer uses `base_size`, each layer shrinks by 20%\n5. Rotate each layer slightly for visual interest\n\nThis combines everything: nested loops, calculations with i, and multiple parameters!",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\ndef draw_mandala(layers, shapes_per_layer, shape_sides, base_size):\n    '''Draw a complex mandala pattern'''\n    # For each layer\n    for layer in range(layers):\n        # Calculate size for this layer (shrinks by 20% each time)\n        size = base_size * (0.8 ** layer)\n        \n        # Draw shapes in a ring for this layer\n        # Your code here\n        \n        # Optional: rotate slightly for next layer\n        pass\n\n# Create a mandala with 3 layers, 8 shapes each\ndraw_mandala(3, 8, 6, 40)",
      },
      testCases: [
        {
          input: [3, 8, 6, 40],
          expected: "PATTERN:mandala[3,8,6,40]",
          description: "Test 3-layer mandala with hexagons",
        },
      ],
      testMode: "procedure",
      functionToTest: "draw_mandala",
    } as TestingSectionData,
    {
      kind: "PRIMM",
      id: "random-art-primm" as SectionId,
      title: "Algorithmic Art",
      content: [
        {
          kind: "text",
          value:
            "Let's combine functions, loops, and the random library to create algorithmic art:",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\nimport random\n\nturtle.speed(0)\n\ndef draw_random_burst(lines, max_length):\n    '''Draw a random burst pattern'''\n    for i in range(lines):\n        # Random length up to max\n        length = random.randint(10, max_length)\n        \n        # Random color\n        colors = ['red', 'blue', 'green', 'purple', 'orange']\n        turtle.color(random.choice(colors))\n        \n        # Draw line and return\n        turtle.forward(length)\n        turtle.backward(length)\n        \n        # Rotate for next line\n        turtle.right(360 / lines)\n\n# Create three random bursts\nfor burst in range(3):\n    x = random.randint(-150, 150)\n    y = random.randint(-100, 100)\n    \n    turtle.penup()\n    turtle.goto(x, y)\n    turtle.pendown()\n    \n    draw_random_burst(12, 80)",
      },
      predictPrompt:
        "This creates 3 random bursts. How do the function parameters and random library work together?",
      conclusion:
        "The function provides structure (number of lines, max length) while randomness provides variation (actual lengths, colors, positions). This is algorithmic art - structured randomness!",
    } as PRIMMSectionData,
    {
      kind: "Reflection",
      id: "function-loop-reflection" as SectionId,
      title: "Function and Loop Reflection",
      content: [
        {
          kind: "text",
          value:
            "Functions with loops inside them are incredibly powerful. They turn repetitive patterns into reusable, customizable tools.\n\nCreate a function that uses loops and takes at least two parameters. Explain how the parameters control the loop behavior. Remember to use the phrase 'as seen in the example above'.",
        },
      ],
      topic: "Functions That Use Loops",
      isTopicPredefined: true,
      code: "Create a function with parameters that control loop behavior",
      isCodePredefined: false,
      explanation:
        "Explain how your function's parameters affect the loops inside (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "function-loop-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "Outstanding! You've learned to combine functions and loops to create powerful, reusable tools. You discovered:\n- Function parameters can control loop iterations\n- Parameters can be used in calculations within loops\n- Nested loops inside functions create complex patterns\n- Functions make patterns reusable and customizable\n- Combining with libraries (like random) adds even more possibilities\n\nIn the final lesson, we'll bring EVERYTHING together - all your functions, all your loop techniques, and all your creativity - to build complete programs that would have seemed impossible just a few lessons ago!",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
