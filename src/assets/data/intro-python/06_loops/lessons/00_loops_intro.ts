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
  title: "The Pattern Repeater",
  guid: "d8f3c921-4a56-4b72-9e15-2c8f7d4a3b91" as LessonId,
  description:
    "Learn how loops eliminate repetition and discover the mathematical patterns behind creating shapes with code.",
  sections: [
    {
      kind: "Information",
      id: "repetition-problem",
      title: "The Repetition Problem",
      content: [
        {
          kind: "text",
          value:
            "At this point you've covered data types, variables, functions, and conditionals. There's only one more thing you need to learn to be considered a competent, beginner programmer: **loops**. Loops let you repeat actions without writing the same code multiple times.\n\nRemember programming the turtle to draw a triangle? You wrote `forward(100)` and `right(120)` three separate times. For a triangle this gets repetitive, but imagine how annoying it would be if you wanted to draw a shape with 100 sides. That's where loops come in.\n\nLoops are powerful because they let you tell the computer to repeat actions without having to write the same code multiple times. They turn you from someone who types instructions into someone who describes patterns.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "PRIMM",
      id: "four-lefts-primm" as SectionId,
      title: "Four Lefts Make a Right",
      content: [
        {
          kind: "text",
          value:
            "Let's start with a simple, repetitive program. Look at this code carefully and predict what it will draw.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\ndef make_shape():\n  turtle.forward(100)\n  turtle.left(90)\n  turtle.forward(100)\n  turtle.left(90)\n  turtle.forward(100)\n  turtle.left(90)\n  turtle.forward(100)\n  turtle.left(90)\n\nmake_shape()\n",
      },
      predictPrompt: "What shape will this draw?",
      conclusion: "Four right angles add up to a square.",
    } as PRIMMSectionData,
    {
      kind: "Observation",
      id: "first-loop" as SectionId,
      title: "Your First Loop",
      content: [
        {
          kind: "text",
          value:
            'The problem with the code above is that it\'s very repetitive. It\'s the same two lines repeated over and over.\n\nBelow is a program to draw the **same exact shape using a loop**. The loop allows us to eliminate the repetition and create a smaller program. The key parts are:\n- `for i in range(4):` tells Python to repeat the code "within" the loop 4 times\n- Just like with functions, indentation shows what\'s "inside" the loop\n\nTake a little time to compare the two different representations. Notice how much shorter and clearer the loop is.',
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\n# Draw the shape using a loop\ndef make_shape():\n  for i in range(4):\n    turtle.forward(100)\n    turtle.left(90)\n\nmake_shape()\n",
      },
    } as ObservationSectionData,
    {
      kind: "MultipleChoice",
      id: "indentation-understanding",
      title: "Indentation Check",
      content: [
        {
          kind: "text",
          value:
            "The code above had a lot of indentations. The `turtle.forward()` and the `turtle.left()` are actually indented twice. Why is that?",
        },
      ],
      options: [
        'Functions require at minimum two spaces for all the code "inside" them',
        "Each new line should be indented by two spaces",
        "Each `turtle` command is required to be at a unique level from the code above",
        'The turtle code is "inside" a loop which is "inside" a function',
      ],
      correctAnswer: 3,
      feedback: {
        correct:
          'Excellent! Indentation is a way that Python shows code that should be run "within" different structures.',
      },
    } as MultipleChoiceSectionData,
    {
      kind: "MultipleChoice",
      id: "loop-mechanics",
      title: "Understanding Loops",
      content: [
        {
          kind: "text",
          value:
            'The creators of Python chose the word `for` very intentionally. It means: for every number up to four (four times), run the code "inside" the loop. Put another way, `for i in range(4)` means "run the following code four times".\n\nFor loops let you easily set how many times they should repeat. How many times will the following loop repeat?',
        },
        {
          kind: "code",
          value: "for i in range(7):\n    print('Hello')\n",
        },
      ],
      options: ["Six times", "Seven times", "Eight times", "It depends on `i`"],
      correctAnswer: 1,
      feedback: {
        correct:
          'Correct! The code "inside" the loop runs seven times, meaning `Hello` is printed seven times.',
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Testing",
      id: "pentagon-builder" as SectionId,
      title: "Challenge: Pentagon Builder",
      content: [
        {
          kind: "text",
          value:
            "As stated, loops are a way of encoding patterns to avoid repetition. For example, the code below draws a pentagon in the least efficient way possible.",
        },
        {
          kind: "code",
          value:
            "import turtle\n\ndef make_shape():\n  turtle.forward(80)\n  turtle.right(72)\n  turtle.forward(80)\n  turtle.right(72)\n  turtle.forward(80)\n  turtle.right(72)\n  turtle.forward(80)\n  turtle.right(72)\n  turtle.forward(80)\n  turtle.right(72)\n\nmake_shape()\n",
        },
        {
          kind: "text",
          value:
            "See if you can use a loop to rewrite the program more efficiently. Your loop should draw the exact same pentagon use only 3 lines of code (not counting the `import` or function definition).",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\ndef make_shape():\n  # Your code here converting the code above to a loop\n\n\nmake_shape()",
      },
      testMode: "procedure",
      functionToTest: "__main__",
      visualThreshold: 0.999,
      testCases: [
        {
          description: "Pentagon with side length 80",
          input: [],
          expected: null,
          referenceImage: "images/turtle_pentagon_80.png",
        },
      ],
    } as TestingSectionData,
    {
      kind: "MultipleSelection",
      id: "loop-understanding",
      title: "Loop Syntax Check",
      content: [
        {
          kind: "text",
          value:
            "Which of the following statements about loops are true? Select all that apply.",
        },
      ],
      options: [
        "`for i in range(5):` repeats exactly 5 times",
        "The code inside a loop must be indented",
        "Loops can only be used for drawing shapes",
        "Loops eliminate the need to write repetitive code",
        "`for i in range(3):` repeats exactly 4 times",
      ],
      correctAnswers: [0, 1, 3],
      feedback: {
        correct:
          "Excellent! You understand that loops are a general programming concept for eliminating repetition, not just for turtle graphics.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "PRIMM",
      id: "loop-mystery" as SectionId,
      title: "Loop Mysteries",
      content: [
        {
          kind: "text",
          value:
            'Now let\'s explore a crazy shape. Look at this code and predict what will happen, paying special attention to the number of times we loop and the angle used "within" the loop.',
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\n# Draw the shape\ndef make_shape():\n  for i in range(36):\n    turtle.forward(15)\n    turtle.right(10)\n\nmake_shape()\n",
      },
      predictPrompt: "What do you think will be the output of the program?",
      conclusion:
        "The pattern is 36 (loops) * 10 (angle) = 360°! This works for any regular polygon because the turtle makes one complete turn (360°) by the time it returns to the start.",
    } as PRIMMSectionData,
    {
      kind: "MultipleChoice",
      id: "loop-counting",
      title: "Counting Loop Iterations",
      content: [
        {
          kind: "text",
          value:
            "If there weren't loops in the program above, how many lines of code would be required to create the same shape?",
        },
      ],
      options: [
        "20 lines of code",
        "36 lines of code",
        "55 lines of code",
        "72 lines of code",
      ],
      correctAnswer: 3,
      feedback: {
        correct:
          "Correct! The two lines of code inside the loop are run 36 times which means 72 lines of code.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Reflection",
      id: "loop-patterns-reflection" as SectionId,
      title: "Loop Patterns Reflection",
      content: [
        {
          kind: "text",
          value:
            'Loops transform repetitive code into elegant patterns. Create a simple example that shows how loops eliminate repetition and explain the pattern that is being repeated inside the loop. Remember to use the phrase "as seen in the example above".',
        },
      ],
      topic: "How Loops Create Patterns",
      isTopicPredefined: true,
      code: "Create an example showing a loop drawing a shape",
      isCodePredefined: false,
      explanation:
        "Explain how your loop works and what pattern it follows (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "loops-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "Fantastic work! You've transformed from writing repetitive code to describing patterns. You've learned:\n- How `for i in range(n):` repeats code n times\n- That indentation shows what's \"inside\" the loop\n- How to use loops to create regular polygons\n\nIn the next lesson, you'll have a chance to practice with some less regular shapes and inject a bit of color.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
