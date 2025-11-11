import type {
  InformationSectionData,
  Lesson,
  ObservationSectionData,
  LessonId,
  SectionId,
  PRIMMSectionData,
  MultipleChoiceSectionData,
  MatchingSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Strings vs. Integers",
  guid: "65ddff46-b4af-4443-ac0a-5b6a714e405e" as LessonId,
  description:
    "Understand the types of data that computers can operate on and see what can happen if you accidentally mix them up.",
  sections: [
    {
      kind: "Information",
      id: "introduction",
      title: "New Data Types",
      content: [
        {
          kind: "text",
          value:
            "In the previous lesson, you learned about strings and how to print them. In this lesson, we'll introduce a new **data type** and explain why it's so important to distinguish between different data types.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Observation",
      id: "print-numbers" as SectionId,
      title: "Integers",
      content: [
        {
          kind: "text",
          value:
            "Computers do more than just print words. In fact, the first computers operated solely on numbers. Therefore, we need to learn how to use numbers in our programs. We'll start with whole numbers, which Python calls **integers**.\n\nIn the example below, there's a bunch of integers being operated on. Notice the lack of quotation marks. Run the code and pay attention to what happens when you use the `+` and `*` operators on different **integers**.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "print(5)\nprint(5 + 3)\nprint(5 + 3 - 1)\nprint(10000 * 173671)",
      },
    } as ObservationSectionData,
    {
      kind: "Matching",
      id: "matching-integer-op-output" as SectionId,
      title: "Integer Operations",
      content: [
        {
          kind: "text",
          value:
            "All the operators that you learned in math class are present in Python: addition, subtraction, multiplication, division, and even exponents.\n\nSee if you can match the left side (integers and operators) with the right side (resulting integer).",
        },
      ],
      prompts: [
        { "8 * 2": "16" },
        { "8 - 2": "6" },
        { "8 / 2": "4" },
        { "8 + 2": "10" },
        { "8 ** 2": "64" },
      ],
      feedback: {
        correct:
          'Correct! The two tough ones to remember are `*` for multiplication and `**` for "raised to the power."',
      },
    } as MatchingSectionData,
    {
      kind: "PRIMM",
      id: "primm-strings-and-integers" as SectionId,
      title: "Operating on Integers and Strings",
      content: [
        {
          kind: "text",
          value:
            'Ok, now for the tricky part! It\'s important to understand the difference between strings and integers because the computers **operate on them differently**. In particular the **string** `"5"` is not the same as the **integer** `5`.\n\nBelow is a simple Python program that showcases this difference. First, predict what you think the code will do and then investigate whether your prediction was correct. Be sure to read the AI response very carefully if your prediction was incorrect.',
        },
      ],
      example: {
        visualization: "console",
        initialCode: 'print(5 + 5)\nprint("5" + "5")',
      },
      predictPrompt:
        "The two print statements above will print out different things. This is because in one case the `+` is operating on **integers** and in the other case the `+` is operating on **strings**. What do you think the will happen when you run the code?",
      conclusion:
        "When you use `+` with two **integers**, the result is addition. When you use `+` with two **strings**, the result is combining (technically called concatenation)",
    } as PRIMMSectionData,
    {
      kind: "MultipleChoice",
      id: "integers-added" as SectionId,
      title: "Operating Integers",
      content: [
        {
          kind: "text",
          value:
            "It's time to test your intuition: which of the following is the result of running `print(3 + 4)`. Notice that **both are integers**!",
        },
      ],
      options: ["7", "34", "333", "An error"],
      correctAnswer: 0,
      feedback: {
        correct:
          "Correct. When you use `+` with two integers, the result is addition.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "MultipleChoice",
      id: "strings-added" as SectionId,
      title: "Operating on Strings",
      content: [
        {
          kind: "text",
          value:
            'Which of the following is the result of running `print("3" + "4")`. Notice that **both are strings**!',
        },
      ],
      options: ["7", "34", "333", "An error"],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct. When you use `+` with two strings, the result is concatenation.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Matching",
      id: "data-types-match" as SectionId,
      title: "Identify Data Types",
      content: [
        {
          kind: "text",
          value:
            "Being able to identify the type of data is a very important skill. Match up each piece of data below with its data type.",
        },
      ],
      prompts: [
        { "'8'": "string" },
        { "16": "integer" },
        { '"hello"': "string" },
        { "-1": "integer" },
        { "'-1.188221 ** 3'": "string" },
      ],
      feedback: {
        correct: "Correct!",
      },
    } as MatchingSectionData,
    {
      kind: "Information",
      id: "integers-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "Great job! You have learned about the two main **data types** that beginning programmers need. In the next lesson you'll start to write your own programs that use these data types and learn to interpret error messages if/when something goes wrong.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
