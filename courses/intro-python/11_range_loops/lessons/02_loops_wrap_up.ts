import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  ObservationSectionData,
  PRIMMSectionData,
  MultipleChoiceSectionData,
  MultipleSelectionSectionData,
  TestingSectionData,
  MatchingSectionData,
  ReflectionSectionData,
  DebuggerSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Loops Unit Challenge",
  guid: "a8c3f729-5e42-4d91-b8a7-2f9e6c8d7b31" as LessonId,
  description:
    "Integrate everything you've learned about loops, functions, variables, and libraries to create complex programs and debug common errors.",
  sections: [
    {
      kind: "Information",
      id: "challenge-intro",
      title: "The Complete Picture",
      content: [
        {
          kind: "text",
          value:
            "You've come incredibly far! Let's step back and see the complete picture of what you've learned.\n\nRemember when `print()` was the only function you knew? Now you understand that `range()` is also a function - one that returns a sequence of numbers for your loops to use. You've created your own functions with `def`, given them input parameters, and filled them with loops that repeat, nest, and vary.\n\nYou've mastered indentation - not just as a style choice, but as Python's way of showing what's 'inside' functions and loops. You've seen the errors that occur when indentation is wrong, and learned to read error messages to quickly fix problems.\n\nThis final lesson brings it ALL together: strings, integers, variables, functions, loops, libraries, and debugging. Ready for the ultimate challenge?",
        },
      ],
    } as InformationSectionData,
    {
      kind: "MultipleChoice",
      id: "range-understanding",
      title: "Understanding range()",
      content: [
        {
          kind: "text",
          value:
            "You've been using `range()` throughout this unit. What type of thing is `range` in the code `for i in range(5):`?",
        },
      ],
      options: [
        "A variable that stores the number 5",
        "A function that returns a sequence of numbers",
        "A loop that repeats 5 times",
        "A string containing the numbers 0-4",
      ],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! `range()` is a function, just like `print()` or `forward()`. It takes an input (5) and returns a sequence [0,1,2,3,4] for the loop to iterate over.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "PRIMM",
      id: "indentation-errors-primm" as SectionId,
      title: "The Importance of Indentation",
      content: [
        {
          kind: "text",
          value:
            "Indentation isn't just about making code pretty. In Python, it determines what code belongs to what structure. Predict what error this code will produce:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "import turtle\n\n\ndef draw_square(size):\n    for i in range(4):\n    turtle.forward(size)  # Not indented!\n        turtle.right(90)\n\ndraw_square(50)",
      },
      predictPrompt:
        "Line 5 isn't indented properly. What type of error will Python raise, and why?",
      conclusion:
        "IndentationError! Python expected the line after the for loop to be indented. Without proper indentation, Python can't tell what's inside the loop versus what comes after it. This is different from a SyntaxError (like missing colons) or a NameError (like misspelled variables).",
    } as PRIMMSectionData,
    {
      kind: "Matching",
      id: "error-types-review" as SectionId,
      title: "Error Type Review",
      content: [
        {
          kind: "text",
          value:
            "Throughout all units, you've encountered different error types. Match each error with its cause:",
        },
      ],
      prompts: [
        { TypeError: "Using + with a string and an integer" },
        {
          NameError:
            "Using a variable that hasn't been created (like typing 'primt' instead of 'print')",
        },
        { SyntaxError: "Missing colon after 'def function_name()'" },
        { IndentationError: "Code not properly aligned under a for loop" },
        { "No error (logic bug)": "Using range(4) when you meant range(5)" },
      ],
      feedback: {
        correct:
          "Perfect! You understand that some errors Python catches (syntax, names, types, indentation) while others are logic errors that run but don't do what you intended.",
      },
    } as MatchingSectionData,
    {
      kind: "Debugger",
      id: "variable-scope-debug" as SectionId,
      title: "Loop Variables and Scope",
      content: [
        {
          kind: "text",
          value:
            "Let's explore something subtle about loop variables. Step through this code and watch the Variables panel carefully. Notice when variables appear and what values they hold:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          '# Variables before loops\nx = 10\nprint(f"x before loop: {x}")\n\n# First loop\nfor i in range(3):\n    x = x + i\n    print(f"In loop: i={i}, x={x}")\n\nprint(f"After loop: x={x}")\nprint(f"Is \'i\' still available? {i}")\n\n# Second loop reuses i\nfor i in range(2):\n    print(f"New loop: i={i}")\n\n# Nested loops with different variables\nfor i in range(2):\n    for j in range(3):\n        print(f"i={i}, j={j}")',
      },
    } as DebuggerSectionData,
    {
      kind: "MultipleSelection",
      id: "complete-understanding",
      title: "Putting It All Together",
      content: [
        {
          kind: "text",
          value:
            "Which of these statements are true about everything you've learned? Select all that apply.",
        },
      ],
      options: [
        "The loop variable (like 'i') is actually a real variable that gets assigned new values",
        "Functions like print(), range(), and forward() all take inputs and do something",
        "Indentation in Python is just for readability, like comments",
        "A string '5' and integer 5 can be added together with +",
        "Nested loops multiply their iterations (outer × inner)",
        "Variables created inside a function exist outside the function",
        "The random library's functions must be accessed with random.function_name()",
      ],
      correctAnswers: [0, 1, 4, 6],
      feedback: {
        correct:
          "Excellent! You understand that: loop variables are real variables, all functions work similarly, indentation is REQUIRED in Python, types matter for operations, nested loops multiply iterations, and libraries need proper access syntax.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Testing",
      id: "debug-challenge" as SectionId,
      title: "Debug Challenge: Find and Fix",
      content: [
        {
          kind: "text",
          value:
            "This program is supposed to draw 3 growing hexagons using a function, but it has FOUR bugs. Fix all the errors to make it work:\n\n1. One indentation error\n2. One NameError (misspelling)\n3. One TypeError\n4. One logic error (wrong value)",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          'import turtle\n\nturtle.speed(0)\n\ndef draw_hexagon(size):\nfor i in range(6):  # Bug 1: Missing indentation\n        turtle.forwrd(size)  # Bug 2: Misspelled forward\n        turtle.right(60)  # Bug 3: Wrong angle (should be 360/6)\n\n# Draw three hexagons\nfor hexagon_num in range(3):\n    size = "30" + (hexagon_num * 20)  # Bug 4: String instead of integer\n    draw_hexagon(size)\n    \n    # Move for next hexagon\n    turtle.penup()\n    turtle.forward(100)\n    turtle.pendown()',
      },
      testCases: [
        {
          input: [null],
          expected: "PATTERN:three_growing_hexagons",
          description: "Test that 3 hexagons of increasing size are drawn",
        },
      ],
      testMode: "procedure",
      functionToTest: "__main__",
    } as TestingSectionData,
    {
      kind: "PRIMM",
      id: "string-loop-primm" as SectionId,
      title: "Loops Beyond Turtle",
      content: [
        {
          kind: "text",
          value:
            "Loops aren't just for drawing! Remember strings and integers from the beginning? Let's combine them with loops. Predict what this program outputs:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          '# Remember string concatenation?\nname = "Python"\ncheer = ""\n\nfor letter in name:\n    cheer = cheer + letter + "! "\n\nprint(cheer)\nprint("Give me a " + name + "!")\n\n# And integer operations?\ntotal = 0\nfor i in range(5):\n    total = total + i\n    print(f"Added {i}, total is now {total}")\n\nprint("Final sum:", total)',
      },
      predictPrompt:
        "This uses loops with strings (concatenation) and integers (addition). What will the output be?",
      conclusion:
        "Loops work with ALL data types! The first loop iterates through each character in a string. The second accumulates a sum. These are the same loop concepts you used for turtle graphics, applied to the strings and integers from Unit 1!",
    } as PRIMMSectionData,
    {
      kind: "Testing",
      id: "factorial-function" as SectionId,
      title: "Challenge: Beyond Graphics",
      content: [
        {
          kind: "text",
          value:
            "Create a function that uses loops but DOESN'T draw anything. Make `calculate_factorial(n)` that:\n\n1. Starts with result = 1\n2. Loops from 1 to n (inclusive)\n3. Multiplies result by each number\n4. Prints the final result\n\nFor example: factorial(5) = 1×2×3×4×5 = 120\n\nHint: Use range(1, n+1) to include n",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def calculate_factorial(n):\n    result = 1\n    \n    # Your loop here\n    # Remember: multiply result by each number from 1 to n\n    \n    print(f"Factorial of {n} is {result}")\n\n# Test your function\ncalculate_factorial(5)  # Should print 120\ncalculate_factorial(3)  # Should print 6\ncalculate_factorial(7)  # Should print 5040',
      },
      testCases: [
        {
          input: [5],
          expected: "Factorial of 5 is 120",
          description: "Test factorial of 5",
        },
        {
          input: [3],
          expected: "Factorial of 3 is 6",
          description: "Test factorial of 3",
        },
        {
          input: [7],
          expected: "Factorial of 7 is 5040",
          description: "Test factorial of 7",
        },
      ],
      testMode: "procedure",
      functionToTest: "calculate_factorial",
    } as TestingSectionData,
    {
      kind: "Observation",
      id: "complete-program" as SectionId,
      title: "A Complete Program",
      content: [
        {
          kind: "text",
          value:
            "Let's examine a complete program that uses EVERYTHING you've learned. Run it, then modify it to make it your own:",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          'import turtle\nimport random\nimport math\n\nturtle.speed(0)\n\ndef draw_spiral_flower(petals, base_size, color_list):\n    """A function combining all our concepts"""\n    \n    for petal_num in range(petals):\n        # Choose random color from list (using random library)\n        color = random.choice(color_list)\n        turtle.color(color)\n        \n        # Use math library for smooth curves\n        angle = 360 / petals\n        \n        # Nested loop for spiral petal\n        for i in range(15):\n            # Loop variable creates spiral\n            size = base_size + (i * 2)\n            turtle.forward(size)\n            turtle.right(30)\n        \n        # Return to center\n        turtle.penup()\n        turtle.home()\n        turtle.pendown()\n        \n        # Rotate for next petal\n        turtle.right(petal_num * angle + angle)\n\n# Create list of colors (remember lists?)\ncolors = ["red", "blue", "purple", "green", "orange"]\n\n# Call our function\ndraw_spiral_flower(8, 5, colors)\n\n# Add a message\nturtle.penup()\nturtle.goto(-100, -150)\nturtle.write("Created with Python!", font=("Arial", 16, "normal"))',
      },
    } as ObservationSectionData,
    {
      kind: "MultipleChoice",
      id: "comprehensive-understanding",
      title: "Deep Understanding Check",
      content: [
        {
          kind: "text",
          value:
            "In the code `for i in range(len('hello')):`, what value will i have on the LAST iteration?",
        },
      ],
      options: ["5", "4", "'o'", "'hello'"],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! The string 'hello' has length 5, so range(5) produces [0,1,2,3,4]. The last value of i is 4. This shows how functions (len), strings, and loops all work together!",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Testing",
      id: "ultimate-challenge" as SectionId,
      title: "Ultimate Challenge: Digital Garden",
      content: [
        {
          kind: "text",
          value:
            "Create a 'digital garden' that demonstrates mastery of everything:\n\nRequirements:\n1. A function `draw_plant(height, branches)` that uses loops\n2. A function `draw_garden(rows, cols)` that calls draw_plant in a grid\n3. Use the random library for variety (random heights or colors)\n4. Include at least one nested loop\n5. Use loop variables for positioning or sizing\n6. Add your creative touch!\n\nThis is your masterpiece - show everything you've learned!",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          "import turtle\nimport random\n\nturtle.speed(0)\n\ndef draw_plant(height, branches):\n    '''Draw a single plant with given height and branches'''\n    # Draw stem\n    \n    # Draw branches using a loop\n    \n    # Your creative implementation here\n    pass\n\ndef draw_garden(rows, cols):\n    '''Draw a grid of plants'''\n    # Use nested loops for grid\n    \n    # Call draw_plant for each position\n    \n    # Add variety with random library\n    pass\n\n# Create your garden\n# Make it beautiful and unique!\n",
      },
      testCases: [
        {
          input: [null],
          expected: "PATTERN:digital_garden",
          description: "Test that a garden with multiple plants is created",
        },
      ],
      testMode: "procedure",
      functionToTest: "__main__",
    } as TestingSectionData,
    {
      kind: "PRIMM",
      id: "evolution-primm" as SectionId,
      title: "How Far You've Come",
      content: [
        {
          kind: "text",
          value:
            "Let's look at how the same task has evolved as you've learned more. This shows your growth as a programmer:",
        },
      ],
      example: {
        visualization: "turtle",
        initialCode:
          '# Unit 1: Drawing a square the hard way\n"""\nturtle.forward(50)\nturtle.right(90)\nturtle.forward(50)\nturtle.right(90)\nturtle.forward(50)\nturtle.right(90)\nturtle.forward(50)\nturtle.right(90)\n"""\n\n# Unit 2: Using a function\n"""\ndef draw_square():\n    turtle.forward(50)\n    turtle.right(90)\n    turtle.forward(50)\n    turtle.right(90)\n    turtle.forward(50)\n    turtle.right(90)\n    turtle.forward(50)\n    turtle.right(90)\n"""\n\n# Unit 3 (Now): The power of loops and parameters!\nimport turtle\nimport random\n\nturtle.speed(0)\n\ndef draw_polygon(sides, size):\n    for i in range(sides):\n        turtle.forward(size)\n        turtle.right(360 / sides)\n\ndef draw_pattern(count, min_sides=3, max_sides=8):\n    for i in range(count):\n        sides = random.randint(min_sides, max_sides)\n        size = random.randint(20, 60)\n        color = random.choice(["red", "blue", "green", "purple"])\n        \n        turtle.color(color)\n        draw_polygon(sides, size)\n        turtle.right(360 / count)\n\n# One line creates a complex pattern!\ndraw_pattern(12)',
      },
      predictPrompt:
        "Compare the three approaches. How many lines would the first approach need to create what the last one does in one function call?",
      conclusion:
        "The first approach would need HUNDREDS of lines! You've gone from repetitive typing to elegant, reusable, parameterized functions. This is the power of programming - building complexity from simple, well-designed pieces.",
    } as PRIMMSectionData,
    {
      kind: "Reflection",
      id: "loops-mastery-reflection" as SectionId,
      title: "Complete Mastery Reflection",
      content: [
        {
          kind: "text",
          value:
            "You've mastered loops and seen how they connect to everything else in programming. Reflect on your journey from drawing simple triangles to creating complex algorithmic art.\n\nCreate one final example that showcases your understanding of loops, and explain how loops work together with variables, functions, and libraries. Remember to use the phrase 'as seen in the example above'.",
        },
      ],
      topic: "Loops as the Foundation of Programming",
      isTopicPredefined: true,
      code: "Create your best example showing loops with other concepts",
      isCodePredefined: false,
      explanation:
        "Explain how loops amplify the power of everything else you've learned (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "loops-conclusion",
      title: "Conclusion: Ready for Real Programming",
      content: [
        {
          kind: "text",
          value:
            "Incredible work! You've completed the Loops unit and demonstrated mastery of fundamental programming concepts.\n\nYou now understand:\n- **Loops** eliminate repetition and create patterns\n- **Variables** (including loop variables) store and track changing values\n- **Functions** package reusable code with flexible parameters\n- **Libraries** provide powerful pre-built functions\n- **Errors** are specific and fixable when you understand their types\n- **Indentation** structures your code and determines execution flow\n\nMost importantly, you understand how these pieces work TOGETHER. A loop variable feeding into a calculation, inside a function with parameters, using library functions, all properly indented - this is real programming!\n\nYou started by typing 'print(\"Hello, World!\")' and now you're creating algorithmic art with nested parameterized functions. You're not just following recipes anymore - you're thinking like a programmer, breaking problems into pieces and building solutions.\n\nYou're ready for the next challenge. Whether it's conditionals, data structures, or moving to professional tools like VSCode, you have the foundation to tackle anything. Keep building, keep experimenting, and remember - every expert was once a beginner who kept practicing.\n\nCongratulations, programmer! 🎉",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
