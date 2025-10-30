import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  PRIMMSectionData,
  MultipleChoiceSectionData,
  TestingSectionData,
  MatchingSectionData,
  ReflectionSectionData,
  PredictionSectionData,
  CoverageSectionData,
  MultipleSelectionSectionData,
  DebuggerSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Multiple Paths: Elif",
  guid: "d8a4e732-9f51-4c83-b821-6e7d3f8c9a42" as LessonId,
  description:
    "Learn how to create functions with three or more different paths using elif statements.",
  sections: [
    {
      kind: "Information",
      id: "elif-intro",
      title: "More Than Two Choices",
      content: [
        {
          kind: "text",
          value:
            "In the last lesson, you learned `if`/`else` for choosing between two paths. But life isn't always binary. Think about traffic lights - they're not just red or green, there's yellow too! Or letter grades - you don't just pass or fail; you get A, B, C, D, or F.\n\nThat's where `elif` comes in (short for 'else if'). It lets you check multiple conditions in order, creating as many paths through your code as you need.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Debugger",
      id: "traffic-light-debugger" as SectionId,
      title: "Three Paths",
      content: [
        {
          kind: "text",
          value:
            "Below is a traffic light function with three possible messages. Notice the new `elif` keyword (short for 'else if'). Step through the code slowly and watch which path the computer takes for each color.\n\nPay special attention to:\n- How Python checks the conditions in order\n- Which blocks of code get skipped\n- What happens with 'purple' which isn't red or yellow",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def check_light(color):\n    if color == "red":\n        print("STOP!")\n    elif color == "yellow":\n        print("Slow down!")\n    else:\n        print("Go!")\n\ncheck_light("red")\nprint("---")\ncheck_light("yellow")\nprint("---")\ncheck_light("green")\nprint("---")\ncheck_light("purple")',
      },
    } as DebuggerSectionData,
    {
      kind: "MultipleChoice",
      id: "elif-else-difference",
      title: "Elif vs Else",
      content: [
        {
          kind: "text",
          value:
            "In the traffic light above, both `elif` and `else` created alternative paths. What's the difference between them?",
        },
      ],
      options: [
        "There is no difference - they do the same thing",
        "elif checks a condition, else catches everything remaining",
        "else checks a condition, elif catches everything remaining",
        "elif can only be used once, else can be used many times",
      ],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! elif requires a condition to check (like `elif color == 'yellow'`), while else catches everything that didn't match previous conditions. You can have many elifs but only one else!",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "PRIMM",
      id: "grade-system-primm" as SectionId,
      title: "Order Matters!",
      content: [
        {
          kind: "text",
          value:
            "The traffic light had three paths, but you can have as many as you need! Below is a grading system with FIVE different paths. This example introduces a crucial concept: **the order of your conditions matters**.\n\nThink about this carefully: if a student scores 85, that score is greater than or equal to 90? No. Greater than or equal to 80? Yes! Python stops checking as soon as it finds the first True condition. This means the order you write your elif statements determines which path gets taken.\n\nPredict what will happen for each score:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def get_grade(score):\n    if score >= 90:\n        print("A")\n    elif score >= 80:\n        print("B")\n    elif score >= 70:\n        print("C")\n    elif score >= 60:\n        print("D")\n    else:\n        print("F")\n\nget_grade(95)\nprint("---")\nget_grade(85)\nprint("---")\nget_grade(55)',
      },
      predictPrompt:
        "Why do we check >= 90 BEFORE >= 80? What would happen if we checked >= 60 first and a student scored 85?",
      conclusion:
        "Order is crucial! If we checked >= 60 first, a score of 85 would match that condition and print 'D' instead of 'B'. Python stops at the FIRST True condition. For number ranges, always check from most extreme to least extreme (highest to lowest, or lowest to highest).",
    } as PRIMMSectionData,
    {
      kind: "MultipleSelection",
      id: "first-match-wins",
      title: "Which Conditions Are Checked?",
      content: [
        {
          kind: "text",
          value:
            "The grading system above showed that Python stops at the first True condition. If score = 85, which conditions does Python actually check? Select all that apply.",
        },
        {
          kind: "code",
          value:
            'def get_grade(score):\n    if score >= 90:\n        print("A")\n    elif score >= 80:\n        print("B")\n    elif score >= 70:\n        print("C")\n    else:\n        print("F")',
        },
      ],
      options: [
        "score >= 90 (checked, result: False)",
        "score >= 80 (checked, result: True, then stops)",
        "score >= 70 (never checked because >= 80 was True)",
        "The else (never reached because >= 80 was True)",
      ],
      correctAnswers: [0, 1, 2, 3],
      feedback: {
        correct:
          "Perfect! Python checks >= 90 (False), then >= 80 (True), prints 'B', and stops. The >= 70 and else are never even evaluated. This is why order matters!",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Prediction",
      id: "grade-prediction" as SectionId,
      title: "Predict the Grades",
      content: [
        {
          kind: "text",
          value:
            "Now that you understand how elif works, predict which grade each score will receive:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def assign_grade(score):\n    if score >= 90:\n        print("A")\n    elif score >= 80:\n        print("B")\n    elif score >= 70:\n        print("C")\n    elif score >= 60:\n        print("D")\n    else:\n        print("F")',
      },
      testMode: "procedure",
      functionToTest: "assign_grade",
      predictionTable: {
        columns: [{ variableName: "score", variableType: "number" }],
        rows: [
          { inputs: [100] },
          { inputs: [90] },
          { inputs: [89] },
          { inputs: [70] },
          { inputs: [59] },
        ],
      },
    } as PredictionSectionData,
    {
      kind: "Coverage",
      id: "size-coverage" as SectionId,
      title: "Working Backwards",
      content: [
        {
          kind: "text",
          value:
            "So far, you've been predicting outputs given inputs. Now let's flip it around and work backwards: given a desired output, what input would produce it?\n\nThis is a valuable debugging skill. When your program isn't working correctly, you need to think: 'What input would make it go down this path?' Understanding the boundaries between conditions (like the difference between 9 and 10, or 19 and 20) is crucial.\n\nProvide measurements that will produce each size category:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def get_size(measurement):\n    if measurement < 10:\n        print("Small")\n    elif measurement < 20:\n        print("Medium")\n    elif measurement < 30:\n        print("Large")\n    else:\n        print("Extra Large")',
      },
      testMode: "procedure",
      functionToTest: "get_size",
      coverageTable: {
        columns: [
          {
            variableName: "measurement",
            variableType: "number",
          },
        ],
        rows: [
          {
            fixedInputs: {},
            expectedOutput: "Small",
            hint: "Less than 10",
          },
          {
            fixedInputs: {},
            expectedOutput: "Medium",
            hint: "10 to 19",
          },
          {
            fixedInputs: {},
            expectedOutput: "Large",
            hint: "20 to 29",
          },
          {
            fixedInputs: {},
            expectedOutput: "Extra Large",
            hint: "30 or more",
          },
        ],
      },
    } as CoverageSectionData,
    {
      kind: "Testing",
      id: "temperature-advisor" as SectionId,
      title: "Challenge: Temperature Advisor",
      content: [
        {
          kind: "text",
          value:
            "Create a function `temperature_advice(temp)` with four temperature categories:\n1. If temp < 0: prints 'Freezing! Stay inside!'\n2. Elif temp < 15: prints 'Cold - wear a coat'\n3. Elif temp < 25: prints 'Nice weather!'\n4. Else: prints 'Hot - stay hydrated'\n\nRemember: order matters! Check from most specific to least specific.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "def temperature_advice(temp):\n    # Four different temperature ranges\n    # Remember: check lowest temperatures first!\n    pass\n\n# Test different temperatures\ntemperature_advice(-5)\nprint('---')\ntemperature_advice(10)\nprint('---')\ntemperature_advice(20)\nprint('---')\ntemperature_advice(30)",
      },
      testCases: [
        {
          input: [-5],
          expected: "Freezing! Stay inside!",
          description: "Test freezing",
        },
        {
          input: [10],
          expected: "Cold - wear a coat",
          description: "Test cold",
        },
        {
          input: [20],
          expected: "Nice weather!",
          description: "Test nice",
        },
        {
          input: [30],
          expected: "Hot - stay hydrated",
          description: "Test hot",
        },
      ],
      testMode: "procedure",
      functionToTest: "temperature_advice",
    } as TestingSectionData,
    {
      kind: "Matching",
      id: "elif-order" as SectionId,
      title: "Correct Order",
      content: [
        {
          kind: "text",
          value:
            "The temperature advisor above had four conditions checking ranges of temperatures. You had to order them from coldest to hottest (< 0, then < 15, then < 25, then everything else).\n\nThe same principle applies to grading, but in reverse: you check from highest score to lowest. This is because you want to catch the best grades first before checking for lower ones.\n\nMatch each condition to its correct position in a properly ordered grade function:",
        },
      ],
      prompts: [
        { First: "if score >= 90:" },
        { Second: "elif score >= 80:" },
        { Third: "elif score >= 70:" },
        { Fourth: "else:" },
      ],
      feedback: {
        correct:
          "Correct! You must check from highest to lowest score, with else catching everything below 70. This ensures an 85 gets a B (matching >= 80) rather than incorrectly matching a lower threshold first.",
      },
    } as MatchingSectionData,
    {
      kind: "Testing",
      id: "game-difficulty" as SectionId,
      title: "Challenge: Game Difficulty",
      content: [
        {
          kind: "text",
          value:
            "Create a function `select_difficulty(choice)` that handles four difficulty levels:\n1. If choice is 'easy' (case-insensitive): prints 'You have 10 lives'\n2. Elif choice is 'medium': prints 'You have 5 lives'\n3. Elif choice is 'hard': prints 'You have 3 lives'\n4. Elif choice is 'extreme': prints 'You have 1 life - good luck!'\n5. Else: prints 'Invalid choice'\n\nUse .lower() to handle any capitalization!",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "def select_difficulty(choice):\n    # Convert to lowercase\n    # Check each difficulty level\n    # Handle invalid input\n    pass\n\n# Test your function\nselect_difficulty('EASY')\nprint('---')\nselect_difficulty('Medium')\nprint('---')\nselect_difficulty('hard')\nprint('---')\nselect_difficulty('nightmare')",
      },
      testCases: [
        {
          input: ["EASY"],
          expected: "You have 10 lives",
          description: "Test easy",
        },
        {
          input: ["medium"],
          expected: "You have 5 lives",
          description: "Test medium",
        },
        {
          input: ["Hard"],
          expected: "You have 3 lives",
          description: "Test hard",
        },
        {
          input: ["nightmare"],
          expected: "Invalid choice",
          description: "Test invalid",
        },
      ],
      testMode: "procedure",
      functionToTest: "select_difficulty",
    } as TestingSectionData,
    {
      kind: "Reflection",
      id: "elif-reflection" as SectionId,
      title: "Multiple Paths Reflection",
      content: [
        {
          kind: "text",
          value:
            "`elif` statements let you create multiple paths through your code. Python checks each condition in order and runs the FIRST one that's True, then skips the rest.\n\nCreate a function with at least 3 different paths (`if`, at least one `elif`, and `else`) and explain how the order of conditions matters. Remember to use the phrase 'as seen in the example above'.",
        },
      ],
      topic: "How `elif` Creates Multiple Branches",
      isTopicPredefined: true,
      code: "Create a function with `if`, at least one `elif`, and `else`",
      isCodePredefined: false,
      explanation:
        "Explain how `elif` checks conditions in order and why order matters (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "elif-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "Excellent work! You've learned how to create functions with multiple paths using `elif`. Key takeaways:\n- `elif` creates additional paths between if and else\n- Python checks conditions from top to bottom\n- The FIRST True condition wins - all others are skipped\n- Order matters! Check more specific or extreme conditions first\n- You can have as many `elif` statements as needed\n- Every input takes exactly ONE path through your code\n\nYou can now handle any number of choices: two paths (`if`/`else`), three paths (`if`/`elif`/`else`), or many paths (`if`/`elif`/`elif`.../`else`).\n\nIn the next lesson, you'll learn about boolean operators that let you check multiple things at once - like requiring BOTH a password AND permission, or offering discounts to students OR seniors.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
