import { Pressable, Text, PressableProps, Button } from "react-native";

export type ButtonProps = PressableProps & {
  label: string
  danger?: boolean
}

export default (props: ButtonProps) => {
  return (
    <Pressable
      className={`rounded-xl h-16 items-center justify-center p-4 bg-inverse active:bg-inverse-mild`}
      onPress={props.onPress}
      {...props}
    >
      <Text className="color-inverse font-medium">{props.label}</Text>
    </Pressable>
  );
}
