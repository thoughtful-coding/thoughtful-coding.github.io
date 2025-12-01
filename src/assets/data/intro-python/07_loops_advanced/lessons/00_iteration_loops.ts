import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  ObservationSectionData,
  PRIMMSectionData,
  MultipleSelectionSectionData,
  DebuggerSectionData,
  MatchingSectionData,
  TestingSectionData,
  ReflectionSectionData,
  MultipleChoiceSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Processing Data",
  guid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" as LessonId,
  description:
    "Learn how iteration loops let you examine each character in a string, one at a time.",
  sections: [
    {
      kind: "Information",
      id: "two-loop-types",
      title: "Two Kinds of Loops",
      content: [
        {
          kind: "text",
          value:
            "You've already learned how to use `for` loops with `range()` to repeat actions a specific number of times. These **range loops** are perfect for drawing shapes or doing something repeatedly.\n\nBut what if you want to process data, such as examining characters in a string, in order to compute an answer to a complex question? That's where **iteration loops** come in.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Observation",
      id: "first-iteration" as SectionId,
      title: "Your First Iteration Loop",
      content: [
        {
          kind: "text",
          value:
            "Below is an example of an iteration loop. Instead of `range()`, the loop **iterates** through each character of the string stored in the `word` variable. The variable `letter` takes on each character's value, one at a time.\n\nRun the code and watch what happens:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def say_hi():\n  word = "HELLO"\n  for letter in word:\n    print(letter)\n\nsay_hi()',
      },
    } as ObservationSectionData,
    {
      kind: "MultipleSelection",
      id: "loop-runs-how-many",
      title: "What Did You See?",
      content: [
        {
          kind: "text",
          value:
            "Based on the code above, which of the following statements are true? Select all that apply.",
        },
      ],
      options: [
        "The loop ran five times because by default a `range` loop runs five times",
        'The loop ran five times because there are five letters in `"HELLO"`',
        'The first time through the loop, `letter` had the value `"H"`',
        'The second time through the loop, `letter` had the value `"L"`',
        "The third time through the loop, `letter` had the value `'\"'`",
        'The last time through the loop, `letter` had the value `"O"`',
      ],
      correctAnswers: [1, 2, 5],
      feedback: {
        correct:
          'Correct! The loop runs once for each character in the string. "HELLO" has 5 characters, so the loop runs 5 times.',
      },
    } as MultipleSelectionSectionData,
    {
      kind: "PRIMM",
      id: "predict-python-output" as SectionId,
      title: "What Gets Printed?",
      content: [
        {
          kind: "text",
          value:
            "Below is example of an another iteration loop. This time, however, we're using f-string to format the output. Predict what will be printed:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def mystery_fn():\n  word = "Python"\n  for character in word:\n    print(f"Letter: {character}")\n\nmystery_fn()\n',
      },
      predictPrompt:
        "The loop goes through each character in `Python`. What will be printed for each character?",
      conclusion:
        'The loop prints `"Letter: "` followed by each character, one per line. It processes P, then y, then t, then h, then o, then n.',
    } as PRIMMSectionData,
    {
      kind: "Debugger",
      id: "watch-iteration" as SectionId,
      title: "Watching the Loop Variable",
      content: [
        {
          kind: "text",
          value:
            "Let's slow down and watch exactly what happens during an iteration loop. Step through the code below line by line and pay close attention to:\n- How the `letter` variable appears in the Variables panel\n- How `letter` changes with each iteration\n- How the loop automatically moves to the next character\n\nThis is the key to understanding iteration loops: the loop variable automatically iterates through each character in the string that it's \"looping over\", one at a time.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def iteration_loop():\n  word = "CAT"\n  print("Starting loop")\n  for letter in word:\n    print(f"Current letter: {letter}")\n  print("Loop finished")\n\niteration_loop()\n',
      },
    } as DebuggerSectionData,
    {
      kind: "Matching",
      id: "which-loop-type" as SectionId,
      title: "Choosing the Right Loop",
      content: [
        {
          kind: "text",
          value:
            "Now that you've seen both range loops and iteration loops, it's important to understand when to use one over the other. In short: if you want to have access to the individual parts of of data (such as the characters in a string), you should use an iteration loop. Otherwise, you should use a range loop.\n\nGive this explanation, match each task to the appropriate loop type:",
        },
      ],
      prompts: [
        { "Draw a square (4 sides)": "Range loop" },
        { "Check every letter in a password": "Iteration loop" },
        { "Print 'Hello' 10 times": "Range loop" },
        { "Count vowels in a word": "Iteration loop" },
        { "Draw 6 triangles in a circle": "Range loop" },
        { "Find all uppercase letters in a sentence": "Iteration loop" },
      ],
      feedback: {
        correct:
          "Perfect! Use iteration loops for processing a piece of data (such as the value in a string). Otherwise, use a range loop.",
      },
    } as MatchingSectionData,
    {
      kind: "MultipleSelection",
      id: "loop-differences",
      title: "Range vs Iteration",
      content: [
        {
          kind: "text",
          value:
            "Which of the following statements about range loops and iteration loops are true? Select all that apply.",
        },
      ],
      options: [
        "Range loops use `range()` to specify how many times to repeat",
        "Iteration loops can be used to go through each character in a string",
        "Both types of loops must use the variable name `i`",
        "In iteration loops, the loop variable automatically changes to each character",
        "Range loops are better for examining strings character by character",
        "Both types of loop start with `for`",
      ],
      correctAnswers: [0, 1, 3, 5],
      feedback: {
        correct:
          "Excellent! Knowing when to use the proper loop will make you a much more efficient programmer.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "PRIMM",
      id: "iteration-with-conditionals" as SectionId,
      title: "Checking Each Character",
      content: [
        {
          kind: "text",
          value:
            "Iteration loops become really powerful when you combine them with conditionals. For example, you can check each character and only do something for certain characters. Predict what will be printed:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def do_something(password):\n  for character in password:\n    if character == "!":\n      print("Clearly exciting data")\n\ndo_something("Who\'s excited!? I\'m excited!")',
      },
      predictPrompt:
        "The loop checks EVERY character. Some will match the `if` condition, others won't. What will be printed by the program?",
      conclusion:
        'Every character gets checked! Every time there\'s a `"!"` character, something is printed out.',
    } as PRIMMSectionData,
    {
      kind: "MultipleChoice",
      id: "iteration-concepts",
      title: "Iteration Loop Concepts",
      content: [
        {
          kind: "code",
          value:
            'def something_with_a(sentence):\n  for character in sentence:\n    if character == "A" or character == "a":\n      print("Saw something")\n\nsomething_with_a("An aardvark")',
        },
        {
          kind: "text",
          value:
            'The code above is an example of an iteration loop with a conditional inside of it. How many times will it print out `"Saw something"`?',
        },
      ],
      options: ["Zero times", "One times", "Four times", "Eleven times"],
      correctAnswer: 2,
      feedback: {
        correct:
          "Perfect! Iteration loops examine each character automatically: running once per character! The code above counts the number of a's (upper or lower case).",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Testing",
      id: "print-vowels" as SectionId,
      title: "Challenge: Find the E's",
      content: [
        {
          kind: "text",
          value:
            'Now it\'s your turn! Create a function named `print_es()` that:\n1. Takes a single input names `message`\n2. Loops through the string `message`\n3. Prints `"Found an E!" whenever it finds an **upper case** `"E"`.\n\nHint: Use the code in the problem above as a model.',
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "def print_es(message):\n  # Write your iteration loop here\n  # Check each character\n  # Print only the E's\n\nprint_es('Eric says \"HEY\"!')",
      },
      testCases: [
        {
          input: ["heyeeeE"],
          expected: "Found an E!",
          description: "One E",
        },
        {
          input: ["HEYEeee"],
          expected: "Found an E!\nFound an E!",
          description: "Two E's",
        },
        {
          input: ["Eric says HEYEeee"],
          expected: "Found an E!\nFound an E!\nFound an E!",
          description: "Three E's",
        },
      ],
      testMode: "procedure",
      functionToTest: "print_es",
    } as TestingSectionData,
    {
      kind: "Reflection",
      id: "loop-types-reflection" as SectionId,
      title: "Two Tools, Different Jobs",
      content: [
        {
          kind: "text",
          value:
            "You now have two types of loops in your programming toolkit:\n- **Range loops** (`for i in range(n):`) repeat actions a specific number of times\n- **Iteration loops** (`for char in string:`) examine each character in a string\n\nCreate a simple example showing one of each type of loop, and explain when you would use each one. Remember to use the phrase 'as seen in the example above'.",
        },
      ],
      topic: "When to Use Range vs Iteration Loops",
      isTopicPredefined: true,
      code: "Create one range loop example and one iteration loop example",
      isCodePredefined: false,
      explanation: "Explain when to use each type of loop (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "iteration-conclusion",
      title: "What's Next?",
      content: [
        {
          kind: "text",
          value:
            "Excellent work! You've learned how to examine each character in a string using iteration loops. You can now:\n- Loop through strings character by character\n- Use the loop variable to access each character\n- Combine iteration with conditionals to check specific characters\n- Understand when to use range loops vs iteration loops\n\nIn the next lesson, you'll learn how to \"accumulate\" data as you go through different loop iterations. This will allow you to do much more complex things and put you on the edge of writing programs that process all kinds of data in useful and interesting ways.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
