import { ConfigContext, ExpoConfig } from "expo/config";

module.exports = ({ config }: ConfigContext): ExpoConfig => {
  return {
    name: "mobile-client",
    slug: "mobile-client",
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
        "@rnmapbox/maps",
        {
          RNMapboxMapsDownloadToken: process.env.EXPO_PUBLIC_MAPBOX_TOKEN
        }
      ]
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
