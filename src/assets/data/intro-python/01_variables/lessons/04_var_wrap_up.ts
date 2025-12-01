import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  MultipleChoiceSectionData,
  MultipleSelectionSectionData,
  TestingSectionData,
  ParsonsSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Variable Unit Challenge",
  guid: "14f3ba03-2020-44e6-b68d-ae8dde46da7e" as LessonId,
  description:
    "Test your understanding of strings, integers, and variables with a variety of practice problems and challenges.",
  sections: [
    {
      kind: "Information",
      id: "review-intro",
      title: "Practicing with Interleaving",
      content: [
        {
          kind: "text",
          value:
            "You've learned a lot in the previous lessons: how to work with strings and integers, how operations affect data-types differently, and how to store values in variables. What's more, these topics build on each other in varying and subtle ways. Therefore, this review uses a learning technique called **interleaving** to help solidify your understanding of all these interrelated topics.\n\nInterleaving is technique where you answer questions about everything you've encountered so far - not just the most recent unit. It forces you to utilize prior knowledge while simultaneously reviewing what you just learned. This approach helps your brain make stronger connections between concepts and mirrors how real programming works.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Parsons",
      id: "order-vars" as SectionId,
      title: "Order Matters",
      content: [
        {
          kind: "text",
          value:
            "Order the following lines of a program so the number `8` is printed out and then the number `5` is printed out.",
        },
      ],
      puzzle: {
        codeBlocks: [
          ["x = 3"],
          ["x = 7"],
          ["x = x + 2"],
          ["print(x)"],
          ["print(x + 1)"],
        ],
        visualization: "console",
      },
      testMode: "procedure",
      functionToTest: "__main__",
      testCases: [
        {
          input: [null],
          expected: "8\n5",
          description: "Test 5 then 8",
        },
      ],
    } as ParsonsSectionData,
    {
      kind: "MultipleChoice",
      id: "string-identification",
      title: "Identifying Strings",
      content: [
        {
          kind: "text",
          value:
            "Which of the following is a valid string that could be printed **without** causing a `SyntaxError`?",
        },
      ],
      options: [
        "'It's a beautiful day'",
        '"She said "hello" to me"',
        `'I heard "yo" earlier'`,
        "'The cat's meow'",
      ],
      correctAnswer: 2,
      feedback: {
        correct:
          "Correct! This string uses double quotes consistently without any conflicting quotes inside.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "MultipleChoice",
      id: "var-errors",
      title: "Name That Error",
      content: [
        {
          kind: "text",
          value:
            'Which of the following lines of code would result the following error being raised:\n```\nError:\n\nExecution Error: Traceback (most recent call last):\n  File "/lib/python311.zip/_pyodide/_base.py", line 573, in eval_code_async\n    await CodeRunner(\n  File "/lib/python311.zip/_pyodide/_base.py", line 393, in run_async\n    coroutine = eval(self.code, globals, locals)\n                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File "<exec>", line 2, in <module>\nNameError: name \'num\' is not defined\n```\n',
        },
      ],
      options: [
        "`num = 10` followed by `print(number)`",
        "`number = 10` followed by `print(num)`",
        '`num = 3 + "3"`',
        '`number = 3 * "3"`',
      ],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! The variable `number` was created but the program tries to use `num`.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "MultipleSelection",
      id: "data-types",
      title: "Data Types",
      content: [
        {
          kind: "text",
          value:
            "Which of the following that are integers? Select all that apply.",
        },
      ],
      options: ["42", '"forty two"', "0", '"hello"', "999", "'999'", "-5"],
      correctAnswers: [0, 2, 4, 6],
      feedback: {
        correct:
          "Correct! Integers are whole numbers without quotation marks around them.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "MultipleSelection",
      id: "variable-behavior",
      title: "How Variables Work",
      content: [
        {
          kind: "text",
          value:
            "Which of the following statements about variables are true? Select all that apply.",
        },
      ],
      options: [
        "Variables can store both strings and integers",
        "Once you assign a value to a variable, it can never be changed",
        "Variable names must always be surrounded by quotes",
        "You can use a variable in its own reassignment (like x = x + 1)",
        "Variables remember their values throughout the program",
        "The = sign checks if two values are equal",
      ],
      correctAnswers: [0, 3, 4],
      feedback: {
        correct:
          "Correct! Variables are flexible containers that can be reassigned and used in calculations.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "MultipleSelection",
      id: "type-errors",
      title: "Type Errors",
      content: [
        {
          kind: "text",
          value:
            "Which of the following lines of code would result in a `TypeError` being raised? Select all that apply.",
        },
      ],
      options: [
        'print("5" + "3")',
        "print(5 + 3)",
        'print("5" + 3)',
        'print(5 + "3")',
        'print("hello" + "world")',
        'print("hello" - "world")',
      ],
      correctAnswers: [2, 3, 5],
      feedback: {
        correct:
          "Correct! One of the ways to get TypeErrors is when you try to mix strings and integers with `+`, or when you try to use `-` with strings.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "MultipleChoice",
      id: "variable-assignment",
      title: "Variable Assignment",
      content: [
        {
          kind: "text",
          value:
            "After running the following code, what will be the value of the variable `x`?",
        },
        { kind: "code", value: "x = 10\nx = 5\nx = x + 3\n" },
      ],
      options: ["10", "5", "8", "18"],
      correctAnswer: 2,
      feedback: {
        correct:
          "Correct! x starts at 10, then gets changed to 5, then gets changed to 5 + 3 = 8.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "MultipleChoice",
      id: "variable-naming",
      title: "Variable Names",
      content: [
        {
          kind: "text",
          value: "Looking at this code, what is the **name** of the variable?",
        },
        { kind: "code", value: 'favorite_food = "pizza"' },
      ],
      options: ["favorite_food", '"pizza"', "pizza", "="],
      correctAnswer: 0,
      feedback: {
        correct:
          "Correct! The variable name is favorite_food - it's the identifier on the left side of the = sign.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "MultipleChoice",
      id: "tricky-prediction",
      title: "Tricky Prediction",
      content: [
        {
          kind: "text",
          value: "What will be printed by the last line of this code?",
        },
        {
          kind: "code",
          value:
            'message = "Hello"\nmessage = message + " World"\nprint(message)',
        },
      ],
      options: ["Hello", "World", "Hello World", "message + World"],
      correctAnswer: 2,
      feedback: {
        correct:
          "Correct! The variable message starts as 'Hello', then gets reassigned to 'Hello' + ' World' = 'Hello World'.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Testing",
      id: "dog-years-challenge" as SectionId,
      title: "Challenge: Dog Years",
      content: [
        {
          kind: "text",
          value:
            "Now it's your turn to work with variables! Create a program that:\n\n1. Creates a variable called `dog_age` and stores the number `3` in it\n2. Prints out the dog's age\n3. Prints out the dog's age in human years (multiply by 7)",
        },
      ],
      example: {
        visualization: "console",
        initialCode: "# Your code here",
      },
      testCases: [
        {
          input: [null],
          expected: "3\n21",
          description: "Test with dog_age=3, should print 3 then 21",
        },
      ],
      testMode: "procedure",
      functionToTest: "__main__",
    } as TestingSectionData,
    {
      kind: "Information",
      id: "review-conclusion",
      title: "The Power of Interleaving",
      content: [
        {
          kind: "text",
          value:
            "Excellent job working through these interleaved practice problems! By mixing questions about strings, integers, and variables together, your brain had to actively recall and apply different concepts rather than just reproducing a single pattern. This type of practice - where you switch between related topics - has been proven to create stronger, more durable learning.\n\nYou've demonstrated your understanding of all the foundational concepts and you're ready to move on to more advanced topics!",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
