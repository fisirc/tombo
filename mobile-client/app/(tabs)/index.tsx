import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, useColorScheme, View } from "react-native";
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
import { IconClock, IconRoute, IconSearch } from "@tabler/icons-react-native";
import { FullReport } from "@/services/report.service";
import PagerView from "react-native-pager-view";

const DISPLACEMENT = [0, 5, 10];

const Container = ({ reports }: { reports: FullReport[] }) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const map = useRef<Mapbox.MapView | null>(null);

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
        styleURL={
          colorScheme === "dark"
            ? "mapbox://styles/mapbox/dark-v11"
            : "mapbox://styles/mapbox/light-v11"
        }
        compassEnabled={true}
        style={{ flex: 1 }}
        logoEnabled={false}
        attributionEnabled={false}
        scaleBarEnabled={false}
      >
        {reports.map((report) => {
          const reportType = reportTypes.find(
            (rep) => rep.value === report.report_type,
          );
          if (!reportType) throw new Error("Invalid report type");
          const mainColor = report.process_start
            ? theme["--color-warning"]
            : theme["--color-danger"];
          const isSelected = selectedReport?.id === report.id;
          return (
            <Mapbox.PointAnnotation
              coordinate={[report.longitude, report.latitude]}
              id={`icon-${report.id}`}
              key={`icon-${report.id}-${isSelected}`}
            >
              <reportType.Icon
                color={isSelected ? mainColor : "white"}
                strokeWidth={1.75}
                size={20}
              />
            </Mapbox.PointAnnotation>
          );
        })}
        {reports.map((report) => {
          const reportType = reportTypes.find(
            (rep) => rep.value === report.report_type,
          );
          if (!reportType) throw new Error("Invalid report type");
          const mainColor = report.process_start
            ? theme["--color-warning"]
            : theme["--color-danger"];
          console.log(mainColor, report.report_type, report.address);
          const isSelected = selectedReport?.id === report.id;
          return (
            <Mapbox.PointAnnotation
              coordinate={[report.longitude, report.latitude]}
              id={`bg-${report.id}`}
              key={`bg-${report.id}-${isSelected}`}
            >
              <View
                style={{
                  backgroundColor: isSelected ? "white" : mainColor,
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
