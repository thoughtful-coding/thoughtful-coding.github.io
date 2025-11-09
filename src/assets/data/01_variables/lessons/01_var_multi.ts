import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  DebuggerSectionData,
  MultipleChoiceSectionData,
  PRIMMSectionData,
  MatchingSectionData,
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
            "If you were to insert the line `students_count = students_count + 16` between the first and second line of the example from the video, what would be printed out?",
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
            'It\'s time to increase the degree of difficulty by using _multiple_ variables. This is very common when a program needs to operate on different pieces of data. When this happens, each variable has its own name and stores its own, independent value.\n\nStep line-by-line through the code below and watch how each variable maintains its own, separate value. As before, pay attention to the `Variables` and `Program Output` side-panels. If you go slow, you can see how different values pop in and out of the memory slots designated by the "variable labels".',
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
            "If you were to insert the line `students_count = students_count + 16` between the first and second line of the example from the video, what would be printed out?",
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
      kind: "Information",
      id: "variables-single",
      title: "Short Term Memory",
      content: [
        {
          kind: "text",
          value:
            'An important thing to understand is that variables can only remember one thing at a time. As soon as their value is updated, they have no way to "remember" what their previous value was.\n\nConsider the line of code `x = x + 1`. The computer handles this line in two distinct parts. First, it calculates what the stuff to the **right** of the equal sign (the value) should be. Then, it saves this value into the variable on the **left** side of the equal sign. In the end, there\'s no way to know what the original value of `x` was.',
        },
      ],
    } as InformationSectionData,
    {
      kind: "PRIMM",
      id: "switch-values-primm" as SectionId,
      title: "Switching Values",
      content: [
        {
          kind: "text",
          value:
            "A common problem in programming is to switch (swap) the values stored in two variables. For example, if you have the variables `x` and `y`, you might want to store the value of `x` into `y` and the value of `y` into `x`. Unfortunately, the fact that variables can only store one value at a time can make this tricky.\n\nPredict what this program will output, then run it to check your prediction.",
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
