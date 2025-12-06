import type {
  Lesson,
  LessonId,
  PredictionSectionData,
  SectionId,
} from "../../../../src/types/data";

const lessonData: Lesson = {
  title: "PredictionSection Testing",
  guid: "4895ae8f-932c-415e-88f1-9c4684b48c62" as LessonId,
  description:
    "A sample lesson to allow end-to-end tests to test the PredictionSection.",
  sections: [
    {
      kind: "Prediction",
      id: "multi-output-testing" as SectionId,
      title: "Predict the Outputs",
      content: [
        {
          kind: "text",
          value: "Guess what the outputs will be",
        },
      ],
      example: {
        visualization: "console",
        initialCode: "def fn(x):\n  print(x)",
      },
      testMode: "procedure",
      functionToTest: "fn",
      predictionTable: {
        columns: [{ variableName: "x", variableType: "number" }],
        rows: [{ inputs: [2] }, { inputs: [4] }, { inputs: [6] }],
      },
    } as PredictionSectionData,
    {
      kind: "Prediction",
      id: "multi-return-testing" as SectionId,
      title: "Predict the Return Outputs",
      content: [
        {
          kind: "text",
          value: "Guess what the outputs will be",
        },
      ],
      example: {
        visualization: "console",
        initialCode: "def fn(x):\n  return x",
      },
      testMode: "function",
      functionToTest: "fn",
      predictionTable: {
        columns: [{ variableName: "x", variableType: "number" }],
        rows: [{ inputs: [2] }, { inputs: [4] }, { inputs: [6] }],
      },
    } as PredictionSectionData,
  ],
};

export default lessonData;
