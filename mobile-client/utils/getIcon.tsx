import {
  IconProps,
  IconQuestionMark,
  IconSkull,
  IconSlice,
} from "@tabler/icons-react-native";

const getIcon = (iconName: string, props?: IconProps) => {
  switch (iconName) {
    case 'skull':               return <IconSkull               {...props} />;
    case 'slice':               return <IconSlice               {...props} />;
    default:                    return <IconQuestionMark        {...props} />;
  };
};

export default getIcon;
