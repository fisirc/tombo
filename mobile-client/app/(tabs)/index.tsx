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
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import useTheme from "@/hooks/useTheme";
import QueryWait from "@/components/QueryWait";
import dayjs from "dayjs";
import { ScrollView } from "react-native-gesture-handler";
import TextArea from "@/components/TextArea";
import Button from "@/components/Button";
import useSession from "@/hooks/useSession";
import useGetReports from "@/hooks/useGetReports";
import { Tables } from "@/types/supabase";
import { SafeAreaView } from "react-native-safe-area-context";

const DISPLACEMENT = [0, 5, 10];
const ZOOM_SIZE_MULT = 1.5;

const NewCommentForm = ({ reportId }: { reportId: string }) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string>("");

  const commentMutation = useMutation({
    mutationFn: ReportService.createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reports", reportId, "comments"],
      });
      setMessage("");
    },
  });

  const handleSubmit = () => {
    commentMutation.mutate({
      reportId,
      message,
    });
  };

  return (
    <View className="flex gap-2">
      <Text className="text-sm" style={{ color: theme["--color-text-muted"] }}>
        Nuevo comentario
      </Text>
      <TextArea
        placeholder="El sospechoso escapó por la avenida..."
        value={message}
        onChangeText={setMessage}
      />
      <Button
        style={{ backgroundColor: theme["--color-bg-inverse"] }}
        label="Publicar"
        onPress={handleSubmit}
      />
    </View>
  );
};

const ReportComments = ({ reportId }: { reportId: string }) => {
  const theme = useTheme();

  const commentsQuery = useQuery({
    queryKey: ["reports", reportId, "comments"],
    queryFn: () => ReportService.getComments(reportId),
  });

  if (!commentsQuery.data) return <QueryWait qr={commentsQuery} />;

  console.log(commentsQuery.data);

  return (
    <View className="flex gap-3">
      <Text className="text-sm" style={{ color: theme["--color-text-muted"] }}>
        Comentarios
      </Text>
      {commentsQuery.data.map((comment) => (
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
            {dayjs(comment.createdAt).fromNow()}
          </Text>
        </View>
      ))}
    </View>
  );
};

const ReportSheet = ({ report }: { report: Tables<"reports"> }) => {
  const theme = useTheme();

  return (
    <BottomSheetView style={{ backgroundColor: theme["--color-bg-default"] }}>
      <ScrollView className="h-[60vh]">
        <View className="flex gap-8 px-5 py-10">
          <View className="flex gap-2">
            <Text
              className="text-4xl font-bold"
              style={{ color: theme["--color-text-default"] }}
            >
              {report.report_type}
            </Text>
            <Text
              className="text-sm"
              style={{ color: theme["--color-text-muted"] }}
            >
              {report.address}
            </Text>
          </View>
          <View className="flex gap-2">
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
          <NewCommentForm reportId={report.id} />
          <ReportComments reportId={report.id} />
        </View>
      </ScrollView>
    </BottomSheetView>
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
    console.log("handleSheetChanges", index);
  }, []);

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
        {reports.map((report) => (
          <Mapbox.PointAnnotation
            coordinate={[report.longitude, report.latitude]}
            id={report.id}
            key={report.id}
            onSelected={() => {
              console.log("🚨 Selecting report", report);
              if (selectedReport === report) {
                setSelectedReport(null);
                bottomSheetModalRef.current?.close();
              } else {
                setSelectedReport(report);
                bottomSheetModalRef.current?.present();
              }
            }}
          >
            <View
              style={{
                height: zoom * ZOOM_SIZE_MULT,
                width: zoom * ZOOM_SIZE_MULT,
                backgroundColor: "#f84747",
                borderRadius: 50,
                borderColor: "#fff",
                borderWidth: 1.5,
              }}
            ></View>
          </Mapbox.PointAnnotation>
        ))}
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
        handleStyle={{ backgroundColor: theme["--color-bg-default"] }}
        handleIndicatorStyle={{
          backgroundColor: theme["--color-bg-foreground"],
        }}
      >
        {selectedReport && <ReportSheet report={selectedReport} />}
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
