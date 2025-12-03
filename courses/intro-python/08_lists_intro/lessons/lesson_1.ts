import type {
  Lesson,
  MultipleChoiceSectionData,
  ObservationSectionData,
  PRIMMSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Grocery Lists",
  guid: "c3aa36b7-5c56-476f-a38f-2a9fd39e08eb",
  description: 'Compare "real world" lists with their Python equivalent.',
  sections: [
    {
      kind: "Information",
      id: "python-lists-intro-info",
      title: "Programming vs. Real World",
      content:
        "Lists, or a collection of items, are a very natural concept that you interact with daily. Use the questions below to help formalize your understanding.",
    },
    {
      kind: "Observation",
      id: "python-lists-intro-observation",
      title: "Two item list",
      content:
        "Lists are denoted with via square brackets: `[ ]`. They can hold multiple items of different types. In the example below, they are holding strings representing things you should buy.",
      example: {
        id: "hello-world",
        title: "REMOVE",
        description: "",
        code: 'gl = []\ngl.append("eggs")\ngl.append("apples")\nprint(gl)',
      },
    } as ObservationSectionData,
    {
      kind: "MultipleChoice",
      id: "question-1",
      title: "Question 1: Append",
      content: "What does it seem that the `append()` function does?",
      options: [
        "Removes an item from the list",
        "Adds and item to the front of the list",
        "Adds and item to the back of the list",
        "Duplicates all of the items of the list",
      ],
      correctAnswer: 3,
      feedback: {
        correct:
          "Correct! The print() function is used to display output to the console.",
        incorrect:
          "Incorrect. The print() function is used to display output to the console.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "PRIMM",
      id: "primm-grocer-lists",
      title: "Grocery lists",
      content:
        "Use the code below to answer the following questions and complete the required tasks.",
      examples: [
        {
          id: "primm-nested-example",
          code: 'def do_something_0(to_add):\n    gl = ["bread", "apples"]\n    gl.append(to_add)\n\n    for elem in gl:\n        print(f"Buy {elem}!")\n\n    print(f"But the {gl[-1]} is most important!")\n\nif __name__ == "__main__":\n    do_something_0("ice cream")',
          predictPrompt:
            'What lines will be printed when this code runs with `answer = "c"`?',
        },
      ],
      conclusion:
        "When `answer` is 'c', the outer `if` is false, so the outer `else` block executes. Inside that, the inner `if answer == \"b\"` is also false, so its `else` block runs, printing 'Other'. Finally, the 'All done' print statement outside all conditionals always runs.",
    } as PRIMMSectionData,
    {
      kind: "Observation",
      id: "comments",
      title: "Comments",
      content:
        "Comments help you document your code. Python ignores anything after a # symbol.",
      example: {
        id: "comments",
        title: "Using Comments",
        description:
          "Comments are used to explain code and make your programs more readable:",
        code: '# This is a comment\nprint("This code is executed") # This is an inline comment\n\n# The following line is not executed\n# print("This won\'t be printed")',
      },
    },
    {
      kind: "Observation",
      id: "basic-math",
      title: "Basic Math Operations",
      content:
        "Python can perform arithmetic operations like addition, subtraction, multiplication, and division.",
      example: {
        id: "math",
        title: "Math Operations",
        description: "Try these basic mathematical operations:",
        code: 'print("Addition:", 5 + 3)\nprint("Subtraction:", 10 - 4)\nprint("Multiplication:", 6 * 7)\nprint("Division:", 20 / 4)\nprint("Integer Division:", 20 // 3)\nprint("Remainder (Modulo):", 20 % 3)\nprint("Exponentiation:", 2 ** 3)',
      },
    },
    {
      kind: "Observation",
      id: "exercises",
      title: "Exercises",
      content: "Try solving these exercises to practice what you've learned.",
      example: {
        id: "exercise1",
        title: "Print your name",
        description: "Write a program that prints your name and a greeting.",
        code: '# Write your code here\n# Example: print("Hello, my name is Alex!")',
      },
    },
  ],
};

export default lessonData;
