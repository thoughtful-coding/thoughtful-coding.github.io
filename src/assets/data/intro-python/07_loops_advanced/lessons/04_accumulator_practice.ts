import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  PRIMMSectionData,
  MultipleSelectionSectionData,
  MatchingSectionData,
  TestingSectionData,
  MultipleChoiceSectionData,
  CoverageSectionData,
  DebuggerSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Pattern Recognition",
  guid: "d4e5f6a7-b8c9-0123-def0-ef4567890123" as LessonId,
  description:
    "Practice recognizing when to use the accumulator pattern and master its key components.",
  sections: [
    {
      kind: "Information",
      id: "the-accumulator-pattern",
      title: "The Accumulator Pattern",
      content: [
        {
          kind: "text",
          value:
            "You've now learned the accumulator pattern for both counting and building strings. While the details differ (numbers vs. strings, starting at 0 vs. empty string), the **structure** is always the same:\n\n1. **Accumulator variable**: Initialize before the loop\n2. **Accumulation step**: Update inside the loop\n3. **Filter condition**: Optional - determines what to process\n4. **Accumulation result**: Use the final value\n\nThis lesson will help you recognize when to use the accumulator pattern and identify its parts in various contexts.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "PRIMM",
      id: "decode-backwards-messagess" as SectionId,
      title: "A More Complex Example",
      content: [
        {
          kind: "text",
          value:
            "Here's a more sophisticated use of the accumulator pattern. Like the previous lesson, this code extracts a hidden message. There is one key different, however. The line `message = letter + message` means that each character that matches the filter condition is added **to the front** of the accumulator. This has a very interesting effect. Before running it, predict: What will the program print?",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def decode_message():\n  scrambled = "neHddEih.siY.eg aTssHeEm.teRrceEs.a"\n  message = ""\n  for letter in scrambled:\n    if letter.islower():\n      message = letter + message\n    elif letter == ".":\n      message = " " + message\n  print(f"Hidden message: {message}")\n\ndecode_message()',
      },
      predictPrompt:
        "The filter condition has two parts - one for lowercase letters and one for periods. What will each add to the accumulator?",
      conclusion:
        'The program reveals "a secret message" by reading the lowercase letters backwards! Adding characters to the FRONT of the accumulator (`letter + message`) instead of the END (`message + letter`) reverses the order. The periods become spaces, completing the hidden message.',
    } as PRIMMSectionData,
    {
      kind: "MultipleSelection",
      id: "advanced-pattern-parts",
      title: "Identifying the Parts",
      content: [
        {
          kind: "text",
          value:
            "Looking at the code above, which of the following statements are true? Select all that apply.",
        },
      ],
      options: [
        '`message = ""` initializes the accumulator variable',
        "The filter condition has two parts connected by `elif`",
        "The accumulation step always adds the exact same character",
        "`message = letter + message` is an accumulation step",
        '`message = " " + message` is also an accumulation step',
        "The accumulation result is displayed using `print()`",
      ],
      correctAnswers: [0, 1, 3, 4, 5],
      feedback: {
        correct:
          "Perfect! This example shows that you can have multiple accumulation steps based on different conditions. The key is that they all build up the same accumulator variable.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Matching",
      id: "choose-initial-value" as SectionId,
      title: "Choosing the Right Starting Point",
      content: [
        {
          kind: "text",
          value:
            "The initial value of the accumulator depends on what you're trying to accomplish. Match each goal to its correct starting value:",
        },
      ],
      prompts: [
        { "Compute how many uppercase letters are in a string": "0" },
        { "Build a string with only vowels": '""' },
        { "Count spaces in a sentence": "0" },
        { "Create a string of all digits from mixed text": '""' },
        { "Calculate total characters in a string": "0" },
        { "Copy a string with punctuation removed": '""' },
      ],
      feedback: {
        correct:
          "Excellent! If you're counting anything, start at 0. If you're building a string, start with an empty string. The pattern stays consistent!",
      },
    } as MatchingSectionData,
    {
      kind: "MultipleChoice",
      id: "identify-missing-part",
      title: "What's Missing?",
      content: [
        {
          kind: "text",
          value:
            'Look at this code that\'s supposed to count vowels:\n\n```python\ndef count_vowels(text):\n  for letter in text:\n    if letter in "aeiou":\n      count = count + 1\n  print(f"Vowels: {count}")\n```\n\nWhat critical part of the accumulator pattern is missing?',
        },
      ],
      options: [
        "The filter condition",
        "The accumulation step",
        "The accumulator variable initialization",
        "The accumulation result",
      ],
      correctAnswer: 2,
      feedback: {
        correct:
          "Exactly! The code never initializes `count = 0` before the loop. Python will give an error because `count` doesn't exist yet when we try to add 1 to it.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Debugger",
      id: "two-accumulators-together" as SectionId,
      title: "Two Accumulators at Once",
      content: [
        {
          kind: "text",
          value:
            "You can use multiple accumulators in the same loop - one for counting, one for building. Step through this code and watch how both accumulators change:\n- `count` tracks the number of vowels found\n- `vowels` builds a string of the actual vowels\n\nPay attention to how each accumulator updates independently based on the same condition.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def analyze_vowels(text):\n  count = 0\n  vowels = ""\n  for letter in text:\n    if letter in "aeiou":\n      count = count + 1\n      vowels = vowels + letter\n  print(f"Found {count} vowels: {vowels}")\n\nanalyze_vowels("beautiful")',
      },
    } as DebuggerSectionData,
    {
      kind: "Coverage",
      id: "accumulator-output-coverage" as SectionId,
      title: "Accumulator Output",
      content: [
        {
          kind: "text",
          value:
            "For the program below, what inputs will produce the following outputs?",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def do_something(sentence):\n  count = 0\n  val = ""\n  for char in sentence:\n    count = count + 1\n    if char == "!" or char == "?":\n      val = val + "."\n  print(f\'Got {count} and "{val}"\')\n',
      },
      testMode: "procedure",
      functionToTest: "do_something",
      coverageTable: {
        columns: [{ variableName: "sentence", variableType: "string" }],
        rows: [
          {
            fixedInputs: {},
            expectedOutput: 'Got 2 and ""',
            hint: "Nothing matches the filter condition",
          },
          {
            fixedInputs: {},
            expectedOutput: 'Got 2 and ".."',
            hint: "Everything matches the filter condition",
          },
          {
            fixedInputs: {},
            expectedOutput: 'Got 5 and "...."',
            hint: "This one is tricky",
          },
        ],
      },
    } as CoverageSectionData,
    {
      kind: "Matching",
      id: "fix-the-bug" as SectionId,
      title: "Debug the Code",
      content: [
        {
          kind: "text",
          value:
            "Each of these buggy code snippets has one error related to the accumulator pattern. Match each bug to the fix needed:",
        },
      ],
      prompts: [
        {
          '```\ntotal = 0\nfor num in "123":\n  total + 1```\n':
            "Change `total + 1` to `total = total + 1",
        },
        {
          '```\nfor letter in "Hello":\n  count = 0\n  count = count + 1\n```':
            "Move `count = 0` before the loop`",
        },
        {
          '```\nword = ""\nfor char in "abc":\n  word = word + char\nresult = word\n```':
            "No fix needed - code is correct",
        },
        {
          '```\nspaces = 1\nfor char in text:\n  if char == " ":\n    spaces = spaces + 1```\n':
            "Change `spaces = 1` to `spaces = 0`",
        },
      ],
      feedback: {
        correct: "Perfect! You can spot common accumulator pattern bugs.",
      },
    } as MatchingSectionData,
    {
      kind: "Testing",
      id: "count-digits" as SectionId,
      title: "Challenge: Count Digits",
      content: [
        {
          kind: "text",
          value:
            'Create a function named `count_digits()` that:\n1. Takes a single input named `text`\n2. Counts how many digit characters (0-9) are in the text\n3. Prints the result in the format: `"Digits: X"`\n\nHint: Use the string method `.isdigit()` to check if a character is a digit. For example, `"5".isdigit()` returns `True`, but `"a".isdigit()` returns `False`.',
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def count_digits(text):\n  # Initialize your accumulator\n  # Loop through each character\n  # Use .isdigit() in your filter condition\n  # Update your count\n  # Print the result\n\ncount_digits("Call me at 555-1234")',
      },
      testCases: [
        {
          input: ["Call me at 555-1234"],
          expected: "Digits: 7",
          description: "Mixed text with digits",
        },
        {
          input: ["No numbers here"],
          expected: "Digits: 0",
          description: "No digits",
        },
        {
          input: ["2024"],
          expected: "Digits: 4",
          description: "Only digits",
        },
        {
          input: ["Price: $19.99"],
          expected: "Digits: 4",
          description: "Digits with punctuation",
        },
      ],
      testMode: "procedure",
      functionToTest: "count_digits",
    } as TestingSectionData,
    {
      kind: "Information",
      id: "pattern-conclusion",
      title: "What's Next?",
      content: [
        {
          kind: "text",
          value:
            "Outstanding work! You now have a lot of experience using the accumulator pattern. You can now:\n- Identify all four parts of the pattern in any code\n- Choose the correct initial value (0 or empty string)\n- Recognize when accumulation is needed\n- Use multiple accumulators in one loop\n- Spot and fix common accumulator bugs\n\nIn the next lesson, you'll apply everything you've learned by integrating the accumulator pattern with concepts from earlier units.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
