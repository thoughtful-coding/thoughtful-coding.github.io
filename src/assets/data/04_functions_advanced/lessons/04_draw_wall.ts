import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  TestingSectionData,
  ParsonsSectionData,
  ReflectionSectionData,
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
      kind: "Parsons",
      id: "row-logic-parsons",
      title: "Step 2: Designing the Rows",
      content: [
        {
          kind: "text",
          value:
            "We need two types of rows to make the pattern work. \n- **Row A:** Big, Big, Big, Small\n- **Row B:** Small, Big, Big, Big\n\nArrange the code to define `draw_row_a`.",
        },
      ],
      codeBlocks: [
        ["def draw_row_a():"],
        ["  draw_big_brick()"],
        ["  draw_big_brick()"],
        ["  draw_big_brick()"],
        ["  draw_small_brick()"],
      ],
      visualization: "turtle",
      testMode: "procedure",
      functionToTest: "draw_row_a",
      testCases: [
        {
          input: [null],
          expected: "SHAPE:row_a",
          description: "Define Row A",
        },
      ],
    } as ParsonsSectionData,
    {
      kind: "Testing",
      id: "create-rows" as SectionId,
      title: "Step 3: Build the Rows",
      content: [
        {
          kind: "text",
          value:
            "Now define both row functions in code.\n\n**Row A:** 3 Big Bricks, then 1 Small Brick.\n**Row B:** 1 Small Brick, then 3 Big Bricks.\n\n(Note: In a real wall, we'd use loops, but for now, just copy/paste the function calls!).",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\ndef draw_row_a():\n    # 3 Big, 1 Small\n    pass\n\ndef draw_row_b():\n    # 1 Small, 3 Big\n    pass\n\n# Test both\ndraw_row_a()\nturtle.penup(); turtle.goto(0, -30); turtle.pendown()\ndraw_row_b()",
      },
      testMode: "procedure",
      functionToTest: "__main__",
      visualThreshold: 0.95,
      testCases: [
        {
          input: [null],
          expected: "SHAPE:both_rows",
          description: "Draw both row types",
        },
      ],
    } as TestingSectionData,
    {
      kind: "Testing",
      id: "draw-wall-challenge" as SectionId,
      title: "Step 4: The Wall (High Level)",
      content: [
        {
          kind: "text",
          value:
            "Finally, create the `draw_wall` function. It should stack the rows on top of each other:\n\n1. Draw Row A\n2. Move up and back to start\n3. Draw Row B\n4. Move up and back to start\n5. Draw Row A\n\nNotice how simple `draw_wall` is to read? That is the beauty of abstraction!",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\n# ... assume row functions are defined ...\n\ndef draw_wall():\n    # 1. Row A\n    # 2. Move up (y + 20) and back (x = 0)\n    # 3. Row B\n    # 4. Move up\n    # 5. Row A\n    pass\n\ndraw_wall()",
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
