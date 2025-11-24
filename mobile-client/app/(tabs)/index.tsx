import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Mapbox, {
  Annotation,
  Camera,
  UserLocation,
  UserTrackingMode,
} from "@rnmapbox/maps";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IReportResponse, ReportService } from "@/api/services/report";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import useTheme from "@/hooks/useTheme";
import QueryWait from "@/components/QueryWait";
import dayjs from "dayjs";
import TextArea from "@/components/TextArea";
import Button from "@/components/Button";
import useSession from "@/hooks/useSession";
import useGetReports from "@/hooks/useGetReports";
import { Tables } from "@/types/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import useGetReportComments from "@/hooks/useGetReportComments";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import reportTypes from "@/constants/reportTypes";
import EmptyMsg from "@/components/EmptyMsg";
import useCreateReportComment from "@/hooks/useCreateReportComment";

const DISPLACEMENT = [0, 5, 10];
const MARKER_SIZE = 35

const NewCommentForm = ({
  report_id,
  sheetRef
}: {
  report_id: string,
  sheetRef: React.RefObject<BottomSheetModal | null>
}) => {
  const theme = useTheme();
  const [message, setMessage] = useState<string>("");
  const { mutate: createReportComment } = useCreateReportComment(report_id);

  const handleSubmit = () => createReportComment(message, {
    onSuccess: () => setMessage(""),
  });

  return (
    <View className="flex gap-3">
      <Text className="text-sm" style={{ color: theme["--color-text-muted"] }}>
        Nuevo comentario
      </Text>
      <TextArea
        placeholder="El sospechoso escapó por la avenida..."
        value={message}
        onChangeText={setMessage}
        onPress={() => sheetRef.current?.expand()}
      />
      <Button
        style={{ backgroundColor: theme["--color-bg-inverse"] }}
        label="Publicar"
        className="mt-1"
        onPress={handleSubmit}
        disabled={message.trim().length === 0}
      />
    </View>
  );
};

const ReportComments = ({ report_id }: { report_id: string }) => {
  const theme = useTheme();

  const commentsQR = useGetReportComments(report_id);
  const { data: comments } = commentsQR;

  if (!comments) return <QueryWait qr={commentsQR} />;

  return (
    <View className="flex gap-3">
      <Text className="text-sm" style={{ color: theme["--color-text-muted"] }}>
        Comentarios
      </Text>
      {
        comments.length
        ? comments.map((comment) => (
          <View
            key={comment.id}
            className="p-4 rounded-xl gap-2"
            style={{ backgroundColor: theme["--color-bg-foreground"] }}
          >
            <Text style={{ color: theme["--color-text-default"] }}>
              {comment.message}
            </Text>
            <Text
              className="text-sm"
              style={{ color: theme["--color-text-muted"] }}
            >
              {dayjs(comment.created_at).fromNow()}
            </Text>
          </View>
        ))
        : <EmptyMsg />
      }
    </View>
  );
};

const ReportSheet = ({
  report,
  sheetRef
}: {
  report: Tables<"reports">,
  sheetRef: React.RefObject<BottomSheetModal | null>
}) => {
  const theme = useTheme();

  const reportType = reportTypes.find((r) => r.value === report.report_type);

  if (!reportType) throw new Error("Invalid report type");

  return (
    <BottomSheetScrollView
      // style={{ backgroundColor: theme["--color-bg-default"] }}
    >
      <SafeAreaView edges={['bottom']}>
        {/* <KeyboardAwareScrollView
          className="h-[60vh]"
          enableOnAndroid
          keyboardOpeningTime={2000}
        > */}
          <View className="flex gap-8 px-5 py-10">
            <View className="flex gap-2">
              <View className="flex flex-row gap-2 items-center">
                <reportType.Icon color={theme["--color-text-default"]} size={32} strokeWidth={3} />
                <Text
                  className="text-4xl font-bold"
                  style={{ color: theme["--color-text-default"] }}
                >
                  {reportType.label}
                </Text>
              </View>
              <Text
                style={{ color: theme["--color-text-default"] }}
              >
                {report.address}
              </Text>
            </View>
            <View className="flex gap-3">
              <Text
                className="text-sm"
                style={{ color: theme["--color-text-muted"] }}
              >
                Descripción
              </Text>
              <Text style={{ color: theme["--color-text-default"] }}>
                {report.description}
              </Text>
            </View>
            <NewCommentForm report_id={report.id} sheetRef={sheetRef} />
            <ReportComments report_id={report.id} />
          </View>
        {/* </KeyboardAwareScrollView> */}
      </SafeAreaView>
    </BottomSheetScrollView>
  );
};

