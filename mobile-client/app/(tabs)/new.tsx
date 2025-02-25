import { ReportService } from "@/api/services/report";
import Button from "@/components/Button";
import ImageInput from "@/components/ImageInput";
import Select, { SelectItem } from "@/components/Select";
import TextArea from "@/components/TextArea";
import reportTypes from "@/constants/reportTypes";
import { ReportForm } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";

const Form = () => {
  const { control, handleSubmit } = useForm<ReportForm>({
    defaultValues: { multimediaReports: [] }
  })

  const queryClient = useQueryClient()

  const createReportMutation = useMutation({
    mutationFn: ReportService.createReport,
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ['reports']
    })
  })

  const onSubmit: SubmitHandler<ReportForm> = (data) => {
    createReportMutation.mutate(data)
  }

  const formattedReportTypes: SelectItem[] = reportTypes.map((rt) => ({
    value: rt.name,
    label: rt.name,
  }))

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
      <Button
        label="Enviar reporte"
        variant="danger"
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  )
}

export default function Settings() {
  return (
    <ScrollView className="flex-1 bg-default">
      <Form />
    </ScrollView>
  );
}
