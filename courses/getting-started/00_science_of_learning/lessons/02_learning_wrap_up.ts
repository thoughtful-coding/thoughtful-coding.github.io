import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  MultipleChoiceSectionData,
} from "../../../../src/types/data";

const lessonData: Lesson = {
  title: "The Science Behind the Method",
  guid: "dbd45993-6473-4df3-959a-04b7289a229e" as LessonId,
  description:
    "Learning is a well researched process. Understand what best practices are and how this website aligns with them.",
  sections: [
    {
      kind: "Information",
      id: "learning-techniques-intro",
      title: "Why This Works",
      content: [
        {
          kind: "text",
          value:
            "You've just experienced the core learning strategies of this website: PRIMM and Reflection. These aren't random activities; they're built on well-researched best practices for learning complex skills. Understanding these strategies will not only help you get the most out of this site, but will help you learn pretty much anything more effectively.\n\nAcross all fields, the core techniques for learning are: _spaced-practice_, _interleaving_, _retrieval-practice_, _elaboration_, _concrete examples_, and _dual coding_. Each of these techniques exercise your brain and create complex webs of connections that improve your understanding. For more information about how each of these techniques help you learn, [click here](https://cognitiveresearchjournal.springeropen.com/articles/10.1186/s41235-017-0087-y).",
        },
      ],
    } as InformationSectionData,
    {
      kind: "MultipleChoice",
      id: "best-practice-quiz" as SectionId,
      title: "Not Best Practice?",
      content: [
        {
          kind: "text",
          value:
            "Which of the following **is not** one of the learning best-practices?",
        },
      ],
      options: [
        "Elaboration",
        "Spaced Practice",
        "Timed Focus",
        "Interleaving",
        "Concrete Examples",
      ],
      correctAnswer: 2,
      feedback: {
        correct: "Correct!",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Information",
      id: "active-reading" as SectionId,
      title: "Active Reading is Hard",
      content: [
        {
          kind: "text",
          value:
            "I'm going to bet that a fair number of you had to go back and reread the `Learning Best Practices` section once you realized that there was a quiz on it. This is because _just_ reading information and learning from it is hard. This is the reason why this website has so many PRIMM, reflection, and quiz sections. This approach maximizes active learning and deepens your understanding.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "MultipleChoice",
      id: "retrieval-practice-quiz",
      title: "Learning Through Retrieval Practice",
      content: [
        {
          kind: "text",
          value:
            "While this website uses all six of the above learning techniques, several are particularly prominent. One featured technique is _spaced practice_: basically the opposite of cramming. _Spaced practice_ is about practicing retrieving your knowledge over an extended period of time. It's a bit like the gym: you can go and do every exercise in a single day, but you'll get much better results if you make a habit of going.\n\nBased on this explanation what do you think is the optimal strategy for approaching this website?",
        },
      ],
      options: [
        "Do as much as possible as you can in a single day",
        "Wait until the last minute to do anything so it's fresh",
        "Do a few things a day so you practice recalling information",
        "Change strategies over time to keep yourself on your toes",
      ],
      correctAnswer: 2,
      feedback: {
        correct:
          "Correct! Practicing retrieval from your long-term memory is both about the number of reps AND consistency over time.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Information",
      id: "best-practice-wrap-up" as SectionId,
      title: "Wrapping Up",
      content: [
        {
          kind: "text",
          value:
            "The goal of this lesson isn't to make you a philosopher of learning. It's to prove to you that the techniques utilized in this website have been proven to be effective. In fact, these techniques will help you learn more effectively no matter what you're focused on.\n\nThe important thing to keep in mind is that learning isn't easy. It's an active process that requires effort. This website utilizes best practice learning techniques that are proven to work. If you're willing to put forth the effort, you have the opportunity to learn more effectively and deeply. Good luck as you move onto learning Python!",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
