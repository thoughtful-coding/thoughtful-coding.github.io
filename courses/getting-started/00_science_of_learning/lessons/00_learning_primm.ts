import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  MultipleSelectionSectionData,
  PRIMMSectionData,
  MatchingSectionData,
  ObservationSectionData,
} from "../../../../src/types/data";

const lessonData: Lesson = {
  title: "A Guided Tour: PRIMM",
  guid: "f950d6b1-7c06-485c-8a23-9cd17f72a7ba" as LessonId,
  description:
    "PRIMM is a paradigm for learning programming. It allows you to take small steps from basic understanding all the way up to code creation.",
  sections: [
    {
      kind: "Information",
      id: "thoughtful-intro",
      title: "Thoughtful Intro",
      content: [
        {
          kind: "text",
          value:
            "Welcome to _Thoughtful Python_! We hope that this will serve as a first step in your journey towards the ability to read and write programs that empower you to do great things.\n\nFirst things first: programming is difficult! It's a lot like learning a new language. It requires a whole new way of thinking in order to express your ideas. Also, it requires a lot of practice!",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Observation",
      id: "running-code" as SectionId,
      title: "Running Code",
      content: [
        {
          kind: "text",
          value:
            "This website is designed to allow you to quickly write, run, and debug programs. Below is your first program. Run it by clicking the `Run Code` button. Once it is done executing, compare the program with the resulting output to try and understand what is happened.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'print("Hello, World!")\nprint("Can I call myself a programmer?")',
      },
    } as ObservationSectionData,
    {
      kind: "Information",
      id: "primm-history",
      title: "A Systematic Approach",
      content: [
        {
          kind: "text",
          value:
            "That was interesting, but here's the issue: if all you do is run code and copy examples, you're not really learning to think like a programmer. For this reason, this website takes a very opinionated approach to learning by using a method called PRIMM. PRIMM is based on the realization that people often struggle to learn programming because writing a program from scratch involves **a lot of things happening all at once**. For novices, handling all the necessary details can quickly become overwhelming.\n\nPRIMM (which stands for Predict, Run, Investigate, Modify, Make) is a way of learning to program that mimics how real software engineers work. Very rarely do engineers create something from scratch. Instead, they start with something that's close and then slowly mold it to be what they want.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Matching",
      id: "primm-matching" as SectionId,
      title: "Matching PRIMM",
      content: [
        {
          kind: "text",
          value:
            "Based on the definition above, match each part of PRIMM with what you think its purpose is:",
        },
      ],
      prompts: [
        { PREDICT: "Force yourself to try and understand a program" },
        {
          RUN: "Generate results to compare them with your expectations",
        },
        { INVESTIGATE: "Understand any mistakes in your mental model" },
        { MODIFY: "Challenge yourself to expand on the existing ideas" },
        { MAKE: "Challenge yourself to implement your own ideas" },
      ],
    } as MatchingSectionData,
    {
      kind: "PRIMM",
      id: "print-primm" as SectionId,
      title: "Using PRIMM on Code",
      content: [
        {
          kind: "text",
          value:
            "Now, let's try the PRIMM way of learning so you can experience the difference. Below is a PRIMM-ified version of the code you ran above. To complete this section, you must:\n1. Predict what will happen\n2. Run the program\n3. Investigate the output and explain what (if anything) was wrong with your prediction\n\n\nThe key is to be as **specific as possible** in your prediction and interpretation.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'print("Hello, World!")\nprint("Now can I call myself a programmer?")',
      },
      predictPrompt: "What do you think the program will print out?",
      conclusion:
        "PRIMM increases learning by making you read code carefully and then address anything you got wrong",
    } as PRIMMSectionData,
    {
      kind: "Information",
      id: "ai-feedback",
      title: "PRIMM + AI",
      content: [
        {
          kind: "text",
          value:
            "There are two things to notice from the previous section:\n1. PRIMM is a way of systematically approaching new code\n2. This website uses AI to supercharge PRIMM\n\nIf you look at the final few lines in the section, you'll see that AI gave you feedback on what you wrote. This website has been designed to use AI to catch (and explain) any mistakes you might make AND to keep you honest with yourself.\n\nPRIMM works best when you push yourself to make specific predictions and carefully interpret the output. The AI prevents you from coasting and moving too fast. Put another way, the AI is there to make sure you're actually learning.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "MultipleSelection",
      id: "learning-through-primm-quiz",
      title: "Getting the Most Out of PRIMM",
      content: [
        {
          kind: "text",
          value:
            "Which of the following will allow you to get the most out of a PRIMM + AI combo? Select all that apply.",
        },
      ],
      options: [
        "Be specific in your prediction",
        "Be verbose to let the AI know you're smart",
        "Be critical in your interpretation",
        "Be careful when reading the AI's feedback",
      ],
      correctAnswers: [0, 2, 3],
      feedback: {
        correct:
          "Correct! The more you open yourself up to feedback, the more opportunity there is to learn.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Information",
      id: "primm-wrap-up" as SectionId,
      title: "Wrapping Up PRIMM",
      content: [
        {
          kind: "text",
          value:
            "Hopefully you can appreciate the power of PRIMM + AI. PRIMM is a systematic way of approaching code that's proven to work. The AI is there to help you slow down, focus on important concepts, and provide hints when you're confused.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
