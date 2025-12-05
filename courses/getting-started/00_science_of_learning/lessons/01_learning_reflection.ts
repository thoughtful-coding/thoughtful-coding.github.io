import type {
  InformationSectionData,
  Lesson,
  LessonId,
  ReflectionSectionData,
  MultipleChoiceSectionData,
  MultipleSelectionSectionData,
} from ".././../../types/data";

const lessonData: Lesson = {
  title: "Reflective Learning",
  guid: "3c201468-453b-42f3-a4f6-51a0ad3c93f8" as LessonId,
  description:
    "Without reflection there is no learning. See how this website leverages AI to help you reflect, correct, and internalize new information.",
  sections: [
    {
      kind: "Information",
      id: "reflection-intro",
      title: "The Importance of Reflection",
      content: [
        {
          kind: "text",
          value:
            'There is a quote by a philosopher named John Dewey that sums up this website\'s approach: "We do not learn from experience. We learn from reflecting on experience." AI provides a new and unique opportunity to engage in reflective learning. This lesson showcases another powerful learning tool that this website has in its tool belt: reflection.',
        },
      ],
    } as InformationSectionData,
    {
      kind: "MultipleChoice",
      id: "reflection-quiz",
      title: "Why Reflection?",
      content: [
        {
          kind: "text",
          value:
            "Why do you think reflection such a powerful tool in learning?",
        },
      ],
      options: [
        "It proves to the teacher that you did the work.",
        "It forces you to retrieve information and organize it in your own words.",
        "It's the fastest way to get through a lesson.",
        "It allows you to skip the parts of the code you don't understand.",
      ],
      correctAnswer: 1,
      feedback: {
        correct:
          "Correct! Re-organizing and explaining concepts is a proven way to build stronger, more durable knowledge.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Information",
      id: "reflection-analysis",
      title: "The Importance of Reflection",
      content: [
        {
          kind: "text",
          value:
            'Reflecting on things that you struggled with and then forcing yourself to articulate **why** you struggled is an incredibly powerful learning tool. This form of "journaling" can then act as a record of everything you\'ve learned in case you get stuck sometime later. These types of journals are considered best practice for anyone who takes their learning seriously: think of a scientist\'s notebook or a writer\'s journal.\n\nAs with PRIMM, AI has the potential to super-charge reflection. This is because it can provide quick feedback on mistakes. In addition, it can provide a "speed bump" to make you slow down and take the reflection seriously. Below is an example reflection section. You complete it by:\n1. Choosing the topic (since it\'s the first time, we\'ve set it to `How Print Works`)\n2. Creating a small code example (also set)\n3. Explaining how the code works\n4. Asking the AI if there is any room for improvement\n\nThe section forces you to iterate with AI to improve your code/analysis until you demonstrate deep understanding. Basically, you aren\'t "allowed" to submit and complete the section until the AI gives you at least a "mostly understands" on a scale of poor, developing, mostly, and fully. Annoying? A bit! Effective? Definitely! Try it out below.',
        },
      ],
    } as InformationSectionData,
    {
      kind: "Reflection",
      id: "print-reflection",
      title: "Using Reflection for Learning",
      content: [
        {
          kind: "text",
          value: "Explain in your own words how print statements work.",
        },
      ],
      topic: "How Print Works",
      isTopicPredefined: true,
      code: 'print("Hello, World!")\nprint("Can I call myself a programmer now?")',
      isCodePredefined: true,
      explanation: "Explain how your example works (3-4 sentences)",
      isExplanationPredefined: false,
      extraContext:
        "So far students have _only_ learned about the print statement. They have not been introduced to strings, new lines, or even functions. They have only a simple program with two print statements and its output after running it.",
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "understanding-ai-feedback",
      title: "Understanding the AI Feedback",
      content: [
        {
          kind: "text",
          value:
            'The AI is intended to act as a guide and a "speed bump". What is basically happening is the website sends your entire journal entry to a ChatBot and asks it to assess it using a rubric designed for people learning to program.\n\nThe best way to approach reflection sections is to pretend you are writing for some future version of yourself who doesn\'t quite remember a topic. Keep the entries short and to the point. Using the magic phrase **"as seen in the example above"** will really help because it will keep your analysis aligned with the code.',
        },
      ],
    } as InformationSectionData,
    {
      kind: "MultipleSelection",
      id: "learning-through-reflection-quiz",
      title: "Getting the Most Out of Reflection",
      content: [
        {
          kind: "text",
          value:
            "Which of the following will allow you to get the most out of the Reflection + AI combo? Select all that apply.",
        },
      ],
      options: [
        "Being hasty so you can get to the next lesson quickly",
        "Being honest in identifying things you don't understand",
        "Being careful in constructing the simplest example possible",
        "Being specific as you discuss important parts of the example",
        "Being open to feedback from the AI",
      ],
      correctAnswers: [1, 2, 3, 4],
      feedback: {
        correct:
          "Correct! Reflection is work, but it's work that will solidify your understanding of difficult topics.",
      },
    } as MultipleSelectionSectionData,
    {
      kind: "Information",
      id: "reflection-wrap-up",
      title: "Wrapping Up Reflection",
      content: [
        {
          kind: "text",
          value:
            "There's only one last thing to know about reflection sections. All of your submitted entries are stored in a special section of this website. If you click on the `Learning Entries` tab at the top of the page, you will see the first of your finalized entries. Think of this as a special section you can go to if you ever have a nagging feeling you've already solved a particular problem.\n\nThat's it! Hopefully you can appreciate why this website pushes you towards reflection so strongly. Deep learning isn't easy and this website is designed to help nudge you towards expanding your own understanding. If you predict specifically, interpret critically, and reflect honestly, you'll be well on your way to becoming a great programmer.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
