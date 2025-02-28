import { ReportService } from "@/api/services/report";
import Button from "@/components/Button";
import ImageInput from "@/components/ImageInput";
import { MapPicker, reverseGeocoding } from "@/components/MapBoxPicker";
import Select, { SelectItem } from "@/components/Select";
import TextArea from "@/components/TextArea";
import reportTypes from "@/constants/reportTypes";
import { ReportForm } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Modal, ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
import { useState } from "react";
import * as Location from 'expo-location';
import { IconLocationFilled } from "@tabler/icons-react-native";

const Form = () => {
  const [mapPickerVisible, setMapPickerVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { control, handleSubmit, setValue, watch } = useForm<ReportForm>({
    defaultValues: {
      multimediaReports: [],
      location: {
        latitude: 0,
        longitude: 0,
        address: '',
      },
    },
  })

  const location = watch("location");

  const queryClient = useQueryClient()

  const createReportMutation = useMutation({
    mutationFn: ReportService.createReport,
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ['reports']
    })
  })

  const onSubmit: SubmitHandler<ReportForm> = (data) => {
    setSubmitLoading(true);
    createReportMutation.mutate(data, {
      onSuccess: () => {
        Alert.alert('Reporte enviado', 'Tu reporte ha sido enviado con éxito');
        // clear form
        setValue('description', '');
        setValue('reportType', '');
        setValue('multimediaReports', []);
        setValue('location', {
          latitude: 0,
          longitude: 0,
          address: '',
        });
        setSubmitLoading(false);
      },
      onError: (error) => {
        Alert.alert('Error', 'No se pudo enviar el reporte');
        console.error('Error creating report:', error);
        setSubmitLoading(false);
      },
    });
  }

  const formattedReportTypes: SelectItem[] = reportTypes.map((rt) => ({
    value: rt.name,
    label: rt.name,
  }))

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se requiere permiso para acceder a la ubicación');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const { latitude, longitude } = currentLocation.coords;

      const address = await reverseGeocoding(longitude, latitude);

      setValue('location', {
        latitude,
        longitude,
        address,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación actual');
      console.error('Error getting location:', error);
    }
  };

  return (
    <View className="px-5 py-10 flex gap-6">
      <Controller
        name="reportType"
        control={control}
        render={({ field }) => (
          <Select
            label="Tipo de evento*"
            data={formattedReportTypes}
            onSelect={field.onChange}
            onBlur={field.onBlur}
            search
            placeholder="Robo a mano armada"
            searchPlaceHolder="Buscar tipo de evento..."
          />
        )}
      />
      <View>
        <Text className="text-sm font-medium mb-2 text-default">Lugar</Text>
        <TouchableOpacity
          onPress={() => setMapPickerVisible(true)}
          className="rounded-md p-3 flex-row justify-between items-center bg-bg-default bg-foreground-mild"
        >
          <Text className="text-default">
        {location?.address ? location.address : "Seleccionar ubicación"}
          </Text>
          <IconLocationFilled size={20} color="#7f7f7f" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={getCurrentLocation}
          className="mv-2 mt-2 flex-row items-center justify-center p-3 bg-bg-subtle rounded-md bg-foreground"
        >
          <Text className="text-default text-md">Usar ubicación actual</Text>
        </TouchableOpacity>
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
      <Controller
        name="multimediaReports"
        control={control}
        render={({ field }) => (
          <ImageInput
            label="Imágenes"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      {
        submitLoading ? (
          <Button
            label="Enviando..."
            variant="danger"
            style={{ opacity: 0.5 }}
            disabled
          />
        ) : <Button
          label="Enviar reporte"
          variant="danger"
          onPress={handleSubmit(onSubmit)}
        />
      }

      <Modal
        visible={mapPickerVisible}
        animationType="slide"
        onRequestClose={() => setMapPickerVisible(false)}
      >
        <MapPicker
          onSelectLocation={(location) => {
            setValue('location', {
              address: location.address,
              latitude: location.latitude,
              longitude: location.longitude,
            });
            setMapPickerVisible(false);
          }}
          onClose={() => setMapPickerVisible(false)}
        />
      </Modal>
    </View>
  );
}

export default function Settings() {
  return (
    <ScrollView className="flex-1 bg-default">
      <Form />
    </ScrollView>
  );
}
