import { UnitId, UnitManifest } from "../../../types/data";

const unitManifest: UnitManifest = {
  id: "intro_functions" as UnitId,
  title: "Functions",
  image: "images/unit_icon_functions.svg",
  description:
    "Learn how to use functions to help reduce the size of your code and make it more readable.",
  lessons: [
    "lessons/00_func_intro",
    "lessons/01_func_exec",
    "lessons/02_func_inputs",
    "lessons/03_func_wrap_up",
  ],
};

export default unitManifest;
