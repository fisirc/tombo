import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Mapbox, { Camera, UserTrackingMode } from '@rnmapbox/maps';
import { Ionicons } from '@expo/vector-icons';

interface MapBoxPickerProps {
  onSelectLocation: (location: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => void;
  onClose: () => void;
}

export const reverseGeocoding = async (longitude: number, latitude: number) => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.EXPO_PUBLIC_MAPBOX_TOKEN}`
  );
  const data = await response.json();
  if (data.features && data.features.length > 0) {
    return data.features[0].place_name;
  } else {
    return null;
  }
}

// Replace with your Mapbox access token if not set globally
// Mapbox.setAccessToken('your-access-token');

export const MapPicker: React.FC<MapBoxPickerProps> = ({ onSelectLocation, onClose }) => {
  const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number] | null>(null);
  const [placeName, setPlaceName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mapRef = useRef<Mapbox.MapView | null>(null);

  const fetchPlaceName = async (longitude: number, latitude: number) => {
    try {
      setIsLoading(true);
      const address = await reverseGeocoding(longitude, latitude);
      if (address) {
        setPlaceName(address);
      } else {
        setPlaceName('Unknown location');
      }
    } catch (error) {
      console.error('Error fetching place name:', error);
      setPlaceName('Location unavailable');
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Location</Text>
      </View>

      <Mapbox.MapView
        ref={(ref) => (mapRef.current = ref)}
        style={styles.map}
        styleURL='mapbox://styles/mapbox/dark-v11'
        onPress={handleMapPress}
        logoEnabled={false}
        compassEnabled={true}
      >
        <Camera
          followUserMode={UserTrackingMode.Follow}
          followUserLocation
          defaultSettings={{
            centerCoordinate: selectedCoordinates || undefined,
            zoomLevel: 15,
          }}
        />

        {selectedCoordinates && (
          <Mapbox.PointAnnotation
            id="selected-location"
            coordinate={selectedCoordinates}
          >
            <View style={styles.annotationContainer}>
              <View style={styles.annotationFill} />
            </View>
          </Mapbox.PointAnnotation>
        )}
      </Mapbox.MapView>

      <View style={styles.footer}>
        {selectedCoordinates ? (
          <>
            <Text style={styles.locationText} numberOfLines={2}>
              {isLoading ? 'Getting location...' : placeName || 'Select a location on the map'}
            </Text>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmLocation}
              disabled={!selectedCoordinates}
            >
              <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.instructionText}>Tap anywhere on the map to select a location</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 28, // To balance the close button
  },
  map: {
    flex: 1,
  },
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderRadius: 15,
  },
  annotationFill: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: 'white',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  locationText: {
    fontSize: 14,
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginVertical: 12,
  },
  confirmButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
