import type {
  InformationSectionData,
  Lesson,
  LessonId,
  MatchingSectionData,
  MultipleChoiceSectionData,
  MultipleSelectionSectionData,
  SectionId,
  TestingSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Intro Unit Challenge",
  guid: "a2f4b8c3-9d1e-4f3a-b7c9-2e8f5a6d9c4e" as LessonId,
  description:
    "Put together everything you've learned about strings, integers, and print statements to create social media posts.",
  sections: [
    {
      kind: "Information",
      id: "challenge-intro",
      title: "Your First Real Challenge",
      content: [
        {
          kind: "text",
          value:
            "In the previous lessons you learned about strings and integers. You've discovered that quotation marks matter, that `+` does different things to different data types, and that computers are very picky about details.\n\nNow comes the real test: can you use what you've learned to solve actual problems? The following challenges aren't meant to be easy. But, the struggle is where the learning happens.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "MultipleChoice",
      id: "integer-operations",
      title: "Integer Math",
      content: [
        {
          kind: "text",
          value: "What will be the output of the following code?",
        },
        { kind: "code", value: "print(15 - 3)" },
      ],
      options: ["18", "12", "153", "15 - 3"],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! When you use `-` with integers, it performs subtraction: 15 - 3 = 12.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Matching",
      id: "python-ops-match" as SectionId,
      title: "Matching Operations",
      content: [
        {
          kind: "text",
          value:
            "Match each of the following outputs with the bits of code that would result in them:",
        },
      ],
      prompts: [
        { "16": "8 + 8" },
        { '"88"': '"8" + "8"' },
        { "TypeError: unsupported operand type(s) for +": '8 + "8"' },
        { "SyntaxError: unterminated string": '"8" + "8' },
        { "0": "8 - 8" },
        { "TypeError: unsupported operand type(s) for -": '8 - "8"' },
        { "64": "8 * 8" },
        { "1": "8 / 8" },
        { "16777216": "8 ** 8" },
      ],
    } as MatchingSectionData,
    {
      kind: "MultipleChoice",
      id: "operation-question",
      title: "When To Use What?",
      content: [
        {
          kind: "text",
          value:
            "What determines what operations (`+`, `-`, `*`) you can use (without getting an error)?",
        },
      ],
      options: [
        "The type of the data",
        "The location of the data",
        "How old your are",
        "How old the computer is",
      ],
      correctAnswer: 0,
      feedback: {
        correct:
          "Correct! The **data type** determines what the operations does (and if it can be used).",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "MultipleChoice",
      id: "syntax-error-interpretation",
      title: "SyntaxError Interpretation",
      content: [
        {
          kind: "text",
          value: `What is the following \`SyntaxError\` trying to communicate?\n\`\`\`\nSyntaxError: Traceback (most recent call last):
  File "/lib/python311.zip/_pyodide/_base.py", line 573, in eval_code_async
    await CodeRunner(
          ^^^^^^^^^^^
  File "/lib/python311.zip/_pyodide/_base.py", line 267, in __init__
    self.ast = next(self._gen)
               ^^^^^^^^^^^^^^^
  File "/lib/python311.zip/_pyodide/_base.py", line 145, in _parse_and_compile_gen
    mod = compile(source, filename, mode, flags | ast.PyCF_ONLY_AST)
          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<exec>", line 5
SyntaxError: '(' was never closed for print("hi"`,
        },
      ],
      options: [
        "There's an error on line 57 because there's a `*` instead of a `+`",
        "There's an error on line 12 because `print` is misspelled",
        "There's an error on line 15 because there's a missing end quote",
        "There's an error on line 5 because there's a missing `)` for the print",
      ],
      correctAnswer: 3,
      feedback: {
        correct:
          'Correct! The program should be `print("hi")` instead of `print("hi"`',
      },
    } as MultipleChoiceSectionData,
    {
      kind: "MultipleSelection",
      id: "ways-to-get-twelve-question",
      title: "When To Use What?",
      content: [
        {
          kind: "text",
          value:
            'Which of the following will result in `12` **OR** `"12"` being printed out? Select all that apply.',
        },
      ],
      options: [
        "print(1 + 2)",
        'print("1" + "2")',
        "print(3 * 4)",
        "print(11 + 1)",
        'print("11" + "1")',
        "print(13 - 1)",
        'print("13" - "1")',
      ],
      correctAnswers: [1, 2, 3, 5],
      feedback: {
        correct: "Correct! Different operations can yield the same result.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Testing",
      id: "instagram-likes" as SectionId,
      title: "Instagram Post",
      content: [
        {
          kind: "text",
          value:
            'Now for some actual coding. Your goal is to create a program that mimics an Instagram post by printing out these three lines exactly:\n```\nTaylor liked your photo\nBill said "Great shot!"\n42 others also liked it\n```\n\nWatch out for:\n- The quotation marks around "Great shot!" must appear in the output\n- Each line needs its own print statement\n\nTo check your work, click the `Run Code` button. Once you think your program is ready, click the `Run Tests` button to check that the generated output exactly matches expectations. Hint: if you get stuck, go back and look at your learning entries by clicking on the `Learning Entries` tab at the top of the page.',
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "# Print the three lines above exactly as shown\nprint()\nprint()\nprint()\n",
      },
      testCases: [
        {
          input: [null],
          expected:
            'Taylor liked your photo\nBill said "Great shot!"\n42 others also liked it',
          description: "Test Instagram notification format",
        },
      ],
      testMode: "procedure",
      functionToTest: "__main__",
    } as TestingSectionData,
    {
      kind: "MultipleSelection",
      id: "select-the-truth",
      title: "What's the Truth?",
      content: [
        {
          kind: "text",
          value:
            "Which of the following statements are true? Select all that apply.",
        },
      ],
      options: [
        'If you start a string with a `"` you have to end it with a `"`',
        "If you start a string with a `'` you can have a `'` in the middle",
        'There is no difference between "3" and 3',
        '"18" is a string and 77 is an integer',
        "Errors in Python follow a predictable pattern of where and then what",
        "You can use the `+` operator on two strings and also on two integers",
        "You can use the `-` operator on two strings and also on two integers",
      ],
      correctAnswers: [0, 3, 4, 5],
      feedback: {
        correct: "Correct!",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Information",
      id: "challenge-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "If you made it through all five lessons, congratulations. You learned to write programs using print statements, strings, and integers. If you struggled with quotation marks, got `TypeError` messages, or had to count characters on your fingers - that's completely normal. Every programmer has been there. The difference between those who succeed and those who don't isn't talent - it's persistence.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
