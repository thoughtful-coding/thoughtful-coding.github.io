import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  TestingSectionData,
  ReflectionSectionData,
  MultipleChoiceSectionData,
  MultipleSelectionSectionData,
  MatchingSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "The Brick Wall",
  guid: "advanced-func-wall-uuid" as LessonId,
  description:
    "Build a complex structure by creating a hierarchy of functions: Bricks make Rows, Rows make Walls.",
  sections: [
    {
      kind: "Information",
      id: "wall-intro",
      title: "The Running Bond",
      content: [
        {
          kind: "text",
          value:
            "Brick walls are strong because the bricks are offset. One row starts with a full brick, the next might start with a half-brick. This pattern is called a 'Running Bond'.\n\nTo draw this, we need different types of rows. Instead of writing one giant script, we will build a hierarchy of functions:\n1. **Low Level:** `draw_brick`\n2. **Mid Level:** `draw_row_a` and `draw_row_b`\n3. **High Level:** `draw_wall`",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Testing",
      id: "test-bricks" as SectionId,
      title: "Step 1: The Bricks",
      content: [
        {
          kind: "text",
          value:
            "We have provided two helper functions: `draw_small_brick()` (width 25) and `draw_big_brick()` (width 50). Both are 20 pixels high.\n\nWrite a script that draws one small brick, moves the turtle, and draws one big brick. Verify they work.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\n# Helpers provided: draw_small_brick(), draw_big_brick()\n\n# Draw small, move, draw big\n",
      },
      testMode: "procedure",
      functionToTest: "__main__",
      visualThreshold: 0.95,
      testCases: [
        {
          input: [null],
          expected: "SHAPE:two_bricks",
          description: "Draw one of each brick",
        },
      ],
    } as TestingSectionData,
    {
      kind: "Matching",
      id: "row-logic-match" as SectionId,
      title: "Planning the Rows",
      content: [
        {
          kind: "text",
          value:
            "We need two types of rows to make the pattern work. Match the Row Name to the correct pattern.",
        },
      ],
      prompts: [
        { "Row A": "Big, Big, Big, Small (Ends with half)" },
        { "Row B": "Small, Big, Big, Big (Starts with half)" },
        { Wall: "Stack of Row A, Row B, Row A..." },
      ],
      feedback: {
        correct:
          "Correct! By alternating these two row types, the 'seams' of the bricks won't line up, making the wall strong.",
      },
    } as MatchingSectionData,
    {
      kind: "Testing",
      id: "create-row-a" as SectionId,
      title: "Step 2: Define Row A",
      content: [
        {
          kind: "text",
          value:
            "Define `draw_row_a()`. It should draw **3 Big Bricks** followed by **1 Small Brick**.\n\n(Since we don't have loops yet, just call the brick functions one after another!).",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n# Helpers provided\n\ndef draw_row_a():\n    # Big, Big, Big, Small\n    pass\n\ndraw_row_a()",
      },
      testMode: "procedure",
      functionToTest: "draw_row_a",
      visualThreshold: 0.95,
      testCases: [
        {
          input: [null],
          expected: "SHAPE:row_a",
          description: "Draw Row A",
        },
      ],
    } as TestingSectionData,
    {
      kind: "Testing",
      id: "create-row-b" as SectionId,
      title: "Step 3: Define Row B",
      content: [
        {
          kind: "text",
          value:
            "Now define `draw_row_b()`. It should start with **1 Small Brick**, followed by **3 Big Bricks**.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n# Helpers provided\n\ndef draw_row_b():\n    # Small, Big, Big, Big\n    pass\n\ndraw_row_b()",
      },
      testMode: "procedure",
      functionToTest: "draw_row_b",
      visualThreshold: 0.95,
      testCases: [
        {
          input: [null],
          expected: "SHAPE:row_b",
          description: "Draw Row B",
        },
      ],
    } as TestingSectionData,
    {
      kind: "MultipleSelection",
      id: "hierarchy-check",
      title: "Checking the Hierarchy",
      content: [
        {
          kind: "text",
          value:
            "We are about to build the Wall. Which functions will `draw_wall` call directly? Select all that apply.",
        },
      ],
      options: [
        "`draw_row_a`",
        "`draw_row_b`",
        "`draw_small_brick`",
        "`turtle.forward`",
      ],
      correctAnswers: [0, 1],
      feedback: {
        correct:
          "Correct! The Wall talks to the Rows. The Rows talk to the Bricks. The Bricks talk to the Turtle. This is a Hierarchy.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Testing",
      id: "draw-wall-challenge" as SectionId,
      title: "Step 4: The Wall",
      content: [
        {
          kind: "text",
          value:
            "Finally, create the `draw_wall` function. It should stack the rows:\n\n1. Draw Row A\n2. Move up (y + 20) and back to start (x = 0)\n3. Draw Row B\n4. Move up and back\n5. Draw Row A\n\nNotice how simple `draw_wall` is to read? That is the beauty of abstraction!",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\n# ... assume row functions are defined ...\n\ndef draw_wall():\n    # 1. Row A\n    # 2. Move up and back\n    # 3. Row B\n    # 4. Move up and back\n    # 5. Row A\n    pass\n\ndraw_wall()",
      },
      testMode: "procedure",
      functionToTest: "draw_wall",
      visualThreshold: 0.9,
      testCases: [
        {
          input: [null],
          expected: "SHAPE:full_wall",
          description: "Draw the stacked wall",
        },
      ],
    } as TestingSectionData,
    {
      kind: "MultipleChoice",
      id: "maintenance-quiz",
      title: "The Lazy Programmer",
      content: [
        {
          kind: "text",
          value:
            "Suppose you decide the wall is too short. You want to make the bricks TALLER (30px instead of 20px). Where do you have to change the code?",
        },
      ],
      options: [
        "In `draw_wall` (because it draws the wall)",
        "In `draw_row_a` and `draw_row_b` (because they draw lines of bricks)",
        "In `draw_small_brick` and `draw_big_brick` (because they draw the shape)",
        "In every single line of code",
      ],
      correctAnswer: 2,
      feedback: {
        correct:
          "Correct! You change the 'Low Level' brick functions. The Rows and the Wall will automatically use the new, taller bricks!",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Reflection",
      id: "wall-reflection" as SectionId,
      title: "Reflection: The Hierarchy",
      content: [
        {
          kind: "text",
          value:
            "You just built a wall using a hierarchy: `draw_wall` called `draw_row`, which called `draw_brick`, which called `turtle.forward`.\n\nWhy is this better than just writing 100 lines of `turtle.forward` commands inside one giant function? Use the phrase 'as seen in the example above'.",
        },
      ],
      topic: "Hierarchical Abstraction",
      isTopicPredefined: true,
      code: "draw_wall() # vs 100 lines of code",
      isCodePredefined: true,
      explanation:
        "Explain benefits of breaking code into layers (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
  ],
};

export default lessonData;
