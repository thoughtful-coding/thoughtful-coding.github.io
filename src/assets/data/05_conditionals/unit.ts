import { UnitId, UnitManifest } from "../../../types/data";

const unitManifest: UnitManifest = {
  id: "python_conditionals" as UnitId,
  title: "Python Conditionals (If/Else)",
  image: "images/unit_icon_conditionals.svg",
  description:
    "Learn how to control the flow of your programs using `if`, `else`, and `elif` statements.",
  lessons: [
    "lessons/00_pre_cond_tools",
    "lessons/01_cond_intro",
    "lessons/02_multiple_ifs",
    "lessons/03_cond_if_else",
    "lessons/04_cond_if_elif",
    "lessons/05_cond_bool",
    "lessons/06_cond_wrap_up",
  ],
};

export default unitManifest;
