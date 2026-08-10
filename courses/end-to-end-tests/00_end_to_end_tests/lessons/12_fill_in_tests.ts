import type { Lesson, LessonId, SectionId } from "../../../../src/types/data";

const lessonData: Lesson = {
  title: "FillInSection Testing",
  guid: "0d47505b-62f7-439c-97dc-9da7ea229834" as LessonId,
  description:
    "A sample lesson to allow end-to-end tests to test the FillInSection.",
  sections: [
    {
      kind: "FillIn",
      id: "fill-in-text" as SectionId,
      title: "Fill in the Blanks",
      content: [
        {
          kind: "text",
          value:
            "Fill each blank with the missing word. `def` is a Python keyword, so it is graded case-sensitively; the prose answers are not.",
        },
      ],
      // Every blank names its matcher and both of its grading decisions. There
      // is no shorthand: an inferred matcher is how a number gets compared as
      // text, and an inferred casing rule is how `Def` passes for `def`.
      body: "A Python {{fn}} is defined with the {{kw}} keyword and hands a value back with {{ret}}.",
      blanks: {
        fn: {
          match: "text",
          answers: ["function"],
          caseSensitive: false,
          hintMode: "coloring",
        },
        kw: {
          match: "text",
          answers: ["def"],
          caseSensitive: true,
          hintMode: "coloring",
        },
        ret: {
          match: "text",
          answers: ["return", "a return statement"],
          caseSensitive: false,
          hintMode: "none",
        },
      },
    },
    {
      kind: "FillIn",
      id: "fill-in-numeric" as SectionId,
      title: "Computed Values",
      content: [
        {
          kind: "text",
          value:
            "A list of 8 items is looped over with a nested pair of `for` loops.\n\nHow many times does the inner body run, and what fraction of a 64-cell grid is that?",
        },
      ],
      body: "The body runs {{iterations}} times, which is {{fraction}} of the grid.",
      blanks: {
        // No unit here: the sentence already says "times". A unit is for blanks
        // whose prose does not name it, like the percentage below.
        iterations: {
          match: "numeric",
          answer: 64,
          tolerance: 0,
          hintMode: "highLow",
        },
        fraction: {
          match: "numeric",
          answer: 100,
          tolerance: 0.5,
          unit: "%",
          hintMode: "highLow",
        },
      },
    },
    {
      kind: "FillIn",
      id: "fill-in-mixed" as SectionId,
      title: "Words and Numbers Together",
      content: [
        {
          kind: "text",
          value:
            "One sentence can mix a recalled word with a computed value. The word is matched exactly; the number is matched within a tolerance.",
        },
      ],
      body: "Indexing a list starts at {{start}}, so the last index of a {{len}}-item list is {{last}}.",
      blanks: {
        start: {
          match: "numeric",
          answer: 0,
          tolerance: 0,
          hintMode: "highLow",
        },
        len: {
          match: "text",
          answers: ["ten"],
          caseSensitive: false,
          hintMode: "coloring",
        },
        last: { match: "numeric", answer: 9, tolerance: 0, hintMode: "none" },
      },
    },
    {
      kind: "Information",
      id: "fill-in-guard-explainer" as SectionId,
      title: "About the Next Section",
      content: [
        {
          kind: "text",
          value:
            "**The section below is broken on purpose.** It exists so the authoring guard can be seen and tested.\n\nIts body references `{{missing}}`, which has no entry in `blanks`, and it declares a blank named `unused` that the body never mentions. Because lesson files are not typechecked, neither mistake would be caught at build time — so the section refuses to render an interaction and lists what is wrong instead. An author seeing that list knows the section needs fixing; a learner never gets an unanswerable question.\n\nNote that the broken section's own prose is not shown: a misconfigured section deliberately hides its question rather than posing one that cannot be answered.",
        },
      ],
    },
    {
      kind: "FillIn",
      id: "fill-in-misconfigured" as SectionId,
      title: "Authoring Guard",
      content: [
        {
          kind: "text",
          value:
            "This prose is intentionally never rendered — the authoring guard replaces it with the error list.",
        },
      ],
      body: "This references {{missing}} which has no entry.",
      blanks: {
        unused: {
          match: "text",
          answers: ["never referenced"],
          caseSensitive: false,
          hintMode: "none",
        },
      },
    },
  ],
};

export default lessonData;
