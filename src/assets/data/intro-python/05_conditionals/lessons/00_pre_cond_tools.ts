import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  PRIMMSectionData,
  MultipleChoiceSectionData,
  DebuggerSectionData,
  MatchingSectionData,
  MultipleSelectionSectionData,
  PredictionSectionData,
  ReflectionSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Asking Questions About Strings",
  guid: "c5e8f0a1-6d7b-4c3e-8a90-1f2b3c4d5e6f" as LessonId,
  description:
    "Learn to use Python's built-in tools to ask questions about data, preparing you to write powerful if-statements.",
  sections: [
    {
      kind: "Information",
      id: "toolkit-intro",
      title: "Before You Decide, You Must Ask",
      content: [
        {
          kind: "text",
          value:
            "In the next unit, you'll learn how to make your programs make decisions using `if` statements. But to make a good decision, you first need to *ask questions*.\n\nFor example, you can't decide 'is this password valid?' unless you can first *ask*: 'How long is it?' and 'Does it contain a capital letter?'\n\nThis lesson will let you explore Python's 'question toolkit'—a set of built-in tools for inspecting your data.",
        },
      ],
    } as InformationSectionData,

    {
      kind: "PRIMM",
      id: "len-primm" as SectionId,
      title: "Tool 1: How Long Is It?",
      content: [
        {
          kind: "text",
          value:
            "Our first tool is the `len()` function. It answers the question, 'How many characters are in this string?'\n\nThis is a new *kind* of function. It doesn't `print`—it *gives you back a number*. Let's see it in action.",
        },
        {
          kind: "image",
          src: "data/05_conditionals/images/len_function_diagram.png",
          alt: "A diagram showing 'Hello' going into a len() function and the number 5 coming out",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'print(len("Hello"))\nprint(len("abc123"))\nprint(len("Hi!"))\nprint(len("a b c"))',
      },
      predictPrompt:
        "What number will each of the four `print` statements output? Pay close attention to the last one!",
      conclusion:
        "It prints 5, 6, 3, and 5. `len()` gives you back a *number* representing the total count of *all* characters, including spaces and punctuation.",
    } as PRIMMSectionData,

    {
      kind: "MultipleChoice",
      id: "len-quiz" as SectionId,
      title: "Check Your `len()` Knowledge",
      content: [
        {
          kind: "text",
          value: "What is the value of `len('Hi there!')`?",
        },
      ],
      options: ["8", "9", "10", "Hi there!"],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! The characters are 'H', 'i', ' ', 't', 'h', 'e', 'r', 'e', '!', for a total of 9.",
      },
    } as MultipleChoiceSectionData,

    {
      kind: "Debugger",
      id: "len-debugger" as SectionId,
      title: "Watching `len()` Give a Value",
      content: [
        {
          kind: "text",
          value:
            "Let's slow down and see that 'give back a value' idea up close. The `len()` function *gives* its number answer to the variable on the left of the `=`.\n\nStep through this code and watch the **Variables** panel. See how `word_length` gets the *number* `6` from the `len()` function. This is a powerful new concept!",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'text = "Python"\nprint(f"Checking length of \'{text}\'")\nword_length = len(text)\nprint(f"The variable \'word_length\' is now: {word_length}")',
      },
    } as DebuggerSectionData,

    {
      kind: "PRIMM",
      id: "in-primm" as SectionId,
      title: "Tool 2: Is This *in* There?",
      content: [
        {
          kind: "text",
          value:
            "The `in` operator is our next tool. It checks if one string is *inside* another and gives back one of two special keywords: `True` or `False`. These are the heart of `if` statements.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "word = \"apple\"\nprint(f\"'a' in 'apple'?  {'a' in word}\")\nprint(f\"'z' in 'apple'?  {'z' in word}\")\nprint(f\"'A' in 'apple'?  {'A' in word}\")\nprint(f\"'pl' in 'apple'? {'pl' in word}\")",
      },
      predictPrompt:
        "What will each of the four `print` statements output: `True` or `False`? Pay close attention to case sensitivity!",
      conclusion:
        "`in` gives back `True` if it finds the substring and `False` if it doesn't. It is case-sensitive! These `True`/`False` answers are exactly what `if` statements need.",
    } as PRIMMSectionData,

    {
      kind: "Matching",
      id: "in-matching" as SectionId,
      title: "Membership Check",
      content: [
        {
          kind: "text",
          value:
            "Given `text = 'Hello!'`, match each expression to its `True`/`False` result:",
        },
      ],
      prompts: [
        { "'H' in text": "True" },
        { "'h' in text": "False" },
        { "'lo' in text": "True" },
        { "' ' in text": "False" },
        { "'!' in text": "True" },
        { "'He' in text": "True" },
      ],
    } as MatchingSectionData,

    {
      kind: "PRIMM",
      id: "methods-primm" as SectionId,
      title: "Tool 3: What *Kind* of String Is This?",
      content: [
        {
          kind: "text",
          value:
            "Finally, strings have special functions 'attached' to them with a dot (`.`). These are called **methods**. They also give back `True` or `False`.",
        },
        {
          kind: "image",
          src: "data/05_conditionals/images/string_method_syntax.png",
          alt: "Syntax diagram showing 'A'.isupper()",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'char1 = "X"\nchar2 = "y"\nchar3 = "3"\nprint(f"\'{char1}\'.isupper() is {char1.isupper()}")\nprint(f"\'{char2}\'.islower() is {char2.islower()}")\nprint(f"\'{char3}\'.isdigit() is {char3.isdigit()}")\nprint(f"\'{char1}\'.islower() is {char1.islower()}") # A check that will be False',
      },
      predictPrompt:
        "For each of the four `print` statements, predict the `True`/`False` output.",
      conclusion:
        "These methods let you ask specific questions. Notice that 'X' is uppercase, but it's *not* lowercase! `.isupper()`, `.islower()`, and `.isdigit()` are powerful tools for checking characters.",
    } as PRIMMSectionData,

    {
      kind: "MultipleSelection",
      id: "methods-quiz" as SectionId,
      title: "Check Your Method Knowledge",
      content: [
        {
          kind: "text",
          value:
            "Given `text = 'Hi 5'` (which contains 'H', 'i', ' ', and '5'), which of the following expressions would produce `True`?",
        },
      ],
      options: [
        "text.isupper()",
        "text.islower()",
        "text.isdigit()",
        "'i' in text",
        "len(text) == 4",
        '"5".isdigit()',
      ],
      correctAnswers: [3, 4, 5],
      feedback: {
        correct:
          "Correct! `text` itself is not upper, lower, or all digits. But 'i' *is* in `text`, its length *is* 4, and the *character* '5' *is* a digit.",
      },
    } as MultipleSelectionSectionData,

    {
      kind: "Prediction",
      id: "toolkit-prediction" as SectionId,
      title: "Practice Your Predictions",
      content: [
        {
          kind: "text",
          value:
            "Let's combine all three tools. This function `analyze_text` will be called with different inputs. Predict the `True`/`False` output for each check. This is exactly what you'll do in your head when writing `if` statements.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def analyze_text(text):\n    print(f"Checking text: \'{text}\'")\n    print(f"  len(text) > 5:   {len(text) > 5}")\n    print(f"  \'a\' in text:     {\'a\' in text}")\n    print(f"  text.isupper():  {text.isupper()}")\n',
      },
      testMode: "procedure",
      functionToTest: "analyze_text",
      predictionTable: {
        columns: [{ variableName: "text", variableType: "string" }],
        rows: [
          { inputs: ["Hello"] },
          { inputs: ["PASSWORD"] },
          { inputs: ["apple"] },
          { inputs: ["dry"] },
        ],
      },
    } as PredictionSectionData,

    {
      kind: "Reflection",
      id: "toolkit-reflection" as SectionId,
      title: "My New Toolkit",
      content: [
        {
          kind: "text",
          value:
            "You now have a toolkit for asking questions. You can check length (`len`), membership (`in`), and type (`.isupper()`).",
        },
      ],
      topic: "How `len`, `in`, and methods help you make decisions",
      isTopicPredefined: true,
      code: "Create a 3-4 line example that uses *at least two* of the new tools to check a variable (e.g., 'password = ...').",
      isCodePredefined: false,
      explanation:
        "Explain what questions your code is asking and what the `True`/`False` or number answers would be. How would this be useful in an `if` statement you might write in the next lesson?",
      isExplanationPredefined: false,
    } as ReflectionSectionData,

    {
      kind: "Information",
      id: "toolkit-conclusion",
      title: "Ready to Make Decisions",
      content: [
        {
          kind: "text",
          value:
            "Excellent work! You've *explored* Python's 'question toolkit' instead of just reading about it. You've discovered how to ask about:\n- **Length:** `len(password)`\n- **Membership:** `'!' in password`\n- **Type:** `char.isupper()` or `char.isdigit()`\n\nYou also saw that these tools give you back numbers (like `5`) or `True`/`False` values. These are the *exact* answers an `if` statement needs to work.\n\nIn the next lesson, you'll finally use `if` to make your program *act* on these answers.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
