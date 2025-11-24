import {
  IconBomb,
  IconBriefcaseFilled,
  IconCarCrash,
  IconCarFilled,
  IconFlame,
  IconFriends,
  IconGenderFemale,
  IconMoodAngry,
  IconQuestionMark,
  IconRoad,
  IconSkull,
  IconSlice
} from "@tabler/icons-react-native";

const reportTypes = [
  {
    label: "Robo a mano armada",
    value: "robbery_with_violence",
    Icon: IconSlice,
  },
  {
    label: "Homicidio",
    value: "homicide",
    Icon: IconSkull,
  },
  {
    label: "Robo de vehículo",
    value: "vehicle_theft",
    Icon: IconCarFilled,
  },
  {
    label: "Violencia doméstica",
    value: "domestic_violence",
    Icon: IconFriends,
  },
  {
    label: "Acoso sexual",
    value: "sexual_harassment",
    Icon: IconMoodAngry,
  },
  {
    label: "Acoso laboral",
    value: "workplace_harassment",
    Icon: IconBriefcaseFilled,
  },
  {
    label: "Violencia de género",
    value: "gender_based_violence",
    Icon: IconGenderFemale,
  },
  {
    label: "Choque",
    value: "collision",
    Icon: IconCarCrash,
  },
  {
    label: "Incendio",
    value: "fire",
    Icon: IconFlame,
  },
  {
    label: "Atropello",
    value: "run_over",
    Icon: IconRoad,
  },
  {
    label: "Detonación",
    value: "detonation",
    Icon: IconBomb,
  },
  {
    label: "Otro",
    value: "other",
    Icon: IconQuestionMark,
  },
];

export default reportTypes;
