import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  MultipleSelectionSectionData,
  PRIMMSectionData,
  DebuggerSectionData,
  ReflectionSectionData,
  MultipleChoiceSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Storing Data",
  guid: "5c3c6f3b-722f-4b19-b3ed-d532b7961f92" as LessonId,
  description:
    "Learn how to store and reuse data in your programs using variables to create more flexible, responsive programs.",
  sections: [
    {
      kind: "Information",
      id: "variables-intro" as SectionId,
      title: "Why Variables Matter",
      content: [
        {
          kind: "text",
          value: "Blah Blah Blah",
        },
      ],
    } as InformationSectionData,
    {
      kind: "MultipleChoice",
      id: "variable-resetting",
      title: "Setting and Resetting Variables",
      content: [
        {
          kind: "text",
          value:
            "This quiz tests your understanding of **set** versus **read**. Crucially, we set the value of a variable multiple times: the first line, sets the value of `points` to `10` and the third line sets the value of `points` to `2`. The three `print` lines all **read** the value of `points`\n\nWhat will the three lines print?",
        },
        {
          kind: "code",
          value:
            "points = 10\nprint(points - 2)\npoints = 2\nprint(points)\nprint(points * 4)",
        },
      ],
      options: [
        "First `-2`, then `2`, then `14`",
        "First `2`, then `10`, then `4`",
        "First `10`, then `5`, then `40`",
        "First `8`, then `2`, then `8`",
      ],
      correctAnswer: 3,
      feedback: {
        correct:
          "Correct! When the `points` value is set, that value is used in reads until it is set again.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Debugger",
      id: "variable-debugging" as SectionId,
      title: "Watching Variables Change",
      content: [
        {
          kind: "text",
          value:
            "One of the most powerful features of variables is that you can update the value they're storing. When you assign a new value to an existing variable, it simply overwrites the old value.\n\nUse the debugging tool to step line-by-line through the code and observe how the value of the `score` variable **changes**. Pay particular attention to the following:\n- When `score` is created, it shows up in the `Variables` side-panel with its given, initial value\n- When the value of `score` is updated, the variable is highlighted in the `Variables` side-panel with its new value\n- Whenever a `print()` statement is run, the output is shown in the `Program Output` side-panel",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "score = 10\nprint(score)\nscore = 20\nprint(score)\nscore = score + 5\nprint(score)",
      },
    } as DebuggerSectionData,
    {
      kind: "MultipleChoice",
      id: "variable-reassignment",
      title: "Variable Values",
      content: [
        {
          kind: "text",
          value:
            "Based on what you observed in the previous section, what will be the final value of `points` after running this code?",
        },
        {
          kind: "code",
          value: "points = 100\npoints = 50\npoints = points + 25",
        },
      ],
      options: ["100", "50", "75", "175"],
      correctAnswer: 2,
      feedback: {
        correct:
          "Correct! The variable starts at 100, gets sets to 50, then gets updated to 50 + 25 = 75.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "PRIMM",
      id: "string-variables-primm" as SectionId,
      title: "Changing String Variables",
      content: [
        {
          kind: "text",
          value:
            "Just like with integers, you can update (e.g., change, overwrite, reassign) the value that a variable is holding. And, just like with integers, you can use the old value when calculating what new value to store in the variable.\n\nPredict what the program below will output, then run it to check your prediction.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'greeting = "Hello"\nprint(greeting)\ngreeting = "Goodbye"\nprint(greeting)\ngreeting = greeting + "!"\nprint(greeting)\n',
      },
      predictPrompt:
        'The variable `greeting` is initially set to "Hello" but gets updated twice. What do you think each print statement will output?',
      conclusion:
        "Just like with integers, you can reassign string variables and even use the variables in their own (re)assignment!",
    } as PRIMMSectionData,
    {
      kind: "Reflection",
      id: "variables-reflection" as SectionId,
      title: "Variables Reflection",
      content: [
        {
          kind: "text",
          value:
            'Variables are fundamental to programming because they allow programs to store, update, and reuse data. Without variables, every bit of data would have to be written directly into the code, making programs inflexible and hard to maintain.\n\nNow it\'s time to reflect in order to formalize your knowledge. Create a simple 3-4 line code example that demonstrates how variables can make a program more useful, and write 3-4 sentences explaining how your program works. Remember to use the phrase "as seen in the example above".',
        },
      ],
      topic: "Why Variables Matter",
      isTopicPredefined: true,
      code: "Create an example showing why variables are useful",
      isCodePredefined: false,
      explanation: "Explain how the code in example works (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "variables-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "Great job! You have now seen the core ways that variables are used in programs. They can be **set** and *read**. Then, if you combine these two abilities, they can be updated based on their previous values.\n\nIn the next lesson you'll learn how to use multiple variables in a single program.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
