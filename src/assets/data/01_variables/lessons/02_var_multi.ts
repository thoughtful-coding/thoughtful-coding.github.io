import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  DebuggerSectionData,
  MultipleChoiceSectionData,
  PRIMMSectionData,
  MatchingSectionData,
  MultipleSelectionSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Multiple Data Streams",
  guid: "aa145d0e-68cb-44b2-a484-8d7ab19e2810" as LessonId,
  description:
    "Learn how to handle and utilize multiple variables to create complex interactions.",
  sections: [
    {
      kind: "Information",
      id: "variables-perspective",
      title: "A Different Perspective on Variables",
      content: [
        {
          kind: "text",
          value:
            "The more ways you can see, hear, touch, or smell what you're learning, the more likely you are to remember it. Interacting with new information in different ways is a technique called **dual encoding** and it's one of the best ways to form strong connections in your brain.\n\nFor this reason, where applicable, we've included images and videos to augment the lessons. In this case, the video below talks about variables and explains how they hold different data types in \"slots\" of memory in the computer. You can almost view variables as labels for the memory holding the data you want to store.",
        },
        {
          kind: "video",
          src: "https://www.youtube.com/watch?v=cQT33yu9pY8",
          start: 4,
          end: 57,
        },
      ],
    } as InformationSectionData,
    {
      kind: "MultipleChoice",
      id: "variable-reassignment",
      title: "Variable Values",
      content: [
        {
          kind: "text",
          value:
            "The program below recreates the example from the video. If you were to insert the line `students_count = students_count + 16` **between the first and second lines**, what would be printed out?",
        },
        {
          kind: "code",
          value: "students_count = 1000\nprint(students_count)\n",
        },
      ],
      options: ["16", "428", "1016", "Error"],
      correctAnswer: 2,
      feedback: {
        correct: "Correct!",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Debugger",
      id: "multiple-variables-debugging" as SectionId,
      title: "Watching Multiple Variables Change",
      content: [
        {
          kind: "text",
          value:
            'It\'s time to increase the degree of difficulty by using _multiple variables_ in a single program. This is very common when a program needs to operate on different pieces of data as it runs. When this happens, each variable has its own unique name and stores its own independent value.\n\nStep line-by-line through the code below and watch how each variable maintains its own, separate value. As before, pay attention to the `Variables` and `Program Output` side-panels. If you go slow, you can see how different values pop in and out of the memory slots designated by the "variable labels".',
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'first_name = "Eric"\nlast_name = "Smith"\nage = 25\nfirst_name = first_name + "a"\nage = age + 10\nprint(first_name + " " + last_name)\nage = age + 3\nprint(age)',
      },
    } as DebuggerSectionData,
    {
      kind: "MultipleChoice",
      id: "variable-value-tracking",
      title: "Variable Value Tracking",
      content: [
        {
          kind: "text",
          value:
            "The program below uses **six different variables**. See if you can track the the different values of each variable in order to determine what would be printed out after the program was run.",
        },
        {
          kind: "code",
          value:
            'num_1 = "6"\nnum_2 = "3"\nresult_1 = num_1 + num_2\n\nnum_3 = 5\nnum_4 = 2\nresult_2 = num_3 + num_4\n\nprint(result_1)\nprint(result_2)\n',
        },
      ],
      options: ["63 then 52", "63 then 7", "9 then 7", "9 then 52"],
      correctAnswer: 1,
      feedback: {
        correct: "Correct!",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "PRIMM",
      id: "switch-values-primm" as SectionId,
      title: "Switching Values",
      content: [
        {
          kind: "text",
          value:
            'As stated in the previous lesson, variables can only remember one thing at a time. As soon as their value is updated, they have no way to "remember" what their previous value was.\n\nThis inability to remember previous values can make some things that seem easy a bit trickier than expected. For example, a common problem in programming is to switch (swap) the values stored in two variables. The program below tries to do this by saving what was in `y` into `x` (line 3) and saving what was in `y` into `x` (line 4). Unfortunately, there\'s an issue with this approach.\n\nPredict what this program will output, then run it to check your prediction.',
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'x = "Hello"\ny = "Goodbye"\nx = y\ny = x\nprint(x)\nprint(y)',
      },
      predictPrompt:
        "The program is attempting to swap the values stored in `x` and `y`. What do you think the program will output?",
      conclusion:
        'Since variables can only remember a single value, `"Hello"` gets lost when the value of `y` is stored into `x`!',
    } as PRIMMSectionData,
    {
      kind: "Matching",
      id: "switch-values-question" as SectionId,
      title: "Properly Switch Values",
      content: [
        {
          kind: "text",
          value:
            'To properly switch values, you need something called a "holder variable". This is a third variable to store the value of one of the variables so its doesn\'t get lost during the updates.\n\nOrder the following lines of a program so that `x` gets the value of `y` and `y` gets the value of `x`.',
        },
      ],
      prompts: [
        { "Line 1": "holder = x" },
        { "Line 2": "x = y" },
        { "Line 3": "y = holder" },
      ],
      feedback: {
        correct:
          "Correct! You fist need to save the value of `x` so it doesn't later get lost.",
      },
    } as MatchingSectionData,
    {
      kind: "MultipleSelection",
      id: "variable-summary",
      title: "Variable Values",
      content: [
        {
          kind: "text",
          value: "Blah blah blah. Select all that apply.",
        },
      ],
      options: ["16", "428", "1016", "Error"],
      correctAnswers: [2],
      feedback: {
        correct: "Correct!",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Information",
      id: "variables-conclusion",
      title: "Conclusion",
      content: [
        {
          kind: "text",
          value:
            "Great job learning about some of the complexities of variables! The more practice you have, the easier it will be to understand when and how to use variables and how to debug any issues that pop up while you're using them.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
