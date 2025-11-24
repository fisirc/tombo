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
import { SafeAreaView } from "react-native-safe-area-context";
import useGetReportComments from "@/hooks/useGetReportComments";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import reportTypes from "@/constants/reportTypes";
import EmptyMsg from "@/components/EmptyMsg";
import useCreateReportComment from "@/hooks/useCreateReportComment";
import { IconClock, IconRoute } from "@tabler/icons-react-native";
import { FullReport } from "@/services/report.service";
import PagerView from "react-native-pager-view";

const DISPLACEMENT = [0, 5, 10];

const NewCommentForm = ({
  report_id,
  sheetRef,
}: {
  report_id: string;
  sheetRef: React.RefObject<BottomSheetModal | null>;
}) => {
  const theme = useTheme();
  const [message, setMessage] = useState<string>("");
  const { mutate: createReportComment } = useCreateReportComment(report_id);

  const handleSubmit = () =>
    createReportComment(message, {
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
      {comments.length ? (
        comments.map((comment) => (
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
      ) : (
        <EmptyMsg />
      )}
    </View>
  );
};

const ReportSheet = ({
  report,
  sheetRef,
}: {
  report: FullReport;
  sheetRef: React.RefObject<BottomSheetModal | null>;
}) => {
  const theme = useTheme();

  const reportType = reportTypes.find((r) => r.value === report.report_type);

  const timeElapsed = dayjs(report.created_at).fromNow();

  if (!reportType) throw new Error("Invalid report type");

  return (
    <BottomSheetScrollView>
      <SafeAreaView edges={["bottom"]}>
        <View className="flex gap-8 px-5 py-10">
          <View className="flex gap-2">
            <View className="flex flex-row gap-2 items-center">
              <reportType.Icon
                color={theme["--color-text-default"]}
                size={32}
                strokeWidth={2.5}
              />
              <Text
                className="text-4xl font-bold"
                style={{ color: theme["--color-text-default"] }}
              >
                {reportType.label}
              </Text>
            </View>
            <View className="flex flex-col gap-2 mt-4">
              <View className="flex flex-row gap-3 items-center">
                <IconClock
                  size={15}
                  color={theme["--color-text-muted"]}
                  strokeWidth={1.75}
                />
                <Text style={{ color: theme["--color-text-muted"] }}>
                  {timeElapsed}
                </Text>
              </View>
              <View className="flex flex-row gap-3 items-center">
                <IconRoute
                  size={15}
                  color={theme["--color-text-muted"]}
                  strokeWidth={1.75}
                />
                <Text
                  style={{ color: theme["--color-text-muted"] }}
                  className="text-wrap max-w-[90%]"
                >
                  {report.address}
                </Text>
              </View>
            </View>
          </View>
          {report.multimedia_reports.length ? (
            <PagerView style={{ height: 250 }} pageMargin={16}>
              {report.multimedia_reports.map((image) => (
                <Image
                  key={image.id}
                  source={{ uri: image.resource }}
                  style={{ borderRadius: 12, height: 250 }}
                />
              ))}
            </PagerView>
          ) : null}
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

const Container = ({ reports }: { reports: FullReport[] }) => {
  const theme = useTheme();

  const map = useRef<Mapbox.MapView | null>(null);
  const [zoom, setZoom] = useState(15);

  const [selectedReport, setSelectedReport] = useState<FullReport | null>(null);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSelectedReport(null);
    }
  }, []);

  const handlePointPress = (report: FullReport) => {
    setSelectedReport(report);
    bottomSheetModalRef.current?.present();
  };

  console.log("selectedReport", selectedReport);

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
          const reportType = reportTypes.find(
            (rep) => rep.value === report.report_type
          );
          if (!reportType) throw new Error("Invalid report type");
          const isSelected = selectedReport?.id === report.id;
          return (
            <Mapbox.PointAnnotation
              coordinate={[report.longitude, report.latitude]}
              id={`icon-${report.id}`}
              key={`icon-${report.id}-${isSelected}`}
              onSelected={() => handlePointPress(report)}
              onDeselected={() => handlePointPress(report)}
            >
              <reportType.Icon
                color={isSelected ? theme["--color-danger"] : "white"}
                strokeWidth={1.75}
                size={20}
              />
            </Mapbox.PointAnnotation>
          );
        })}
        {reports.map((report) => {
          const reportType = reportTypes.find(
            (rep) => rep.value === report.report_type
          );
          if (!reportType) throw new Error("Invalid report type");
          const isSelected = selectedReport?.id === report.id;
          return (
            <Mapbox.PointAnnotation
              coordinate={[report.longitude, report.latitude]}
              id={`bg-${report.id}`}
              key={`bg-${report.id}-${isSelected}`}
              onSelected={() => handlePointPress(report)}
              onDeselected={() => handlePointPress(report)}
            >
              <View
                style={{
                  backgroundColor: isSelected
                    ? "white"
                    : theme["--color-danger"],
                  borderRadius: 1000,
                  width: 30,
                  height: 30,
                }}
              />
            </Mapbox.PointAnnotation>
          );
        })}
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
        snapPoints={[500, "100%"]}
        handleIndicatorStyle={{
          backgroundColor: theme["--color-bg-foreground-extra"],
        }}
        backgroundStyle={{ backgroundColor: theme["--color-bg-default"] }}
      >
        {selectedReport && (
          <ReportSheet report={selectedReport} sheetRef={bottomSheetModalRef} />
        )}
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
