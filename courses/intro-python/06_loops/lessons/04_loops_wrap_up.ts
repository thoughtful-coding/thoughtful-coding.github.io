import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  MultipleChoiceSectionData,
  MultipleSelectionSectionData,
  MatchingSectionData,
  TestingSectionData,
  CoverageSectionData,
  CoverageTableRow,
  InputParam,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Loops Unit Challenge",
  guid: "f8e3d945-7c82-4b90-a634-3f9e1g0h4j78" as LessonId,
  description:
    "Test your understanding of loops and review previous concepts through interleaved practice problems.",
  sections: [
    {
      kind: "Information",
      id: "wrap-up-intro",
      title: "Practicing with Interleaving",
      content: [
        {
          kind: "text",
          value:
            "You've learned how to use loops to eliminate repetitive code and create patterns. You've discovered single loops, nested loops for circular patterns, and nested loops with positioning for grids. These powerful concepts build on everything you've learned so far: variables, f-strings, functions, and conditionals.\n\nThis review uses **interleaving** to mix questions about loops with questions about earlier topics. By switching between concepts, your brain has to actively recall what you've learned rather than following a single pattern. This creates stronger, more durable learning. Take your time with each question and remember: the struggle is where the learning happens!",
        },
      ],
    } as InformationSectionData,
    {
      kind: "MultipleChoice",
      id: "basic-loop-counting",
      title: "Loop Repetition",
      content: [
        {
          kind: "text",
          value:
            "Understanding how many times a loop runs is fundamental. How many times does the code inside this loop execute?",
        },
        {
          kind: "code",
          value:
            "for i in range(8):\n    turtle.forward(50)\n    turtle.right(45)",
        },
      ],
      options: ["7 times", "8 times", "9 times", "16 times"],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! `range(8)` means the loop runs exactly 8 times. Both commands inside the loop (forward and right) execute 8 times each.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "MultipleChoice",
      id: "variable-reassignment-review",
      title: "Variable Behavior",
      content: [
        {
          kind: "text",
          value:
            "Let's review how variables work. After running this code, what is the value of `score`?",
        },
        {
          kind: "code",
          value: "score = 10\nscore = score + 5\nscore = score * 2",
        },
      ],
      options: ["10", "15", "20", "30"],
      correctAnswer: 3,
      feedback: {
        correct:
          "Correct! score starts at 10, becomes 15 (10 + 5), then becomes 30 (15 × 2).",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "MultipleSelection",
      id: "loop-syntax",
      title: "Loop Syntax Check",
      content: [
        {
          kind: "text",
          value:
            "Which of the following statements about loop syntax are true? Select all that apply.",
        },
      ],
      options: [
        "The code inside a loop must be indented",
        "`for i in range(5):` repeats exactly 5 times",
        "The colon (`:`) at the end of the `for` line is required",
        "You can have loops inside other loops (nested loops)",
        "`range(10)` would repeat 11 times",
      ],
      correctAnswers: [0, 1, 2, 3],
      feedback: {
        correct:
          "Perfect! Loops require proper syntax: indentation, the `in` keyword, a colon, and the ability to nest. And `range(10)` repeats exactly 10 times, not 11.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Matching",
      id: "loop-patterns-match" as SectionId,
      title: "Matching Loop Patterns",
      content: [
        {
          kind: "text",
          value:
            "Different loop patterns create different shapes. Match each code pattern with what it creates:",
        },
      ],
      prompts: [
        {
          "Loop with 4 sides turning 90° each time": "Square",
        },
        {
          "Loop with 6 sides turning 60° each time": "Hexagon",
        },
        {
          "Loop with 5 sides turning 72° each time": "Pentagon",
        },
        {
          "Loop with 3 sides turning 120° each time": "Triangle",
        },
        {
          "Outer loop for rotation, inner loop for squares": "Flower pattern",
        },
      ],
      feedback: {
        correct:
          "Excellent! Regular polygons follow the pattern: number of sides × angle = 360°. Nested loops create more complex patterns.",
      },
    } as MatchingSectionData,
    {
      kind: "MultipleChoice",
      id: "nested-loop-counting",
      title: "Counting Nested Loops",
      content: [
        {
          kind: "text",
          value:
            "Nested loops have a multiplicative effect. How many times total does `turtle.forward(30)` get called in this code?",
        },
        {
          kind: "code",
          value:
            "for i in range(6):\n    for j in range(4):\n        turtle.forward(30)\n        turtle.right(90)\n    turtle.right(60)",
        },
      ],
      options: ["4 times", "6 times", "10 times", "24 times"],
      correctAnswer: 3,
      feedback: {
        correct:
          "Correct! The outer loop runs 6 times, and for EACH of those, the inner loop runs 4 times. So 6 × 4 = 24 total calls to `forward()`.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "MultipleSelection",
      id: "fstring-review",
      title: "F-String Review",
      content: [
        {
          kind: "text",
          value:
            "Let's review f-strings from an earlier unit. Which of the following statements about f-strings are true? Select all that apply.",
        },
      ],
      options: [
        "F-strings require the letter `f` before the opening quote",
        "F-strings automatically convert integers to strings",
        "F-strings can only work with string variables",
        "Variables go inside curly braces like `{variable_name}`",
        "F-strings can include math expressions like `{x + 5}`",
      ],
      correctAnswers: [0, 1, 3, 4],
      feedback: {
        correct:
          "Perfect! F-strings work with any data type (not just strings) and can evaluate expressions inside the braces.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Testing",
      id: "square-challenge" as SectionId,
      title: "Challenge: Draw a Square",
      content: [
        {
          kind: "text",
          value:
            "Create a function that uses a loop to draw a square:\n\n1. Create a function called `draw_square(size)` that takes one input\n2. Use a loop to draw a square with sides of length `size`\n3. Remember: squares have 4 sides and turn 90° at each corner\n4. Call your function with `draw_square(60)` to test it",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\n# Create your draw_square function here\n\n\n# Call your function\n",
      },
      testMode: "procedure",
      functionToTest: "draw_square",
      visualThreshold: 0.999,
      testCases: [
        {
          description: "Square with side length 60",
          input: [60],
          expected: null,
          referenceImage: "images/turtle_square_60.png",
        },
        {
          description: "Square with side length 40",
          input: [40],
          expected: null,
          referenceImage: "images/turtle_square_40.png",
        },
      ],
    } as TestingSectionData,
    {
      kind: "MultipleChoice",
      id: "indentation-understanding",
      title: "Understanding Indentation",
      content: [
        {
          kind: "text",
          value:
            "Indentation shows what code is 'inside' what structure. In this code, why is `turtle.forward(50)` indented twice?",
        },
        {
          kind: "code",
          value:
            "def draw_pattern():\n    for i in range(8):\n        turtle.forward(50)\n        turtle.right(45)",
        },
      ],
      options: [
        "It's a mistake - it should only be indented once",
        "The forward command is inside a loop which is inside a function",
        "Double indentation makes the turtle move twice as far",
        "All turtle commands require double indentation",
      ],
      correctAnswer: 1,
      feedback: {
        correct:
          "Excellent! Each level of indentation shows code is 'inside' another structure. The turtle commands are inside the loop, which is inside the function.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Coverage",
      id: "loop-function-coverage",
      title: "Loop Function Coverage",
      content: [
        {
          kind: "text",
          value:
            "This function uses a loop to repeat a greeting. Provide inputs that will produce the desired outputs:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "def greet_multiple(name, times):\n    for i in range(times):\n        print(f'Hello {name}!')\n\n",
      },
      testMode: "procedure",
      functionToTest: "greet_multiple",
      coverageTable: {
        columns: [
          {
            variableName: "name",
            variableType: "string",
          } as InputParam,
          {
            variableName: "times",
            variableType: "number",
          } as InputParam,
        ],
        rows: [
          {
            fixedInputs: {},
            expectedOutput: "Hello Maya!\nHello Maya!\nHello Maya!",
            hint: "What name and how many times?",
          } as CoverageTableRow,
          {
            fixedInputs: {},
            expectedOutput: "Hello Alex!\nHello Alex!",
            hint: "What name and how many repetitions?",
          } as CoverageTableRow,
          {
            fixedInputs: {},
            expectedOutput: "Hello Sam!\nHello Sam!\nHello Sam!\nHello Sam!",
            hint: "What name and how many loops?",
          } as CoverageTableRow,
        ],
      },
    } as CoverageSectionData,
    {
      kind: "MultipleSelection",
      id: "positioning-concepts",
      title: "Positioning with Penup and Pendown",
      content: [
        {
          kind: "text",
          value:
            "Which of the following statements about `turtle.penup()` and `turtle.pendown()` are true? Select all that apply.",
        },
      ],
      options: [
        "`turtle.penup()` lifts the pen so the turtle can move without drawing",
        "`turtle.pendown()` puts the pen back down to resume drawing",
        "You need penup/pendown to create grid patterns",
        "Penup and pendown are only used for drawing circles",
        "The turtle can still move when the pen is up",
      ],
      correctAnswers: [0, 1, 2, 4],
      feedback: {
        correct:
          "Perfect! Penup and pendown allow positioning without drawing lines, which is essential for creating rows and grids of shapes.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "MultipleChoice",
      id: "data-types-review",
      title: "Data Types Review",
      content: [
        {
          kind: "text",
          value:
            "Let's review data types from earlier units. Which of the following will cause a `TypeError`?",
        },
      ],
      options: [
        'print("5" + "3")',
        "print(5 + 3)",
        'print("5" + 3)',
        'print(f"Result: {5 + 3}")',
      ],
      correctAnswer: 2,
      feedback: {
        correct:
          'Correct! You cannot use `+` to combine a string ("5") with an integer (3). Options 0 and 1 work because both operands are the same type, and option 3 works because f-strings handle type conversion automatically.',
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Testing",
      id: "ring-of-shapes" as SectionId,
      title: "Challenge: Ring of Triangles",
      content: [
        {
          kind: "text",
          value:
            "Use nested loops to create a ring of triangles arranged in a circle:\n\n1. Draw 6 triangles arranged in a circle\n2. Each triangle should have sides of 40 pixels\n3. Remember: triangles turn 120° at each corner\n4. The triangles should be evenly spaced (360° ÷ 6 = 60° between triangles)\n\nHint: You need two loops - the outer loop positions each triangle (rotating 60° each time), and the inner loop draws each triangle (3 sides, 120° turns).",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\nturtle.speed(0)\n\n# Draw 6 triangles in a circle\n# Your code here\n",
      },
      testMode: "procedure",
      functionToTest: "__main__",
      visualThreshold: 0.999,
      testCases: [
        {
          description: "6 triangles arranged in a circle",
          input: [],
          expected: null,
          referenceImage: "images/turtle_ring_triangles_6.png",
        },
      ],
    } as TestingSectionData,
    {
      kind: "Matching",
      id: "code-structure-match" as SectionId,
      title: "Code Structure Review",
      content: [
        {
          kind: "text",
          value: "Match each programming concept with its correct description:",
        },
      ],
      prompts: [
        {
          Variable: "A container that stores a value",
        },
        {
          Function: "A reusable block of code that performs a specific task",
        },
        {
          Loop: "A structure that repeats code multiple times",
        },
        {
          "F-string": "A way to insert variables into text output",
        },
        {
          Conditional: "A structure that runs code only if a condition is true",
        },
      ],
      feedback: {
        correct:
          "Excellent! These are the fundamental building blocks you've learned so far. Each one serves a specific purpose in creating programs.",
      },
    } as MatchingSectionData,
    {
      kind: "MultipleSelection",
      id: "comprehensive-review",
      title: "Comprehensive Concepts",
      content: [
        {
          kind: "text",
          value:
            "Which of the following statements are true about the programming concepts you've learned? Select all that apply.",
        },
      ],
      options: [
        "Variables can be used inside loops",
        "Functions can contain loops",
        "Loops can be nested inside other loops",
        "F-strings can display the results of loop iterations",
        "You can only have one loop per program",
        "The same loop can produce different outputs with different function inputs",
      ],
      correctAnswers: [0, 1, 2, 3, 5],
      feedback: {
        correct:
          "Perfect! All these concepts work together. You can combine variables, functions, loops, f-strings, and conditionals in countless ways to solve problems.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Information",
      id: "wrap-up-conclusion",
      title: "The Journey Continues",
      content: [
        {
          kind: "text",
          value:
            "Congratulations on completing the loops unit! You've transformed from someone who writes repetitive code into someone who describes elegant patterns. By working through these interleaved questions, you've reinforced not just loops, but how loops connect to everything else you've learned.\n\nYou now have all the fundamental tools of programming:\n- **Variables** to store information\n- **Data types** to work with different kinds of information\n- **F-strings** to create readable output\n- **Functions** to organize and reuse code\n- **Conditionals** to make decisions\n- **Loops** to eliminate repetition and create patterns\n\nThese aren't separate skills - they're building blocks that work together. Every program you write will combine these concepts in different ways. In the next unit, you'll discover how to use the loop variable itself to make each iteration different from the last, creating gradients, spirals, and dynamic patterns. Keep up the excellent work!",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
