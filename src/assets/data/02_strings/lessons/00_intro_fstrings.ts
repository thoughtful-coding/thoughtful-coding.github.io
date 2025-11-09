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
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Format Strings",
  guid: "a7d9e2f1-3c4b-5a6d-8e9f-1a2b3c4d5e6f" as LessonId,
  description:
    "Learn how to easily combine variables and text using f-strings, Python's powerful formatting tool.",
  sections: [
    {
      kind: "Information",
      id: "hiding-complexity",
      title: "Printing Different Data Types",
      content: [
        {
          kind: "text",
          value:
            "In previous lessons, you learned how to create variables that store both strings and integers. You also learned how to print these variables. However, there's something we carefully avoided talking about: printing integers and strings together on the same line.\n\nFor example, if you have a variable `age` that holds the integer `15` (via the code `age = 15`), we've only shown you how to print `age` by itself. We haven't shown you how to print something like `You are 15 years old` where the integer is combined with a string. In this lesson, we'll show you different ways to try and do this and how to debug any errors you encounter along the way.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "PRIMM",
      id: "string-and-int-problems" as SectionId,
      title: "Combining Strings and Integers",
      content: [
        {
          kind: "text",
          value:
            "Below is a simple program that tries to print out two simple sentences. It uses the `+` operator to combine strings with variables holding different data types. Predict what will happen when you run this code, then check your prediction.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'color = "red"\nnum = 25\nprint("A color is " + color)\nprint("A number is " + num)',
      },
      predictPrompt:
        "The first print statement combines two strings. The second print statement tries to combine a string with the `num` variable (which stores an integer). What do you think will happen?",
      conclusion:
        "Python raises a TypeError! You cannot use `+` to combine strings and integers directly. Python doesn't know whether you want to add numbers or join text, so it refuses to guess. We need a different approach.",
    } as PRIMMSectionData,
    {
      kind: "Observation",
      id: "fstring-solution" as SectionId,
      title: "F-Strings: The Solution",
      content: [
        {
          kind: "text",
          value:
            "The solution to the problem of printing strings and integers on the same line is something called an **f-string** (short for 'format string'). An f-string lets you easily insert variables into text, regardless of whether they're strings or integers.\n\nHere's the same program from before, but using f-strings. Notice three key parts:\n1. The letter `f` appears right before the opening quote\n2. Variable names go inside curly braces `{}`\n3. Python automatically converts the variable to text\n\nRun this code and see how smoothly it works:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'color = "red"\nnum = 25\nprint(f"A color is {color}")\nprint(f"A number is {num}")',
      },
    } as ObservationSectionData,
    {
      kind: "PRIMM",
      id: "predict-fstring-output" as SectionId,
      title: "Predicting F-String Outputs",
      content: [
        {
          kind: "text",
          value:
            "Now let's practice predicting what f-strings will output. Remember: Python replaces everything inside `{}` with the actual value of the variable. Predict what each line will print, then run the code to check.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'city = "Boston"\ntemperature = 40 + 30\nprint(f"It is {temperature} degrees in {city}")',
      },
      predictPrompt:
        "For the following program, predict exactly what will appear on the screen. Remember that the variables get replaced with their values!",
      conclusion:
        "The variables inside `{}` get replaced with their actual values. The f-string treats everything as text in the final output, so you never see the curly braces themselves.",
    } as PRIMMSectionData,
    {
      kind: "MultipleChoice",
      id: "fstring-syntax",
      title: "F-String Syntax",
      content: [
        {
          kind: "text",
          value:
            "Given that `score = 100`, which of the following correctly uses an f-string to print 'Score: 100'?",
        },
      ],
      options: [
        'print("Score: {score}")',
        'print(f"Score: (score)")',
        'print(f"Score: {score}")',
        'print("f Score: {score}")',
      ],
      correctAnswer: 2,
      feedback: {
        correct:
          "Correct! You need the `f` before the quote AND curly braces `{}` around the variable name.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Matching",
      id: "fstring-vs-regular" as SectionId,
      title: "F-Strings vs Regular Strings",
      content: [
        {
          kind: "text",
          value:
            'Understanding the difference between f-strings and regular strings is crucial. Given that `name = "Alice"`, match each print statement with its output:',
        },
      ],
      prompts: [
        { 'print(f"Hi {name}")': '"Hi Alice"' },
        { 'print("Hi {name}")': '"Hi {name}"' },
        { 'print(f"Hi name")': '"Hi name"' },
        { 'print(f"Hi (name)")': '"Hi (name)"' },
        { 'print(f"Hi {name")': "`SyntaxError`" },
      ],
      feedback: {
        correct:
          "Perfect! Without the `f`, curly braces print literally. Without the curly braces, the variable name prints literally.",
      },
    } as MatchingSectionData,
    {
      kind: "Information",
      id: "why-fstrings",
      title: "Why F-Strings Work So Well",
      content: [
        {
          kind: "text",
          value:
            "Remember the TypeError you saw at the beginning of this lesson? That happened because Python couldn't use `+` to combine strings and integers. You'd need to convert the integer to a string first, which is complicated and error-prone.\n\nF-strings solve this problem elegantly:\n- They automatically handle different data types (strings, integers, even calculations)\n- They're much easier to read than alternatives\n- You can see exactly what the output will look like just by reading the code\n- You can put expressions (like `{age + 1}`) directly inside the curly braces",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Matching",
      id: "convert-to-fstrings" as SectionId,
      title: "Converting to F-Strings",
      content: [
        {
          kind: "text",
          value:
            "A useful skill is converting old-style string combination into clean f-strings. Match each complicated expression with its f-string equivalent. Assume all variables are already defined.",
        },
      ],
      prompts: [
        { 'print("Score: " + points)': 'print(f"Score: {points}")' },
        { 'print(name + " is " + age)': 'print(f"{name} is {age}")' },
        { 'print(city + " is " + weather)': 'print(f"{city} is {weather}")' },
        {
          'print("Happy birthday " + name + "!")':
            'print(f"Happy birthday {name}!")',
        },
      ],
      feedback: {
        correct:
          "Excellent! Notice how f-strings are cleaner and avoid all the `+` signs and extra quotes. The code becomes much easier to read!",
      },
    } as MatchingSectionData,
    {
      kind: "Testing",
      id: "create-profile" as SectionId,
      title: "Challenge: Create a Profile",
      content: [
        {
          kind: "text",
          value:
            "Now it's your turn! Create a program that:\n1. Uses the three variables `name`, `age`, and `state`\n2. Uses an f-string\n3. Prints out the sentence: `Mary is 12 years old and lives in New Jersey'",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          '# Create your three variables\nname = "Mary"\nage = 12\nstate = "New Jersey"\n\n# Print the profile sentence using an f-string\n',
      },
      testCases: [
        {
          input: [null],
          expected: "Mary is 12 years old and lives in New Jersey",
          description: "Expected output",
        },
      ],
      testMode: "procedure",
      functionToTest: "__main__",
    } as TestingSectionData,
    {
      kind: "Information",
      id: "fstrings-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "Congratulations on learning about f-strings! You now have a powerful tool for creating clear, readable output that mixes text and variables.\n\nKey takeaways:\n- F-strings start with `f` before the opening quote\n- Variables go inside curly braces `{}`\n- Python automatically handles different data types\n- F-strings are cleaner and easier to read than using `+`\n\nIn the next few lessons, you'll use f-strings to build more complex outputs and even create your own Mad Libs game!",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
