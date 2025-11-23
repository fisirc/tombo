// Import your global CSS file
import * as Application from "expo-application";
import "../global.css";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import { View } from "react-native";
import { Stack } from "expo-router";
import themes from "@/themes";
import { useColorScheme } from "nativewind";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useEffect } from "react";
import dayjs from "dayjs";
import useSessionInit from "@/hooks/useSessionInit";
import useSession from "@/hooks/useSession";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Mapbox from "@rnmapbox/maps";
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import { LogLevel, OneSignal } from "react-native-onesignal";

// GoogleSignin.configure({
// 	webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
// 	scopes: ['profile', 'email'],
// });

// OneSignal.Debug.setLogLevel(LogLevel.Verbose);
// OneSignal.initialize('93a4fc29-c71b-4f39-8a27-d65be1befd24');

// export const GoogleLogin = async () => {
// 	await GoogleSignin.hasPlayServices();
// 	const userInfo = await GoogleSignin.signIn();
// 	return userInfo;
// };

const mapboxToken = process.env.EXPO_PUBLIC_MAPBOX_TOKEN
if (!mapboxToken) throw Error('No Mapbox Token')
Mapbox.setAccessToken(mapboxToken);

const RootLayout = () => {
  useSessionInit();
  const { data: session } = useSession();

  const { colorScheme } = useColorScheme();

  return (
    <View style={themes[colorScheme || "dark"]} className="flex-1">
      <Stack>
        <Stack.Protected guard={session !== null}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={session === null}>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
          <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </View>
  );
};

export default () => {
  const queryClient = new QueryClient();

  useEffect(() => {
    dayjs.locale("es");
    dayjs.extend(relativeTime);
    // OneSignal.Notifications.requestPermission(true);
    // const androidId = Application.getAndroidId();
    // // TODO: Move this to login
    // console.log(`📨 Logging to OneSignal with Android ID: ${androidId}`);
    // OneSignal.logout();
    // OneSignal.login(androidId);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <RootLayout />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};
