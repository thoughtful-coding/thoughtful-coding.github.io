import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  PRIMMSectionData,
  TestingSectionData,
  MultipleSelectionSectionData,
  ObservationSectionData,
  MultipleChoiceSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Shapes and Patterns",
  guid: "c10314ef-e785-48be-9f76-b23a57abe95c" as LessonId,
  description:
    "Continue to explore how loops create regular patterns and discover creative applications.",
  sections: [
    {
      kind: "Information",
      id: "practice-intro",
      title: "Building on Loops",
      content: [
        {
          kind: "text",
          value:
            "In the previous lesson, you learned how loops eliminate repetitive code. By identifying patterns, you can write more efficient programs. In this lesson, you'll practice creating different shapes, work with function inputs in loops, and discover some creative patterns.\n\nBy the end, you'll be ready to combine multiple loops to create complex designs.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "MultipleSelection",
      id: "riddled-with-errors" as SectionId,
      title: "Debug the Triangle",
      content: [
        {
          kind: "text",
          value:
            "Before we start creating new shapes, let's test your understanding. The code below attempts to draw a triangle but has **three** errors. Select all the errors:",
        },
        {
          kind: "code",
          value:
            "import turtle\n\ndef draw_shape():\n  for i range(4):\n  turtle.forward(100)\n  turtle.right(120)\n\ndraw_shape()",
        },
      ],
      options: [
        "The loop repeats 4 times but should repeat 3 times for a triangle",
        "The `for` loop shouldn't be indented at all",
        "There shouldn't be a `:` after the `for` statement",
        "The two turtle statements need to be indented to be inside the loop",
        "The `for` loop is missing the word `in`",
      ],
      correctAnswers: [0, 3, 4],
      feedback: {
        correct:
          "Excellent! A triangle has 3 sides (not 4), the for loop needs `in` (`for i in range(3):`), and the turtle commands must be indented to be inside the loop.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Testing",
      id: "hexagon-testing" as SectionId,
      title: "Challenge: Hexagon",
      content: [
        {
          kind: "text",
          value:
            "Now it's time to see if you can create a shape of your own without any hints! You goal is to a hexagon: a shape with 6 sides. To accomplish this goal, do the following:\n- Create a function called `make_hexagon()` that takes no inputs\n- Inside the function, use a loop to draw a six-sided figure that has **side length of 50**.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\n# Create make_hexagon() function here\n\n\n# Call your function\n",
      },
      testMode: "procedure",
      functionToTest: "make_hexagon",
      visualThreshold: 0.999,
      testCases: [
        {
          description: "Hexagon with side length 50",
          input: [],
          expected: null,
          referenceImage: "images/turtle_hexagon_50.png",
        },
      ],
    } as TestingSectionData,
    {
      kind: "Testing",
      id: "octagon-testing" as SectionId,
      title: "Challenge: Octagon with Input",
      content: [
        {
          kind: "text",
          value:
            "Now let's make your loops more flexible by using function inputs. Create an octagon (8-sided shape) that can be any size:\n- Create a function called `make_octagon(size)` that takes a single input: size\n- Inside the function, use a loop to draw an eight-sided figure where each side has length `size`\n- Call `make_octagon(55)` to test it",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\n# Create make_octagon(size) function here\n\n\n# Call your function with size 55\n",
      },
      testMode: "procedure",
      functionToTest: "make_octagon",
      visualThreshold: 0.999,
      testCases: [
        {
          description: "Octagon with side length 55",
          input: [55],
          expected: null,
          referenceImage: "images/turtle_octagon_55.png",
        },
        {
          description: "Octagon with side length 20",
          input: [20],
          expected: null,
          referenceImage: "images/turtle_octagon_20.png",
        },
      ],
    } as TestingSectionData,
    {
      kind: "Testing",
      id: "star-builder" as SectionId,
      title: "Challenge: Five-Pointed Star",
      content: [
        {
          kind: "text",
          value:
            "See if you can create a star like the image below. To accomplish this goal, do the following:\n- Create a function called `make_star()` that takes a single input: size\n- Inside the function, use a loop to draw a five-sided figure\n-Call the `make_star()` function with an input of 55.\n\nHint: the angle is greater than 120 degrees.",
        },
        {
          kind: "image",
          src: "data/05_loops/images/turtle-star.png",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\n# Create make_star(size) function here\n\n\n# Call your function with size 55\n",
      },
      testMode: "procedure",
      functionToTest: "make_star",
      visualThreshold: 0.999,
      testCases: [
        {
          description: "Star with side length 55",
          input: [55],
          expected: null,
          referenceImage: "images/turtle_star_55.png",
        },
        {
          description: "Star with side length 150",
          input: [150],
          expected: null,
          referenceImage: "images/turtle_star_150.png",
        },
      ],
    } as TestingSectionData,
    {
      kind: "MultipleChoice",
      id: "function-input-in-loop",
      title: "Using Function Inputs",
      content: [
        {
          kind: "text",
          value:
            "In the octagon and star challenges, you used the `size` parameter inside your loop. Look at this code:",
        },
        {
          kind: "code",
          value:
            "def make_octagon(size):\n  for i in range(8):\n    turtle.forward(size)\n    turtle.right(45)",
        },
        {
          kind: "text",
          value: "What happens when you call `make_octagon(100)`?",
        },
      ],
      options: [
        "Each side is 100 pixels long",
        "The octagon is drawn 100 times",
        "The loop runs 100 times",
        "The angle becomes 100°",
      ],
      correctAnswer: 0,
      feedback: {
        correct:
          "Correct! The `size` parameter gets used inside the loop for EACH iteration. So `turtle.forward(size)` becomes `turtle.forward(100)` every time through the loop.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "PRIMM",
      id: "sunburst-primm" as SectionId,
      title: "Creative Patterns",
      content: [
        {
          kind: "text",
          value:
            "Loops aren't just for closed shapes! Look at this code and predict what pattern it will create. Pay attention to the `forward` and `backward` commands:",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\ndef make_pattern():\n  for i in range(12):\n    turtle.forward(80)\n    turtle.backward(80)\n    turtle.right(30)\n\nmake_pattern()",
      },
      predictPrompt:
        "The turtle moves forward 80, backward 80 (returning to center), then turns 30°. What will this create after 12 repetitions?",
      conclusion:
        "This creates a sunburst pattern! The turtle draws 12 lines radiating from the center. The pattern is: 12 repetitions × 30° = 360° (one complete rotation).",
    } as PRIMMSectionData,
    {
      kind: "Observation",
      id: "spiral-pattern" as SectionId,
      title: "Spiraling Patterns",
      content: [
        {
          kind: "text",
          value:
            "When you use larger numbers in `range()`, you can create more complex patterns. The code below creates a beautiful spiral by repeating 600 times with a carefully chosen angle. Run it and watch what happens:",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)  # Fastest speed\n\ndef make_spiral():\n  for i in range(600):\n    turtle.forward(i / 3)  # Distance increases each time\n    turtle.left(59)\n\nmake_spiral()",
      },
    } as ObservationSectionData,
    {
      kind: "MultipleSelection",
      id: "loop-concepts",
      title: "Loop Concepts Check",
      content: [
        {
          kind: "text",
          value:
            "After creating various shapes and patterns, select all statements that are true about loops:",
        },
      ],
      options: [
        "`for i in range(5):` repeats exactly 5 times",
        "The code inside a loop must be indented",
        "Loops can only be used for drawing closed shapes",
        "You can use function parameters (like `size`) inside loops",
        "`range(360)` would repeat 361 times",
        "The same loop can produce different outputs based on function inputs",
      ],
      correctAnswers: [0, 1, 3, 5],
      feedback: {
        correct:
          "Perfect! Loops are flexible tools that work with any repetitive pattern. You can use function inputs inside loops to create variations, and loops aren't limited to closed shapes or graphics!",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Information",
      id: "loops-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "Excellent work! You've practiced creating various shapes, learned to use function parameters inside loops, and discovered creative patterns beyond simple polygons.\n\nYou've mastered:\n- Creating regular polygons using the 360° rule\n- Passing inputs to functions and using them in loops\n- Creating open patterns (like sunbursts) in addition to closed shapes\n- Understanding that the same loop structure can produce different results\n\nIn the next lesson, you'll take the final step: using multiple loops together to create complex, layered designs. Get ready to combine everything you've learned!",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
