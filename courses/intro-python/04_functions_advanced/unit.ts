import { UnitId, UnitManifest } from "../../../types/data";

const unitManifest: UnitManifest = {
  id: "advanced_functions" as UnitId,
  title: "Advanced Functions",
  image: "images/unit_icon_functions_advanced.svg",
  description:
    "Learn how you can use functions other people wrote to create more complex and visually interesting outputs.",
  lessons: [
    "lessons/00_func_libraries",
    "lessons/01_func_turtles",
    "lessons/02_draw_house",
    "lessons/03_draw_suburbs",
    "lessons/04_draw_wall",
    "lessons/05_adv_func_wrap_up",
  ],
};

export default unitManifest;
