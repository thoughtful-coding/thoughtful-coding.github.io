import type {
  InformationSectionData,
  Lesson,
  ObservationSectionData,
  LessonId,
  SectionId,
  MultipleSelectionSectionData,
  PRIMMSectionData,
  DebuggerSectionData,
  MultipleChoiceSectionData,
  MatchingSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Python Basics",
  guid: "eeee0332-e7ec-4e6a-b0c6-f9c9890999c5" as LessonId,
  description:
    "Welcome to your first Python lesson! In this lesson, you'll learn how computers work and see them execute in slow motion.",
  sections: [
    {
      kind: "Information",
      id: "python-history",
      title: "The History of Python",
      content: [
        {
          kind: "text",
          value:
            "Python was first released in 1991. Since then, it has become a very popular language because of its clean syntax and the way that well-written Python programs almost read like English prose.",
        },
        {
          kind: "image",
          src: "data/00_intro/images/simple_program.png",
          alt: "Screenshot of a simple Python program in VSCode",
          maxWidthPercentage: 70,
        },
        {
          kind: "text",
          value:
            "Learning Python is great for formalizing your understanding of difficult topics and sharing your ideas with others. In this lesson, you'll learn how computers work and how they can be used to print out useful information.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Observation",
      id: "print-function" as SectionId,
      title: "Printing Stuff",
      content: [
        {
          kind: "text",
          value:
            "Computers wouldn't be of any use if they couldn't communicate with their users. The `print()` statement is used to display output to the user. It's one of the most basic and frequently used bits of code in Python.\n\nLet's start with the [classic](https://en.wikipedia.org/wiki/%22Hello,_World!%22_program) \"Hello, World!\" example. Run the code below by clicking the `Run Code` button. You will see how the program produces two outputs: one line for each value inside a print statement.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'print("Hello, World!")\nprint("Can I call myself a programmer now?")\n',
      },
    } as ObservationSectionData,
    {
      kind: "Debugger",
      id: "line-by-line-debugging" as SectionId,
      title: "Watching a Computer Work",
      content: [
        {
          kind: "text",
          value:
            "The first, and perhaps most important thing to understand is that computers are **mindlessly literal**. They don't \"understand\" your code; they just follow your instructions one line at a time.\n\nTo see this in action, we'll use the **Debugger**. The debugger is one of the most important tools in programming. It lets you watch the computer execute your program step-by-step.\n\nClick the `Enter Debug Mode` button and use the `Step` button to run each line of the program. Pay attention to:\n- How the `Program Output` panel only changes *after* a `print` line is executed\n- How the computer goes executes each line of code in order",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'print("Hello, World!")\nprint("Can I call myself a programmer now?")\n',
      },
    } as DebuggerSectionData,
    {
      kind: "MultipleSelection",
      id: "debugging-lessons",
      title: "What Did You See?",
      content: [
        {
          kind: "text",
          value:
            "Based on your experience with the Debugger, select the three statements below that are true.",
        },
      ],
      options: [
        "The computer starts executing at the top of the program",
        "The computer waits until the end of the program to output anything",
        "The computer runs each line of code twice to check its work",
        "The computer outputs information to the user as it runs",
        "The computer executes instructions one at a time, in order",
      ],
      correctAnswers: [0, 3, 4],
      feedback: {
        correct:
          "Correct! Computers are simple: they start at the top and run one line at a time to the end, doing exactly what they're told.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "MultipleChoice",
      id: "mindless-machine-quiz",
      title: "The Mindless Machine",
      content: [
        {
          kind: "text",
          value:
            'Hopefully that experience showed you that computers don\'t do anything special: they simply follow the instructions they are given. They really are mindless machines.\n\nIf you ask a computer to do `2 + 2` what does the computer "think"?',
        },
      ],
      options: [
        '"The user is doing math. I should get my math chip ready."',
        '"I know math can be hard for humans, so I will double check my work."',
        '"I have been given an an input `2 + 2`. I will execute the `2 + 2` operation."',
        '"This is a simple problem. I should check if there\'s a harder one."',
      ],
      correctAnswer: 2,
      feedback: {
        correct:
          "Correct! The computer doesn't 'think' or 'understand.' It just *executes* the instructions it's given, step-by-step.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "PRIMM",
      id: "empty-print-primm" as SectionId,
      title: "Useless Work is Still Work",
      content: [
        {
          kind: "text",
          value:
            'Because computers are mindlessly literal, they\'re perfectly happy running "useless" instructions. Below is an example of this. There are a bunch of `print()` statements without anything in them. First, predict what you think the code will do when you run it and then see if your prediction is correct. Finally, use the feedback from AI to correct/refine your mental model.',
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'print("Hello, World!")\nprint()\nprint()\nprint()\nprint("Can I call myself a programmer now?")\n',
      },
      predictPrompt:
        "What do you think the computer will output for the given program?",
      conclusion:
        'The computer ran every single line of code, even the "useless" ones. The empty `print()` commands just told the computer to print a blank line, and it did so, mindlessly.',
    } as PRIMMSectionData,
    {
      kind: "Debugger",
      id: "useless-work-debugging" as SectionId,
      title: "Watching Useless Work",
      content: [
        {
          kind: "text",
          value:
            'You just *predicted* what the code with blank lines would do. Now, let\'s *watch* it happen in the debugger. Use the `Step` button again to run each line of code in the program. Notice how the computer "executes" `print()` just as seriously as it executes `print("Hello, World!")`. It\'s just following instructions.',
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'print("Hello, World!")\nprint()\nprint()\nprint()\nprint("Can I call myself a programmer now?")\n',
      },
    } as DebuggerSectionData,
    {
      kind: "PRIMM",
      id: "syntax-error-primm" as SectionId,
      title: "Computers Don't Understand Typos",
      content: [
        {
          kind: "text",
          value:
            "Computers are *so* mindlessly literal that they can't even understand a simple typo. The program below is *almost* correct, but it has a small error: `print()` is misspelled as `printt()`. Predict what you think will happen when you run the program.",
        },
      ],
      example: {
        visualization: "console",
        initialCode: 'printt("This line has a typo")\nprint("Goodbye!")',
      },
      predictPrompt:
        "What will happen? Will the first line print? Will the computer fix the typo? Will it print an error?",
      conclusion:
        "The computer tried to run but then became confused by the misspelled word. This is why programmers must be so precise.",
    } as PRIMMSectionData,
    {
      kind: "Matching",
      id: "intent-vs-syntax-matching" as SectionId,
      title: "Programmer vs. Computer",
      content: [
        {
          kind: "text",
          value:
            "A programmer has *intent* (what they *want* to do), but the computer only sees *syntax* (what you *wrote*). Match the programmer's intent to what the literal computer actually does.",
        },
      ],
      prompts: [
        {
          'Intent: `printt("Hello")`':
            "Crashes because doesn't know what `printt()` means.",
        },
        {
          "Intent: `print()`":
            "Executes the instruction and prints a blank line.",
        },
        {
          'Intent: `print("Hello")`': 'Executes and prints the "Hello"',
        },
        {
          'Intent: `print("Hlelo")`': 'Executes and prints the "Hlelo"',
        },
      ],
      feedback: {
        correct:
          "Perfect! The core challenge of programming is that the computer never understands what you *want*, only what you *write*.",
      },
    } as MatchingSectionData,
    {
      kind: "Information",
      id: "programmers-job-info",
      title: "The Programmer's Job",
      content: [
        {
          kind: "text",
          value:
            "You've now seen two ways computers are \"stupid\":\n1.  **Mindless Execution:** They'll run \"useless\" code like `print()` over and over\n2.  **Literal Rule-Following:** They'll crash on a simple typo like `printt`\n\nThis is the core challenge of programming! The computer is a powerful but *literal* tool. Our job as programmers is to provide **perfect, step-by-step** instructions.\n\nIn the next section, you'll investigate how to output your own custom text and write your first few Python programs.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
