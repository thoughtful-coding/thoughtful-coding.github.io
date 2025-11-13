import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  MultipleChoiceSectionData,
  MultipleSelectionSectionData,
  MatchingSectionData,
  TestingSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "F-Strings Unit Challenge",
  guid: "d0g2h5i4-6f7e-8d9c-1h2g-4d5e6f7g8h9i" as LessonId,
  description:
    "Test your understanding of f-strings, data types, and variables through a variety of interleaved practice problems.",
  sections: [
    {
      kind: "Information",
      id: "wrap-up-intro",
      title: "Bringing It All Together",
      content: [
        {
          kind: "text",
          value:
            "Over the past three lessons, you've learned how to use f-strings to create informative, human-readable output. You've also reviewed and reinforced your understanding of data types (strings and integers) and variables from earlier units.\n\nThis wrap-up lesson uses **interleaving** to mix questions about all these topics together. By switching between concepts, your brain has to actively recall what you've learned rather than following a single pattern. This creates stronger, more durable learning. Take your time with each question. Think carefully about what you've learned, and remember: struggling a bit is how you learn!",
        },
      ],
    } as InformationSectionData,
    {
      kind: "MultipleChoice",
      id: "data-type-identification",
      title: "Identifying Data Types",
      content: [
        {
          kind: "text",
          value:
            "Understanding data types is fundamental to programming. Which of the following is a string?",
        },
      ],
      options: ['"42"', "42", 'f"{42}"', 'var = "42"'],
      correctAnswer: 0,
      feedback: {
        correct:
          'Correct! "42" is a string because it has quotes around it. The f-string like f"{42}" produces a string as output, but the f-string syntax itself is not a data type - it\'s a way to create strings.',
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Information",
      id: "wrap-up-intro",
      title: "Bringing It All Together",
      content: [
        {
          kind: "text",
          value:
            "TODO: https://drive.google.com/drive/folders/15AdutAgRgxRVO6XqqS_0-Z_KIAS1CTzW : Hello World program",
        },
      ],
    } as InformationSectionData,
    {
      kind: "MultipleSelection",
      id: "valid-strings",
      title: "Valid String Syntax",
      content: [
        {
          kind: "text",
          value:
            "Being able to identify valid strings is crucial for avoiding syntax errors. Select all of the following that are valid strings in Python:",
        },
      ],
      options: [
        '"Hello, world!"',
        "'It's a nice day'",
        '"She said "hi" to me"',
        "'Python is fun!'",
        "\"She said 'hi' to me\"",
        '"It\'s cool"',
      ],
      correctAnswers: [0, 3, 4, 5],
      feedback: {
        correct: "Correct!",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "MultipleChoice",
      id: "fstring-vs-concat",
      title: "F-Strings vs Concatenation",
      content: [
        {
          kind: "text",
          value: "If you ran the following program, what would be the output?",
        },
        {
          kind: "code",
          value:
            'num_1 = "6"\nnum_2 = "3"\nresult_1 = num_1 + num_2\n\nnum_3 = 5\nnum_4 = 2\nresult_2 = num_3 + num_4\nprint(f"{result_1} and {result_2}")',
        },
      ],
      options: ["63 and 52", "63 and 7", "9 and 7", "9 and 52"],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! Identifying what type of data is being operated on lets you know whether `+` will do concatenation for addition.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Matching",
      id: "concat-to-fstrings" as SectionId,
      title: "Converting to F-Strings",
      content: [
        {
          kind: "text",
          value:
            "One of the benefits of f-strings is how much cleaner they are than old-style concatenation. Match each concatenation attempt with its correct f-string equivalent. Assume all variables are already defined.",
        },
      ],
      prompts: [
        { 'print("Score: " + points)': 'print(f"Score: {points}")' },
        {
          'print(name + " is " + age + " years old")':
            'print(f"{name} is {age} years old")',
        },
        {
          'print("Hometown: " + town + "!")': 'print(f"Hometown: {town}!")',
        },
        { 'print("Hello " + user)': 'print(f"Hello {user}")' },
      ],
      feedback: {
        correct:
          "Excellent! Notice how f-strings eliminate all those + signs and quote marks, making the code much easier to read. Plus, f-strings handle data type conversion automatically!",
      },
    } as MatchingSectionData,
    {
      kind: "MultipleChoice",
      id: "variable-reassignment-fstring",
      title: "Variables and F-Strings",
      content: [
        {
          kind: "text",
          value:
            "Understanding how variables change is important when using them in f-strings. What will the following code output?",
        },
        {
          kind: "code",
          value: 'x = 5\nx = x + 3\nprint(f"Value: {x}")',
        },
      ],
      options: ["Value: 5", "Value: 8", "Value: x + 3", "Value: 53"],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! First x is set to 5, then x is reassigned to 5 + 3 = 8. When the f-string is evaluated, x has the value 8, so that's what gets inserted.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "MultipleSelection",
      id: "fstring-capabilities",
      title: "F-String Capabilities",
      content: [
        {
          kind: "text",
          value:
            "Which of the following statements about f-strings are true? Select all that apply.",
        },
      ],
      options: [
        "F-strings require the letter f before the opening quote",
        "F-strings can only work with string variables, not integers",
        "F-strings automatically convert integers to strings",
        "You can use the same variable multiple times in one f-string",
        "F-strings can include expressions like {x + 5} inside the braces",
      ],
      correctAnswers: [0, 2, 3],
      feedback: {
        correct:
          "Perfect! F-strings work with any data type (not just strings)!",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Testing",
      id: "profile-card" as SectionId,
      title: "Challenge: Profile Card",
      content: [
        {
          kind: "text",
          value:
            "Create a profile card display using f-strings. You are given three variables: `name`, `age`,and `hobby`.\n\nYour program should print exactly three lines:\n1. 'Name: [name]'\n2. 'Age: [age]'\n3. 'Favorite hobby: [hobby]'\n\nMake sure to use f-strings for all your print statements.\n\nExample with name='Maya', age=16, hobby='photography':\n```\nName: Maya\nAge: 16\nFavorite hobby: photography\n```",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          '# Variables provided\nname = "Maya"\nage = 16\nhobby = "photography"\n\n# Write your three print statements using f-strings\n',
      },
      testCases: [
        {
          input: [null],
          expected: "Name: Maya\nAge: 16\nFavorite hobby: photography",
          description: "Test profile card output",
        },
      ],
      testMode: "procedure",
      functionToTest: "__main__",
    } as TestingSectionData,
    {
      kind: "Matching",
      id: "expression-results" as SectionId,
      title: "Expression Evaluation",
      content: [
        {
          kind: "text",
          value:
            "F-strings can evaluate expressions inside the curly braces. Given that `x = 10`, match each f-string to its output:",
        },
      ],
      prompts: [
        { 'print(f"Value: {x}")': '"Value: 10"' },
        { 'print(f"Value: {x * 2}")': '"Value: 20"' },
        { 'print(f"Value: {x + 5}")': '"Value: 15"' },
        { 'print(f"Value: {x - 3}")': '"Value: 7"' },
        { 'print(f"Value: {x * 3}")': '"Value: 30"' },
      ],
      feedback: {
        correct:
          "Excellent! Python evaluates the expression inside the braces first (does the math), then converts the result to a string and inserts it into the output.",
      },
    } as MatchingSectionData,
    {
      kind: "MultipleSelection",
      id: "prints-fifteen",
      title: "Multiple Approaches",
      content: [
        {
          kind: "text",
          value:
            "Given the variables `x = 10` and `y = 5`, which of the following will print the number 15? Select all that apply.",
        },
      ],
      options: [
        'print(f"{x + y}")',
        'print(f"{x} {y}")',
        'print(f"x + y")',
        "print(x + y)",
        'print(f"{y + x}")',
        'print(f"{15}")',
      ],
      correctAnswers: [0, 3, 4, 5],
      feedback: {
        correct:
          "Perfect! Option 0, 3, 4, and 5 all print 15. Option 1 prints '10 5' (two numbers with a space). Option 2 prints the literal text 'x + y' because the variables aren't in braces.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Testing",
      id: "price-calculator" as SectionId,
      title: "Challenge: Price Calculator",
      content: [
        {
          kind: "text",
          value:
            "Create a price calculator that shows an item's original price, discount amount, and final price. You are given three variables: `item`, `price`, and `discount`.\n\nYour program should print exactly four lines:\n1. 'Item: [item]'\n2. 'Original price: $[price]'\n3. 'Discount: $[discount]'\n4. 'Final price: $[price minus discount]'\n\nUse f-strings with an expression to calculate the final price.\n\nExample with item='Headphones', price=50, discount=10:\n```\nItem: Headphones\nOriginal price: $50\nDiscount: $10\nFinal price: $40\n```",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          '# Variables provided\nitem = "Headphones"\nprice = 50\ndiscount = 10\n\n# Write your four print statements using f-strings\n',
      },
      testCases: [
        {
          input: [null],
          expected:
            "Item: Headphones\nOriginal price: $50\nDiscount: $10\nFinal price: $40",
          description: "Test price calculator with discount",
        },
      ],
      testMode: "procedure",
      functionToTest: "__main__",
    } as TestingSectionData,
    {
      kind: "MultipleChoice",
      id: "best-practices",
      title: "When to Use F-Strings",
      content: [
        {
          kind: "text",
          value:
            "Understanding when to use different tools is part of becoming a good programmer. When should you use f-strings instead of regular strings?",
        },
      ],
      options: [
        "Always - f-strings are always better than regular strings",
        "When you need to insert variables or expressions into text",
        "Only when working with integers, never with strings",
        "Never - regular strings are simpler and always work",
      ],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! Use f-strings when you need to combine variables or expressions with text. For simple text with no variables (like 'Hello, world!'), a regular string is fine. The key is choosing the right tool for the job!",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Information",
      id: "wrap-up-conclusion",
      title: "Excellent Work!",
      content: [
        {
          kind: "text",
          value:
            "Congratulations on completing the f-strings unit! By working through these interleaved questions, you've reinforced your understanding of how data types, variables, and f-strings work together. These aren't just isolated skills - they're fundamental building blocks that you'll use in every program you write. Whether you're creating games, analyzing data, building websites, or solving problems, you'll constantly be:\n1. Storing data in variables\n2. Working with different data types\n3. Presenting results in human-readable formats\n\nYou've learned how to make computers speak to humans. That's a powerful skill, and you should be proud of how far you've come!",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
