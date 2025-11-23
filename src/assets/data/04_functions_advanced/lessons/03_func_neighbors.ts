import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  TestingSectionData,
  ObservationSectionData,
  PRIMMSectionData,
  MultipleSelectionSectionData,
  ReflectionSectionData,
  MatchingSectionData,
  MultipleChoiceSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "The City Planner",
  guid: "city-planner-lesson-uuid" as LessonId,
  description:
    "Combine all your functions to generate a unique, randomized neighborhood scene.",
  sections: [
    {
      kind: "Information",
      id: "planner-intro",
      title: "Designing the System",
      content: [
        {
          kind: "text",
          value:
            "You are now a City Planner. You have a library of blueprints (functions) for houses, trees, and suns. Your job is not to draw lines; your job is to decide **where** things go and **how many** there are. In this lesson, we will use Python's `random` library to make sure no two neighborhoods look exactly the same.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Observation",
      id: "provided-assets" as SectionId,
      title: "Reviewing Your Assets",
      content: [
        {
          kind: "text",
          value:
            "We have pre-loaded all the drawing functions you built in previous lessons (`draw_house`, `draw_tree`, `draw_sun`). Run the code to see them all drawn at once. Notice how clean the main code is? It just calls functions!",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          'import turtle\nimport random\nt = turtle.Turtle()\nt.speed(0)\n\n# --- The "Assets" (Hidden details) ---\ndef draw_square(size): \n    turtle.forward(size); turtle.right(90)\n    turtle.forward(size); turtle.right(90)\n    turtle.forward(size); turtle.right(90)\n    turtle.forward(size); turtle.right(90)\n\ndef draw_triangle(size):\n    turtle.forward(size); turtle.left(120)\n    turtle.forward(size); turtle.left(120)\n    turtle.forward(size); turtle.left(120)\n\ndef draw_house(x, y, size, color):\n    turtle.penup(); turtle.goto(x, y); turtle.pendown()\n    turtle.color(color); turtle.begin_fill(); draw_square(size); turtle.end_fill()\n    turtle.color("red"); turtle.begin_fill(); draw_triangle(size); turtle.end_fill()\n\n# --- The Plan ---\ndraw_house(-100, 0, 50, "blue")\ndraw_house(0, 0, 50, "green")\ndraw_house(100, 0, 50, "yellow")',
      },
    } as ObservationSectionData,
    {
      kind: "Matching",
      id: "random-tool-matching" as SectionId,
      title: "Tools of the Trade",
      content: [
        {
          kind: "text",
          value:
            "To plan a unique city, you need the right random tools. Match the command to its purpose.",
        },
      ],
      prompts: [
        { "random.choice(['red', 'blue'])": "Pick a random color" },
        { "random.randint(50, 100)": "Pick a random size" },
        { "import random": "Load the toolset" },
        { "turtle.goto(x, y)": "Pick a specific location" },
      ],
      feedback: {
        correct:
          "Correct! Use 'choice' for lists of words, and 'randint' for ranges of numbers.",
      },
    } as MatchingSectionData,
    {
      kind: "PRIMM",
      id: "random-street-primm" as SectionId,
      title: "Randomizing the Neighborhood",
      content: [
        {
          kind: "text",
          value:
            "Real neighborhoods aren't perfect copies. We can use `random.randint(min, max)` and `random.choice(list)` to add variety. Predict what will change when you run this code multiple times.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          'import turtle\nimport random\n# ... (Assume drawing functions are here)\n\ndef draw_random_house(x, y):\n    colors = ["blue", "green", "purple", "orange"]\n    chosen_color = random.choice(colors)\n    random_size = random.randint(40, 70)\n    draw_house(x, y, random_size, chosen_color)\n\n# Draw 3 random houses\ndraw_random_house(-100, 0)\ndraw_random_house(0, 0)\ndraw_random_house(100, 0)',
      },
      predictPrompt:
        "Will the houses always be the same size? Will they always be the same distance apart?",
      conclusion:
        "The sizes and colors change! However, the *position* (x, y) stayed the same because we passed fixed numbers for the location.",
    } as PRIMMSectionData,
    {
      kind: "MultipleChoice",
      id: "random-range-quiz",
      title: "Safety Limits",
      content: [
        {
          kind: "text",
          value:
            "The code above uses `random.randint(40, 70)`. Which of these sizes is **IMPOSSIBLE** for a house?",
        },
      ],
      options: ["40", "70", "55", "30"],
      correctAnswer: 3,
      feedback: {
        correct: "Correct! 30 is below the minimum limit of 40.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "MultipleSelection",
      id: "planning-features",
      title: "Features of a Neighborhood",
      content: [
        {
          kind: "text",
          value:
            "As a City Planner, what details do you need to control to make a good scene? Select all that apply.",
        },
      ],
      options: [
        "The X and Y position of every object",
        "The order objects are drawn (background first!)",
        "The exact number of pixels in every line",
        "The variety of colors and sizes",
      ],
      correctAnswers: [0, 1, 3],
      feedback: {
        correct:
          "Correct! You control positions, layers (order), and variety. You shouldn't worry about individual pixels anymore - your functions handle that!",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "MultipleChoice",
      id: "layering-logic-quiz",
      title: "The Painter's Algorithm",
      content: [
        {
          kind: "text",
          value:
            "The 'Painter's Algorithm' means painting the background before the foreground. If you want a blue sky and a yellow sun, what order should you draw them?",
        },
      ],
      options: [
        "Draw the sun, then draw the sky rectangle",
        "Draw the sky rectangle, then draw the sun",
        "It does not matter",
        "Draw them both at the same time",
      ],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! If you draw the sky second, it will paste right over your sun, hiding it!",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Testing",
      id: "final-neighborhood-project" as SectionId,
      title: "Project: The Neighborhood",
      content: [
        {
          kind: "text",
          value:
            "It is time. Build your neighborhood.\n\n**Requirements:**\n1. Draw the Sky and Ground (Hint: giant rectangles).\n2. Call `draw_house` at least **3 times** at different locations.\n3. Call `draw_tree` at least **2 times**.\n4. Use `random` to vary the size or color of your houses.\n\nWe have provided all the helper functions. You just need to write the `main` logic at the bottom.",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\nimport random\n\n# --- PRE-WRITTEN ASSETS (Do not change) ---\ndef draw_rectangle(x, y, w, h, color):\n    turtle.penup(); turtle.goto(x, y); turtle.pendown()\n    turtle.color(color); turtle.begin_fill()\n    turtle.forward(w); turtle.left(90)\n    turtle.forward(h); turtle.left(90)\n    turtle.forward(w); turtle.left(90)\n    turtle.forward(h); turtle.left(90)\n    turtle.end_fill()\n\ndef draw_house(x, y, size, color):\n    # Simplified house logic...\n    pass \n    # (Assume full implementation in real lesson)\n\ndef draw_tree(x, y):\n    # Simplified tree logic...\n    pass\n# ------------------------------------------\n\n# --- YOUR CITY PLAN ---\n# 1. Draw Sky and Ground\n\n# 2. Draw 3 Houses\n\n# 3. Draw 2 Trees\n",
      },
      testMode: "procedure",
      functionToTest: "__main__",
      visualThreshold: 0.9,
      testCases: [
        {
          input: [null],
          expected: "SHAPE:complex_neighborhood",
          description: "Draw a full neighborhood",
        },
      ],
    } as TestingSectionData,
    {
      kind: "Reflection",
      id: "abstraction-reflection" as SectionId,
      title: "Reflection: The View from Above",
      content: [
        {
          kind: "text",
          value:
            'In the beginning, you had to write `forward(100)` just to draw a line. Now, you can write `draw_neighborhood()` to create an entire world.\n\nThis is **Abstraction**: hiding details to focus on the big picture.\n\nWrite 3-4 sentences explaining why Abstraction is important for large software projects (like video games or apps). How would building this neighborhood feel if you had to write every `forward` command by hand? Use the phrase "as seen in the example above".',
        },
      ],
      topic: "The Power of Abstraction",
      isTopicPredefined: true,
      code: "draw_house(0, 0, 50, 'red')\n# vs\n# 50 lines of turtle code",
      isCodePredefined: true,
      explanation:
        "Explain why functions/abstraction help manage complexity (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "unit-conclusion",
      title: "Unit Complete!",
      content: [
        {
          kind: "text",
          value:
            "You have mastered Functions. You know how to define them, pass inputs to them, and compose them into complex systems. You are ready for the next challenge: making your programs smart enough to make decisions on their own using **Conditionals**.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
