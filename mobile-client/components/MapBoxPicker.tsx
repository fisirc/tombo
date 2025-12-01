import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import Mapbox, { Camera, UserTrackingMode } from "@rnmapbox/maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import Button from "./Button";
import { SafeAreaView } from "react-native-safe-area-context";
import useCurrentLocation from "@/hooks/useCurrentLocation";
import QueryWait from "./QueryWait";
import { GeocodedLocation } from "@/types";
import { set } from "react-hook-form";

interface MapBoxPickerProps {
  onSelectLocation: (location: GeocodedLocation) => void;
  onClose: () => void;
}

export const reverseGeocoding = async (
  longitude: number,
  latitude: number,
  useOSM: boolean = false
) => {
  let url;
  if (useOSM) {
    url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
  } else {
    url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.EXPO_PUBLIC_MAPBOX_TOKEN}&types=address,poi&limit=1`;
  }

  const response = await fetch(url);
  const data = await response.json();

  if (useOSM) {
    if (data && data.display_name) {
      return data.display_name;
    } else {
      return null;
    }
  } else {
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      return feature.place_name;
    } else {
      return null;
    }
  }
};

const MapPicker: React.FC<
  MapBoxPickerProps & { currentLocation: GeocodedLocation }
> = ({ onSelectLocation, onClose, currentLocation }) => {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<GeocodedLocation>(currentLocation);
  const mapRef = useRef<Mapbox.MapView>(null);

  const handleMapPress = (feature: any) => {
    setLoading(true);
    const { coordinates } = feature.geometry;
    const longitude = coordinates[0];
    const latitude = coordinates[1];

    reverseGeocoding(longitude, latitude)
      .then((address) => {
        setSelectedLocation({
          latitude,
          longitude,
          address: address || "Sin dirección",
        });
      })
      .catch((error) => {
        console.error("Error during reverse geocoding:", error);
        setSelectedLocation({ latitude, longitude, address: "Sin dirección" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleConfirmLocation = () => {
    if (!selectedLocation) throw new Error("No location selected");
    onSelectLocation(selectedLocation);
    onClose();
  };

  return (
    <SafeAreaView style={styles.container} className="bg-default">
      <View style={styles.header} className="bg-default">
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title} className="text-default">
          Selecciona la ubicación
        </Text>
      </View>

      <Mapbox.MapView
        ref={(ref) => {
          mapRef.current = ref;
        }}
        style={styles.map}
        styleURL={
          colorScheme === "dark"
            ? "mapbox://styles/mapbox/dark-v11"
            : "mapbox://styles/mapbox/light-v11"
        }
        onPress={handleMapPress}
        logoEnabled={false}
        scaleBarEnabled={false}
        compassEnabled={true}
      >
        <Camera
          followUserMode={UserTrackingMode.Follow}
          followUserLocation
          minZoomLevel={14}
          defaultSettings={{
            centerCoordinate: [
              selectedLocation.longitude,
              selectedLocation.latitude,
            ],
            zoomLevel: 16,
          }}
        />

        {selectedLocation && (
          <Mapbox.PointAnnotation
            id="selected-location"
            coordinate={[selectedLocation.longitude, selectedLocation.latitude]}
          >
            <View />
          </Mapbox.PointAnnotation>
        )}
      </Mapbox.MapView>

      <SafeAreaView className="absolute bottom-0 left-0 w-full p-4">
        <View className="bg-default p-6 rounded-xl flex flex-col gap-4">
          {selectedLocation ? (
            <>
              <Text className="text-default text-lg" numberOfLines={2}>
                {loading
                  ? "Obteniendo ubicación..."
                  : selectedLocation.address ||
                    "Selecciona una ubicación en el mapa"}
              </Text>
              <View className="flex-row justify-between gap-4">
                <Button
                  onPress={onClose}
                  label="Cancelar"
                  variant="secondary"
                />
                <Button onPress={handleConfirmLocation} label="Confirmar" />
              </View>
            </>
          ) : (
            <Text className="text-default">
              Toca en el mapa para seleccionar
            </Text>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: 18,
    textAlign: "center",
    marginRight: 28, // To balance the close button
  },
  map: {
    flex: 1,
  },
  footer: {
    padding: 16,
    fontSize: 16,
  },
  // Added missing styles
  confirmButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default (mapBoxPickerProps: MapBoxPickerProps) => {
  const currentLocationQR = useCurrentLocation();
  const currentLocation = currentLocationQR.data;

  if (!currentLocation) {
    return <QueryWait qr={currentLocationQR} />;
  }

  return <MapPicker {...mapBoxPickerProps} currentLocation={currentLocation} />;
};
