import { UnitId, UnitManifest } from "../../../types/data";

const unitManifest: UnitManifest = {
  id: "variables_debugging" as UnitId,
  title: "Variables and Debugging",
  image: "images/unit_icon_variables.svg",
  description:
    "Learn how to store data and reuse it to make you programs more versatile.",
  lessons: [
    "lessons/00_var_intro",
    "lessons/01_var_reset",
    "lessons/02_var_multi",
    "lessons/03_var_errors",
    "lessons/04_var_wrap_up",
  ],
};

export default unitManifest;
