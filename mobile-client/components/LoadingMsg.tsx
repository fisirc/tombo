import { ActivityIndicator, Text } from "react-native"
import { View } from "react-native"

export default () => {
  return (
    <View className="flex-1 flex flex-col justify-center items-center gap-2">
      <ActivityIndicator size="large" />
    </View>
  )
}