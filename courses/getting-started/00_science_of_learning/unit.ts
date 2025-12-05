import { UnitId, UnitManifest } from "../../../types/data";

const unitManifest: UnitManifest = {
  id: "science_of_learning" as UnitId,
  title: "The Science of Learning",
  image: "images/unit_icon_science_of_learning.svg",
  description:
    'Understand how this website differs from other "Learn Python" websites and learn a little bit about learning.',
  lessons: [
    "lessons/00_learning_primm",
    "lessons/01_learning_reflection",
    "lessons/02_learning_wrap_up",
  ],
};

export default unitManifest;
