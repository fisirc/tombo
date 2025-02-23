import { values } from "@/themes"
import { useColorScheme } from "nativewind"

export default () => {
  const { colorScheme } = useColorScheme()
  return values[colorScheme || 'dark']
}
