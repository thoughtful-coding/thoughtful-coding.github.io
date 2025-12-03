import { UnitId, UnitManifest } from "../../../types/data";

const unitManifest: UnitManifest = {
  id: "end_to_end_tests" as UnitId,
  title: "Section End-To-End Testing",
  image: "images/unit_icon_e2e.svg",
  description: "A simulated to test the functionality of all of the sections.",
  lessons: [
    "lessons/00_coverage_tests",
    "lessons/01_debugger_tests",
    "lessons/02_matching_tests",
    "lessons/03_multiple_choice_tests",
    "lessons/04_multiple_selection_tests",
    "lessons/05_observation_tests",
    "lessons/06_parsons_tests",
    "lessons/07_prediction_tests",
    "lessons/08_primm_tests",
    "lessons/09_reflection_tests",
    "lessons/10_testing_tests",
  ],
};

export default unitManifest;
