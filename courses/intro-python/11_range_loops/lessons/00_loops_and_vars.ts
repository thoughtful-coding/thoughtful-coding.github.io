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
  MatchingSectionData,
  ReflectionSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "The Loop Variable Artist",
  guid: "c7d5e921-8f34-4b89-a821-3f9c7d2e5a14" as LessonId,
  description:
    "Transform static patterns into dynamic art by using the loop variable to create growing, shrinking, and evolving designs.",
  sections: [
    {
      kind: "Information",
      id: "loop-variable-intro",
      title: "The Hidden Power of i",
      content: [
        {
          kind: "text",
          value:
            "So far, you've been using loops to repeat the exact same action multiple times. But there's been a secret weapon hiding in plain sight: the loop variable (usually called `i`).\n\nIn `for i in range(5):`, the variable `i` isn't just counting repetitions - it's actually changing each time! It starts at 0, then becomes 1, then 2, then 3, then 4. We can use these changing values to make each repetition slightly different.\n\nThis transforms loops from simple repeaters into dynamic pattern generators. Instead of drawing 5 identical squares, you can draw squares that grow, shrink, change color, or spiral outward!",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Observation",
      id: "first-variable-use" as SectionId,
      title: "Your First Dynamic Loop",
      content: [
        {
          kind: "text",
          value:
            "Let's see the loop variable in action. This simple program uses `i` to make each line longer than the last. Run it and watch how the value of `i` affects what gets drawn:",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\n\n# Draw lines of increasing length\nfor i in range(18):\n    turtle.forward(i * 10)  # Each line is longer!\n    turtle.backward(i * 10)  # Return to center\n    turtle.right(20)  # Rotate for next line\n",
      },
    } as ObservationSectionData,
    {
      kind: "PRIMM",
      id: "growing-squares-primm" as SectionId,
      title: "Growing Squares",
      content: [
        {
          kind: "text",
          value:
            "Now let's use the loop variable to create squares that grow in size. Predict what this pattern will look like:",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\nfor i in range(6):\n    # Calculate size based on i\n    size = 20 + (i * 15)\n    \n    # Draw a square with that size\n    for j in range(4):\n        turtle.forward(size)\n        turtle.right(90)\n    \n    # The squares share a corner",
      },
      predictPrompt:
        "When i=0, size=20. When i=1, size=35. When i=2, size=50. What pattern will the 6 squares create?",
      conclusion:
        "The squares grow from 20 to 95 pixels, all sharing the same corner. This creates a nested square pattern that appears to zoom outward!",
    } as PRIMMSectionData,
    {
      kind: "MultipleChoice",
      id: "calculate-size",
      title: "Calculating with i",
      content: [
        {
          kind: "text",
          value:
            "If you have the code `for i in range(4):` and inside you calculate `size = 100 - (i * 20)`, what sizes will be generated?",
        },
      ],
      options: [
        "100, 80, 60, 40",
        "80, 60, 40, 20",
        "100, 90, 80, 70",
        "20, 40, 60, 80",
      ],
      correctAnswer: 0,
      feedback: {
        correct:
          "Correct! When i=0: 100-0=100, i=1: 100-20=80, i=2: 100-40=60, i=3: 100-60=40. The shapes would shrink!",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Observation",
      id: "spiral-pattern" as SectionId,
      title: "Creating Spirals",
      content: [
        {
          kind: "text",
          value:
            "One of the most beautiful uses of the loop variable is creating spirals. By making each forward movement slightly longer, we get a naturally growing spiral:",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\n# Square spiral\nfor i in range(100):\n    turtle.forward(i * 2)  # Each side grows by 2 pixels\n    turtle.right(90)\n\n# Try changing 90 to 91 for a different spiral!\n# Or try 120 for a triangular spiral!",
      },
    } as ObservationSectionData,
    {
      kind: "Testing",
      id: "shrinking-pattern" as SectionId,
      title: "Challenge: Shrinking Shapes",
      content: [
        {
          kind: "text",
          value:
            "Create a pattern of shrinking triangles:\n\n1. Draw 5 triangles\n2. The first triangle should have sides of 100 pixels\n3. Each subsequent triangle should be 20 pixels smaller\n4. All triangles should share the same bottom-left corner\n\nHint: Calculate size as 100 - (i * 20)",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\n# Draw 5 triangles, each smaller than the last\nfor i in range(5):\n    # Calculate the size for this triangle\n    # Your code here\n    \n    # Draw the triangle\n    # Remember: triangles use 120° exterior angles\n    pass",
      },
      testCases: [
        {
          input: [null],
          expected: "PATTERN:shrinking_triangles",
          description: "Test that 5 triangles of decreasing size are drawn",
        },
      ],
      testMode: "procedure",
      functionToTest: "__main__",
    } as TestingSectionData,
    {
      kind: "PRIMM",
      id: "rotating-spiral-primm" as SectionId,
      title: "Rotating and Growing",
      content: [
        {
          kind: "text",
          value:
            "We can use `i` for multiple purposes at once - both size AND rotation! Predict what this creates:",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\nfor i in range(36):\n    # Use i for size\n    turtle.forward(i * 5)\n    \n    # Use i for color intensity (just for fun)\n    # (This creates a gradual color change)\n    \n    # Use i for rotation\n    turtle.right(90 + i)\n    \n# The angle increases each time, creating a curve!",
      },
      predictPrompt:
        "The forward distance grows by 5 each time, and the angle grows from 90° to 125°. What shape will emerge?",
      conclusion:
        "It creates an expanding spiral that curves more and more! Using `i` for both size and angle creates organic, shell-like patterns.",
    } as PRIMMSectionData,
    {
      kind: "Matching",
      id: "variable-effects" as SectionId,
      title: "Loop Variable Effects",
      content: [
        {
          kind: "text",
          value: "Match each use of the loop variable with its visual effect:",
        },
      ],
      prompts: [
        { "`forward(i * 10)`": "Lines grow longer each iteration" },
        { "`forward(50 - i)`": "Lines shrink each iteration" },
        { "`right(90 + i)`": "Rotation increases, creating a spiral" },
        { "`forward(i * i)`": "Growth accelerates (quadratic)" },
        {
          "`if i % 2 == 0:`": "Every other iteration (we'll learn this soon!)",
        },
      ],
      feedback: {
        correct:
          "Perfect! You understand how mathematical operations on `i` create different visual patterns.",
      },
    } as MatchingSectionData,
    {
      kind: "Testing",
      id: "starburst-pattern" as SectionId,
      title: "Challenge: Starburst",
      content: [
        {
          kind: "text",
          value:
            "Create a starburst pattern using the loop variable:\n\n1. Draw 18 lines radiating from a center point\n2. Each line should be `i * 8` pixels long\n3. After drawing each line, return to center\n4. Rotate 20° between each line (360° ÷ 18 = 20°)\n\nThe result should look like a starburst or firework!",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\n# Create a starburst pattern\nfor i in range(18):\n    # Draw line of length i * 8\n    # Return to center\n    # Rotate for next line\n    pass",
      },
      testCases: [
        {
          input: [null],
          expected: "PATTERN:starburst",
          description: "Test that a starburst pattern is created",
        },
      ],
      testMode: "procedure",
      functionToTest: "__main__",
    } as TestingSectionData,
    {
      kind: "PRIMM",
      id: "nested-variable-primm" as SectionId,
      title: "Nested Loops with Variables",
      content: [
        {
          kind: "text",
          value:
            "Things get really interesting when you combine nested loops with loop variables. Watch how both `i` and `j` affect the pattern:",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\n# Outer loop: create multiple spirals\nfor i in range(3):\n    # Each spiral starts bigger\n    start_size = 10 + (i * 20)\n    \n    # Inner loop: draw one spiral\n    for j in range(15):\n        turtle.forward(start_size + j * 3)\n        turtle.right(90)\n    \n    # Move to next starting position\n    turtle.penup()\n    turtle.forward(100)\n    turtle.pendown()",
      },
      predictPrompt:
        "The outer loop creates 3 spirals. Each spiral starts at a different size. How will the three spirals differ?",
      conclusion:
        "Each spiral starts larger than the last! The first starts at 10 pixels, the second at 30, the third at 50. This shows how outer and inner loop variables can work together.",
    } as PRIMMSectionData,
    {
      kind: "MultipleSelection",
      id: "variable-concepts",
      title: "Loop Variable Mastery",
      content: [
        {
          kind: "text",
          value:
            "Which statements about loop variables are true? Select all that apply.",
        },
      ],
      options: [
        "In `for i in range(5):`, i takes values 0, 1, 2, 3, 4",
        "You can use i in calculations like `size = i * 10`",
        "Loop variables must always be named 'i'",
        "In nested loops, inner variables reset for each outer iteration",
        "You can use the loop variable multiple times in one iteration",
        "The loop variable can only be used for counting",
      ],
      correctAnswers: [0, 1, 3, 4],
      feedback: {
        correct:
          "Excellent! Loop variables are flexible tools for creating dynamic patterns, not just counters.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Testing",
      id: "fading-hexagons" as SectionId,
      title: "Challenge: Fading Hexagons",
      content: [
        {
          kind: "text",
          value:
            "Create a pattern of hexagons that appear to fade into the distance:\n\n1. Draw 8 hexagons\n2. Start with a hexagon of side length 80\n3. Each hexagon should be 10 pixels smaller than the previous\n4. Rotate 15° between each hexagon\n5. All hexagons share the same center point\n\nThis should create a rotating, shrinking pattern.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\n# Draw 8 hexagons, each smaller and rotated\nfor i in range(8):\n    # Calculate size for this hexagon\n    size = 80 - (i * 10)\n    \n    # Draw the hexagon\n    # Your code here\n    \n    # Rotate for next hexagon\n    # Your code here\n    pass",
      },
      testCases: [
        {
          input: [null],
          expected: "PATTERN:fading_hexagons",
          description: "Test that 8 rotating, shrinking hexagons are drawn",
        },
      ],
      testMode: "procedure",
      functionToTest: "__main__",
    } as TestingSectionData,
    {
      kind: "Reflection",
      id: "variable-reflection" as SectionId,
      title: "Loop Variables Reflection",
      content: [
        {
          kind: "text",
          value:
            "Loop variables transform static repetition into dynamic change. By using `i` in calculations, you can create patterns that grow, shrink, rotate, or evolve.\n\nCreate an example that uses the loop variable to create a changing pattern. Explain how the variable affects each iteration. Remember to use the phrase 'as seen in the example above'.",
        },
      ],
      topic: "Using Loop Variables for Dynamic Patterns",
      isTopicPredefined: true,
      code: "Create a pattern where the loop variable changes something each iteration",
      isCodePredefined: false,
      explanation:
        "Explain how the loop variable creates variation in your pattern (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "variable-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "Brilliant work! You've discovered how to make loops dynamic and creative. You learned:\n- Loop variables count from 0 up through range(n)-1\n- You can use `i` in calculations to vary size, distance, or angle\n- Combining math operations with `i` creates different effects (linear, quadratic, etc.)\n- Nested loops can use both variables for complex variations\n\nIn the next lesson, we'll combine everything - functions with inputs, multiple loop variables, and the libraries you know - to create sophisticated programs. Get ready to build some amazing algorithmic art!",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
