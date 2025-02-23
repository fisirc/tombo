import { Stack, Tabs } from "expo-router";

// Import your global CSS file
import "../global.css";
import { View } from "react-native";
import themes from "@/themes";
import { useColorScheme } from "nativewind";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout() {
  const queryClient = new QueryClient()
  const { colorScheme } = useColorScheme()

  return (
    <QueryClientProvider client={queryClient}>
      <View style={themes[colorScheme || 'dark']} className="flex-1">
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
        </Stack>
      </View>
    </QueryClientProvider>
  );
}
