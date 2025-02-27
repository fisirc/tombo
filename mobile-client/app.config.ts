import { ConfigContext, ExpoConfig } from "expo/config";

module.exports = ({ config }: ConfigContext): ExpoConfig => {
  return {
    name: "mobile-client",
    slug: "mobile-client",
    android: {
      package: "pe.tombo.app",
    },
    ios: {
      bundleIdentifier: "pe.tombo.app",
    },
    version: "1.0.0",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    web: {
      bundler: "metro",
      output: "static"
    },
    plugins: [
      "expo-router",
      [
        "onesignal-expo-plugin",
        {
          "mode": "development",
        }
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/splash-icon.png",
          backgroundColor: "#000",
        },
      ],
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsDownloadToken: process.env.EXPO_PUBLIC_MAPBOX_TOKEN
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "La aplicación accede a tus fotos para adjuntarlas a los reportes que realices.",
          "cameraPermission": "La aplicación accede a tu cámara para adjuntar fotos a los reportes que realices."
        }
      ],
    ],
    experiments: {
      typedRoutes: true
    },
    scheme: "myapp",
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "16276d4d-ca48-4ad3-8775-aeb18f91c38f"
      }
    }
  };
};
