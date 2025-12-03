import { UnitId, UnitManifest } from "../../../types/data";

const unitManifest: UnitManifest = {
  id: "python_lists_intro" as UnitId,
  title: "Python Lists (Intro)",
  image: "images/unit_icon_lists_intro.svg",
  description:
    "This worksheet is intended to show you how lists work in Python and how they compare with strings.",
  lessons: [
    "lessons/lesson_1",
    "lessons/lesson_2",
    "lessons/lesson_3",
    "lessons/lesson_4",
  ],
};

export default unitManifest;
