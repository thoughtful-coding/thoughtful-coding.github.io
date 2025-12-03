import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  ObservationSectionData,
  PRIMMSectionData,
  MultipleSelectionSectionData,
  DebuggerSectionData,
  MatchingSectionData,
  TestingSectionData,
  ReflectionSectionData,
  MultipleChoiceSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Accumulating Strings",
  guid: "c3d4e5f6-a7b8-9012-cdef-ef3456789012" as LessonId,
  description:
    "Learn how to build new strings character by character using the accumulator pattern.",
  sections: [
    {
      kind: "Information",
      id: "different-accumulator-types",
      title: "Different Accumulator Types",
      content: [
        {
          kind: "text",
          value:
            "In the last lesson, you learned about the accumulator pattern and how to use it to count. In this case, the accumulator variable starts at `0` and you add `1` each time. But the accumulator pattern isn't just for numbers! You can use the same pattern to **build strings** character by character. The structure is identical - only the details change. Learning to use the pattern with strings allows you to process complex messages and real-world data.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Observation",
      id: "string-concatenation-review" as SectionId,
      title: "String Concatenation Review",
      content: [
        {
          kind: "text",
          value:
            'Before we dive in, let\'s quickly review string concatenation. You can "add" strings together using the `+` operator. For example, adding two strings like `"3"` and `"3"` results in `"33"`. Run the code below to refresh yourself on how a string builds up one character at a time:',
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def build_word():\n  word = ""\n  word = word + "H"\n  word = word + "i"\n  word = word + "!"\n  print(word)\n\nbuild_word()',
      },
    } as ObservationSectionData,
    {
      kind: "PRIMM",
      id: "hidden-message" as SectionId,
      title: "Decoding a Hidden Message",
      content: [
        {
          kind: "text",
          value:
            "Below is code that extracts a hidden message from a scrambled string. The message is hidden among all of the letters and punctuation marks. Only the letters that match the filter condition are part of the actual message.\n\nBefore running it, predict: What will the program print?",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def decode_message():\n  word = "neHddEih.siY.eg aTssHeEm.teRrceEs.a"\n  x = ""\n  for letter in word:\n    if letter.isupper() or letter == " ":\n      x = x + letter\n  print(f"Result: {x}")\n\ndecode_message()',
      },
      predictPrompt:
        "The loop examines each character. When it finds a character that matches the filter condition, it adds it to the accumulator variable. What will be the final result?",
      conclusion:
        'The program builds the hidden message "HEY THERE" by starting with an empty string and "accumulating" uppercase letters and spaces one at a time.',
    } as PRIMMSectionData,
    {
      kind: "Matching",
      id: "label-the-pattern" as SectionId,
      title: "Label the Pattern",
      content: [
        {
          kind: "text",
          value:
            "In the previous lesson, you learned the four parts of the accumulator pattern when dealing with numbers. These four parts are used in almost the exact same way for strings. Match each line of code to the correct term:",
        },
      ],
      prompts: [
        { '`x = ""`': "Accumulator variable" },
        { '`if letter.isupper() or letter == " ":`': "Filter condition" },
        { "`x = x + letter`": "Accumulation step" },
        { '`print(f"Result: {x}")`': "Accumulation result" },
      ],
      feedback: {
        correct:
          "Perfect! The accumulator pattern has the same four parts whether you're dealing with numbers of strings. Only the details change!",
      },
    } as MatchingSectionData,
    {
      kind: "MultipleChoice",
      id: "starting-empty",
      title: "Why Start Empty?",
      content: [
        {
          kind: "text",
          value:
            'When building strings with the accumulator pattern, the accumulator variable starts with an empty string (`""`). Why?',
        },
      ],
      options: [
        "Because Python requires all string variables to start empty",
        "Because you need to clear out any old data before building new strings",
        "Because before adding any characters, you have an empty string with zero characters",
        "Because empty strings take up less memory than strings with characters",
      ],
      correctAnswer: 2,
      feedback: {
        correct:
          'Exactly! Just like counting starts at 0 (zero things counted), building strings starts at "" (zero characters added). This way, the first character you add creates a 1-character string.',
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Matching",
      id: "number-vs-string" as SectionId,
      title: "Two Types of Accumulators",
      content: [
        {
          kind: "text",
          value:
            "The accumulator pattern works the same way for both counting and building strings, but the details differ. Match each concept to the correct accumulator type:",
        },
      ],
      prompts: [
        { "Initial value is 0": "Accumulating numbers" },
        { 'Initial value is ""': "Accumulating strings" },
        { "Uses `x = x + 1`": "Accumulating numbers" },
        { "Uses `x = x + character`": "Accumulating strings" },
        { "Result is a number": "Accumulating numbers" },
        { "Result is a string": "Accumulating strings" },
      ],
      feedback: {
        correct:
          "Excellent! The pattern structure is identical. The only difference is:\n- Accumulating with numbers means you start at 0 and add 1\n- Accumulating with strings means you start with the empty string and add characters.",
      },
    } as MatchingSectionData,
    {
      kind: "Debugger",
      id: "watch-string-build" as SectionId,
      title: "Watch the String Build",
      content: [
        {
          kind: "text",
          value:
            "Let's slow down and watch exactly how a string builds up character by character. Step through the code below and pay close attention to:\n- How `message` starts as an empty string\n- How `message` only changes when the filter condition is met\n- How each character gets added to the **end** of the existing string\n- What the final value is when the loop finishes\n\nThe accumulator **remembers** all the characters added so far and keeps building on them.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def extract_caps():\n  text = "HeLLo"\n  message = ""\n  for letter in text:\n    if letter.isupper():\n      message = message + letter\n  print(f"Uppercase letters: {message}")\n\nextract_caps()',
      },
    } as DebuggerSectionData,
    {
      kind: "MultipleSelection",
      id: "string-accumulation-concepts",
      title: "String Accumulation Concepts",
      content: [
        {
          kind: "text",
          value:
            "Which of the following statements about building strings with the accumulator pattern are true? Select all that apply.",
        },
      ],
      options: [
        "The accumulator variable must be initialized to an empty string before the loop",
        "Each character is added to the beginning of the string",
        "The accumulation step happens inside the loop",
        "The line `message = message + letter` adds the new letter to the end",
        "You can only build strings with uppercase letters",
        "The filter condition determines which characters get added to the string",
      ],
      correctAnswers: [0, 2, 3, 5],
      feedback: {
        correct:
          "Perfect! The accumulator starts empty, builds inside the loop by adding to the end, and the filter condition controls what gets added.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "PRIMM",
      id: "without-filter" as SectionId,
      title: "No Filter Needed",
      content: [
        {
          kind: "text",
          value:
            "Just like with counting, the filter condition is optional when building strings. What happens if you remove the `if` statement? Predict what this code will do:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def do_something(word):\n  acc = ""\n  for character in word:\n    acc = acc + character\n  print(f"Result: {acc}")\n\ndo_something("Hello")',
      },
      predictPrompt:
        "Without the filter condition, when does the accumulation step happen? What will the final string be?",
      conclusion:
        "Without a filter condition, every character gets added to the accumulator. The filter is only needed when you want to be selective about what you add.",
    } as PRIMMSectionData,
    {
      kind: "Testing",
      id: "remove-spaces" as SectionId,
      title: "Challenge: Remove Spaces",
      content: [
        {
          kind: "text",
          value:
            'Create a function named `remove_spaces()` that:\n1. Takes a single input named `text`\n2. Builds a new string with all the same characters EXCEPT spaces\n3. Prints the result in the format: `"Result: X"`\n\nHint: This time your filter condition should check if a character is **NOT** a space. Use `if character != " ":` to add everything except spaces.',
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def remove_spaces(text):\n  # Initialize your accumulator\n  # Loop through each character\n  # Add character only if it\'s not a space\n  # Print the result\n\nremove_spaces("Hello World")',
      },
      testCases: [
        {
          input: ["Hello World"],
          expected: "Result: HelloWorld",
          description: "One space",
        },
        {
          input: ["a b c d"],
          expected: "Result: abcd",
          description: "Multiple spaces",
        },
        {
          input: ["NoSpacesHere"],
          expected: "Result: NoSpacesHere",
          description: "No spaces to remove",
        },
        {
          input: ["   "],
          expected: "Result: ",
          description: "Only spaces",
        },
      ],
      testMode: "procedure",
      functionToTest: "remove_spaces",
    } as TestingSectionData,
    {
      kind: "Reflection",
      id: "two-accumulation-types" as SectionId,
      title: "Two Accumulation Types",
      content: [
        {
          kind: "text",
          value:
            "You now understand the accumulator pattern for both counting (numbers) and building (strings). Both use the same four-part structure, but with different details.\n\nCreate an example that builds a string using the accumulator pattern, then explain how it works. In your explanation:\n- Identify the four parts (accumulator variable, accumulation step, filter condition, accumulation result) as seen in the example above\n- Explain how this is similar to and different from the counting pattern\n- Describe what your code accomplishes",
        },
      ],
      topic: "Comparing Counting and Building Patterns",
      isTopicPredefined: true,
      code: "Create a string-building pattern that extracts or transforms text",
      isCodePredefined: false,
      explanation:
        "Identify the four parts, compare to counting pattern, and explain what your code does (5-6 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "building-conclusion",
      title: "What's Next?",
      content: [
        {
          kind: "text",
          value:
            "Excellent work! You've now learned the accumulator pattern for both counting and building strings. You can now:\n- Build strings character by character using an empty string as your starting point\n- Use filter conditions to selectively add characters\n- Transform strings by adding formatted pieces with f-strings\n- Recognize that the accumulator pattern structure stays the same—only the details change\n\nIn the next lesson, you'll practice recognizing when to use the accumulator pattern and apply it to a variety of problems. You'll also learn to spot common mistakes and fix buggy accumulator code!",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
