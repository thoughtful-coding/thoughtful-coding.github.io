import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  TestingSectionData,
  PRIMMSectionData,
  MultipleSelectionSectionData,
  MatchingSectionData,
  ReflectionSectionData,
  MultipleChoiceSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "The Neighborhood",
  guid: "advanced-func-neighborhood-uuid" as LessonId,
  description:
    "Use your house function to build a street, and learn how changing the blueprint updates the whole town.",
  sections: [
    {
      kind: "Information",
      id: "neighborhood-intro",
      title: "One Blueprint, Many Houses",
      content: [
        {
          kind: "text",
          value:
            "Now that you have a `draw_house()` function, you effectively have a blueprint. You can build as many houses as you want by calling the function multiple times. If you want to change *every* house in the neighborhood (e.g., paint them all blue), you only have to change the blueprint (the function definition) once.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "PRIMM",
      id: "street-primm",
      title: "Building a Street",
      content: [
        {
          kind: "text",
          value:
            "Read the code below. It calls `draw_house()` three times. Predict what the output will look like on the screen.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n# draw_house() is hidden\n\ndraw_house()\nturtle.penup()\nturtle.forward(150)\nturtle.pendown()\n\ndraw_house()\nturtle.penup()\nturtle.forward(150)\nturtle.pendown()\n\ndraw_house()",
      },
      predictPrompt: "Will the houses be stacked? In a row? Overlapping?",
      conclusion:
        "They are in a row! The `forward(150)` moves the start position for the next house.",
    } as PRIMMSectionData,
    {
      kind: "Testing",
      id: "linear-neighborhood" as SectionId,
      title: "Challenge: The Street",
      content: [
        {
          kind: "text",
          value:
            "Create a row of 3 houses yourself. \n\n1. Use the provided `draw_house()` function.\n2. Space them out so they don't touch (at least 150 pixels apart).\n3. Ensure you use `penup()` so you don't draw lines between the houses.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\n# draw_house() is provided\n\n# House 1\n\n# Move to next spot\n\n# House 2\n\n# Move to next spot\n\n# House 3",
      },
      testMode: "procedure",
      functionToTest: "__main__",
      visualThreshold: 0.9,
      testCases: [
        {
          input: [null],
          expected: "SHAPE:three_houses_row",
          description: "Draw 3 houses in a line",
        },
      ],
    } as TestingSectionData,
    {
      kind: "Information",
      id: "random-color-intro",
      title: "Updating the Blueprint",
      content: [
        {
          kind: "text",
          value:
            "That neighborhood looks a bit boring—all the houses are gray. We want to paint them random colors.\n\nInstead of changing the code for House 1, then House 2, then House 3, we can just change the `draw_house` function *definition*. This is the power of abstraction: Change the rule in one place, and it applies everywhere.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "MultipleChoice",
      id: "abstraction-benefit-quiz",
      title: "Why Use Functions?",
      content: [
        {
          kind: "text",
          value:
            "Imagine you drew 50 houses manually (without a function). Now your boss says 'Make all the roofs red instead of black.' How many lines of code would you have to change?",
        },
      ],
      options: [
        "1 line (The definition)",
        "50 lines (Every single house)",
        "0 lines (The computer knows what you want)",
      ],
      correctAnswer: 1,
      feedback: {
        correct:
          "Exactly! Without functions, you'd have to edit 50 places. With functions, you edit the definition once, and all 50 houses update.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "PRIMM",
      id: "random-house-primm" as SectionId,
      title: "Randomizing the House",
      content: [
        {
          kind: "text",
          value:
            "We've updated the `draw_house` function to use `turtle.random_color()` (a special helper we made) for the body color. Predict what will happen when we run the EXACT same street code from before.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\n\ndef draw_house():\n    # Now uses a random color!\n    color = turtle.random_color()\n    draw_square(100, color)\n    # ... rest of house code ...\n\n# The street code hasn't changed:\ndraw_house()\nturtle.penup(); turtle.forward(150); turtle.pendown()\ndraw_house()\nturtle.penup(); turtle.forward(150); turtle.pendown()\ndraw_house()",
      },
      predictPrompt:
        "Will the houses be the same color? Will they change every time you run it?",
      conclusion:
        "Every house is now a different random color! We updated the 'Definition' (the blueprint), so every 'Call' (the house) got the upgrade automatically.",
    } as PRIMMSectionData,
    {
      kind: "Testing",
      id: "random-neighborhood-challenge" as SectionId,
      title: "Challenge: The Colorful Street",
      content: [
        {
          kind: "text",
          value:
            "We have provided a function `get_random_color()` that returns a color string. Update the `draw_house` function to use a random color for the body AND a random color for the roof.\n\nThen draw the row of 3 houses again to see your colorful neighborhood.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\nimport random\n\ndef draw_house():\n    # 1. Get random color for body\n    body_col = get_random_color()\n    draw_square(100, body_col)\n    \n    # ... move to roof ...\n    \n    # 2. Get random color for roof\n    roof_col = get_random_color()\n    draw_triangle(100, roof_col)\n\n# Draw 3 houses\n",
      },
      testMode: "procedure",
      functionToTest: "__main__",
      visualThreshold: 0.85, // Lower threshold for randomness
      testCases: [
        {
          input: [null],
          expected: "SHAPE:three_random_houses",
          description: "Draw 3 random houses",
        },
      ],
    } as TestingSectionData,
    {
      kind: "Matching",
      id: "abstraction-levels-match" as SectionId,
      title: "Levels of Abstraction",
      content: [
        {
          kind: "text",
          value:
            "We are now working with functions inside functions. Match the code to its 'Level' of abstraction.",
        },
      ],
      prompts: [
        { "`turtle.forward(10)`": "Low Level (Tiny Details)" },
        { "`draw_square(50)`": "Mid Level (Building Blocks)" },
        { "`draw_neighborhood()`": "High Level (Big Picture)" },
      ],
      feedback: {
        correct:
          "Perfect! High-level functions call mid-level functions, which call low-level commands. Good programmers spend most of their time at the High Level.",
      },
    } as MatchingSectionData,
    {
      kind: "MultipleSelection",
      id: "function-purpose-check",
      title: "Function Roles",
      content: [
        {
          kind: "text",
          value:
            "Which of these are responsibilities of the `draw_house` function? Select all that apply.",
        },
      ],
      options: [
        "Choosing the color of the house",
        "Deciding WHERE on the screen the house goes",
        "Combining a square and a triangle",
        "Drawing the entire neighborhood",
      ],
      correctAnswers: [0, 2],
      feedback: {
        correct:
          "Correct! `draw_house` decides what a house LOOKS like (color, shape). It does NOT decide WHERE it goes (that's the job of the code calling it).",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Reflection",
      id: "blueprint-reflection",
      title: "Reflection: The Blueprint",
      content: [
        {
          kind: "text",
          value:
            "Think about the difference between the **Definition** (`def draw_house(): ...`) and the **Call** (`draw_house()`). \n\nOne is the Blueprint. One is the House.\n\nExplain why separating the Blueprint from the House allows us to create 100 *different* houses (random colors) without writing 100 different functions.",
        },
      ],
      topic: "Definitions vs Calls",
      isTopicPredefined: true,
      code: "draw_house() # Calls the blueprint",
      isCodePredefined: true,
      explanation:
        "Explain how one definition creates many unique instances (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
  ],
};

export default lessonData;