const Container = ({ reports }: { reports: Tables<"reports">[] }) => {
  const theme = useTheme();

  const map = useRef<Mapbox.MapView | null>(null);
  const [zoom, setZoom] = useState(15);

  const [selectedReport, setSelectedReport] =
    useState<Tables<"reports"> | null>(null);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSelectedReport(null);
    }
  }, []);

  const handlePointPress = (report: Tables<'reports'>) => {
    setSelectedReport(report)
    bottomSheetModalRef.current?.present()
  }

  console.log('selectedReport', selectedReport)

  return (
    <View style={{ flex: 1 }}>
      <Mapbox.MapView
        ref={(mapRef) => {
          map.current = mapRef;
        }}
        zoomEnabled={true}
        styleURL="mapbox://styles/mapbox/dark-v11"
        compassEnabled={true}
        style={{ flex: 1 }}
        logoEnabled={false}
        attributionEnabled={false}
        scaleBarEnabled={false}
        onTouchEnd={async () => {
          const zoom = (await map.current?.getZoom()) ?? 1;
          setZoom(zoom);
        }}
      >
        {reports.map((report) => {
          const reportType = reportTypes.find(rep => rep.value === report.report_type);
          if (!reportType) throw new Error("Invalid report type");
          const isSelected = selectedReport?.id === report.id;
          if (isSelected) console.log('selected', report.description, isSelected)
          return (
            <Mapbox.PointAnnotation
              coordinate={[report.longitude, report.latitude]}
              id={report.id}
              key={`${report.id}-${isSelected}`}
              onSelected={() => handlePointPress(report)}
              onDeselected={() => handlePointPress(report)}
            >
              <reportType.Icon
                size={MARKER_SIZE - 10}
                color={isSelected ? theme['--color-danger'] : 'white'}
                strokeWidth={3}
                style={{
                  backgroundColor: isSelected ? 'white' : theme['--color-danger'],
                  borderRadius: 1000,
                  width: MARKER_SIZE,
                  height: MARKER_SIZE,
                }}
              />
            </Mapbox.PointAnnotation>
          )
        })}
        {/* {reports.map((report) => (
          <Mapbox.MarkerView
            key={report.id}
            coordinate={[report.longitude, report.latitude]}
            anchor={{ x: 0.5, y: 1 }}
            className="overflow-visible"
            style={{
              width: zoom * ZOOM_SIZE_MULT * 4,
              minWidth: zoom * ZOOM_SIZE_MULT * 4,
              minHeight: zoom * ZOOM_SIZE_MULT * 4,
            }}
          >
            <View className='items-center justify-center overflow-visible'>
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
        ))} */}
        <Camera
          followZoomLevel={16}
          followUserMode={UserTrackingMode.Follow}
          followUserLocation
        />
        <UserLocation minDisplacement={DISPLACEMENT[0]} />
      </Mapbox.MapView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        snapPoints={[500, '100%']}
        handleIndicatorStyle={{
          backgroundColor: theme["--color-bg-foreground-extra"],
        }}
        backgroundStyle={{ backgroundColor: theme["--color-bg-default"] }}
      >
        {selectedReport && <ReportSheet report={selectedReport} sheetRef={bottomSheetModalRef} />}
      </BottomSheetModal>
    </View>
  );
};

// -12.062081, -76.989357
export default () => {
  const getReportsQR = useGetReports();
  const { data: reports } = getReportsQR;

  return (
    <View className="h-full">
      {reports ? (
        <Container reports={reports} />
      ) : (
        <QueryWait qr={getReportsQR} />
      )}
    </View>
  );
};
