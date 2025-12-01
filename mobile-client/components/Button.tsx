import useTheme from "@/hooks/useTheme";
import { Pressable, Text, PressableProps, Button } from "react-native";

export type ButtonProps = PressableProps & {
  label?: string;
  variant?: "primary" | "secondary" | "danger";
};

export default ({
  label,
  variant = "primary",
  onPress,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) => {
  const theme = useTheme();

  return (
    <Pressable
      className={`${className} flex-grow rounded-xl h-14 flex-row items-center justify-center px-4 disabled:opacity-50 
      ${
        variant === "primary"
          ? "bg-inverse active:bg-inverse-mild"
          : variant === "secondary"
          ? "bg-foreground active:bg-foreground-mild"
          : "bg-danger active:bg-red-600"
      }`}
      disabled={disabled}
      onPress={onPress}
      {...props}
    >
      {label ? (
        <Text
          className={`font-medium ${
            variant === "primary"
              ? "text-inverse"
              : variant === "secondary"
              ? "text-default"
              : "text-white"
          }`}
          style={{
            color:
              variant === "primary"
                ? theme["--color-text-inverse"]
                : variant === "secondary"
                ? theme["--color-text-default"]
                : "white",
          }}
        >
          {label}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
};
