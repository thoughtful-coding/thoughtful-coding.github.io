import type {
  DebuggerSectionData,
  InformationSectionData,
  Lesson,
  LessonId,
  MatchingSectionData,
  MultipleChoiceSectionData,
  PRIMMSectionData,
  ReflectionSectionData,
  SectionId,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Inputs to Functions",
  guid: "ab5bed79-7662-423e-90ef-952539f59099" as LessonId,
  description: "Learn how to make functions more flexible with inputs",
  sections: [
    {
      kind: "PRIMM",
      id: "primm-greet-person-function" as SectionId,
      title: "Functions with Inputs",
      content: [
        {
          kind: "text",
          value:
            'Ok, now it\'s time to learn how to make functions a little more "general". Below is some Python code that **defines** and **calls** the `greet_person()` function. Notice that there is now a variable *between the parentheses*. Predict what the code below will output, then run it to check your prediction.',
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def greet_person(name):\n  print("Hello there " + name + "!")\n\ngreet_person("Ben")\ngreet_person("Meg")\n',
      },
      predictPrompt: "What do you think will happen when you run the code?",
      conclusion: `Calling a function with different "inputs" allows them to mold to the situation.`,
    } as PRIMMSectionData,
    {
      kind: "MultipleChoice",
      id: "variable-reassignment",
      title: "Input Values",
      content: [
        {
          kind: "text",
          value: `As you saw above, you can pass different values (inputs) to a function and have the function act differently. What happens is the following:\n1. You define the function with \`def\` and the name\n2. Inside the parentheses, you state the inputs/variables the function should take\n3. You call the function, passing the inputs in via the call\n\nBased on what you observed in the previous section, what will be printed out if you call the function with the code \`greet_person("Bill")\`?`,
        },
      ],
      options: [
        "`Hello there + name + !`",
        "`Hello there Bill!`",
        "`greet_person(name)`",
        "`Hello there name!`",
      ],
      correctAnswer: 1,
      feedback: {
        correct:
          'Correct! The value `"Bill"` gets stored in the functions `name` input variable',
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Information",
      id: "function-pieces",
      title: "Function Parts",
      content: [
        {
          kind: "text",
          value:
            'Let\'s revisit the parts of a function from the previous lesson... mostly because we lied to you a bit. There\'s really **five** pieces:\n1. `def` starts "defining" the function\n2. `greet_person` is name of the function\n3. The **input variables** inside the parentheses are variables, waiting to be set by the function call\n4. The indented code below the `def greet_person(name):` is the code the function will run\n5. The unindented `greet_person()` "calls" the function with particular **input values**',
        },
      ],
    } as InformationSectionData,
    {
      kind: "Matching",
      id: "matching-function-pieces" as SectionId,
      title: "Matching Function Parts",
      content: [
        {
          kind: "text",
          value:
            "Knowing that there are five core parts of a function, match up the pieces of the function below with its value in the code.",
        },
        {
          kind: "code",
          value:
            'def favorite(animal):\n  val = "My favorite animal is a " + animal + "!"\n  print(val)\n\nfavorite("cat")',
        },
      ],
      prompts: [
        { "Function name": "favorite" },
        { "Function input variable": "animal" },
        { "Function input value": '"cat"' },
      ],
    } as MatchingSectionData,
    {
      kind: "Debugger",
      id: "variable-debugging" as SectionId,
      title: "Watching Variables Change",
      content: [
        {
          kind: "text",
          value:
            "Let's dive into how a function call **with inputs** work. Below is a small program where we greet Bill with three different phrases. Step through each line of the program. The most important thing to notice is every time a function is called, the input value of the function call gets stored into the function's `phrase` input variable. In total, you go in and out of the function three times, each time with a different input value.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'def greet_bill(phrase):\n  print(phrase + " Bill!")\n\ngreet_bill("Yo")\ngreet_bill("What up")\ngreet_bill("Hi")\nprint("All done")',
      },
      advancedControls: false,
    } as DebuggerSectionData,
    {
      kind: "MultipleChoice",
      id: "problem-function-input-1-question",
      title: "Single Input, What's the Output?",
      content: [
        {
          kind: "text",
          value: "What would the following program print out?",
        },
        {
          kind: "code",
          value:
            "def math_stuff(x):\n    y = x + x\n    print(y + 1)\n\nmath_stuff(7)",
        },
      ],
      options: ["9", "10", "13", "15"],
      correctAnswer: 3,
      feedback: {
        correct: "Correct!",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "MultipleChoice",
      id: "problem-function-input-2-question",
      title: "Multiple Inputs, What's the Output?",
      content: [
        {
          kind: "text",
          value:
            "You aren't limited to a single input variable for functions. You can actually use as many as your would like. For example, in the program below, the function has three input variables: `x`, `y`, and `z` input variables . The **function call** then provides three input values for these input variables:\n- `5` -> `x`\n- `2` -> `y`\n- `3` -> `z`.\n\nBased on this explanation, what would the following program print out?",
        },
        {
          kind: "code",
          value:
            "def math_stuff(x, y, z):\n    a = x * y * z\n    print(z)\n\nmath_stuff(5, 2, 3)",
        },
      ],
      options: ["13", "15", "30", "100"],
      correctAnswer: 2,
      feedback: {
        correct: "Correct!",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Reflection",
      id: "function-with-inputs-reflection" as SectionId,
      title: "Functions With Inputs Reflection",
      content: [
        {
          kind: "text",
          value:
            'Having functions with input variables allows them to become much more useful. This, in turn, means that they provide you with many more opportunities to "fold" your program: assuming you can find the repeating patterns. \n\nNow it\'s time to reflect to formalize your knowledge. Create a simple 3-4 line code example that demonstrates how a function with one (or multiple) input variables works and then write 3-4 sentences explaining how your program works. Remember to use the phrase "as seen in the example above".',
        },
      ],
      topic: "Functions With Inputs",
      isTopicPredefined: true,
      code: "Create an example showing the definition and calling of a function that takes input(s)",
      isCodePredefined: false,
      explanation: "Explain how the code in example works (3-4 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "functions-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "Congratulations on learning about functions! You now understand how to define and call your own functions. Identifying places where you can create and use functions is one of the core parts of being a programmer.\n\nOver the previous three lessons, you've learned some of the most important concepts in programming. They will come up over and over again. In the next lesson, we'll pause and test ourselves on everything we've learned so far.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
