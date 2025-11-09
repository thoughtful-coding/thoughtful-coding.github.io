import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  PRIMMSectionData,
  ObservationSectionData,
  MultipleChoiceSectionData,
  MatchingSectionData,
  TestingSectionData,
  ReflectionSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Advanced F-Strings",
  guid: "b8e0f3g2-4d5c-6b7a-9f0e-2b3c4d5e6f7g" as LessonId,
  description:
    "Master using multiple variables and expressions in f-strings to create powerful, informative output.",
  sections: [
    {
      kind: "Information",
      id: "building-on-fstrings",
      title: "Building on F-Strings",
      content: [
        {
          kind: "text",
          value:
            "In the last lesson, you learned how to use f-strings. You discovered that f-strings let you easily mix text and variables without worrying about data types.\n\nNow you're ready to unlock the full power of f-strings. In this lesson, you'll learn how to:\n- Do calculations directly inside the curly braces\n- Combine both techniques to create rich, informative output\n\nThese skills will prepare you to create complex programs where many pieces of information need to come together.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Observation",
      id: "multiple-variables" as SectionId,
      title: "Multiple Variables in One F-String",
      content: [
        {
          kind: "text",
          value:
            "You're not limited to just one variable per f-string. You can use as many variables as you need, and you can even use the same variable multiple times!\n\nRun the code below and notice how three different variables get inserted into a single sentence. Also pay attention to the last line, which uses the `name` variable twice:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'name = "Alice"\nage = 25\ncity = "Boston"\n\nprint(f"{name} is {age} years old and lives in {city}")\nprint(f"{name} said hello. Then {name} waved goodbye.")',
      },
    } as ObservationSectionData,
    {
      kind: "MultipleChoice",
      id: "multiple-vars-syntax",
      title: "Multiple Variables Syntax",
      content: [
        {
          kind: "text",
          value:
            "Given that `name = 'Alice'` and `score = 95`, which of the following correctly prints 'Alice scored 95 points'?",
        },
      ],
      options: [
        'print(f"(name) scored (score) points")',
        'print(f"{name} scored {score} points")',
        'print("f{name} scored {score} points")',
        'print("{name} scored {score} points")',
      ],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! The f goes before the quote, and both variables go inside curly braces.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Information",
      id: "expressions-intro",
      title: "Calculations Inside Braces",
      content: [
        {
          kind: "text",
          value:
            "Here's where f-strings get really powerful: you can do math directly inside the curly braces! Python will calculate the result first, then insert it into the string.\n\nFor example:\n```python\nage = 25\nprint(f'Next year you will be {age + 1} years old')\n# Output: Next year you will be 26 years old\n```\n\nYou can use any arithmetic operations:\n- Addition: `{price + tax}`\n- Subtraction: `{score - 10}`\n- Multiplication: `{hours * rate}`\n- Division: `{total / count}`\n\nThe key is that Python evaluates (calculates) the expression first, then converts the result to text and inserts it.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "PRIMM",
      id: "expressions-primm" as SectionId,
      title: "Predicting Expressions",
      content: [
        {
          kind: "text",
          value:
            "Let's practice predicting what happens when you put calculations inside f-strings. The code below uses expressions with addition, multiplication, and division:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'price = 10\nquantity = 5\n\nprint(f"Each item costs ${price}")\nprint(f"You are buying {quantity} items")\nprint(f"Your total is ${price * quantity}")',
      },
      predictPrompt:
        "Look carefully at the expressions inside the curly braces. What calculation will Python do for each one?",
      conclusion:
        "Python evaluates the expression first (does the math), then inserts the result into the string. So {price * quantity} becomes {10 * 5} which becomes {50}, and '50' appears in the output.",
    } as PRIMMSectionData,
    {
      kind: "Matching",
      id: "order-code" as SectionId,
      title: "Order the Code",
      content: [
        {
          kind: "text",
          value:
            "Understanding how variables change and how f-strings use them is crucial. Order the following lines of code so that the program prints:\n```\nFirst: 10\nSecond: 13\nThird: 26\n```",
        },
      ],
      prompts: [
        { "Line 1": "x = 6" },
        { "Line 2": 'print(f"First: {x + 4}")' },
        { "Line 3": "x = x + 7" },
        { "Line 4": 'print(f"Second: {x}")' },
        { "Line 5": "x = x + 13" },
        { "Line 6": 'print(f"Third: {x}")' },
      ],
      feedback: {
        correct:
          "Perfect! Line 2 uses an expression ({x + 4}) which is 6 + 4 = 10. Then x gets updated to 13, and printed. Then x gets updated to 26, and printed.",
      },
    } as MatchingSectionData,
    {
      kind: "Testing",
      id: "shopping-cart-test" as SectionId,
      title: "Challenge: Shopping Cart",
      content: [
        {
          kind: "text",
          value:
            "Create a shopping cart calculator. You are given three variables: `item`, `price`, and `quantity`.\n\nYour program should print exactly four lines:\n1. 'Item: [item]'\n2. 'Price per item: $[price]'\n3. 'Quantity: [quantity]'\n4. 'Total cost: $[price times quantity]'\n\nUse f-strings with an expression for the total calculation.\n\nExample: item='Widget', price=15, quantity=4, output:\n```\nItem: Widget\nPrice per item: $15\nQuantity: 4\nTotal cost: $60\n```",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          '# Variables are provided\nitem = "Widget"\nprice = 15\nquantity = 4\n\n# Write your four print statements here\n',
      },
      testCases: [
        {
          input: [null],
          expected:
            "Item: Widget\nPrice per item: $15\nQuantity: 4\nTotal cost: $60",
          description: "Test with Widget purchase",
        },
      ],
      testMode: "procedure",
      functionToTest: "__main__",
    } as TestingSectionData,
    {
      kind: "Reflection",
      id: "fstrings-reflection" as SectionId,
      title: "F-Strings Make Output Clear",
      content: [
        {
          kind: "text",
          value:
            "F-strings are powerful because they let you create informative, readable output that combines different data types seamlessly. Now it's time to reflect on what you've learned. Create a simple example (3-4 lines) that uses at least three variables and at least one complex f-string. Then write 3-4 sentences explaining how your f-strings make the output clear and informative. Remember to use the phrase 'as seen in the example above'.",
        },
      ],
      topic: "How F-Strings Make Output Clear",
      isTopicPredefined: true,
      code: "Create an example with 3+ variables and 1+ calculation in braces",
      isCodePredefined: false,
      explanation:
        "Explain how f-strings make your output informative (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "ready-for-madlibs",
      title: "Ready for Mad Libs",
      content: [
        {
          kind: "text",
          value:
            "Congratulations! You now have all the tools you need to create Mad Libs games. Mad Libs are fill-in-the-blank stories where you provide words (nouns, adjectives, names, places) and they get inserted into a story template.\n\nFor example:\n```python\nname = 'Alice'\nplace = 'the grocery store'\nadjective = 'sparkly'\nnoun = 'banana'\n\nprint(f'Once upon a time, {name} went to {place}.')\nprint(f'There, {name} found a {adjective} {noun}!')\n```\n\nIn the next lesson, you'll create your own Mad Libs stories using everything you've learned about f-strings. Get ready to be creative!",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
