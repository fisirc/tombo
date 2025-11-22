import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Mapbox, { Annotation, Camera, UserLocation, UserTrackingMode } from '@rnmapbox/maps';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IReportResponse, ReportService } from '@/api/services/report';
import BottomSheet, { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import useTheme from '@/hooks/useTheme';
import QueryWait from '@/components/QueryWait';
import dayjs from 'dayjs';
import { ScrollView } from 'react-native-gesture-handler';
import TextArea from '@/components/TextArea';
import Button from '@/components/Button';
import useSession from '@/hooks/useSession';

const DISPLACEMENT = [0, 5, 10];
const ZOOM_SIZE_MULT = 1.5;

const ws = new WebSocket(`${process.env.EXPO_PUBLIC_WS_URL}/api/reports`);
ws.onopen = () => {
  console.log('Listening to reports!');
}

function useReports() {
  return useQuery({
    queryKey: ['reports:list'],
    queryFn: ReportService.getAllReports,
  });
}

const NewCommentForm = ({ reportId }: {
  reportId: string
}) => {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const [message, setMessage] = useState<string>('')

  const commentMutation = useMutation({
    mutationFn: ReportService.createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reports', reportId, 'comments']
      })
      setMessage('')
    }
  })

  const handleSubmit = () => {
    commentMutation.mutate({
      reportId,
      message,
    })
  }

  return (
    <View className='flex gap-2'>
      <Text className='text-sm' style={{ color: theme['--color-text-muted'] }}>
        Nuevo comentario
      </Text>
      <TextArea
        placeholder='El sospechoso escapó por la avenida...'
        value={message}
        onChangeText={setMessage}
      />
      <Button
        style={{ backgroundColor: theme['--color-bg-inverse'] }}
        label='Publicar'
        onPress={handleSubmit}
      />
    </View>
  )
}

const ReportComments = ({ reportId }: {
  reportId: string
}) => {
  const theme = useTheme()

  const commentsQuery = useQuery({
    queryKey: ['reports', reportId, 'comments'],
    queryFn: () => ReportService.getComments(reportId),
  })

  if (!commentsQuery.data) return <QueryWait qr={commentsQuery} />

  console.log(commentsQuery.data)

  return (
    <View className='flex gap-3'>
      <Text className='text-sm' style={{ color: theme['--color-text-muted'] }}>
        Comentarios
      </Text>
      {
        commentsQuery.data.map((comment) => (
          <View
            key={comment.id}
            className='p-4 rounded-xl gap-2'
            style={{ backgroundColor: theme['--color-bg-foreground'] }}
          >
            <Text style={{ color: theme['--color-text-default'] }}>
              {comment.message}
            </Text>
            <Text className='text-sm' style={{color: theme['--color-text-muted']}}>
              {dayjs(comment.createdAt).fromNow()}
            </Text>
          </View>
        ))
      }
    </View>
  )
}

const ReportSheet = ({ report }: {
  report: IReportResponse
}) => {
  const theme = useTheme()

  return (
    <BottomSheetView
      style={{ backgroundColor: theme['--color-bg-default'] }}
    >
      <ScrollView className='h-[60vh]'>
        <View className='flex gap-8 px-5 py-10'>
          <View className='flex gap-2'>
            <Text
              className='text-4xl font-bold'
              style={{ color: theme['--color-text-default'] }}
            >
              {report.reportType}
            </Text>
            <Text
              className='text-sm'
              style={{ color: theme['--color-text-muted'] }}
            >
              {report.address}
            </Text>
          </View>
          <View className='flex gap-2'>
            <Text
              className='text-sm'
              style={{ color: theme['--color-text-muted'] }}
            >
              Descripción
            </Text>
            <Text
              style={{ color: theme['--color-text-default'] }}
            >
              {report.description}
            </Text>
          </View>
          <NewCommentForm reportId={report.id} />
          <ReportComments reportId={report.id} />
        </View>
      </ScrollView>
    </BottomSheetView>
  )
}

// -12.062081, -76.989357
export default function Index() {
  const queryClient = useQueryClient();
  const map = useRef<Mapbox.MapView | null>();
  const theme = useTheme()

  const { status, data, error, isFetching } = useReports();

  const [zoom, setZoom] = useState(15);
  const [selectedReport, setSelectedReport] = useState<IReportResponse | null>(null);
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
                  console.log('🚨 Selecting report', report);
                  if (selectedReport === report) {
                    setSelectedReport(null);
                    bottomSheetModalRef.current?.close();
                  } else {
                    setSelectedReport(report);
                    bottomSheetModalRef.current?.present();
                  }
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
                  minWidth: zoom * ZOOM_SIZE_MULT * 4,
                  minHeight: zoom * ZOOM_SIZE_MULT * 4,
                  overflow: 'visible'
                }}
              >
                <View style={{ alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
                  {
                    report.multimediaReports.length > 0 ? <Image
                      source={{
                        uri: `${process.env.EXPO_PUBLIC_STORAGE_URL}/reports/${report.multimediaReports[0].resource}`,
                      }}
                      width={zoom * ZOOM_SIZE_MULT * 4}
                      height={zoom * ZOOM_SIZE_MULT * 4}
                      style={{ overflow: 'visible', borderRadius: 20 }}
                    ></Image>
                    : <View
                        style={{
                          backgroundColor: theme['--color-bg-default'],
                          borderRadius: 20,
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: zoom * ZOOM_SIZE_MULT * 6,
                          width: zoom * ZOOM_SIZE_MULT * 8,
                        }}
                        className='p-4'
                      >
                      <Text style={{ color: theme['--color-text-default'] }}>
                        {report.description}
                      </Text>
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
      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        handleStyle={{ backgroundColor: theme['--color-bg-default'] }}
        handleIndicatorStyle={{ backgroundColor: theme['--color-bg-foreground'] }}
      >
        {selectedReport && <ReportSheet report={selectedReport} />}
      </BottomSheetModal>
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
