import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  PRIMMSectionData,
  MultipleSelectionSectionData,
  DebuggerSectionData,
  MatchingSectionData,
  TestingSectionData,
  ReflectionSectionData,
  MultipleChoiceSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Accumulator Pattern",
  guid: "b2c3d4e5-f6a7-8901-bcde-ef2345678901" as LessonId,
  description:
    "Learn how to count things as you iterate through a string using the accumulator pattern.",
  sections: [
    {
      kind: "Information",
      id: "remembering-while-looping",
      title: "Remembering While Looping",
      content: [
        {
          kind: "text",
          value:
            "In the last lesson, you learned how to examine individual pieces of a dataset, such as characters in a string, using iteration loops. But what if you want to know the **total** value of something? To do this, you need to **remember** information as the loop runs. You need a way to keep track of a count that builds up over time. This is where the **accumulator pattern** comes in.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "PRIMM",
      id: "counting-red-cards" as SectionId,
      title: "Counting Red Cards",
      content: [
        {
          kind: "text",
          value:
            'Below is code that counts red cards in a shuffled deck. The program uses `"r"` for red cards, `"b"` for black cards, and `"j"` for jokers. Look at the code carefully and then predict what the program will print out',
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def process_deck():\n  cards = "rbrrjbrbbbbj"\n  x = 0\n  for card in cards:\n    if card == "r":\n      x = x + 1\n  print(f"Result: {x}")\n\nprocess_deck()\n',
      },
      predictPrompt:
        "The loop examines each card. Every time it finds a red card, something happens to `x`. What will be the final result?",
      conclusion:
        'The program counts the red cards! It starts with `x = 0`, then adds 1 every time it finds an "r". By the end, `x` holds the total count of red cards.',
    } as PRIMMSectionData,
    {
      kind: "Information",
      id: "four-key-parts",
      title: "Four Key Parts",
      content: [
        {
          kind: "text",
          value:
            'The code you just saw uses the **accumulator pattern** for counting. This pattern has four parts:\n\n1. **Accumulator variable**: A variable that starts at `0` and remembers the count (`x = 0`)\n2. **Accumulation step**: The line that updates the count (`x = x + 1`)\n3. **Filter condition**: The `if` statement that decides what to count\n4. **Accumulation result**: Displaying or using the final count (`print(f"Result: {x}")`)\n\nEvery instance of the accumulator pattern uses parts 1 and 2 to set up the loop. Part 3 is needed if you\'re counting specific things (like only red cards, not all cards). Part 4 is how you decide to use your answer once your done computing.',
        },
      ],
    } as InformationSectionData,
    {
      kind: "Matching",
      id: "identify-the-parts" as SectionId,
      title: "Match the Vocabulary",
      content: [
        {
          kind: "text",
          value:
            "Now that you know the vocabulary, match each line of code from the previous example to the correct term:",
        },
      ],
      prompts: [
        { "`x = 0`": "Accumulator variable" },
        { "`x = x + 1`": "Accumulation step" },
        { '`if card == "r":`': "Filter condition" },
        { '`print(f"Result: {x}")`': "Accumulation result" },
      ],
      feedback: {
        correct:
          "Perfect! Understanding these parts will help you recognize and create accumulator patterns in your own code.",
      },
    } as MatchingSectionData,
    {
      kind: "MultipleChoice",
      id: "initial-value-why-zero",
      title: "Why Start at Zero?",
      content: [
        {
          kind: "text",
          value:
            "The accumulator variable in the accumulator pattern always starts at `0`. Which of the following explains why?",
        },
      ],
      options: [
        "Because Python requires all number variables to start at 0",
        "Because the smallest number Python knows is the number 0",
        "Because the loop iterates through at least once, resulting in a non-zero number",
        "Because before accumulator anything, you have seen zero things",
      ],
      correctAnswer: 3,
      feedback: {
        correct:
          "Exactly! You start at 0 because you haven't seen anything yet. This way, the first time you find something to count, adding 1 gives you 1.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Debugger",
      id: "watch-count-grow" as SectionId,
      title: "Watch the Count Grow",
      content: [
        {
          kind: "text",
          value:
            "Let's slow down and watch how the accumulator pattern works. Step through the code below and pay close attention to:\n- How `red_count` starts at 0\n- How the `red_count` variable only changes when the filter condition is met\n- How `red_count` stays the same when the filter condition is not met\n- What the final value is when the loop finishes\n\nThe key to concept to understand about the accumulator pattern is that the accumulator variable **remembers** and **builds up** information across iterations.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def count_red(cards):\n  red_count = 0\n  for card in cards:\n    if card == "r":\n      red_count = red_count + 1\n  print(f"Red cards: {red_count}")\n\ncount_red("rbrr")',
      },
    } as DebuggerSectionData,
    {
      kind: "MultipleSelection",
      id: "pattern-requirements",
      title: "What Makes the Pattern Work?",
      content: [
        {
          kind: "text",
          value:
            "Based on what you've learned so far, which of the following statements about the accumulator pattern are true? Select all that apply.",
        },
      ],
      options: [
        "The accumulator variable must be initialized before the loop",
        "The accumulator variable must be named `x`",
        "The accumulation step must happen inside the loop",
        "Every accumulator pattern must have an `if` statement",
        "The line `x = x + 1` adds 1 to the current value of x",
      ],
      correctAnswers: [0, 2, 4],
      feedback: {
        correct:
          "Great! The accumulator must be initialized before the loop and updated inside it. You can name it anything and you don't always need an if statement.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "PRIMM",
      id: "without-filters" as SectionId,
      title: "No Filter",
      content: [
        {
          kind: "text",
          value:
            "What happens if you remove the filter condition (the `if` statement)? Predict what the code below will do:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def do_something(cards):\n  total = 0\n  for card in cards:\n    total = total + 1\n  print(f"Result: {total}")\n\ndo_something("rbrrjbrbbbbj")',
      },
      predictPrompt:
        "Without the if statement, when does the accumulation step happen? What will be counted?",
      conclusion:
        "Without a filter condition, the accumulation step happens for EVERY character. This code counts all the cards in the string, not just the red ones. The filter condition is optional—you only need it when you want to count specific things.",
    } as PRIMMSectionData,
    {
      kind: "Testing",
      id: "count-letters" as SectionId,
      title: "Challenge: Count Letters",
      content: [
        {
          kind: "text",
          value:
            "Now it's your turn! Create a function named `count_es()` that:\n1. Takes a single input named `text`\n2. Counts how many uppercase E's are in the text\n3. Prints the result in the format: `\"Num E's: X\"` (where X is the count)\n\nRemember the four key parts of the accumulator pattern: initialize your accumulator, update it in the loop under certain conditions, and display the result.\n\nHint: Use the code in the problem above as a model.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "def count_es(text):\n  # Initialize your accumulator\n  # Loop through each character\n  # Check if it's an E\n  # Update your count\n  # Print the result\n\ncount_es('hello world')",
      },
      testCases: [
        {
          input: ["HELLO ME"],
          expected: "Num E's: 2",
          description: "Two E's",
        },
        {
          input: ["Python is the BEST"],
          expected: "Num E's: 1",
          description: "One E",
        },
        {
          input: ["bEautiful, EEE E"],
          expected: "Num E's: 5",
          description: "Five E's",
        },
        {
          input: ["sky"],
          expected: "Num E's: 0",
          description: "No E's",
        },
      ],
      testMode: "procedure",
      functionToTest: "count_es",
    } as TestingSectionData,
    {
      kind: "Reflection",
      id: "accumulator-pattern-reflection" as SectionId,
      title: "Understanding the Accumulator Pattern",
      content: [
        {
          kind: "text",
          value:
            "You've learned the **accumulator pattern** for counting. This pattern lets you keep track of totals as you examine data.\n\nCreate your own example of a accumulator pattern and explain how it works. Your example should:\n- Use a descriptive accumulator variable name (not `x`)\n- Count something specific from a string\n- Include all four parts of the pattern\n\nIn your explanation, identify each of the four parts (accumulator variable, accumulation step, filter condition, and accumulation result) as seen in the example above.",
        },
      ],
      topic: "The Accumulator Pattern for Counting",
      isTopicPredefined: true,
      code: "Create a accumulator pattern that counts something in a string",
      isCodePredefined: false,
      explanation:
        "Explain your code and identify the four parts of the accumulator pattern (4-5 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "counting-conclusion",
      title: "What's Next?",
      content: [
        {
          kind: "text",
          value:
            "Excellent work! You've learned the accumulator pattern for counting. You can now:\n- Initialize an accumulator variable to track a count\n- Update the accumulator inside a loop\n- Use filter conditions to count specific things\n- Work with multiple accumulators in a single loop\n- Choose meaningful variable names for your accumulators\n\nBut counting isn't the only thing you can accumulate. In the next lesson, you'll learn how to use the accumulator pattern to **build strings** character by character. This will open up even more possibilities for processing data!",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
