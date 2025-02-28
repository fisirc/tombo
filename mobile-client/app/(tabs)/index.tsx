import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Mapbox, { Annotation, Camera, UserLocation, UserTrackingMode } from '@rnmapbox/maps';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IReportResponse, ReportService } from '@/api/services/report';
import BottomSheet, { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Link, usePathname, useRouter } from 'expo-router';

const DISPLACEMENT = [0, 5, 10];
const ZOOM_SIZE_MULT = 1.5;

const ws = new WebSocket('wss://reports.tombo.paoloose.site/api/reports');
ws.onopen = () => {
  console.log('Listening to reports!');
}

function useReports() {
  return useQuery({
    queryKey: ['reports:list'],
    queryFn: ReportService.getAllReports,
  });
}

// -12.062081, -76.989357
export default function Index() {
  const queryClient = useQueryClient();
  const map = useRef<Mapbox.MapView | null>();
  const router = useRouter()

  const { status, data, error, isFetching } = useReports();

  const [zoom, setZoom] = useState(15);
  const [newReports, setNewReports] = useState<IReportResponse[]>([]);

  useEffect(() => {
    (async () => {
      await Mapbox.requestAndroidLocationPermissions();
      Mapbox.locationManager.start();
    })();

    ws.onmessage = (e) => {
      console.log(e.data);
      setNewReports((prev) => [...prev, JSON.parse(e.data)]);
    };

    return () => {
      Mapbox.locationManager.stop();
    };
  }, []);

  const reports = (data ?? []).concat(...newReports);

  // Bottom sheet
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Mapbox.MapView
          ref={(mapRef) => {
            map.current = mapRef;
          }}
          zoomEnabled={true}
          style={styles.map}
          styleURL='mapbox://styles/mapbox/dark-v11'
          compassEnabled={true}
          logoEnabled={false}
          attributionEnabled={false}
          scaleBarEnabled={false}
          onTouchEnd={async () => {
            const zoom = await map.current?.getZoom() ?? 1;
            setZoom(zoom);
            console.log('📷 zoom:', zoom);
          }}
        >
          {
            reports.map((report) => (
              <Mapbox.PointAnnotation
                coordinate={[report.longitude, report.latitude]}
                id={report.id}
                key={report.id}
                onSelected={() => {
                  router.replace(`/report/${report.id}`);
                  console.log('🚨 report selected:', report.id);
                }}
              >
                <View style={{
                  height: zoom * ZOOM_SIZE_MULT,
                  width: zoom * ZOOM_SIZE_MULT,
                  backgroundColor: '#f84747',
                  borderRadius: 50,
                  borderColor: '#fff',
                  borderWidth: 1.5,
                }}>
                </View>
              </Mapbox.PointAnnotation>
            ))
          }
          {
            reports.map((report) => (
              <Mapbox.MarkerView
                key={report.id}
                coordinate={[report.longitude, report.latitude]}
                anchor={{ x: 0.5, y: 1 }}
                style={{
                  width: zoom * ZOOM_SIZE_MULT * 4,
                  height: zoom * ZOOM_SIZE_MULT * 4,
                  minWidth: zoom * ZOOM_SIZE_MULT * 4,
                  minHeight: zoom * ZOOM_SIZE_MULT * 4,
                }}
              >
                <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 13 }}>
                  {
                    report.multimediaReports.length > 0 ? <Image
                      source={{
                        uri: `https://minio.tombo.paoloose.site/reports/${report.multimediaReports[0].resource}`,
                      }}
                      width={zoom * ZOOM_SIZE_MULT * 4}
                      height={zoom * ZOOM_SIZE_MULT * 4}
                    ></Image>
                    : <View
                        style={{
                          backgroundColor: '#FFF',
                          padding: 10,
                          borderRadius: 5,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                      <Text>{report.description}</Text>
                    </View>
                  }
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderTopWidth: 15,
                      borderLeftWidth: 10,
                      borderRightWidth: 10,
                      borderTopColor: '#1f1f1f',
                      borderLeftColor: 'transparent',
                      borderRightColor: 'transparent',
                    }}
                  />
                </View>
              </Mapbox.MarkerView>
            ))
          }
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
    flex: 1,
  },
  modal: {
    // backgroundColor: '#212121',
  },
  contentContainer: {
    flex: 1,
    // backgroundColor: '#212121',
    height: 300,
    padding: 16,
  },
  baseText: {
    fontFamily: 'Cochin',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
