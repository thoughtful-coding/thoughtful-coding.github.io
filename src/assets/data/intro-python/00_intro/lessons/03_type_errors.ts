import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  PRIMMSectionData,
  MatchingSectionData,
  ReflectionSectionData,
  MultipleChoiceSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Interpreting Errors",
  guid: "933ff0c7-8c35-4786-86eb-649c02be6a3c" as LessonId,
  description:
    "Learn to interpret the errors that Python finds in your code so you can easily fix it.",
  sections: [
    {
      kind: "Information",
      id: "type-errors-intro",
      title: "Introduction",
      content: [
        {
          kind: "text",
          value:
            "In the previous lesson you learned about different data types and how different operators affect them. In this lesson, you will see what happens when you accidentally mix up the data types.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "PRIMM",
      id: "primm-type-errors" as SectionId,
      title: "Data Type Mixup",
      content: [
        {
          kind: "text",
          value:
            "The first two lines of the program below do things we've seen before. Using a `+` on two integers results in addition. Using a `+` on two strings results in concatenation.\n\nSomething new is happening on the third line of the program, however. We're using a `+` on the integer `3` and the string `\"4\"`. First, predict what you think the code will do and then investigate whether your prediction is correct. Be sure to read the AI response afterwards very carefully if your prediction was incorrect.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'print(3 + 3)\nprint("a" + "b")\nprint(3 + "4")\nprint("All done!")\n',
      },
      predictPrompt:
        "We are trying to do use the `+` operator on a string and an integer. What do you think will happen when you run the code?",
      conclusion:
        "Error messages can be overwhelming! Read the next section carefully for how to approach them.",
    } as PRIMMSectionData,
    {
      kind: "Information",
      id: "understanding-type-errors" as SectionId,
      title: "Understanding TypeErrors",
      content: [
        {
          kind: "text",
          value:
            "Getting errors while you're writing a program is very common. You saw a `SyntaxError` in the lesson about single and double quotes. Here you're seeing a `TypeError`. Learning how to interpret errors will save you **a ton of time** later.\n\nThe error above is trying to tell you two things: where and what the issue is.\n- Where\n    - The second to last line of the error shows what line of code has the problem\n    - The error above says \"line 3\", which makes sense this was the line that was added\n- What\n    - The last line of the error shows was the actual problem is\n    - The error above says the problem is that we're the `+` operation can't handle two different data types",
        },
      ],
    } as InformationSectionData,
    {
      kind: "MultipleChoice",
      id: "type-error-interpretation",
      title: "TypeError Interpretation",
      content: [
        {
          kind: "text",
          value: `Let's see if you can interpret an error to figure out _where_ the issue is:\n\`\`\`\nTypeError: Traceback (most recent call last):
  File "/lib/python311.zip/_pyodide/_base.py", line 573, in eval_code_async
    await CodeRunner(
  File "/lib/python311.zip/_pyodide/_base.py", line 393, in run_async
    coroutine = eval(self.code, globals, locals)
                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<exec>", line 117, in <module>
TypeError: unsupported operand type(s) for +: 'int' and 'str'\n\`\`\``,
        },
      ],
      options: ["line 573", "line 393", "line 117", "line 1"],
      correctAnswer: 2,
      feedback: {
        correct:
          "Correct! The second to last line of the error message gives you the line",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "MultipleChoice",
      id: "syntax-error-interpretation",
      title: "SyntaxError Interpretation",
      content: [
        {
          kind: "text",
          value: `All errors follow the same basic format. For example, look at the following \`SyntaxError\`. As you saw in the first lesson, these occur when your program is written incorrectly. What is the following \`SyntaxError\` trying to communicate?\n\`\`\`\nSyntaxError: Traceback (most recent call last):
  File "/lib/python311.zip/_pyodide/_base.py", line 573, in eval_code_async
    await CodeRunner(
          ^^^^^^^^^^^
  File "/lib/python311.zip/_pyodide/_base.py", line 267, in __init__
    self.ast = next(self._gen)
               ^^^^^^^^^^^^^^^
  File "/lib/python311.zip/_pyodide/_base.py", line 145, in _parse_and_compile_gen
    mod = compile(source, filename, mode, flags | ast.PyCF_ONLY_AST)
          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<exec>", line 2
    SyntaxError: unterminated string literal print('hi)`,
        },
      ],
      options: [
        "There's an error on line 573 because there's a missing space",
        "There's an error on line 393 because there's a `*` instead of a `+`",
        "There's an error on line 2 because there's a missing end quote",
        "There's an error on line 145 because there's a missing parentheses",
      ],
      correctAnswer: 2,
      feedback: {
        correct:
          "Correct! The program should be `print('hi')` instead of `print('hi)`",
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
            'Having experimented with different data types, different operations, and the different errors that can be "raised" if you make a mistake, match each of the following bits of code with their result:',
        },
      ],
      prompts: [
        { "5 + 3": "8" },
        { '"5" + "3"': '"53"' },
        { '5 + "3"': "TypeError: unsupported operand type(s) for +" },
        { "5 - 3": "2" },
        { '5 - "3"': "TypeError: unsupported operand type(s) for -" },
        { '"5" + "3': "SyntaxError: unterminated string" },
      ],
    } as MatchingSectionData,
    {
      kind: "Reflection",
      id: "data-type-reflection" as SectionId,
      title: "Data Type Reflection",
      content: [
        {
          kind: "text",
          value:
            "Identifying the **data types** that are being operated on is crucial in understanding how Python works. Accidentally mixing up data types (and getting an error because of it) is one of the biggest sources of frustration for people who are learning to code.\n\nNow it's time to reflect to formalize your knowledge. Create a simple 2-3 line code example that demonstrates the difference between strings and integers, and write 3-4 sentences explaining how the example works.",
        },
      ],
      topic: "Strings vs. Integers",
      isTopicPredefined: true,
      code: "Create a simple example that demonstrates this topic",
      isCodePredefined: false,
      explanation: "Explain how your example works (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "reflection-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "Congratulations on the lesson on errors in Python. As stated above, it is a major source of confusion and frustration. If you ever see a `TypeError`, take your time and think about what line the error is identifying as the problem and what data types are on that line.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
