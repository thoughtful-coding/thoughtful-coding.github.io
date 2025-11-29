import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  MultipleChoiceSectionData,
  MatchingSectionData,
  ParsonsSectionData,
  MultipleSelectionSectionData,
  TestingSectionData,
  ReflectionSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Advanced Functions Wrap Up",
  guid: "advanced-func-wrap-uuid" as LessonId,
  description:
    "Test your understanding of abstraction, composition, and system design, plus a review of previous topics.",
  sections: [
    {
      kind: "Information",
      id: "wrap-intro",
      title: "Thinking Like an Architect",
      content: [
        {
          kind: "text",
          value:
            "You have moved from being a bricklayer (writing individual commands) to being an architect (designing systems). You learned that functions can call other functions, creating 'Layers of Abstraction'. This is how all modern software is built.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Matching",
      id: "visual-hierarchy-match" as SectionId,
      title: "Deconstructing the Scene",
      content: [
        {
          kind: "text",
          value:
            "Look at this drawing of boats on the ocean. If you were writing the code for this, how would you organize your functions? Match the function name to its Abstraction Level.",
        },
        {
          kind: "image",
          src: "data/06_advanced_funcs/images/turtle_boats_waves.png",
          alt: "Diagram of triangle boats floating on rows of sine-wave water",
        },
      ],
      prompts: [
        { "`draw_ocean_scene()`": "High Level (The whole picture)" },
        { "`draw_boat()`": "Mid Level (A specific object)" },
        { "`draw_triangle()`": "Low Level (A basic shape)" },
      ],
      feedback: {
        correct:
          "Perfect! The Scene calls the Boat, and the Boat calls the Triangle. That is the hierarchy of abstraction.",
      },
    } as MatchingSectionData,
    {
      kind: "MultipleChoice",
      id: "variable-review",
      title: "Review: Variable Logic",
      content: [
        {
          kind: "text",
          value:
            "Let's check your memory on variables. What is the value of `x` after this code runs?",
        },
        {
          kind: "code",
          value: "x = 10\nx = x + 5\nx = x * 2",
        },
      ],
      options: ["10", "15", "30", "Error"],
      correctAnswer: 2,
      feedback: {
        correct: "Correct! 10 + 5 is 15. Then 15 * 2 is 30.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "MultipleSelection",
      id: "string-review",
      title: "Review: Strings",
      content: [
        {
          kind: "text",
          value:
            "Which of the following are valid ways to verify if a string contains a question mark?",
        },
      ],
      options: [
        "`if '?' in text:`",
        "`if text.has('?'):`",
        "`if '?' not in text:` (Checks if it is MISSING)",
        "`if text == '?':` (Only checks if it IS a question mark)",
      ],
      correctAnswers: [0, 2],
      feedback: {
        correct:
          "Correct! `in` is the operator for checking membership. `text == '?'` only works if the string is *only* a question mark.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Parsons",
      id: "flow-control-parsons",
      title: "Tracing the Execution",
      content: [
        {
          kind: "text",
          value:
            "When we run the high-level function `draw_ocean_scene()`, what happens inside the computer? Place these events in the order they logically **start**.",
        },
      ],
      puzzle: {
        codeBlocks: [
          ["draw_ocean_scene() starts"],
          ["draw_boat() is called"],
          ["draw_triangle() is called"],
          ["turtle.forward() moves the turtle"],
        ],
        visualization: "console",
      },
      testMode: "procedure",
      functionToTest: "__main__",
      testCases: [
        {
          input: [null],
          expected: "Correct Order",
          description: "Order of execution stack",
        },
      ],
    } as ParsonsSectionData,
    {
      kind: "MultipleChoice",
      id: "reuse-benefits",
      title: "Why Reuse?",
      content: [
        {
          kind: "text",
          value:
            "If you decided the sails on *every* boat were too small, what is the FASTEST way to fix it in your program?",
        },
      ],
      options: [
        "Rewrite the `draw_ocean_scene` function completely",
        "Change the size inside the `draw_boat` function",
        "Manually redraw every boat",
        "Change the size inside the `draw_triangle` function",
      ],
      correctAnswer: 3,
      feedback: {
        correct:
          "Correct! If you change the Low Level function (`draw_triangle`), that change ripples up. Every Boat uses the Triangle, so every Boat gets fixed automatically!",
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
        { "#": "Starts a comment" },
      ],
      feedback: {
        correct: "Great review! Syntax rules never go away.",
      },
    } as MatchingSectionData,
    {
      kind: "MultipleSelection",
      id: "abstraction-concept",
      title: "True or False: Abstraction",
      content: [
        {
          kind: "text",
          value: "Select all TRUE statements about Abstraction.",
        },
      ],
      options: [
        "It hides details so you can focus on the big picture",
        "It makes programs run faster",
        "It allows you to reuse code easily",
        "It requires using 'elif' statements",
      ],
      correctAnswers: [0, 2],
      feedback: {
        correct:
          "Correct! Abstraction is about organization and reuse, not speed or conditionals.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Testing",
      id: "final-forest-challenge" as SectionId,
      title: "Challenge: The Forest",
      content: [
        {
          kind: "text",
          value:
            "Let's prove you can build a system. Create a `draw_forest` function using the provided `draw_tree` helper.\n\n1. Draw 3 trees in a row.\n2. Use `random.randint` to give them random heights (inputs to `draw_tree`).\n3. This combines Abstraction, Inputs, and Libraries.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\nimport random\n# draw_tree(height) is provided\n\ndef draw_forest():\n    # Your code here\n    pass\n\ndraw_forest()",
      },
      testMode: "procedure",
      functionToTest: "draw_forest",
      visualThreshold: 0.9,
      testCases: [
        {
          input: [null],
          expected: "SHAPE:forest",
          description: "Draw 3 random trees",
        },
      ],
    } as TestingSectionData,
    {
      kind: "Reflection",
      id: "final-abstraction-reflection",
      title: "Philosophy: The Black Box",
      content: [
        {
          kind: "text",
          value:
            "We started this unit talking about how you don't need to know how a microwave works to use it. Now you have built your own 'Microwaves' (Houses, Walls, Forests).\n\nWrite 3-4 sentences explaining why 'hiding the details' (Abstraction) is necessary when building HUGE programs like Video Games or Operating Systems. What would happen if you had to worry about every pixel all the time?",
        },
      ],
      topic: "Functions as Black Boxes",
      isTopicPredefined: true,
      code: "draw_forest() # vs 1000 lines of geometry",
      isCodePredefined: true,
      explanation:
        "Reflect on how hiding details makes large programs possible (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
  ],
};

export default lessonData;
