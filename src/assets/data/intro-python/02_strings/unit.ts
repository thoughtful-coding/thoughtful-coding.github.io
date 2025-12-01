import { UnitId, UnitManifest } from "../../../types/data";

const unitManifest: UnitManifest = {
  id: "python_format_strings" as UnitId,
  title: "Python Format Strings",
  image: "images/unit_icon_strings.svg",
  description:
    "Explore string manipulation, f-strings, type casting, and create fun projects like Mad Libs.",
  lessons: [
    "lessons/00_intro_fstrings",
    "lessons/01_fstring_practice",
    "lessons/02_mad_libs",
    "lessons/03_fstrings_wrap_up",
  ],
};

export default unitManifest;
