import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  MultipleChoiceSectionData,
  MatchingSectionData,
  ParsonsSectionData,
  TestingSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Advanced Functions Wrap Up",
  guid: "advanced-func-wrap-uuid" as LessonId,
  description:
    "Test your understanding of abstraction, composition, and system design.",
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
      codeBlocks: [
        ["draw_ocean_scene() starts"],
        ["draw_boat() is called"],
        ["draw_triangle() is called"],
        ["turtle.forward() moves the turtle"],
      ],
      visualization: "console",
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
  ],
};

export default lessonData;
