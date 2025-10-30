import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  PRIMMSectionData,
  MultipleChoiceSectionData,
  MultipleSelectionSectionData,
  TestingSectionData,
  MatchingSectionData,
  ReflectionSectionData,
  PredictionSectionData,
  CoverageSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Combining Conditions",
  guid: "e5b6f823-4d71-4a92-bc58-9f2e6d8a7c31" as LessonId,
  description:
    "Learn how to combine multiple conditions using and, or, and not to create sophisticated decision-making.",
  sections: [
    {
      kind: "Information",
      id: "boolean-intro",
      title: "Checking Multiple Things",
      content: [
        {
          kind: "text",
          value:
            "So far, your conditionals have checked one thing at a time: `if age >= 18:` or `if score > 90:`. But sometimes you need to check multiple things at once.\n\nThink about a roller coaster: you need to be tall enough AND old enough to ride. Or think about movie theater discounts: you get a discount if you're a student OR a senior citizen.\n\nThat's where **boolean operators** come in. They let you combine conditions:\n- `and`: BOTH conditions must be True\n- `or`: AT LEAST ONE condition must be True\n- `not`: Flips True to False (and False to True)\n\nThese operators let your functions make complex decisions based on multiple factors.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "PRIMM",
      id: "first-and" as SectionId,
      title: "The AND Operator",
      content: [
        {
          kind: "text",
          value:
            "Let's see how `and` works. Below is a function that checks if a movie is appropriate by checking TWO things: the rating AND the length. Predict which movies will be approved:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def check_movie(rating, length_minutes):\n    if rating == "PG" and length_minutes <= 120:\n        print("Perfect for family movie night!")\n    else:\n        print("Let\'s find a different movie")\n\nprint("Movie 1:")\ncheck_movie("PG", 90)\n\nprint("\\nMovie 2:")\ncheck_movie("PG", 180)\n\nprint("\\nMovie 3:")\ncheck_movie("R", 90)\n\nprint("\\nMovie 4:")\ncheck_movie("R", 180)',
      },
      predictPrompt:
        "The condition checks TWO things with `and`. Which movies will print 'Perfect for family movie night!'? Think about what BOTH conditions need to be.",
      conclusion:
        "The `and` operator requires BOTH conditions to be True. Movie 1 works (PG rating AND short length). Movies 2, 3, and 4 fail because at least one condition is False.",
    } as PRIMMSectionData,
    {
      kind: "MultipleChoice",
      id: "and-understanding",
      title: "Understanding AND",
      content: [
        {
          kind: "text",
          value:
            "In the movie checker above, you saw that `and` requires both conditions to be True. When using `and`, the overall condition is True when:",
        },
      ],
      options: [
        "At least one part is True",
        "BOTH parts are True",
        "The first part is True",
        "Exactly one part is True",
      ],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! The `and` operator only gives True when BOTH conditions are True. If either one (or both) is False, the entire condition is False.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Prediction",
      id: "and-prediction" as SectionId,
      title: "Ride Safety Check",
      content: [
        {
          kind: "text",
          value:
            "After seeing how `and` works with the movie checker, let's practice with a ride safety function. This checks if someone is tall enough AND old enough. Predict who gets approved:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def check_ride_safety(height, age):\n    if height >= 48 and age >= 10:\n        print("You can ride!")\n    else:\n        print("Sorry, not this time")',
      },
      testMode: "procedure",
      functionToTest: "check_ride_safety",
      predictionTable: {
        columns: [
          { variableName: "height", variableType: "number" },
          { variableName: "age", variableType: "number" },
        ],
        rows: [
          { inputs: [50, 12] },
          { inputs: [50, 8] },
          { inputs: [45, 12] },
          { inputs: [48, 10] },
          { inputs: [40, 8] },
        ],
      },
    } as PredictionSectionData,
    {
      kind: "PRIMM",
      id: "or-operator-primm" as SectionId,
      title: "The OR Operator",
      content: [
        {
          kind: "text",
          value:
            "Now let's see how `or` works. This function gives discounts to children OR seniors. Predict who gets the discount:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def check_discount(age):\n    if age < 12 or age >= 65:\n        print("You get a discount!")\n    else:\n        print("Regular price")\n\ncheck_discount(10)\nprint("---")\ncheck_discount(70)\nprint("---")\ncheck_discount(30)\nprint("---")\ncheck_discount(11)',
      },
      predictPrompt:
        "The condition uses `or` to check if age is under 12 OR 65 and over. Which ages will get the discount?",
      conclusion:
        "The `or` operator gives True if AT LEAST ONE condition is True. Children (under 12) get discounts. Seniors (65+) get discounts. Adults in between pay regular price.",
    } as PRIMMSectionData,
    {
      kind: "MultipleSelection",
      id: "and-vs-or",
      title: "AND vs OR",
      content: [
        {
          kind: "text",
          value:
            "You've now seen both `and` and `or` in action. The discount function showed that `or` only needs ONE condition to be True. Select all statements that are true:",
        },
      ],
      options: [
        "`and` requires BOTH conditions to be True",
        "`or` requires BOTH conditions to be True",
        "`or` requires AT LEAST ONE condition to be True",
        "`and` requires AT LEAST ONE condition to be True",
        "With `or`, if both conditions are True, the overall result is True",
        "With `and`, if one condition is False, the overall result is False",
      ],
      correctAnswers: [0, 2, 4, 5],
      feedback: {
        correct:
          "Perfect! Remember: `and` is strict (needs BOTH), `or` is flexible (needs AT LEAST ONE). If both are True with `or`, that's still True!",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Coverage",
      id: "free-admission" as SectionId,
      title: "Free Admission",
      content: [
        {
          kind: "text",
          value:
            "The discount function above used `or` with a single input (age). Now let's practice with TWO inputs. This function gives free entry if you're under 5 OR you have a membership. Provide combinations that produce each output:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def free_entry(age, has_membership):\n    if age < 5 or has_membership:\n        print("Free entry!")\n    else:\n        print("Please pay admission")',
      },
      testMode: "procedure",
      functionToTest: "free_entry",
      coverageTable: {
        columns: [
          { variableName: "age", variableType: "number" },
          { variableName: "has_membership", variableType: "boolean" },
        ],
        rows: [
          {
            fixedInputs: { has_membership: false },
            expectedOutput: "Free entry!",
            hint: "Young child without membership",
          },
          {
            fixedInputs: { has_membership: true },
            expectedOutput: "Free entry!",
            hint: "Adult with membership",
          },
          {
            fixedInputs: { age: 45 },
            expectedOutput: "Please pay admission",
            hint: "Adult without membership",
          },
          {
            fixedInputs: { age: 6 },
            expectedOutput: "Free entry!",
            hint: "Young child with membership (both True!)",
          },
        ],
      },
    } as CoverageSectionData,
    {
      kind: "Testing",
      id: "ride-requirements" as SectionId,
      title: "Challenge: Ride Requirements",
      content: [
        {
          kind: "text",
          value:
            "Create a function `can_ride(height, age, has_adult)` that checks if someone can ride a roller coaster.\n\nYou CAN ride if:\n- You are at least 120cm tall AND at least 10 years old\nOR\n- You are at least 100cm tall AND you have an adult with you\n\nPrint 'You can ride!' or 'Sorry, you cannot ride'\n\nHint: You'll need to combine `and` and `or` in one condition. Use parentheses to group: `(condition1 and condition2) or (condition3 and condition4)`",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "def can_ride(height, age, has_adult):\n    # Check: (tall AND old enough) OR (shorter but WITH adult)\n    pass\n\n# Test cases\ncan_ride(125, 12, False)\nprint('---')\ncan_ride(105, 8, True)\nprint('---')\ncan_ride(105, 8, False)\nprint('---')\ncan_ride(95, 15, True)",
      },
      testCases: [
        {
          input: [125, 12, false],
          expected: "You can ride!",
          description: "Tall and old enough",
        },
        {
          input: [105, 8, true],
          expected: "You can ride!",
          description: "Shorter but has adult",
        },
        {
          input: [105, 8, false],
          expected: "Sorry, you cannot ride",
          description: "Shorter and no adult",
        },
        {
          input: [95, 15, true],
          expected: "Sorry, you cannot ride",
          description: "Too short even with adult",
        },
      ],
      testMode: "procedure",
      functionToTest: "can_ride",
    } as TestingSectionData,
    {
      kind: "Matching",
      id: "read-conditions" as SectionId,
      title: "Reading Complex Conditions",
      content: [
        {
          kind: "text",
          value:
            "The ride requirements above combined `and` and `or` into one complex condition. Being able to read and understand these conditions is crucial. Match each condition to its plain English meaning:",
        },
      ],
      prompts: [
        {
          "if age >= 18 and has_permission:":
            "Adult with permission (both required)",
        },
        {
          "if is_student or is_senior:": "Student or senior (either qualifies)",
        },
        {
          "if score > 90 and score <= 100:": "Score between 91 and 100",
        },
        {
          "if day == 'saturday' or day == 'sunday':": "Weekend day",
        },
      ],
      feedback: {
        correct:
          "Excellent! Being able to translate code into plain English (and vice versa) helps you write correct conditions and debug when things go wrong.",
      },
    } as MatchingSectionData,
    {
      kind: "Testing",
      id: "game-access" as SectionId,
      title: "Challenge: Game Access Rules",
      content: [
        {
          kind: "text",
          value:
            "Create a function `can_play_game(age, has_permission, is_weekend)` with complex access rules.\n\nYou CAN play if:\n- You're 18 or older (no other requirements)\nOR\n- You're 13-17 AND have permission AND it's the weekend\nOR  \n- You're under 13 AND have permission (any day)\n\nPrint 'You can play!' or 'Not right now'\n\nThis is challenging! Think carefully about how to combine the conditions. You'll need multiple `and` and `or` operators with parentheses.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "def can_play_game(age, has_permission, is_weekend):\n    # Adults (18+) can always play\n    # Teens (13-17) need permission AND weekend\n    # Kids (under 13) need permission (any day)\n    pass\n\n# Test cases\ncan_play_game(20, False, False)\nprint('---')\ncan_play_game(15, True, True)\nprint('---')\ncan_play_game(15, True, False)\nprint('---')\ncan_play_game(10, True, False)\nprint('---')\ncan_play_game(10, False, True)",
      },
      testCases: [
        {
          input: [20, false, false],
          expected: "You can play!",
          description: "Adult can always play",
        },
        {
          input: [15, true, true],
          expected: "You can play!",
          description: "Teen with permission on weekend",
        },
        {
          input: [15, true, false],
          expected: "Not right now",
          description: "Teen with permission on weekday",
        },
        {
          input: [10, true, false],
          expected: "You can play!",
          description: "Kid with permission any day",
        },
        {
          input: [10, false, true],
          expected: "Not right now",
          description: "Kid without permission",
        },
      ],
      testMode: "procedure",
      functionToTest: "can_play_game",
    } as TestingSectionData,
    {
      kind: "Reflection",
      id: "boolean-reflection" as SectionId,
      title: "Boolean Operators Reflection",
      content: [
        {
          kind: "text",
          value:
            "Boolean operators (`and`, `or`, `not`) let you combine simple conditions into complex decisions. With `and`, all conditions must be True. With `or`, at least one must be True. With `not`, you flip the value.\n\nCreate a function using at least one `and` and one `or` to make a complex decision. Explain how the boolean operators work together in your example. Remember to use the phrase 'as seen in the example above'.",
        },
      ],
      topic: "How Boolean Operators Combine Conditions",
      isTopicPredefined: true,
      code: "Create a function using both 'and' and 'or'",
      isCodePredefined: false,
      explanation:
        "Explain how your boolean operators create the logic (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
  ],
};

export default lessonData;
