import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Mapbox, { Camera, UserTrackingMode } from "@rnmapbox/maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import Button from "./Button";
import { SafeAreaView } from "react-native-safe-area-context";

interface MapBoxPickerProps {
  onSelectLocation: (location: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => void;
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

export const MapPicker: React.FC<MapBoxPickerProps> = ({
  onSelectLocation,
  onClose,
}) => {
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | null
  >(null);
  const [placeName, setPlaceName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mapRef = useRef<Mapbox.MapView>(null);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const currentLocation: [number, number] = [
          location.coords.longitude,
          location.coords.latitude,
        ];
        console.log({ currentLocation });
        setSelectedCoordinates(currentLocation);
        await fetchPlaceName(currentLocation[0], currentLocation[1]);
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };
    getUserLocation();
  }, []);

  const fetchPlaceName = async (longitude: number, latitude: number) => {
    try {
      setIsLoading(true);
      const address = await reverseGeocoding(longitude, latitude);
      if (address) {
        setPlaceName(address);
      } else {
        setPlaceName("Unknown location");
      }
    } catch (error) {
      console.error("Error fetching place name:", error);
      setPlaceName("Location unavailable");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapPress = async (event: any) => {
    const coordinates = event.geometry.coordinates;
    setSelectedCoordinates(coordinates);
    await fetchPlaceName(coordinates[0], coordinates[1]);
  };

  const handleConfirmLocation = () => {
    if (selectedCoordinates) {
      onSelectLocation({
        longitude: selectedCoordinates[0],
        latitude: selectedCoordinates[1],
        address: placeName,
      });
      onClose();
    }
  };

  return (
    <SafeAreaView style={styles.container} className="bg-default">
      <View style={styles.header} className="bg-default">
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title} className="text-default">
          🚨 Selecciona la ubicación
        </Text>
      </View>

      <Mapbox.MapView
        ref={(ref) => {
          mapRef.current = ref;
        }}
        style={styles.map}
        styleURL="mapbox://styles/mapbox/dark-v11"
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
            centerCoordinate: selectedCoordinates || undefined,
            zoomLevel: 16,
          }}
        />

        {selectedCoordinates && (
          <Mapbox.PointAnnotation
            id="selected-location"
            coordinate={selectedCoordinates}
          >
            <View />
          </Mapbox.PointAnnotation>
        )}
      </Mapbox.MapView>

      <SafeAreaView className="absolute bottom-0 left-0 w-full p-4">
        <View className="bg-default p-6 rounded-xl flex flex-col gap-4">
          {selectedCoordinates ? (
            <>
              <Text className="text-default text-lg" numberOfLines={2}>
                {isLoading
                  ? "Obteniendo ubicación..."
                  : placeName || "Selecciona una ubicación en el mapa"}
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
