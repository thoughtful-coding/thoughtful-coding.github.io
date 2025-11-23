import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  MultipleSelectionSectionData,
  PRIMMSectionData,
  DebuggerSectionData,
  MultipleChoiceSectionData,
  MatchingSectionData,
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
          value:
            "So far, you've learned how to work with strings and integers directly in your code. But, what if you want to use the same value multiple times? Or, what if you want to change a value that's used in many different locations? For example, consider the simple program below:",
        },
        {
          kind: "code",
          value:
            'print("Hi Eric!")\nprint("How\'s your day Eric?")\nprint("Bye Eric")',
        },
        {
          kind: "text",
          value:
            "The program runs and interacts with the user `\"Eric\"` without any issues. If you wanted to alter the program to greet someone else, however, then you'd have to change every single line. That's where **variables** come in. Variables allow you to give a piece of data a name so you can easily use and change it throughout your program.",
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
            'You can create a variable in Python with just a single line of code. For example, `name = "Eric"` creates a variable named `name` and then stores the string `"Eric"` in it. You can then reference the variable `name` later in the program and it will give you back the value `"Eric"`.\n\nBased on this brief explanation, predict what the code below will output, then run it to check your prediction.',
        },
      ],
      predictPrompt:
        'The variable `name` is set to `"Eric"`. What do you think each print statement will output?',
      example: {
        visualization: "console",
        initialCode:
          'name = "Eric"\nprint("Hi " + name + "!")\nprint("How\'s your day " + name + "?")\nprint("Bye " + name)\n',
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
            "Variables are such an important concept that it's worth slowing down what just happened with the debugger. As you step line-by-line through the program, pay particular attention to the following:\n- When the variable `name` shows up in the `Variables` side-panel\n- How the value stored in `name` is used throughout the program\n\nStep carefully through the program and try and form a mental image of the variable `name` holding or storing a value that can used whenever the variable is called.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'name = "Eric"\nprint("Hi " + name + "!")\nprint("How\'s your day " + name + "?")\nprint("Bye " + name)\n',
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
        'The variable is named `"Eric"`',
        "The variable is named `name`",
        'The variable\'s value is `"Eric"`',
        "The variable's value is `name`",
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
      kind: "Matching",
      id: "set-vs-read-matching" as SectionId,
      title: "Setting and Reading Variables in Code",
      content: [
        {
          kind: "text",
          value:
            "There are two key operations for variables: **set** and **read**.\n\n- **Set:** `age = 15` \n   - This *sets* the value of `age` to be `15`\n- **Read:** `print(age)` and `print(age + 5)`\n    - These *read* the value `10` from `age` and use it in calculations.\n\nThese two operations - set and read - are the two core things you can do with variables. To tie it back to the debugger, you can only store values into the `Variables` slots and then get the values out of those slots.\n\nBased on this explanation, match the following lines of code with their outcome.",
        },
      ],
      prompts: [
        { "`x = 10`": "Sets the value of `x` to be ten" },
        { "`print(x)`": "Reads the value of `x` and prints the result" },
        {
          "`10 = x`":
            "SyntaxError since you can't set something that isn't a variable",
        },
        { "`x = 55`": "Sets the value of `x` to fifty-five" },
        {
          "`print(x + 10)`":
            "Reads the value of `x`, adds ten, and prints the result",
        },
      ],
      feedback: {
        correct: "Correct! You know it's a set if there's a `=` sign.",
      },
    } as MatchingSectionData,
    {
      kind: "MultipleChoice",
      id: "variable-reading",
      title: "Variable Values",
      content: [
        {
          kind: "text",
          value:
            "This program below sets the variable `points` once and then reads the value of `points` three times (sometimes doing an operation on that value). What will the three lines print?",
        },
        {
          kind: "code",
          value:
            "points = 10\nprint(points - 2)\nprint(points)\nprint(points * 4)",
        },
      ],
      options: [
        "First `-2`, then `10`, then `14`",
        "First `2`, then `2`, then `4`",
        "First `10`, then `5`, then `4`",
        "First `8`, then `10`, then `40`",
      ],
      correctAnswer: 3,
      feedback: {
        correct:
          "Correct! The variable `points` is set to `10` on the first line. Then that value is read and used over and over.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Information",
      id: "variables-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "Congratulations on learning about variables! You now understand how to set variables to be a particular value and then read/use the variable throughout your program. Variables are the foundation for creating programs that can respond to complex problems.\n\nIn the next lesson you'll learn how to combine the store and read operations to _update_ variables as the program progresses.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
