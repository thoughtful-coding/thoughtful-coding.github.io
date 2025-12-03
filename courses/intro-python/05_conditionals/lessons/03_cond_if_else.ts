import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  ObservationSectionData,
  PRIMMSectionData,
  MultipleChoiceSectionData,
  TestingSectionData,
  MatchingSectionData,
  ReflectionSectionData,
  PredictionSectionData,
  CoverageSectionData,
  MultipleSelectionSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Two Paths: If/Else",
  guid: "c9f3d821-7b42-4e89-a634-1d8e5f9c2b47" as LessonId,
  description:
    "Learn how to create functions that choose between two different actions using if/else statements.",
  sections: [
    {
      kind: "Information",
      id: "else-intro",
      title: "One or the Other",
      content: [
        {
          kind: "text",
          value:
            "In the last two lessons, you used `if` statements to decide whether to run particular bits of code. Sometimes the indented code ran, and sometimes it didn't. Often in programming, however, you want to do something when a particular condition is not True. For example, think about a password checker. When the password is wrong, you don't want silence - you want a clear message saying 'Access denied!'. That's where `else` comes in. With `if`/`else`, your function ALWAYS does exactly one of two things. Learning to use the `else` properly gives you more control to match your programs to the situation.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Observation",
      id: "first-else" as SectionId,
      title: "Two Different Messages",
      content: [
        {
          kind: "text",
          value:
            "To show the power of `if`/`else`, we're going to recreate a program from a previous lesson: the password program. The new version is more powerful because it forces the program to go down one of two paths. This means that the program ALWAYS prints one of two messages.\n\nWatch how different inputs to the `check_password()` function go down different paths through the function. In particular, notice how depending on whether the condition is true, either the code indented under the `if` OR the code indented under the `else` runs.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def check_password(attempt):\n    print("Checking password")\n    if attempt == "cheese":\n        print("Welcome, it\'s lovely to see you")\n    else:\n        print("Get out of here!")\n\ncheck_password("CHEESE")\nprint("-+-+-+-+-+-")\ncheck_password("cheese")\nprint("-+-+-+-+-+-")\ncheck_password("crackers")\nprint("-+-+-+-+-+-")\ncheck_password("pizza")',
      },
    } as ObservationSectionData,
    {
      kind: "MultipleSelection",
      id: "else-behavior",
      title: "Understanding If/Else Structure",
      content: [
        {
          kind: "text",
          value:
            "In the password checker above, notice the structure: the `if` and the `else` are lined up at the same indentation level, and the code under each one is indented further. Based on what you observed, select all the statements that are true:",
        },
      ],
      options: [
        "The `else` block runs only when the `if` condition is False",
        "Both the `if` and `else` blocks can run for the same input",
        "The `if` and `else` must be at the same indentation level",
        "Every input triggers exactly one of the two blocks",
        "The code inside `if` part must be indented",
        "The code inside `else` part must be indented",
      ],
      correctAnswers: [0, 2, 3, 4, 5],
      feedback: {
        correct:
          "Perfect! The `if` and `else` are partners that guarantee exactly one path is taken. Indentation shows Python which code belongs to which block.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Coverage",
      id: "age-coverage" as SectionId,
      title: "Make It Print That!",
      content: [
        {
          kind: "text",
          value:
            "The code below is a simple function that determines, based on age, whether you're an adult or a minor. An `if`/`else` is perfect for this situation because you can only be one of these two things. It's a \"binary\" choice. Provide ages that will produce each output shown:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def categorize_age(age):\n    if age < 18:\n        print("You\'re a minor")\n    else:\n        print("You\'re an adult")',
      },
      testMode: "procedure",
      functionToTest: "categorize_age",
      coverageTable: {
        columns: [
          {
            variableName: "age",
            variableType: "number",
          },
        ],
        rows: [
          {
            fixedInputs: {},
            expectedOutput: "You're a minor",
            hint: "What age is less than 18?",
          },
          {
            fixedInputs: {},
            expectedOutput: "You're an adult",
            hint: "What age is 18 or more?",
          },
        ],
      },
    } as CoverageSectionData,
    {
      kind: "MultipleChoice",
      id: "boundary-question",
      title: "Testing Boundaries",
      content: [
        {
          kind: "text",
          value:
            "In the age categorizer above, the condition checks `if age < 18`. What happens when age is exactly 18?",
        },
      ],
      options: [
        "It prints 'You're a minor' because 18 is close to being under 18",
        "It prints 'You're an adult' because 18 < 18 is False",
        "It prints both messages",
        "It prints neither message",
      ],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! Since 18 < 18 is False, the else block runs. Testing boundary values (like exactly 18) is crucial for making sure your conditionals work correctly!",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Testing",
      id: "fix-student-errors" as SectionId,
      title: "Challenge: Fix the Errors",
      content: [
        {
          kind: "text",
          value:
            "There are TWO errors in this student checker function. Your job is to fix both errors so the function works correctly. The function should print 'Good luck on your tests!' for students and 'Pay your rent!' for non-students.\n\nHints:\n- One error involves the comparison operator\n- One error involves indentation",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def check_student(answer):\n    if answer.lower() = "yes":\n        print("Good luck on your tests!")\n        else:\n        print("Pay your rent!")\n\ncheck_student("yes")\nprint("---")\ncheck_student("no")',
      },
      testCases: [
        {
          input: ["yes"],
          expected: "Good luck on your tests!",
          description: "Test with yes",
        },
        {
          input: ["YES"],
          expected: "Good luck on your tests!",
          description: "Test with YES (case insensitive)",
        },
        {
          input: ["no"],
          expected: "Pay your rent!",
          description: "Test with no",
        },
      ],
      testMode: "procedure",
      functionToTest: "check_student",
    } as TestingSectionData,
    {
      kind: "Prediction",
      id: "pass-fail-prediction" as SectionId,
      title: "Pass or Fail",
      content: [
        {
          kind: "text",
          value:
            "After fixing the errors above, you should have a better sense of how if/else works. Now let's practice predicting outputs. This function determines if a student passes or fails:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def check_pass(score):\n    if score >= 60:\n        print("Pass!")\n    else:\n        print("Retake!")',
      },
      testMode: "procedure",
      functionToTest: "check_pass",
      predictionTable: {
        columns: [{ variableName: "score", variableType: "number" }],
        rows: [
          { inputs: [59] },
          { inputs: [60] },
          { inputs: [61] },
          { inputs: [100] },
        ],
      },
    } as PredictionSectionData,
    {
      kind: "PRIMM",
      id: "volume-check-primm" as SectionId,
      title: "Checking Volume",
      content: [
        {
          kind: "text",
          value:
            "This function checks if someone is SHOUTING by seeing if their text is all uppercase. Predict what each function call will print:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def check_volume(word):\n    if word.upper() == word:\n        print("OK ALREADY!")\n    else:\n        print("At least you were polite.")\n\ncheck_volume("HELLO")\nprint("---")\ncheck_volume("hello")\nprint("---")\ncheck_volume("Hello")',
      },
      predictPrompt:
        "The condition `word.upper() == word` checks if the word is already all uppercase. Which words will trigger the shouting message?",
      conclusion:
        "The check is True only when the word is already all capitals. 'HELLO' uppercased is still 'HELLO', so they're equal. But 'Hello' uppercased becomes 'HELLO', which is different from 'Hello'!",
    } as PRIMMSectionData,
    {
      kind: "Matching",
      id: "if-else-pairs" as SectionId,
      title: "If/Else Partnerships",
      content: [
        {
          kind: "text",
          value: "Match each if condition with what its else block handles:",
        },
      ],
      prompts: [
        { "if age >= 18:": "else handles anyone under 18" },
        { "if name == 'Alice':": "else handles any name that isn't Alice" },
        { "if score > 90:": "else handles scores 90 and below" },
        {
          "if password.lower() == 'secret':":
            "else handles any password that isn't 'secret' (case-insensitive)",
        },
        { "if temp < 0:": "else handles temperatures 0 and above" },
      ],
      feedback: {
        correct:
          "Perfect! The else always handles everything the if condition doesn't catch. Together, they cover ALL possibilities.",
      },
    } as MatchingSectionData,
    {
      kind: "Testing",
      id: "temperature-advisor" as SectionId,
      title: "Challenge: Temperature Advisor",
      content: [
        {
          kind: "text",
          value:
            "Create a function `temperature_advice(temp)` that gives clothing advice:\n1. If temp is less than 50, prints 'Wear a coat!'\n2. Otherwise, prints 'No coat needed!'\n\nMake sure to test with temperatures on both sides of the boundary (like 49, 50, and 51) to ensure your function works correctly.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def temperature_advice(temp):\n    # Check if temp < 50\n    # Print appropriate advice\n    pass\n\n# Test your function\ntemperature_advice(45)\nprint("---")\ntemperature_advice(50)\nprint("---")\ntemperature_advice(65)',
      },
      testCases: [
        {
          input: [45],
          expected: "Wear a coat!",
          description: "Test with cold temperature",
        },
        {
          input: [50],
          expected: "No coat needed!",
          description: "Test boundary at exactly 50",
        },
        {
          input: [65],
          expected: "No coat needed!",
          description: "Test with warm temperature",
        },
      ],
      testMode: "procedure",
      functionToTest: "temperature_advice",
    } as TestingSectionData,
    {
      kind: "Reflection",
      id: "if-else-reflection" as SectionId,
      title: "If/Else Reflection",
      content: [
        {
          kind: "text",
          value:
            "If/else statements create exactly two paths through your function. Every input must take exactly one path - never both, never neither. This guarantees complete coverage of all possibilities.\n\nCreate a simple function with an if/else statement and explain how it ensures every input gets exactly one response. Remember to use the phrase 'as seen in the example above'.",
        },
      ],
      topic: "How If/Else Guarantees One Path",
      isTopicPredefined: true,
      code: "Create a function with if/else that handles all inputs",
      isCodePredefined: false,
      explanation:
        "Explain how your if/else ensures exactly one path is taken (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "else-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "Great work! You've learned how if/else creates two mutually exclusive paths through your code. You discovered:\n- `else` runs when the `if` condition is False\n- Every input takes exactly ONE path - never both, never neither\n- The if and else must line up at the same indentation level\n- Testing boundary values (like exactly 18 or exactly 25) is important\n- How to work backwards from desired outputs to inputs\n\nBut what if you have more than two options? What about letter grades (A, B, C, D, F) or traffic lights (red, yellow, green)? That's what we'll learn next with `elif` statements!",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
