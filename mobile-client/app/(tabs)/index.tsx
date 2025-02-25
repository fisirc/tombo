import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Mapbox, { Camera, UserLocation, UserTrackingMode } from '@rnmapbox/maps';

const DISPLACEMENT = [0, 5, 10];

export default function Index() {
  useEffect(() => {
    (async () => {
      await Mapbox.requestAndroidLocationPermissions();
      Mapbox.locationManager.start();
    })();

    return () => {
      Mapbox.locationManager.stop();
    };
  }, []);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Mapbox.MapView
          style={styles.map}
          compassEnabled={true}
          logoEnabled={false}
          attributionEnabled={false}
          scaleBarEnabled={false}
        >
          <Camera
            followZoomLevel={16}
            followUserMode={UserTrackingMode.Follow}
            followUserLocation
          />

          <UserLocation minDisplacement={DISPLACEMENT[0]} />
        </Mapbox.MapView>
      </View>
    </View>
  );
}

Mapbox.setAccessToken('pk.eyJ1IjoiZG90eWVpc29uIiwiYSI6ImNsdGdsbWc0OTAxbXQyanAyaGFwY20xN2MifQ.zqaP-jWUgc1FYPfcHIjtVw');

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1
  }
});
