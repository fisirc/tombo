import { ReportService } from "@/api/services/report";
import Button from "@/components/Button";
import ImageInput from "@/components/ImageInput";
import { MapPicker, reverseGeocoding } from "@/components/MapBoxPicker";
import Select, { SelectItem } from "@/components/Select";
import TextArea from "@/components/TextArea";
import reportTypes from "@/constants/reportTypes";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Modal, ScrollView, Text, View, Alert } from "react-native";
import { useState } from "react";
import * as Location from "expo-location";
import { IconLocationFilled } from "@tabler/icons-react-native";
import { TablesInsert } from "@/types/supabase";
import useCreateReport from "@/hooks/useCreateReport";
import useSession from "@/hooks/useSession";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

const formattedReportTypes = reportTypes.map((rt) => ({
  value: rt.value,
  label: rt.label,
}));

export type FormData = Omit<TablesInsert<"reports">, "user_id">;

export default () => {
  const { control, handleSubmit, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      latitude: 0,
      longitude: 0,
      address: "",
      report_type: "other",
      description: "",
    },
  });

  const { data: session } = useSession();

  const { mutate: createReport, isPending } = useCreateReport();
  const onSubmit = (formData: FormData) =>
    createReport(formData, {
      onSuccess: () => reset(),
    });

  const address = watch("address");

  const [mapPickerVisible, setMapPickerVisible] = useState(false);

  const setCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Se requiere permiso para acceder a la ubicación"
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const { latitude, longitude } = currentLocation.coords;

      const address = await reverseGeocoding(longitude, latitude);

      setValue("latitude", latitude);
      setValue("longitude", longitude);
      setValue("address", address);
    } catch (error) {
      Alert.alert("Error", "No se pudo obtener la ubicación actual");
      console.error("Error getting location:", error);
    }
  };

  return (
    <SafeAreaView className="h-full bg-default">
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
              <Text className="text-default">
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
          {/* <Controller
            name="multimediaReports"
            control={control}
            render={({ field }) => (
              <ImageInput
                label="Imágenes"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          /> */}
          <Button
            label="Enviar reporte"
            variant="danger"
            disabled={isPending}
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
    </SafeAreaView>
  );
};
