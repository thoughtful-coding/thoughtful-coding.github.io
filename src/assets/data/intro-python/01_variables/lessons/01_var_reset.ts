import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  PRIMMSectionData,
  DebuggerSectionData,
  ReflectionSectionData,
  MultipleChoiceSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Updating Data",
  guid: "44356f3b-722f-4b19-b3ed-d532b7961f92" as LessonId,
  description:
    "Learn how to reset the value of variables that are stored in your program to adapt to changing environments.",
  sections: [
    {
      kind: "Information",
      id: "variables-intro" as SectionId,
      title: "Why Variables Matter",
      content: [
        {
          kind: "text",
          value:
            "In the previous lesson, you saw how you can **set** and **read** a variable's value within a program. In this lesson, you'll see how to set the a variable's value _multiple times_. This ability to \"reset\" a variable means that variables can track values as they change throughout a program's execution.\n\nVariables are called variables because they have the ability to change over the course of the program. As you work through the following lessons, imagine new values going in and out of the slot provided by the variable.",
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
            "You've encountered programs where a variable is read multiple times. The program below is the first instance, however, where the same variable is **set multiple times**. We set the value of a variable twice: the first line, sets the value of `points` to `10` and the third line (re)sets the value of `points` to `2`. The three `print` lines all read the value of `points`.\n\nWhat will the three lines print?",
        },
        {
          kind: "code",
          value:
            "points = 10\nprint(points - 2)\npoints = 2\nprint(points)\nprint(points * 4)\n",
        },
      ],
      options: [
        "First `8`, then `2`, then `14`",
        "First `8`, then `10`, then `4`",
        "First `8`, then `5`, then `40`",
        "First `8`, then `2`, then `8`",
      ],
      correctAnswer: 3,
      feedback: {
        correct:
          "Correct! When the `points` value is set, that value is used in reads until it is set again.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "PRIMM",
      id: "variable-reset-primm" as SectionId,
      title: "Resetting Variables",
      content: [
        {
          kind: "text",
          value:
            "When you reset the value of an existing variable, its old value is overwritten. Variables can only remember one thing, so the old value is lost forever. What's really interesting, however, is that if you do things carefully, you can read the value of a variable and then use that value to when resetting the variable.\n\nThe problem below illustrates this read and reset pattern. On the first line, the value of `x` is set to `10`. On the second line, the value of `x` is read and then this original value of `x` is used to calculate the new value of `x`. Based on this explanation, predict what you think will happen when the program is run.",
        },
      ],
      example: {
        visualization: "console",
        initialCode: "x = 10\nx = x + 1\nprint(x)",
      },
      predictPrompt:
        "The value stored in `x` is used to calculate the value it should be reset to. What will the program output?",
      conclusion:
        "The ability to reset variables using their old values gives you the ability to update the variable.",
    } as PRIMMSectionData,
    {
      kind: "MultipleChoice",
      id: "variable-updating",
      title: "Updating Variables",
      content: [
        {
          kind: "text",
          value:
            "The program below initially sets the value of `var` to be `3`. It then resets the value three times before printing out the final value stored in `var. What will the program output?",
        },
        {
          kind: "code",
          value:
            "var = 3\nvar = var + 1  # add one\nvar = var * 3  # multiple by 3\nvar = var + var  # add to self\nprint(var)\n",
        },
      ],
      options: ["3", "14", "24", "6"],
      correctAnswer: 2,
      feedback: {
        correct:
          "Correct! Each time the var is reset, it uses the old value of var to calculate what the new value should be.",
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
            "The program below has all the different patterns we've seen so far: a set, a read, and a reset. Use the debugging tool to step line-by-line through the code and observe how the value of the `score` variable changes. Pay particular attention to the following:\n- When `score` is set, it shows up in the `Variables` side-panel with its given, initial value\n- When the value of `score` is reset, the variable is highlighted in the `Variables` side-panel with its new value",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "score = 10\nprint(score)\nscore = 20\nprint(score)\nscore = score + 5\nprint(score)\n",
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
          "Correct! The variable starts at 100, gets resets to 50, then gets reset once more to be 50 + 25 = 75.",
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
            "Just like with integers, you can reset the string value that a variable is holding. And, just like with integers, you can use the old string value when calculating what new value to store in the variable.\n\nThe program below has a set, a read, and a reset. Predict what it will output, then run it to check your prediction.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'greeting = "Hello"\nprint(greeting)\ngreeting = "Goodbye"\nprint(greeting)\ngreeting = greeting + "!"\nprint(greeting)\n',
      },
      predictPrompt:
        'The variable `greeting` is initially set to "Hello" but gets reset twice. What do you think each print statement will output?',
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
            'Variables are fundamental to programming because they allow programs to set, read, and reset data. Without variables, every bit of data would have to be written directly into the code, making programs inflexible and hard to maintain.\n\nNow it\'s time to reflect in order to formalize your knowledge. Create a simple 3-4 line code example that demonstrates how variables can make a program more useful, and write 3-4 sentences explaining how your program works. Remember to use the phrase "as seen in the example above".',
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
            "Great job! You have now seen the core ways that variables are used in programs. They can be **set** and *read**. They can also be reset with new values - even using their old values in the process. In the next lesson you'll learn how to use multiple variables in a single program.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
