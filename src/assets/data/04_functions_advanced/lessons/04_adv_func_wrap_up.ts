import type {
  InformationSectionData,
  Lesson,
  LessonId,
  MultipleChoiceSectionData,
  MultipleSelectionSectionData,
  MatchingSectionData,
  TestingSectionData,
  ParsonsSectionData,
  ReflectionSectionData,
  SectionId,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Advanced Functions Wrap Up",
  guid: "advanced-functions-wrap-up-uuid" as LessonId, // Generate real UUID
  description:
    "Test your mastery of abstraction, coordinates, and composition with interleaved practice problems.",
  sections: [
    {
      kind: "Information",
      id: "wrap-up-intro",
      title: "The Magic of Black Boxes",
      content: [
        {
          kind: "text",
          value:
            "Imagine a microwave. You don't know how it generates waves, how the timer circuit works, or how the rotating plate motor is wired. You just know the **inputs** (time, power level) and the **output** (hot food). The microwave is a 'Black Box'—it hides complexity behind a simple interface.\n\nIn this unit, you learned that **Functions are Black Boxes**. When you call `random.randint(1, 10)`, you don't care about the complex math happening inside. You just care about the result. This ability to ignore details and focus on the 'What' instead of the 'How' is called **Abstraction**. It is the superpower that allows programmers to build massive systems without their brains exploding.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "MultipleChoice",
      id: "coordinate-logic",
      title: "Navigating the Grid",
      content: [
        {
          kind: "text",
          value:
            "To draw a shape in the **bottom-right** corner of the screen, what would your coordinates look like?",
        },
      ],
      options: [
        "Positive X, Positive Y (e.g., 100, 100)",
        "Negative X, Positive Y (e.g., -100, 100)",
        "Negative X, Negative Y (e.g., -100, -100)",
        "Positive X, Negative Y (e.g., 100, -100)",
      ],
      correctAnswer: 3,
      feedback: {
        correct: "Correct! Positive X moves right, Negative Y moves down.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Parsons",
      id: "snowman-construction",
      title: "Building a Snowman",
      content: [
        {
          kind: "text",
          value:
            "You have a helper function `draw_snowball(size)` that draws a white circle. Organize the code below to draw a snowman. **Think about layers:** You must build from the bottom up, or the big snowballs will cover the small ones!",
        },
      ],
      codeBlocks: [
        ["# Bottom"],
        ["draw_snowball(60)"],
        ["# Middle"],
        ["draw_snowball(40)"],
        ["# Head"],
        ["draw_snowball(20)"],
      ],
      visualization: "turtle",
      testMode: "procedure",
      functionToTest: "__main__",
      testCases: [
        {
          input: [null],
          expected: "SHAPE:snowman", // System checks for 3 overlapping circles
          description: "Draw snowman bottom-to-top",
        },
      ],
    } as ParsonsSectionData,
    {
      kind: "MultipleSelection",
      id: "string-formatting-review",
      title: "Review: Strings & Variables",
      content: [
        {
          kind: "text",
          value:
            "Which of the following are valid ways to print: `The score is 10`? (Assume `score = 10` is an integer). Select all that apply.",
        },
      ],
      options: [
        'print(f"The score is {score}")',
        'print("The score is " + score)',
        'print("The score is " + str(score))',
        'print("The score is {score}")',
      ],
      correctAnswers: [0, 2],
      feedback: {
        correct:
          "Correct! Option 1 is an f-string. Option 3 works because we converted the int to a string manually. Option 2 fails because you can't add string + int.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Matching",
      id: "abstraction-vocab" as SectionId,
      title: "The Language of Design",
      content: [
        {
          kind: "text",
          value: "Match the programming concept to its definition.",
        },
      ],
      prompts: [
        { Composition: "Using one function inside another" },
        { Abstraction: "Hiding details to focus on the big picture" },
        { Parameter: "The variable name inside the function definition" },
        { Argument: "The value passed when calling a function" },
        { Library: "A collection of pre-written functions" },
      ],
      feedback: {
        correct:
          "Excellent! These terms are used by professional software engineers every day.",
      },
    } as MatchingSectionData,
    {
      kind: "MultipleChoice",
      id: "variable-update-logic",
      title: "Review: Variable Logic",
      content: [
        {
          kind: "text",
          value:
            "What will be the final value of `x` after this code runs?\n```python\nx = 10\nx = x + 5\nx = x * 2\n```",
        },
      ],
      options: ["10", "15", "25", "30"],
      correctAnswer: 3,
      feedback: {
        correct: "Correct! 10 + 5 is 15. Then 15 * 2 is 30.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Testing",
      id: "archery-target",
      title: "Challenge: Archery Target",
      content: [
        {
          kind: "text",
          value:
            "Create a function `draw_target` that draws a target with 3 rings: Blue (outer), Red (middle), and Yellow (center).\n\n1. Use the provided `draw_circle(size, color)` helper.\n2. **Important:** Remember the 'Painter's Algorithm'. Draw the biggest thing first!\n3. Sizes: Blue (60), Red (40), Yellow (20).",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\ndef draw_circle(size, color):\n    turtle.color(color)\n    turtle.begin_fill()\n    # Adjust to keep centered\n    turtle.penup(); turtle.right(90); turtle.forward(size); turtle.left(90); turtle.pendown()\n    turtle.circle(size)\n    turtle.penup(); turtle.left(90); turtle.forward(size); turtle.right(90); turtle.pendown()\n    turtle.end_fill()\n\ndef draw_target():\n    # Draw Blue, then Red, then Yellow\n    pass\n\n# Test\ndraw_target()",
      },
      testMode: "procedure",
      functionToTest: "__main__",
      visualThreshold: 0.95,
      testCases: [
        {
          input: [null],
          expected: "SHAPE:target",
          description: "Draw concentric rings (Blue, Red, Yellow)",
        },
      ],
    } as TestingSectionData,
    {
      kind: "MultipleChoice",
      id: "random-behavior",
      title: "Predicting Randomness",
      content: [
        {
          kind: "text",
          value:
            "If you run `random.randint(1, 5)` inside a loop that runs 100 times, which of the following is true?",
        },
      ],
      options: [
        "It will generate the same number every time",
        "It will never produce the number 5",
        "It will produce a mix of numbers between 1 and 5 (inclusive)",
        "It will throw an error after the 10th time",
      ],
      correctAnswer: 2,
      feedback: {
        correct:
          "Correct! `randint` is inclusive, so it can pick 1, 2, 3, 4, or 5 each time.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Matching",
      id: "syntax-review" as SectionId,
      title: "Review: Syntax Hunt",
      content: [
        {
          kind: "text",
          value: "Match the symbol to its job in Python.",
        },
      ],
      prompts: [
        { def: "Defines a new function" },
        { "=": "Assigns a value to a variable" },
        { "==": "Checks if two things are equal" },
        { "()": "Used to call a function" },
        { "#": "Starts a comment (ignored by computer)" },
      ],
      feedback: {
        correct:
          "Great review! Keeping these symbols straight is key to avoiding SyntaxErrors.",
      },
    } as MatchingSectionData,
    {
      kind: "Reflection",
      id: "final-abstraction-reflection",
      title: "Philosophy: The Black Box",
      content: [
        {
          kind: "text",
          value:
            "We started this lesson talking about microwaves and black boxes. Think about the `draw_circle` function you used in the Archery Target challenge. You didn't write the code to draw the circle; you just used it.\n\nWrite 3-4 sentences explaining how treating functions as 'Black Boxes' helps you solve harder problems. If you had to worry about every single pixel every time, would you be able to build a Neighborhood? Use the phrase 'as seen in the example above'.",
        },
      ],
      topic: "Functions as Black Boxes",
      isTopicPredefined: true,
      code: "draw_target() # vs writing 50 lines of geometry",
      isCodePredefined: true,
      explanation:
        "Reflect on how hiding details makes programming easier (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "unit-complete",
      title: "Unit Complete",
      content: [
        {
          kind: "text",
          value:
            "You have completed the Advanced Functions unit. You can now coordinate complex systems, manage randomness, and think like a software architect. These skills are the foundation for the next big leap in your programming journey: teaching the computer to make decisions with **Conditionals**.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
