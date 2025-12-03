import { UnitId, UnitManifest } from "../../../types/data";

const unitManifest: UnitManifest = {
  id: "loops" as UnitId,
  title: "Loops",
  image: "images/unit_icon_loops.svg",
  description:
    "Learn how to use loops in your code to further exploit patterns and create even more interesting shapes.",
  lessons: [
    "lessons/00_loops_intro",
    "lessons/01_loops_challenges",
    "lessons/02_loops_nesting",
    "lessons/03_loops_grab_bag",
    "lessons/04_loops_wrap_up",
  ],
};

export default unitManifest;
