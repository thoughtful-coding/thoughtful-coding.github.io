import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  PRIMMSectionData,
  MultipleChoiceSectionData,
  MultipleSelectionSectionData,
  TestingSectionData,
  ReflectionSectionData,
  MatchingSectionData,
  DebuggerSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Making Decisions",
  guid: "b4e7c932-5a81-4d29-9c73-8f2e4b7a1d36" as LessonId,
  description:
    "Learn how to make your functions choose different actions based on their inputs using if statements.",
  sections: [
    {
      kind: "Information",
      id: "decisions-intro",
      title: "Functions That React",
      content: [
        {
          kind: "text",
          value:
            'So far, every function you\'ve written acts in a very predictable way. Given the same input, the function will produce the same output. But real programs need to make decisions. For example, what if you want to program a clock that says "Good morning" and "Good night" at the proper times?\n\nThat\'s where `if` statements come in. An `if` statement lets your program choose which lines of code to run based on the situation. It\'s like teaching your functions to react to the real world.',
        },
      ],
    } as InformationSectionData,
    {
      kind: "PRIMM",
      id: "first-if" as SectionId,
      title: "Your First `if` Statement",
      content: [
        {
          kind: "text",
          value:
            "Below is a `check_temp()` function that contains an `if` statement. The function is then called three times with different inputs. Take a few minutes to read the code and then predict what will happen:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def check_temp(temp):\n    print(f"The temp is {temp} degrees")\n    if temp > 30:\n        print("It\'s hot outside!")\n    print("Temp check complete")\n\ncheck_temp(35)\nprint("-+-+-+-+-+-")\ncheck_temp(20)\nprint("-+-+-+-+-+-")\ncheck_temp(31)',
      },
      predictPrompt: "Which function calls will print `It's hot outside!`?",
      conclusion:
        "When the condition is True, the indented code runs. When False, Python skips it.",
    } as PRIMMSectionData,
    {
      kind: "MultipleChoice",
      id: "when-prints",
      title: "When Does It Print?",
      content: [
        {
          kind: "text",
          value:
            "In the code above, when does the message `It's hot outside!` get printed?",
        },
      ],
      options: [
        "Every time the function is called",
        "Never - it's just there for show",
        "Only when `temp` is greater than 30",
        "Only when `temp` equals exactly 30",
      ],
      correctAnswer: 2,
      feedback: {
        correct:
          "Correct! The `if` statement checks `if temp > 30`. When this condition is True, the indented code runs. When it's False, Python skips it!",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Debugger",
      id: "string-comparison-primm" as SectionId,
      title: "Comparing Strings",
      content: [
        {
          kind: "text",
          value:
            "`if` statements work by only running code under certain conditions. If the conditions match expectations, then the indented code under the `if` statement is run. Otherwise, the indented code is skipped and the computer jumps to the code after the indentation.\n\nBelow is a small program that checks whether you have the proper password. Use the debugger to step through each line of the program. The most important thing to notice is how the computer goes down different paths depending on the input.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def check_password(attempt):\n    print(f"Checking the password")\n    if attempt == "cheese":\n        print("Welcome, it\'s lovely to see you")\n    print("Done checking")\n\ncheck_password("cheese")\nprint("---")\ncheck_password("pizza")\nprint("---")\ncheck_password("cheesy!")',
      },
    } as DebuggerSectionData,
    {
      kind: "Matching",
      id: "matching-comparisons" as SectionId,
      title: "New Operations",
      content: [
        {
          kind: "text",
          value:
            'Something interesting happened in the previous few examples. Basically, the values of different variables were "compared" to determine if a bit of code should run or not. If `temp > 30` and if `attempt == "cheese"` were **true**, then the code indented under the `if` statement **was run**. If `temp > 30` and if `attempt == "cheese"` were **not true**, then the code indented under the `if` statement **was skipped**. \n\nPython gives you a bunch of different ways to compare data (you\'ve already seen two). See if you can match the "comparisons" with what they mean:',
        },
      ],
      prompts: [
        { "`if x > y:`": "If the value in x is **greater than** y" },
        {
          "`if x >= y:`": "If the value in x is **greater than or equal to** y",
        },
        { "`if x < y:`": "If the value in x is **less than** y" },
        { "`if x <= y:`": "If the value in x is **less than or equal to** y" },
        { "`if x == y:`": "If the value in x is **equal to** y" },
        { "`if x != y:`": "If the value in x is **not equal to** y" },
      ],
      feedback: {
        correct:
          'Perfect! Conditionals all you to determine under which conditions code "within" an `if` statement should run.',
      },
    } as MatchingSectionData,
    {
      kind: "MultipleChoice",
      id: "equals-comparison",
      title: "One Equals or Two?",
      content: [
        {
          kind: "text",
          value:
            "One thing that's a little weird in the question above is the use of `==`. The question is, why are there two equal signs? In previous lessons, we've seen single equal signs: `=`. What's the difference between `=` and `==` in Python?",
        },
      ],
      options: [
        "They do the same thing",
        "`=` assigns a value to a variable, `==` checks if two things are equal",
        "`==` assigns a value to a variable, `=` checks if two things are equal",
        "`=` is for numbers, `==` is for strings",
      ],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! Use `=` to store values in variables (like `x = 5`). Use `==` to check if things are equal in an if statement (like `if x == 5`).",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Matching",
      id: "if-format-checker" as SectionId,
      title: "Common Mistakes",
      content: [
        {
          kind: "text",
          value:
            '`if` statements have a very particular syntax. Similar to functions, they have some code "within" them (indented) that only runs under certain conditions. See if you can match the `if` statement attempts below with the common mistake they illustrate:',
        },
      ],
      prompts: [
        {
          '```if x == y\n  print("Equal")```':
            "Missing colon at the end of the `if` statement",
        },
        { '```if x = y:\n  print("Equal")```': 'Incorrect "equality" check' },
        {
          '```If x == y\n  print("Equal")```':
            "Improperly capitalize if statement",
        },
        {
          'if x == y:\nprint("Equal")': "Incorrect indentation",
        },
        {
          'if x > x:\n  print("Equal")': "Incorrect comparison of variables",
        },
      ],
    } as MatchingSectionData,
    {
      kind: "Matching",
      id: "age-checker" as SectionId,
      title: "Challenge: Age Checker",
      content: [
        {
          kind: "text",
          value:
            "Now it's time to see if you can create your own function that uses conditionals. Since it's your first attempt, we'll provide the code and then leave it up to you to put the lines in the proper order.\n\nCreate a function `check_voting_age(age)` that:\n1. Prints the person's age\n2. If the age is 18 or greater, prints 'You can vote!'\n3. Always prints 'Thank you for checking'",
        },
      ],
      prompts: [
        { "Line 1": "def check_voting_age(age):" },
        { "Line 2": "print(age)" },
        { "Line 3": "if age >= 18:" },
        { "Line 4": "  print('You can vote!')" },
        { "Line 5": 'print("Thank you for checking")' },
      ],
    } as MatchingSectionData,
    {
      kind: "MultipleSelection",
      id: "greater-equal-check",
      title: "Greater or Equal",
      content: [
        {
          kind: "text",
          value:
            "If a function has the line `if score >= 90:`, which of these function calls will trigger the `if` statement? Select all that apply.",
        },
      ],
      options: [
        "check_score(0)",
        "check_score(89)",
        "check_score(90)",
        "check_score(91)",
        "check_score(100)",
        "check_score(900)",
      ],
      correctAnswers: [2, 3, 4, 5],
      feedback: {
        correct:
          "Correct! The >= operator means 'greater than or equal to', so 90 and anything above 90 will trigger the if statement. 89 is not included!",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Testing",
      id: "grade-messages" as SectionId,
      title: "Challenge: Grade Messages",
      content: [
        {
          kind: "text",
          value:
            "Now it's time to see if you can write a function with conditionals without any help. Create a function `check_temp(temp)` that:\n1. Always prints `The temp is [temp] degrees`\n2. If the temp is **less than** 32, also prints `It's cold outside!`\n3. Always prints `Temp check complete`\n\nWhile you're writing your program, remember to indent the code inside the `if` statement and to include `:` in the proper places.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def check_temp(temp):\n    # Always print the temp\n    \n    # Check for if it\'s cold (< 32)\n    \n    # Always print encouragement\n    pass\n\n# Test your function\ncheck_temp(75)\nprint("---")\ncheck_temp(30)\nprint("---")\ncheck_temp(-44)',
      },
      testCases: [
        {
          input: [33],
          expected: "The temp is 33 degrees\nTemp check complete",
          description: "Test with temp 33",
        },
        {
          input: [32],
          expected: "The temp is 32 degrees\nTemp check complete",
          description: "Test with temp 32",
        },
        {
          input: [31],
          expected:
            "The temp is 31 degrees\nIt's cold outside!\nTemp check complete",
          description: "Test temp 31",
        },
      ],
      testMode: "procedure",
      functionToTest: "check_temp",
    } as TestingSectionData,
    {
      kind: "Reflection",
      id: "if-statement-reflection" as SectionId,
      title: "If Statements Reflection",
      content: [
        {
          kind: "text",
          value:
            "`if` statements let your functions make decisions. The code inside an `if` statement only runs when the condition is True. You can use `if` statements to add optional behavior, check boundaries, or respond differently to different inputs.\n\nCreate a simple example with at least one `if` statement in a function, and explain how it controls which code runs. Remember to use the phrase 'as seen in the example above'.",
        },
      ],
      topic: "How If Statements Control Code",
      isTopicPredefined: true,
      code: "Create a function with at least one if statement",
      isCodePredefined: false,
      explanation:
        "Explain how your `if` statement decides what code runs (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "if-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "Great work! You've learned how to make your functions think and decide. You discovered:\n- If statements check a condition and run code only when it's True\n- The == operator checks if two things are exactly equal\n- The >= and > operators compare numbers\n- Indentation shows what code belongs inside the if statement\n\nSo far, your functions can make decisions about what TO do. But what if you want to choose between doing one thing OR another? That's what we'll explore in the next lesson with if/else statements!",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
