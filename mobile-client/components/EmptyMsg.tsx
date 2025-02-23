import { Text } from "react-native"
import { View } from "react-native"

export default () => {
  return (
    <View className="flex-1 flex flex-col justify-center items-center gap-2">
      <Text className="text-muted font-sm">
        No hay elementos por mostrar
      </Text>
    </View>
  )
}