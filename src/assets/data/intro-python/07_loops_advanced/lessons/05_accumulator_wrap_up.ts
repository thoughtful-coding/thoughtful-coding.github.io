import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  MultipleChoiceSectionData,
  MultipleSelectionSectionData,
  MatchingSectionData,
  CoverageSectionData,
  PredictionSectionData,
  TestingSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Accumulator Pattern Unit Challenge",
  guid: "e5f6a7b8-c9d0-1234-efgh-fg5678901234" as LessonId,
  description:
    "Test your understanding of the accumulator pattern plus everything from previous units through interleaved practice.",
  sections: [
    {
      kind: "Information",
      id: "wrap-up-intro",
      title: "Bringing It All Together",
      content: [
        {
          kind: "text",
          value:
            "Over the past lessons, you've learned two new powerful programming patterns:\n- **Iteration loops** let you examine each character in a string\n- **The accumulator pattern** lets you count things or build new strings\n\nThis wrap-up lesson uses **interleaving** to mix questions about all these topics together, along with concepts from earlier units like data types, variables, and functions. These questions are designed to be challenging. Take your time, think carefully, and remember: struggling a bit is how you learn!",
        },
      ],
    } as InformationSectionData,
    {
      kind: "MultipleChoice",
      id: "data-type-identification",
      title: "Understanding Accumulator Data Types",
      content: [
        {
          kind: "text",
          value:
            "The accumulator pattern requires understanding data types. Look at this code:",
        },
        {
          kind: "code",
          value:
            'cards = "rbrrbj"\ncount = 0\nfor card in cards:\n  if card == "r":\n    count = count + 1\nprint(count)',
        },
        {
          kind: "text",
          value:
            "What is the data type of the `count` variable after the loop finishes?",
        },
      ],
      options: ["String", "Integer", "Float", "Boolean"],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! The accumulator variable `count` starts as an integer (0) and stays an integer as we add 1 to it. When counting, your accumulator is always an integer.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Matching",
      id: "loop-type-selection" as SectionId,
      title: "Choosing Your Loop Type",
      content: [
        {
          kind: "text",
          value:
            "Different problems need different loop types. Sometimes you need a range loop, sometimes you need iteration, and sometimes the accumulator pattern. Match each task to the appropriate loop type:",
        },
      ],
      prompts: [
        { "Print 'Hello' 20 times": "Range loop" },
        {
          "Count vowels in a string": "Accumulator pattern with a number",
        },
        { "Draw a hexagon (6 sides)": "Range loop" },
        {
          "Build a string with spaces removed":
            "Accumulator pattern with a string",
        },
        {
          "Print each character in a string": "Iteration loop",
        },
        {
          "Extract all uppercase letters from text":
            "Accumulator pattern with a string",
        },
      ],
      feedback: {
        correct:
          "Perfect! Use range loops for repeating actions a specific number of times. Use iteration loops for examining individual pieces of data. Use the accumulator pattern when you need to **remember** information across iterations.",
      },
    } as MatchingSectionData,
    {
      kind: "Testing",
      id: "count-characters-challenge" as SectionId,
      title: "Challenge: Count Characters",
      content: [
        {
          kind: "text",
          value:
            'Create a function named `count_characters()` that:\n1. Takes a single input named `sentence`\n2. Uses the accumulator pattern\n3. Counts how many characters - letters, punctuation, etc. - are in the sentence\n4. Prints the result in the format: `"Characters: X"`.',
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def count_characters(sentence):\n  # Initialize your accumulator\n  # Loop through each character\n  # Update your count\n  # Print the result\n\ncount_characters("Hello World")',
      },
      testCases: [
        {
          input: ["Hello"],
          expected: "Characters: 5",
          description: "Single word",
        },
        {
          input: ["Python is fun"],
          expected: "Characters: 13",
          description: "Three words",
        },
        {
          input: [""],
          expected: "Characters: 0",
          description: "No characters",
        },
        {
          input: ["   "],
          expected: "Characters: 3",
          description: "Only spaces",
        },
      ],
      testMode: "procedure",
      functionToTest: "count_characters",
    } as TestingSectionData,
    {
      kind: "MultipleChoice",
      id: "len-in-disguise",
      title: "Recreating a Library",
      content: [
        {
          kind: "text",
          value:
            "The code that you wrote above using the accumulator is a very common Python function in disguise. Can you guess which function you just recreated?",
        },
      ],
      options: [
        "`.replace()`",
        "`.isupper()`",
        "`.upper()`",
        "`len()`",
        "`.isdigit()`",
      ],
      correctAnswer: 3,
      feedback: {
        correct:
          "Excellent! You wrote your own version of the `len()` function. This shows that the accumulator pattern gives you the power to recreate some of the most important parts of Python.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Coverage",
      id: "count-filter-coverage" as SectionId,
      title: "Working Backwards",
      content: [
        {
          kind: "text",
          value:
            "Understanding accumulators means being able to understanding how different inputs affect the output. This function counts characters that match (and don't match) the filter condition. Provide inputs that produce each output:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def count_matches(text):\n  type_1 = 0\n  type_2 = 0\n  for char in text:\n    if char.isupper():\n      type_1 = type_1 + 1\n    else:\n      type_2 = type_2 + 1\n  print(f"First type: {type_1}, Second type: {type_2}")',
      },
      testMode: "procedure",
      functionToTest: "count_matches",
      coverageTable: {
        columns: [{ variableName: "text", variableType: "string" }],
        rows: [
          {
            fixedInputs: {},
            expectedOutput: "First type: 1, Second type: 1",
            hint: "One uppercase letter",
          },
          {
            fixedInputs: {},
            expectedOutput: "First type: 3, Second type: 1",
            hint: "Exactly three uppercase letters",
          },
          {
            fixedInputs: {},
            expectedOutput: "First type: 2, Second type: 2",
            hint: "Exactly two uppercase letters",
          },
        ],
      },
    } as CoverageSectionData,
    {
      kind: "MultipleSelection",
      id: "variable-naming-importance",
      title: "The Power of Good Names",
      content: [
        {
          kind: "text",
          value:
            "Good variable names make the accumulator pattern easier to understand and debug. Which of the following statements about variable naming are true? Select all that apply.",
        },
      ],
      options: [
        "Using `x` as an accumulator name makes code shorter and therefore better",
        "A name like `vowel_count` tells you what is being counted",
        "Good variable names help other programmers understand your code",
        "Variable names don't matter because the computer ignores them",
        "Descriptive names like `red_count` help you catch bugs faster",
        "You must use `x` as your accumulator variable name in Python",
      ],
      correctAnswers: [1, 2, 4],
      feedback: {
        correct:
          "Excellent! Good variable names communicate intent. When you see `vowel_count = vowel_count + 1`, you immediately know what's being counted. When you see `x = x + 1`, you have to read more code to figure it out.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Prediction",
      id: "predict-accumulator-outputs" as SectionId,
      title: "Predict the Results",
      content: [
        {
          kind: "text",
          value:
            'The function below takes a single string as an input. It then "processes" that string and computes a result. Predict what this function will output for each input:',
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def process_text(word):\n  result = ""\n  for letter in word:\n    if letter in "aeiou":\n      result = result + letter\n  print(result)',
      },
      testMode: "procedure",
      functionToTest: "process_text",
      predictionTable: {
        columns: [{ variableName: "word", variableType: "string" }],
        rows: [
          { inputs: ["hello"] },
          { inputs: ["python"] },
          { inputs: ["wooooow"] },
          { inputs: ["beautiful"] },
        ],
      },
    } as PredictionSectionData,
    {
      kind: "MultipleChoice",
      id: "identify-missing-part",
      title: "Spot the Bug",
      content: [
        {
          kind: "text",
          value:
            "This code is supposed to count spaces in a string, but it has a bug. What's wrong?",
        },
        {
          kind: "code",
          value:
            'def count_spaces(text):\n  for char in text:\n    if char == " ":\n       spaces = spaces + 1\n  print(f"Spaces: {spaces}")',
        },
      ],
      options: [
        "The filter condition is wrong",
        "The accumulation step is wrong",
        "The accumulator variable was never initialized",
        "The loop should be a range loop instead",
      ],
      correctAnswer: 2,
      feedback: {
        correct:
          "Exactly! The code never sets `spaces = 0` before the loop. Python will give an error when it tries to compute `spaces + 1` because `spaces` doesn't exist yet. The accumulator variable must always be initialized before the loop!",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Testing",
      id: "two-accumulators-challenge" as SectionId,
      title: "Challenge: Count Two Things",
      content: [
        {
          kind: "text",
          value:
            'Remember the card counting example? Now it\'s your turn to count two things at once.\n\nCreate a function `count_cards(deck)` that:\n1. Takes a single input `deck` (a string of r, b, and j characters)\n2. Counts red cards (r) AND black cards (b) - ignore jokers\n3. Prints two lines:\n   - `"Red cards: X"`\n   - `"Black cards: Y"`\n\nHint: You need TWO accumulator variables, but only ONE loop. Both counters update in the same iteration based on different filter conditions. You can use `elif` or separate `if` statements—both work since a card can\'t be red AND black!',
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def count_cards(deck):\n    # Initialize TWO accumulators\n    # Loop through each card\n    # If red, update red count\n    # If black, update black count\n    # Print both results\n\ncount_cards("rbrrbj")\nprint("---")\ncount_cards("rrrrr")\nprint("---")\ncount_cards("bbbbb")',
      },
      testCases: [
        {
          input: ["rbrrbj"],
          expected: "Red cards: 3\nBlack cards: 2",
          description: "Mixed deck with joker",
        },
        {
          input: ["rrrrr"],
          expected: "Red cards: 5\nBlack cards: 0",
          description: "All red",
        },
        {
          input: ["bbbbb"],
          expected: "Red cards: 0\nBlack cards: 5",
          description: "All black",
        },
        {
          input: ["jjjjj"],
          expected: "Red cards: 0\nBlack cards: 0",
          description: "All jokers",
        },
      ],
      testMode: "procedure",
      functionToTest: "count_cards",
    } as TestingSectionData,
    {
      kind: "Coverage",
      id: "complex-filter-coverage" as SectionId,
      title: "Multiple Accumulation Steps",
      content: [
        {
          kind: "text",
          value:
            "More advanced accumulator patterns can have different accumulation steps based on different conditions. This function adds lowercase letters as-is, but converts periods to spaces. Provide inputs that produce each output:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def extract_message(scrambled):\n  message = ""\n  for char in scrambled:\n    if char.islower():\n      message = message + char\n    elif char == ".":\n      message = message + " "\n  print(f"Result: {message}")',
      },
      testMode: "procedure",
      functionToTest: "extract_message",
      coverageTable: {
        columns: [{ variableName: "scrambled", variableType: "string" }],
        rows: [
          {
            fixedInputs: {},
            expectedOutput: "Result: yo",
            hint: "Simple word",
          },
          {
            fixedInputs: {},
            expectedOutput: "Result: hi there",
            hint: "Two words separated by a period",
          },
          {
            fixedInputs: {},
            expectedOutput: "Result: a b c",
            hint: "All lowercase separated by a period",
          },
        ],
      },
    } as CoverageSectionData,
    {
      kind: "Testing",
      id: "password-validator-challenge" as SectionId,
      title: "Real-World Challenge: Password Validator",
      content: [
        {
          kind: "text",
          value:
            'Time for a real-world application! Strong passwords need to meet certain requirements. Create a function `is_strong_password(password)` that:\n1. Takes a single input `password` (a string)\n2. Checks if the password meets ALL of these requirements:\n   - At least 8 characters long\n   - Contains at least one uppercase letter\n   - Contains at least one lowercase letter\n3. Prints `"Strong password"` if all requirements are met; otherwise prints `"Weak password"`\n\nHints:\n- Initialize two accumulator variables: `upper_count = 0`, `lower_count = 0`\n- After the loop, check if ALL conditions are met: `if len(password) >= 8 and upper_count > 0 and ...:`',
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def is_strong_password(password):\n  # Initialize two "accumulators"\n  # Loop through each character\n  #   If character.isupper(): upper acc increases\n  # Check if length >= 8 AND all accumulator values\n\nis_strong_password("Pass123")',
      },
      testCases: [
        {
          input: ["Pass"],
          expected: "Weak password",
          description: "Too short (7 characters)",
        },
        {
          input: ["password"],
          expected: "Weak password",
          description: "No uppercase",
        },
        {
          input: ["PASSWORD"],
          expected: "Weak password",
          description: "No lowercase",
        },
        {
          input: ["Password"],
          expected: "Strong password",
          description: "Meets all requirements",
        },
        {
          input: ["MySecureP@ss1"],
          expected: "Strong password",
          description: "Strong with special characters",
        },
      ],
      testMode: "procedure",
      functionToTest: "is_strong_password",
    } as TestingSectionData,
    {
      kind: "Information",
      id: "wrap-up-conclusion",
      title: "Congratulations!",
      content: [
        {
          kind: "text",
          value:
            "Outstanding work! You've mastered the accumulator pattern and demonstrated how it integrates with everything you've learned: iteration loops, data types, variables, functions, and conditionals.\n\nYou can now:\n- **Iterate** through strings character by character\n- **Transform** data by accumulating modified values\n- **Recognize** when to use the accumulator pattern\n- **Debug** common accumulator mistakes\n\nThese aren't just isolated skills—they're fundamental patterns you'll use in every program you write. Whether you're analyzing data, processing user input, validating passwords, or transforming text, you'll use iteration loops and the accumulator pattern.\n\nThe accumulator pattern is one of the most important patterns in all of programming. You've learned to recognize it, understand it, and apply it. That's a huge achievement!",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
