import { ReportService } from "@/api/services/report";
import Button from "@/components/Button";
import ImageInput from "@/components/ImageInput";
import { MapPicker, reverseGeocoding } from "@/components/MapBoxPicker";
import Select, { SelectItem } from "@/components/Select";
import TextArea from "@/components/TextArea";
import reportTypes from "@/constants/reportTypes";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Modal, ScrollView, Text, View, Alert } from "react-native";
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { IconLocationFilled } from "@tabler/icons-react-native";
import { TablesInsert } from "@/types/supabase";
import useCreateReport from "@/hooks/useCreateReport";
import useSession from "@/hooks/useSession";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import useCurrentLocation from "@/hooks/useCurrentLocation";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import useTheme from "@/hooks/useTheme";
import { MediaAsset } from "@/types";

export type FormData = Omit<TablesInsert<"reports">, "user_id">;

export default () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isValid },
  } = useForm<FormData>({
    defaultValues: {
      latitude: 0,
      longitude: 0,
      address: "",
      report_type: "",
      description: "",
    },
  });
  const { data: currentLocation } = useCurrentLocation();
  const theme = useTheme();

  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);

  const { mutate: createReport, isPending } = useCreateReport();

  const onSubmit = (formData: FormData) =>
    createReport(
      { formData, mediaAssets },
      {
        onSuccess: () => reset(),
      }
    );

  const report_type = watch("report_type");
  const address = watch("address");

  const report_type_object = reportTypes.find((rt) => rt.value === report_type);

  const [mapPickerVisible, setMapPickerVisible] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const setCurrentLocation = () => {
    if (!currentLocation) {
      return;
    }
    setValue("latitude", currentLocation.latitude);
    setValue("longitude", currentLocation.longitude);
    setValue("address", currentLocation.address);
  };

  useEffect(() => {
    if (address === "") {
      setCurrentLocation();
    }
  }, []);

  return (
    <View className="h-full">
      <KeyboardAwareScrollView enableOnAndroid keyboardOpeningTime={2000}>
        <View className="px-5 my-8 flex gap-6">
          {/* <Controller
            name="report_type"
            control={control}
            render={({ field }) => (
              <View className="flex gap-2">
                <Text className="text-default">Tipo de evento*</Text>
                <Select
                  data={formattedReportTypes}
                  onSelect={field.onChange}
                  onBlur={field.onBlur}
                  search
                  placeholder="Robo a mano armada"
                  searchPlaceHolder="Buscar tipo de evento..."
                />
              </View>
            )}
          /> */}
          <View className="flex flex-col gap-2">
            <Text className="text-default">Lugar</Text>
            <Button
              className="justify-between bg-foreground-mild"
              variant="secondary"
              onPress={() => setMapPickerVisible(true)}
            >
              <Text className="text-default max-w-[90%] line-clamp-1 overflow-ellipsis">
                {address || "Seleccionar ubicación"}
              </Text>
              <IconLocationFilled size={20} color="#7f7f7f" />
            </Button>
            <Button
              variant="secondary"
              label="Usar ubicación actual"
              onPress={setCurrentLocation}
            />
          </View>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea
                label="Descripción"
                value={field.value}
                onChangeText={field.onChange}
                placeholder="Aproximadamente a las 10:00 PM..."
              />
            )}
          />
          <View className="flex flex-col gap-2">
            <Text className="text-default">Tipo de incidente</Text>
            <Button
              variant="secondary"
              onPress={() => {
                bottomSheetModalRef.current?.present();
              }}
            >
              {report_type_object ? (
                <View className="flex flex-row gap-2 items-center">
                  <report_type_object.Icon
                    size={24}
                    color={theme["--color-text-default"]}
                    strokeWidth={1.5}
                  />
                  <Text style={{ color: theme["--color-text-default"] }}>
                    {report_type_object.label}
                  </Text>
                </View>
              ) : (
                <Text className="text-default">Seleccionar tipo</Text>
              )}
            </Button>
          </View>
          <ImageInput
            label="Imágenes"
            value={mediaAssets}
            onChange={setMediaAssets}
          />
          <Button
            label="Enviar reporte"
            variant="danger"
            className="mt-4"
            disabled={isPending || !isValid}
            onPress={handleSubmit(onSubmit)}
          />

          <Modal
            visible={mapPickerVisible}
            animationType="slide"
            onRequestClose={() => setMapPickerVisible(false)}
          >
            <MapPicker
              onSelectLocation={(location) => {
                setValue("latitude", location.latitude);
                setValue("longitude", location.longitude);
                setValue("address", location.address);
                setMapPickerVisible(false);
              }}
              onClose={() => setMapPickerVisible(false)}
            />
          </Modal>
        </View>
      </KeyboardAwareScrollView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={[400, "100%"]}
        handleIndicatorStyle={{
          backgroundColor: theme["--color-bg-foreground-extra"],
        }}
        backgroundStyle={{ backgroundColor: theme["--color-bg-foreground"] }}
      >
        <BottomSheetScrollView>
          <SafeAreaView edges={["bottom", "top"]}>
            <KeyboardAwareScrollView>
              <View className="flex flex-col gap-2 px-5">
                {reportTypes.map((rt) => {
                  const isSelected = report_type === rt.value;
                  return (
                    <Button
                      className="flex flex-row gap-2 items-center"
                      key={rt.value}
                      style={{
                        backgroundColor: isSelected
                          ? "white"
                          : theme["--color-bg-foreground-extra"],
                      }}
                      onPress={() => {
                        setValue("report_type", rt.value);
                        bottomSheetModalRef.current?.dismiss();
                      }}
                    >
                      <rt.Icon
                        size={24}
                        color={
                          isSelected
                            ? theme["--color-text-inverse"]
                            : theme["--color-text-default"]
                        }
                        strokeWidth={1.5}
                      />
                      <Text
                        style={{
                          color: isSelected
                            ? theme["--color-text-inverse"]
                            : theme["--color-text-default"],
                        }}
                      >
                        {rt.label}
                      </Text>
                    </Button>
                  );
                })}
              </View>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
};
