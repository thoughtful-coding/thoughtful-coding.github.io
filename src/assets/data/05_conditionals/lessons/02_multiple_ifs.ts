import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  ObservationSectionData,
  PRIMMSectionData,
  MultipleSelectionSectionData,
  MatchingSectionData,
  TestingSectionData,
  DebuggerSectionData,
  MultipleChoiceSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Multiple If Statements",
  guid: "e6f8g0h2-7a9b-4c5d-9e1f-5g6h7i8j9k0l" as LessonId,
  description:
    "Learn how to use multiple if statements in one function to check several conditions independently.",
  sections: [
    {
      kind: "Information",
      id: "multiple-ifs-intro",
      title: "Building on If Statements",
      content: [
        {
          kind: "text",
          value:
            "In the last lesson, you learned how to use a single `if` statement to add different paths through your functions. When a condition was True, the indented code ran. When it was False, Python skipped the indented code.\n\nBut what if you need to check multiple things? For example, what if you're creating a function that checks whether someone is old enough to vote AND old enough to drive? That's where multiple if statements come in. In this lesson, you'll learn how to use several if statements in a single function to produce more complex and interesting programs.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Observation",
      id: "two-ifs" as SectionId,
      title: "Two If Statements",
      content: [
        {
          kind: "text",
          value:
            "Let's start simple. Below is a function that checks whether someone is old enough for two different activities: driving (requires age 16 or higher) and voting (requires age 18 or higher).\n\nRun the code and pay attention to how different inputs result in different messages appearing.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def check_age(age):\n    print(f"Checking privileges for age {age}")\n\n    if age >= 16:\n        print("You can drive!")\n\n    if age >= 18:\n        print("You can vote!")\n\n    print("Check complete")\n\ncheck_age(15)\nprint("---")\ncheck_age(17)\nprint("---")\ncheck_age(19)',
      },
    } as ObservationSectionData,
    {
      kind: "PRIMM",
      id: "multiple-conditions-primm" as SectionId,
      title: "Multiple Independent Checks",
      content: [
        {
          kind: "text",
          value:
            "Below is a function that analyzes a word using three different `if` statements. Each `if` statement checks something different about the word. Predict what messages will appear for each word:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def analyze_word(word):\n    print(f"Analyzing: {word}")\n    \n    if len(word) < 5:\n        print("That\'s a short word!")\n    \n    if word == "HEY":\n        print("HEY TO YOU TOO!")\n    \n    if word == "Python":\n        print("Great programming language!")\n    \n    print("Analysis complete")\n\nanalyze_word("Hello")\nprint("---")\nanalyze_word("Python")\nprint("---")\nanalyze_word("HEY")',
      },
      predictPrompt:
        "Each if statement is checked separately. For each word, predict which messages will appear. Remember: len() gives the length of a word.",
      conclusion:
        "Each if statement runs independently! A word can trigger none, one, some, or all of the if statements depending on its properties. Python checks every single if statement, regardless of whether previous ones were True or False.",
    } as PRIMMSectionData,
    {
      kind: "MultipleChoice",
      id: "how-many-messages",
      title: "Counting Messages",
      content: [
        {
          kind: "text",
          value:
            "In the example above, you saw that `Python` triggered one message while `HEY` triggered two. This happened because each `if` is checked independently. Based on this, how many messages will be printed when you call the `check_score()` function with an input of `95`?",
        },
        {
          kind: "code",
          value:
            'def check_score(score):\n    print("Checking your score")\n    if score > 90:\n        print("Excellent!")\n    if score > 80:\n        print("Great job!")\n    if score > 70:\n        print("Good work!")\n    print("Done")\n\ncheck_score(95)',
        },
      ],
      options: [
        "2 messages (the first print and 'Done')",
        "3 messages (all the if statements trigger)",
        "4 messages (first print, two if messages, and 'Done')",
        "5 messages (all prints run)",
      ],
      correctAnswer: 3,
      feedback: {
        correct:
          "Correct! All 5 print statements run: the first one, all three if conditions are True (95 > 90, 95 > 80, and 95 > 70), and the final one. Each if is checked independently!",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Debugger",
      id: "trace-multiple-paths" as SectionId,
      title: "Tracing Multiple If Statements",
      content: [
        {
          kind: "text",
          value:
            "Let's watch the computer execute a function with multiple if statements. Step through the code slowly and watch which sections of indented code get executed and which get skipped.\n\nThe most important thing to notice: Python checks EVERY if statement, regardless of whether previous ones were True or False. It doesn't stop after finding one True condition.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def check_number(num):\n    print(f"Checking {num}")\n    \n    if num > 50:\n        print("Greater than 50")\n    \n    if num > 25:\n        print("Greater than 25")\n    \n    if num > 10:\n        print("Greater than 10")\n    \n    print("All checks complete")\n\ncheck_number(60)\nprint("---")\ncheck_number(30)\nprint("---")\ncheck_number(5)',
      },
    } as DebuggerSectionData,
    {
      kind: "MultipleSelection",
      id: "which-ifs-trigger",
      title: "Which Conditions Trigger?",
      content: [
        {
          kind: "text",
          value:
            "Look at this function. Which `print()` statements will run when you call `check_privileges()` with an input of `17`? Select all that apply.",
        },
        {
          kind: "code",
          value:
            'def check_privileges(age):\n    if age >= 18:\n        print("Can vote")\n    if age >= 16:\n        print("Can drive")\n    if age >= 13:\n        print("Can have social media")\n    if age < 13:\n        print("Too young for social media")\n\ncheck_privileges(17)',
        },
      ],
      options: [
        'print("Can vote")',
        'print("Can drive")',
        'print("Can have social media")',
        'print("Too young for social media")',
      ],
      correctAnswers: [1, 2],
      feedback: {
        correct:
          "Correct! When age is 17, the conditions 'age >= 16' and 'age >= 13' are both True, so those two messages print. The other two conditions are False.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "MultipleSelection",
      id: "true-statements",
      title: "Understanding Multiple Ifs",
      content: [
        {
          kind: "text",
          value:
            "Which of the following statements about multiple if statements are true? Select all that apply.",
        },
      ],
      options: [
        "Each if statement is checked independently",
        "Once one if condition is True, all others are skipped",
        "Multiple if conditions can all be True for the same input",
        "Python checks every if statement in the function",
        "Only the first True condition runs",
      ],
      correctAnswers: [0, 2, 3],
      feedback: {
        correct:
          "Perfect! Each if is independent, so multiple can be True. Python checks them all. Order CAN matter if the if statements modify variables, but that's more advanced. The key is that all if statements get checked.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Testing",
      id: "temp-checker" as SectionId,
      title: "Challenge: Temperature Checker",
      content: [
        {
          kind: "text",
          value:
            "Create a function `check_temp(temp)` that checks the temperature and provides multiple warnings:\n\n1. Always print 'Temperature: [temp] degrees'\n2. If temp is greater than 90, print 'Heat warning!'\n3. If temp is greater than 100, print 'Extreme heat!'\n4. Always print 'Check complete'\n\nNote: For a temperature of 105, BOTH warnings should print because 105 > 90 AND 105 > 100.\n\nTest your function with temperatures 85, 95, and 105 to see the different combinations.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def check_temp(temp):\n    # Always print the temperature\n    \n    # Check for heat warning (> 90)\n    \n    # Check for extreme heat (> 100)\n    \n    # Always print completion message\n    pass\n\n# Test your function\ncheck_temp(85)\nprint("---")\ncheck_temp(95)\nprint("---")\ncheck_temp(105)',
      },
      testCases: [
        {
          input: [85],
          expected: "Temperature: 85 degrees\nCheck complete",
          description: "Test with temp 85 (no warnings)",
        },
        {
          input: [95],
          expected: "Temperature: 95 degrees\nHeat warning!\nCheck complete",
          description: "Test with temp 95 (one warning)",
        },
        {
          input: [105],
          expected:
            "Temperature: 105 degrees\nHeat warning!\nExtreme heat!\nCheck complete",
          description: "Test with temp 105 (both warnings)",
        },
      ],
      testMode: "procedure",
      functionToTest: "check_temp",
    } as TestingSectionData,
    {
      kind: "Matching",
      id: "code-to-output" as SectionId,
      title: "Predicting Outputs",
      content: [
        {
          kind: "text",
          value:
            "Match each function call to its complete output (including all messages that will print):",
        },
        {
          kind: "code",
          value:
            'def evaluate(x):\n    if x > 100:\n        print("Big")\n    if x > 50:\n        print("Medium")\n    if x < 50:\n        print("Small")',
        },
      ],
      prompts: [
        { "evaluate(150)": '"Big" and "Medium"' },
        { "evaluate(70)": '"Medium" only' },
        { "evaluate(30)": '"Small" only' },
        { "evaluate(50)": "No messages" },
      ],
      feedback: {
        correct:
          "Excellent! You successfully traced through each if statement to determine which conditions were True for each input.",
      },
    } as MatchingSectionData,
    {
      kind: "Testing",
      id: "grade-messages" as SectionId,
      title: "Challenge: Grade Messages",
      content: [
        {
          kind: "text",
          value:
            "Create a function `check_grade(score)` that provides encouraging feedback based on a student's score:\n\n1. Always print 'Your score: [score]'\n2. If score is greater than 90, print 'Outstanding work!'\n3. If score is greater than 80, print 'Great job!'\n4. Always print 'Keep studying!'\n\nImportant: For a score of 95, BOTH 'Outstanding work!' and 'Great job!' should print because 95 is greater than both 90 and 80. This is different from letter grades where you'd only want one message - we'll learn how to do that in the next lesson.\n\nTest your function with scores 95, 85, and 75 to see the different combinations of messages.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def check_grade(score):\n    # Always print the score\n    \n    # Check for outstanding (> 90)\n    \n    # Check for great (> 80)\n    \n    # Always print encouragement\n    pass\n\n# Test your function\ncheck_grade(95)\nprint("---")\ncheck_grade(85)\nprint("---")\ncheck_grade(75)',
      },
      testCases: [
        {
          input: [95],
          expected:
            "Your score: 95\nOutstanding work!\nGreat job!\nKeep studying!",
          description: "Test with score 95 (triggers both conditions)",
        },
        {
          input: [85],
          expected: "Your score: 85\nGreat job!\nKeep studying!",
          description: "Test with score 85 (triggers one condition)",
        },
        {
          input: [75],
          expected: "Your score: 75\nKeep studying!",
          description: "Test with score 75 (triggers no conditions)",
        },
      ],
      testMode: "procedure",
      functionToTest: "check_grade",
    } as TestingSectionData,
    {
      kind: "Information",
      id: "multiple-ifs-conclusion",
      title: "When to Use Multiple Ifs",
      content: [
        {
          kind: "text",
          value:
            "Great work! You've learned how to use multiple if statements in one function. Each if statement is checked independently, which means multiple conditions can be True for the same input - like getting both 'Outstanding!' and 'Great job!' for a score of 95.\n\nBut sometimes, you don't want multiple messages. If you're assigning letter grades, a student should get exactly ONE grade (A, B, C, D, or F), not multiple. If you're checking a password, you want either 'Access granted' OR 'Access denied', not both. That's what we'll learn next: how to make your function choose between alternatives using if/else statements.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
