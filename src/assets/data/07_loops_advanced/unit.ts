import { UnitId, UnitManifest } from "../../../types/data";

const unitManifest: UnitManifest = {
  id: "advanced_loops" as UnitId,
  title: "Advanced Loops",
  image: "images/unit_icon_loops_advanced.svg",
  description:
    "Learn how to iterate through data using loops in order to analyze large datasets.",
  lessons: [
    "lessons/00_iteration_loops",
    "lessons/01_accumulator_intro",
    "lessons/02_accumulator_strings",
    "lessons/03_string_functions",
    "lessons/04_accumulator_practice",
    "lessons/05_accumulator_wrap_up",
  ],
};

export default unitManifest;
