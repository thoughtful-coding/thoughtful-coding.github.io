import type {
  InformationSectionData,
  Lesson,
  LessonId,
  SectionId,
  PRIMMSectionData,
  ObservationSectionData,
  MultipleChoiceSectionData,
  TestingSectionData,
  ReflectionSectionData,
} from "../../../../types/data";

const lessonData: Lesson = {
  title: "Mad Libs",
  guid: "c9f1g4h3-5e6d-7c8b-0g1f-3c4d5e6f7g8h" as LessonId,
  description:
    "Create entertaining Mad Libs stories and discover how f-strings help computers communicate with humans.",
  sections: [
    {
      kind: "Information",
      id: "welcome-to-madlibs",
      title: "Welcome to Mad Libs!",
      content: [
        {
          kind: "text",
          value:
            'Did you ever play Mad Libs as a kid? They\'re fill-in-the-blank stories where you provide random words (like "purple", "elephant", or "dance") without knowing the story. Then those words get plugged into a template, creating unexpected results. The image below shows an example of what Mad Libs look like.',
        },
        {
          kind: "image",
          src: "data/02_strings/images/mad_libs.png",
          maxWidthPercentage: 60,
          alt: "Mad Libs example",
        },
        {
          kind: "text",
          value:
            "As you can see in the example, the Mad Libs are basically a template. Mad Libs are perfect for practicing f-strings because:\n- The template is the f-string\n- The variables are the words you choose\n- The output is a unique story every time\n\nIn this lesson, you'll create your own Mad Libs stories. Along the way, you'll come to understand something deeper about how computers and humans communicate.",
        },
      ],
    } as InformationSectionData,
    {
      kind: "Observation",
      id: "first-madlib" as SectionId,
      title: "Your First Mad Lib",
      content: [
        {
          kind: "text",
          value:
            "Let's see a Mad Libs in action! The code below has a simple story template with four blanks. Run it once to see the story, then change the variable values and run it again. Notice how the same code creates completely different stories!",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'name = "Sarah"\nanimal = "dragon"\nnumber = 4\nplace = "library"\nadjective = "mysterious"\n\nprint(f"Once upon a time, {name} went to the {place}.")\nprint(f"There, they found {number} {adjective} {animal}s.")\nprint(f"The {animal}s said hello to {name}!")',
      },
    } as ObservationSectionData,
    {
      kind: "PRIMM",
      id: "predict-silly-story" as SectionId,
      title: "Well That Was Weird",
      content: [
        {
          kind: "text",
          value:
            "One of the best parts of Mad Libs is seeing unexpected word combinations. Below is a Mad Libs with some very creative variable values. Predict what ridiculous story will be created:",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          'amount = 3\nadjective = "sparkly"\nanimal = "elephant"\nplace = "dentist office"\nverb = "juggled"\n\nprint(f"The {adjective} {animal} walked into the {place}.")\nprint(f"Everyone stared as the {animal} {verb} {amount} chairs.")\nprint(f"The {place} would never be the same!")',
      },
      predictPrompt:
        "Read through the story template and imagine the silly words filling in the blanks. What bizarre scene will this create?",
      conclusion:
        "The computer doesn't judge whether 'sparkly elephant' makes sense - it just combines what you give it! That's what makes Mad Libs fun: the computer follows your instructions perfectly, even when they're ridiculous.",
    } as PRIMMSectionData,
    {
      kind: "Testing",
      id: "complete-madlib" as SectionId,
      title: "Challenge: Complete the Adventure",
      content: [
        {
          kind: "text",
          value:
            'Now it\'s your turn to create a Mad Lib! Below is a story template with some variables already defined. Add the missing variables and print statements to complete the story.\n\nYou need to:\n1. Create a variable `action` with the value "screamed"\n2. Create a variable `number` with the integer 42\n3. Print: `Suddenly, [hero_name] [action] very loudly!`\n4. Print: `The [creature] ran away at [number] miles per hour!`\n\nMake sure to use f-strings for your print statements!',
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          '# These variables are provided\nhero_name = "Alex"\ncreature = "monster"\n\n# Add your two new variables here\n\n# Add your two print statements here\n',
      },
      testCases: [
        {
          input: [null],
          expected:
            "Suddenly, Alex screamed very loudly!\nThe monster ran away at 42 miles per hour!",
          description: "Test adventure completion",
        },
      ],
      testMode: "procedure",
      functionToTest: "__main__",
    } as TestingSectionData,
    {
      kind: "MultipleChoice",
      id: "madlib-debugging",
      title: "Mad Libs Debugging",
      content: [
        {
          kind: "text",
          value:
            "Your friend wrote a Mad Libs but it's not working correctly. Which version has the correct f-string syntax?",
        },
      ],
      options: [
        'print("The {color} {animal} jumped")',
        'print(f"The (color) (animal) jumped")',
        'print(f"The {color} {animal} jumped")',
        'print(The f"{color} {animal} jumped")',
      ],
      correctAnswer: 2,
      feedback: {
        correct:
          "Correct! The f goes before the opening quote, and variables go inside curly braces {}.",
      },
    } as MultipleChoiceSectionData,
    {
      kind: "Testing",
      id: "build-your-own" as SectionId,
      title: "Challenge: Build Your Own Mad Lib",
      content: [
        {
          kind: "text",
          value:
            "Time to unleash your creativity! Create your own original Mad Libs story.\n\nRequirements:\n- Use at least 5 different variables\n- Your story must be 4-6 lines long (4-6 print statements)\n- Use at least one variable more than once in your story\n- Use f-strings for all your print statements\n- Use descriptive variable names like `weird_place` instead of names like `word1`\n\nChoose any theme you want: school, sports, animals, space, fantasy, everyday life - whatever interests you! Make it funny, dramatic, weird, or anything in between.",
        },
      ],
      example: {
        visualization: "console",
        initialCode:
          "# Create your variables here (at least 5)\n\n# Write your story here (4-6 print statements with f-strings)\n",
      },
      testCases: [
        {
          input: [null],
          expected: "Any output with 4-6 lines",
          description:
            "Create original Mad Libs (graded on creativity and correct syntax)",
        },
      ],
      testMode: "procedure",
      functionToTest: "__main__",
    } as TestingSectionData,
    {
      kind: "Information",
      id: "computers-humans-communication" as SectionId,
      title: "Computers, Data, and Humans",
      content: [
        {
          kind: "text",
          value:
            "Mad Libs are fun, but they also reveal something profound about how computers work.\n\nThink about what happens when you run a Mad Libs program:\n1. The computer stores raw data in variables (just words and numbers)\n2. The f-string acts as a template - a pattern for how to present that data\n3. The output combines the data with context to create meaning\n\nThe computer transforms raw data into something humans can understand and enjoy. This is what all computer programs do - they take data and present it in ways that make sense to people.",
        },
      ],
    },
    {
      kind: "Reflection",
      id: "human-understanding-reflection" as SectionId,
      title: "Human Understanding",
      content: [
        {
          kind: "text",
          value:
            'Now it\'s your turn to reflect on this idea. Create a simple example (3-5 lines of code) that shows raw data being transformed into meaningful, human-understandable output using f-strings. Then write 4-5 sentences reflecting on these questions:\n- Why is this translation from data to meaning important?\n- How does it make programs more useful?\n- What would happen if programs only showed raw data?\n- How does this connect to the Mad Libs you created?\n\nRemember to use the phrase "as seen in the example above" in your reflection.',
        },
      ],
      topic: "How F-Strings Bridge Computers and Humans",
      isTopicPredefined: true,
      code: "Create an example showing raw data → meaningful human output",
      isCodePredefined: false,
      explanation:
        "Reflect on how f-strings transform computer data into human-understandable information (4-5 sentences)",
      isExplanationPredefined: false,
    } as ReflectionSectionData,
    {
      kind: "Information",
      id: "power-of-templates",
      title: "The Power of Templates",
      content: [
        {
          kind: "text",
          value:
            "Congratulations! You've mastered f-strings and created your own Mad Libs. You've also learned a fundamental concept in programming: **templates that computers fill with data**. This pattern is everywhere in the digital world:\n\n- **Weather apps:**\n    - `f\"The temperature in {city} is {temp} degrees.\"`\n    - The data comes from weather sensors.\n\n- **Game scores:**\n    - `f\"{player} scored {points} points in {time} seconds!\"`\n    - The data comes from the game engine.\n\n- **Social media:**\n    - `f\"{friend} liked your {post_type}.\"`\n    - The data comes from the platform's database.\n\nEvery time you see personalized output on a device there's a template behind it. A programmer wrote an f-string (or something like it) that takes raw data and presents it in a way humans can understand.\n\nIn the next lesson, you'll work to remember and apply everything you've learned so far.",
        },
      ],
    } as InformationSectionData,
  ],
};

export default lessonData;
