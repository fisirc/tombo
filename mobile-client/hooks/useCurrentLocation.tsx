import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { GeocodedLocation } from "../types";
import { reverseGeocoding } from "@/components/MapBoxPicker";

export default () =>
  useQuery({
    queryKey: ["current-location"],
    queryFn: async (): Promise<GeocodedLocation | null> => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Se requiere permiso para acceder a la ubicación"
        );
        return null;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const { latitude, longitude } = currentLocation.coords;

      const address = await reverseGeocoding(longitude, latitude);

      return { latitude, longitude, address };
    },
  });
