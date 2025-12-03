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
  title: "A Faster Way: String Methods",
  guid: "b9c8d7e6-f5a4-4b3c-9a81-1e2f3d4c5b6a" as LessonId,
  description:
    "Learn powerful string 'methods' (.replace, .lower, .upper) as shortcuts for the accumulator patterns you've already mastered.",
  sections: [
    {
      kind: "Information",
      id: "shortcuts-intro",
      title: "A Faster Way to Transform Strings",
      content: [
        {
          kind: "text",
          value:
            "In the last lesson, you learned the **accumulator pattern** to build new strings, like removing all the spaces. This is a fundamental and powerful skill. Because this pattern is so common, Python gives you 'shortcut' functions called **methods** to do this in one line.\n\nIn this lesson, you'll learn these shortcuts. Because you learned the 'hard way' first, you'll know *exactly* what these shortcuts are doing under the hood. This is how you demystify programming!",
        },
      ],
    } as InformationSectionData,

    {
      kind: "PRIMM",
      id: "replace-primm" as SectionId,
      title: "The Hard Way vs. The Easy Way",
      content: [
        {
          kind: "text",
          value:
            "Let's revisit the 'remove spaces' problem. Below are two programs that do the *exact same thing*. The first uses the accumulator pattern. The second uses the `.replace()` method. Predict what *both* will print.",
        },
        {
          kind: "image",
          src: "data/06_accumulators/images/string_replace_method.png",
          alt: "Diagram of the .replace() method",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          '# The "hard way" (what you learned)\ntext = "Hello World"\nnew_text = ""\nfor char in text:\n  if char != " ":\n    new_text = new_text + char\nprint(f"Accumulator: {new_text}")\n\n# The "easy way" (the shortcut)\nfast_way = text.replace(" ", "")\nprint(f"Method: {fast_way}")',
      },
      predictPrompt:
        "What will the 'Accumulator' line print? What will the 'Method' line print?",
      conclusion:
        "They both print 'HelloWorld'! The `.replace(\" \", \"\")` method is a powerful shortcut that does the *exact same logic* as your 5-line accumulator. It finds every space (' ') and replaces it with an empty string ('').",
    } as PRIMMSectionData,

    {
      kind: "MultipleChoice",
      id: "replace-quiz" as SectionId,
      title: "Understanding `.replace()`",
      content: [
        {
          kind: "text",
          value:
            "The `.replace(old, new)` method is a function 'attached' to a string. What does it do?",
        },
      ],
      options: [
        "It changes the original string in place.",
        "It searches for the 'old' string and *gives back a new string* with the 'new' string in its place.",
        "It can only replace single characters, not whole words.",
        "It deletes the 'old' string from the original.",
      ],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! This is the most important concept: `.replace()` *gives back* (or 'returns') a *brand new string*. The original string is unchanged.",
      },
    } as MultipleChoiceSectionData,

    {
      kind: "Debugger",
      id: "replace-debugger" as SectionId,
      title: "Methods *Give Back* New Strings",
      content: [
        {
          kind: "text",
          value:
            "This is a *critical* concept. Methods like `.replace()` **do not change the original variable**. They *give back a new value* that you must save to a variable (or print).\n\nStep through this code and watch the **Variables** panel. Notice how `message` *never changes*!",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'message = "I like cats"\nprint(f"1. Original: {message}")\n\n# This line calculates a new value, but we don\'t save it!\nmessage.replace("cats", "dogs")\nprint(f"2. After replace (no save): {message}")\n\n# To save it, you must assign it to a variable\nnew_message = message.replace("cats", "dogs")\nprint(f"3. New variable: {new_message}")\nprint(f"4. Original is still: {message}")',
      },
    } as DebuggerSectionData,

    {
      kind: "PRIMM",
      id: "case-methods-primm" as SectionId,
      title: "Changing Case: `.lower()` & `.upper()`",
      content: [
        {
          kind: "text",
          value:
            "This 'give back a new string' idea also works for changing case. This is perfect for standardizing user input (like in the password unit!)\n\n`.lower()` gives back a new string, all lowercase.\n`.upper()` gives back a new string, all uppercase.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'text = "PyThOn"\nlower_text = text.lower()\nupper_text = text.upper()\n\nprint(f"Original: {text}")\nprint(f"Lower: {lower_text}")\nprint(f"Upper: {upper_text}")',
      },
      predictPrompt:
        "What will the 'Original', 'Lower', and 'Upper' lines print? Remember, the original `text` variable won't change!",
      conclusion:
        "The original 'PyThOn' is unchanged! We *saved* the new, transformed values into `lower_text` ('python') and `upper_text` ('PYTHON').",
    } as PRIMMSectionData,

    {
      kind: "MultipleSelection",
      id: "transform-quiz" as SectionId,
      title: "Transformation Tools Check",
      content: [
        {
          kind: "text",
          value:
            "Given `word = 'Test'`, which of the following statements are `True`?",
        },
      ],
      options: [
        "`word.lower()` gives back the string 'test'",
        "`word.upper()` gives back the string 'TEST'",
        "`word.replace('t', 'b')` gives back the string 'besb'",
        "After running all three, the `word` variable still holds the string 'Test'",
        "`'Test'.replace('T', 'B')` gives back the string 'Best'",
      ],
      correctAnswers: [0, 1, 3, 4],
      feedback: {
        correct:
          "Excellent! `word.replace('t', 'b')` is 'besb' because `.replace()` is case-sensitive and only replaces the lowercase 't'. The most important rule is that the original `word` variable is *not* changed.",
      },
    } as MultipleSelectionSectionData,

    {
      kind: "Testing",
      id: "clean-input-challenge" as SectionId,
      title: "Challenge: Clean Up User Input",
      content: [
        {
          kind: "text",
          value:
            "Create a function `clean_input(text)` that takes a string and 'cleans' it by:\n1. Making it all lowercase.\n2. Replacing all spaces (`' '`) with underscores (`'_'`).\n3. Replacing all exclamation marks (`'!'`) with periods (`.`).\n4. Printing the final, cleaned string.\n\nHint: You can 'chain' methods together! The program will run them one after another, from left to right.\n`new_text = text.lower().replace(' ', '_')...`",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def clean_input(text):\n  # Chain the methods to clean the text\n  cleaned_text = text.lower().replace(" ", "_").replace("!", ".")\n  print(cleaned_text)\n\n# Test your function\nclean_input("THIS IS A TEST!")\nclean_input("Another test")\nclean_input("Wow! No spaces!")',
      },
      testCases: [
        {
          input: ["THIS IS A TEST!"],
          expected: "this_is_a_test.",
          description: "Test uppercase, space, and exclamation",
        },
        {
          input: ["Another test"],
          expected: "another_test",
          description: "Test lowercase and space",
        },
        {
          input: ["Wow! No spaces!"],
          expected: "wow._no_spaces.",
          description: "Test multiple exclamations",
        },
      ],
      testMode: "procedure",
      functionToTest: "clean_input",
    } as TestingSectionData,

    {
      kind: "Matching",
      id: "type-signature-matching" as SectionId,
      title: "Matching Methods to Signatures",
      content: [
        {
          kind: "text",
          value:
            "You've now seen two kinds of functions: 'question' functions (from the last lesson) and 'transformation' functions (from this one). Programmers use a 'signature' to describe what a function *needs* and what it *gives back*.\n\nFormat: `(needs) -> gives_back`",
        },
      ],
      prompts: [
        {
          "`.isupper()` (Asks a question)":
            "`() -> bool` (Needs no extra info, gives back a True/False)",
        },
        {
          "`len()` (Asks a question)":
            "`(str) -> int` (Needs a string, gives back a number)",
        },
        {
          "`.lower()` (Transforms)":
            "`() -> str` (Needs no extra info, gives back a new string)",
        },
        {
          "`.replace()` (Transforms)":
            "`(str, str) -> str` (Needs two strings, gives back a new string)",
        },
      ],
      feedback: {
        correct:
          "Perfect! This 'signature' is like a contract. `.replace()` *promises* to take two strings and give one back. `.isupper()` *promises* to give a boolean back. This is a powerful way to think about abstraction.",
      },
    } as MatchingSectionData,

    {
      kind: "Reflection",
      id: "methods-reflection" as SectionId,
      title: "The Easy Way vs. The Hard Way",
      content: [
        {
          kind: "text",
          value:
            "You've seen how `.replace()` is a shortcut for a 5-line accumulator pattern. Knowing *both* is important. The accumulator shows you *how* it works, and the method is the *shortcut*.",
        },
      ],
      topic: "How Methods Relate to the Accumulator Pattern",
      isTopicPredefined: true,
      code: "Write an example that uses `.replace()` or `.lower()` to solve a problem (e.g., standardizing a username).",
      isCodePredefined: false,
      explanation:
        "Explain what your method is doing. As seen in the example above, how is this method a 'shortcut' for the accumulator pattern you learned in the last lesson?",
      isExplanationPredefined: false,
    } as ReflectionSectionData,

    {
      kind: "Information",
      id: "transform-conclusion",
      title: "A Powerful New Toolkit",
      content: [
        {
          kind: "text",
          value:
            "Great job! You've now seen 'transformation' methods. The key takeaway is that methods like `.replace()`, `.lower()`, and `.upper()` **do not change the original string**. They *give you back a new, modified string* that you must save to a variable.\n\nYou've also mastered the 'payoff' of learning: doing it the 'hard way' (with an accumulator) first helps you understand *what* the 'easy way' (the method) is actually doing for you. This demystifies the language and makes you a more powerful programmer.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
