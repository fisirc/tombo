import { Stack, Tabs } from "expo-router";

// Import your global CSS file
import "../global.css";
import { View } from "react-native";
import themes from "@/themes";
import { useColorScheme } from "nativewind";

export default function RootLayout() {
  const { colorScheme } = useColorScheme()

  return (
    <View style={themes[colorScheme || 'dark']} className="flex-1">
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
      </Stack>
    </View>
  );
}
