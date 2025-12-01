import type {
  Lesson,
  ObservationSectionData,
  PRIMMSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Python Lists (Basic)",
  guid: "cde4e0a6-c51e-495f-83fd-21ed00cf06c1",
  description: "W",
  sections: [
    {
      kind: "Information",
      id: "python-history",
      title: "The History of Python",
      content:
        '`Python` was created by _Guido van Rossum_ and first released in 1991. Its clean syntax, which uses indentation rather than braces to define code blocks, makes it particularly accessible for beginners who can focus on learning programming concepts without getting distracted by complex syntax. Python has become popular for learning due to its readability. The language\'s philosophy of "there should be one—and preferably only one—obvious way to do it" creates a straightforward learning path that helps beginners develop good programming habits from the start.',
    },
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
    } as ObservationSectionData,
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
