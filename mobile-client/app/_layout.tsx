import { Stack, Tabs } from "expo-router";

// Import your global CSS file
import "../global.css";
import { View } from "react-native";
import themes from "@/themes";
import { useColorScheme } from "nativewind";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function RootLayout() {
  const queryClient = new QueryClient()
  const { colorScheme } = useColorScheme()

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <View style={themes[colorScheme || 'dark']} className="flex-1">
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
              />
            </Stack>
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
