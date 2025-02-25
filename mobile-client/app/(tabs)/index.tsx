import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Mapbox from '@rnmapbox/maps';

export default function Index() {
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Mapbox.MapView style={styles.map} />
      </View>
    </View>
  );
}

Mapbox.setAccessToken('MAPBOX_API_KEY');

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
