import { Pressable, Text, PressableProps, Button } from "react-native";

export type ButtonProps = PressableProps & {
  label: string
  variant?: 'primary' | 'secondary' | 'danger'
}

export default ({ label, variant = 'primary', onPress, ...props }:
  ButtonProps
) => {
  return (
    <Pressable
      className={`rounded-xl h-16 items-center justify-center p-4 ${
        variant === 'primary'   ? 'bg-inverse active:bg-inverse-mild' :
        variant === 'secondary' ? 'bg-foreground active:bg-foreground-mild' :
        'bg-danger active:bg-red-600'
      }`}
      onPress={onPress}
      {...props}
    >
      <Text
        className={`font-medium ${
          variant === 'primary' ? 'text-inverse' :
          variant === 'secondary' ? 'text-default' :
          'text-white'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}