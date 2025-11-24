import useTheme from "@/hooks/useTheme"
import { Text } from "react-native"
import { View } from "react-native"

export default () => {
  const theme = useTheme()
  return (
    <View className="flex-1 flex flex-col justify-center items-center gap-2">
      <Text className="font-sm" style={{ color: theme["--color-text-muted"] }}>
        Ha ocurrido un error
      </Text>
    </View>
  )
}
