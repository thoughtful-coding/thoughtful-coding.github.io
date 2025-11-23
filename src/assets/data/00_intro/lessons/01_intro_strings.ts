import type {
  InformationSectionData,
  Lesson,
  ObservationSectionData,
  LessonId,
  SectionId,
  MultipleSelectionSectionData,
  PRIMMSectionData,
  TestingSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Python Basics",
  guid: "3c1e0332-e7ec-4e6a-b0c6-f9c9890999c5" as LessonId,
  description:
    "Learn how text is represented in a computer and use this knowledge to write your first Python program.",
  sections: [
    {
      kind: "Information",
      id: "python-history",
      title: "The History of Python",
      content: [
        {
          kind: "text",
          value:
            "In the previous lesson, you ran your first Python program and then used the debugger to watch it run in slow motion. In this lesson, you'll learn how to output your own, custom text to the screen. Then, you'll use this knowledge to write your first two Python programs.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "MultipleSelection",
      id: "what-is-a-string",
      title: "What's a String?",
      content: [
        {
          kind: "text",
          value:
            "The first thing to appreciate about all programming languages is that they're primarily used to operate on data. Therefore, understanding the _type of data_ you're operating on is very important. The first **data type** we're going to cover are **strings**. Strings are lists of characters that can form words, sentences, and paragraphs. They are composed of letters, spaces, punctuation, and even numerical characters.\n\nStrings are most often denoted by being inside double quotes. This means they start with a `\"` and end with a `\"`. Based on this definition, select the **two** options below that are valid strings.",
        },
      ],
      options: [
        "print",
        "Hello, World!",
        '"Hello, World!"',
        "Can I call myself a programmer now?",
        '"Can I call myself a programmer now?"',
        "It is a trap!",
      ],
      correctAnswers: [2, 4],
      feedback: {
        correct: "Correct! A string is surrounded with quotation marks.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Testing",
      id: "hello-testing" as SectionId,
      title: "Modify: Hello, World!",
      content: [
        {
          kind: "text",
          value:
            'Now it\'s your turn to write your first bit of code! The program below says `"Hello, World"`, but it\'s missing the expected exclamation point. Add **a single character** to the program so that it outputs `"Hello, World!"` instead. Once you think you\'ve made the right change:\n1. Verify that your program works by clicking the `Run Code` button\n2. Click the `Run Tests` button to "grade" your answer\n\nWhen you click the `Run Tests` button, the website will double check that your program produces the exactly correct output. If the generated output matches expectations, the entire section will be marked complete. If your change wasn\'t quite right, fix the error, and then rerun the tests.',
        },
      ],
      example: {
        visualization: "console",
        initialCode: 'print("Hello, World")\n',
      },
      testCases: [
        {
          input: [null],
          expected: "Hello, World!",
          description: "Has trailing exclamation point",
        },
      ],
      testMode: "procedure",
      functionToTest: "__main__",
    } as TestingSectionData,
    {
      kind: "PRIMM",
      id: "double-quote-strings" as SectionId,
      title: "Quoting Someone",
      content: [
        {
          kind: "text",
          value:
            "Below is a Python program that attempts to print a famous quote. Unfortunately, there's a problem.\n\nFirst, predict what you think the code will do when you run it and then see if your prediction is correct. Finally, use the feedback from AI to correct/refine your mental model.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'print("John Dewey said: "We learn from reflecting on experience.")',
      },
      predictPrompt:
        "There's something wrong with the code above. What is the problem and what do you think will happen when you run the code?",
      conclusion:
        "When you use double quotes to denote a string, you can't use double quotes **inside the string**",
    } as PRIMMSectionData,
    {
      kind: "Observation",
      id: "single-quote-strings" as SectionId,
      title: "Single Quote Strings",
      content: [
        {
          kind: "text",
          value:
            "Luckily, there's a way around the problem above: single quotes! Single quotes (`'`) can be used whenever you have a string that has a double quote (`\"`) inside it.\n\nThe code below is almost exactly like the code in the example above, except it uses single quotes at the start and end of the string. This simple change prevents the computer from getting confused about where the string ends. Run the program to verify it works as expected.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "print('John Dewey said: \"We learn from reflecting on experience.\"')",
      },
    } as ObservationSectionData,
    {
      kind: "MultipleSelection",
      id: "what-is-a-string-again",
      title: "What's a String Again?",
      content: [
        {
          kind: "text",
          value:
            "Being able to identify valid strings is crucial. Select the **three** options below that are valid strings.",
        },
      ],
      options: [
        "print",
        '"print"',
        "\"Hello, World!'",
        "Hello, World",
        '"John Dewey said "hi"',
        "'bye!'",
        '"It\'s a trap"',
      ],
      correctAnswers: [1, 5, 6],
      feedback: {
        correct:
          "Correct! Strings start and stop with the same quotation character and don't have any other instance of that character between them.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Testing",
      id: "single-vs-double-testing" as SectionId,
      title: "Make: Who Goes There?",
      content: [
        {
          kind: "text",
          value:
            "Now it's your turn to write a complete program! Write a program that outputs the following two sentences, one after the other:\n\n1. `Who's out there?`\n2. `I heard Eric say \"me\".`\n\nYou should be able to create this program by adding two different strings to the `print()` statements below.\n\nOnce you're ready, check that your program works by clicking the `Run Code` button. Then, if everything looks right, click the `Run Tests` button. If the generated output matches expectations, the section will be marked complete. If there's an error, look for where the generated output differs from expectations, fix the issue, and rerun the tests.",
        },
      ],
      example: {
        visualization: "console",
        initialCode: "print()\nprint()",
      },
      testCases: [
        {
          input: [null],
          expected: 'Who\'s out there?\nI heard Eric say "me".',
          description: "Test that program produces expected output",
        },
      ],
      testMode: "procedure",
      functionToTest: "__main__",
    } as TestingSectionData,
    {
      kind: "Information",
      id: "strings-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "Congratulations on completing your first lesson. In the process you should have learned how to create and use strings to output information to the user. In the next section we will learn about a new type of data and how to distinguish between them.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
