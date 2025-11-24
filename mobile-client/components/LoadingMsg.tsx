import useTheme from "@/hooks/useTheme"
import { ActivityIndicator, Text } from "react-native"
import { View } from "react-native"

export default () => {
  const theme = useTheme()
  return (
    <View className="flex-1 flex flex-col justify-center items-center gap-2">
      <ActivityIndicator size="large" color={theme["--color-text-muted"]} />
    </View>
  )
}
