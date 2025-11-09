import type {
  InformationSectionData,
  Lesson,
  ObservationSectionData,
  LessonId,
  SectionId,
  MultipleSelectionSectionData,
  PRIMMSectionData,
  DebuggerSectionData,
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
      id: "variables-intro",
      title: "Why Variables Matter",
      content: [
        {
          kind: "text",
          value:
            "So far, you've learned how to work with strings and integers directly in your code. But, what if you want to use the same value multiple times? Or, what if you want to easily change a value that's used in many different locations? That's where **variables** come in. Variables allow you to give a name to a piece of data so you can use it repeatedly in your program.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "PRIMM",
      id: "basic-variables-primm" as SectionId,
      title: "How Variables Work",
      content: [
        {
          kind: "text",
          value:
            'You can create a variable in Python with just a single line of code. For example, `name = Eric` creates a variable named `name` and then stores the string `"Eric"` in it. You can then reference the variable `name` later in the program and it will give you the value `"Eric"`.\n\nBased on this brief explanation, predict what the code below will output, then run it to check your prediction.',
        },
      ],
      predictPrompt:
        'The variable `name` is set to `"Eric"`. What do you think each print statement will output?',
      example: {
        visualization: "console",
        initialCode:
          'name = "Eric"\nprint("Hi " + name + "!")\nprint("It\'s nice to meet you!")\nprint("Bye " + name)\n',
      },
      conclusion:
        'Variables remember their values! The variable `name` stored `"Eric"` throughout the program and could be used over and over.',
    } as PRIMMSectionData,
    {
      kind: "Debugger",
      id: "line-by-line-variables" as SectionId,
      title: "Watching Computers Use Variables",
      content: [
        {
          kind: "text",
          value:
            "Variables are such an important concept that it's worth slowing down what just happened. To do that, we're going to use the debugger to watch the computer execute the program line-by-line. As you step through the program pay particular attention to the following:\n- How the variable `name` is stored in the `Variables` side-panel\n- How the value stored in `name` is used throughout the program\n\nStep carefully through the program and try and form a mental image of the variable `name` holding or storing a value that can used whenever the variable is called.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'name = "Eric"\nprint("Hi " + name + "!")\nprint("It\'s nice to meet you!")\nprint("Bye " + name)\n',
      },
    } as DebuggerSectionData,
    {
      kind: "MultipleSelection",
      id: "variable-parts",
      title: "Parts of a Variable",
      content: [
        {
          kind: "text",
          value:
            'Looking at the line `name = "Eric"` from the example above, which of the following statements are true? Select all that apply.',
        },
      ],
      options: [
        'The variable name is `"Eric"`',
        "The variable name is `name`",
        'The variable value is `"Eric"`',
        "The variable value is `name`",
        "The `=` sign stores the value in the variable",
        "The `=` sign checks if two things are equal",
      ],
      correctAnswers: [1, 2, 4],
      feedback: {
        correct:
          "Correct! The variable name goes on the left, the value goes on the right, and `=` stores the value in the variable name.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "PRIMM",
      id: "integer-variables" as SectionId,
      title: "Variables with Numbers",
      content: [
        {
          kind: "text",
          value:
            "Variables can store more than just strings; they can also store integers. Below is a program that stores an integer in a variable and then uses the variable in some calculations.\n\nPredict what the code below will output, then run it to check your prediction.",
        },
      ],
      predictPrompt:
        "The variable `age` is set to 15. What do you think each print statement will output?",
      example: {
        visualization: "console",
        initialCode: "age = 15\nprint(age)\nprint(age + 5)\nprint(age)\n",
      },
      conclusion:
        "Variables remember their values! The variable `age` stayed 15 throughout the program, even after being used in the calculation `age + 5`",
    } as PRIMMSectionData,
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
      kind: "Information",
      id: "variables-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "Congratulations on learning about variables! You now understand how to store data, update it, and reuse it throughout your programs. Variables are the foundation for creating programs that can respond to complex problems.\n\nIn the next lesson you'll learn how to use multiple variables in a single program.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
