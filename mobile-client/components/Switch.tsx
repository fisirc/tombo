import useTheme from "@/hooks/useTheme";
import { SwitchProps as NativeSwitchProps, Switch, Text, View } from "react-native";

export type SwitchProps = NativeSwitchProps & {
  label: string
}

export default (props: SwitchProps) => {
  const theme = useTheme()
  
  return (
    <View className="flex flex-row items-center gap-4">
      <Switch
        {...props}
        trackColor={{
          true: theme['--color-success'],
          false: theme['--color-bg-foreground-extra']
        }}
        thumbColor={theme['--color-bg-inverse']}
      />
      <Text className="text-default">
        {props.label}
      </Text>
    </View>
  )
}
