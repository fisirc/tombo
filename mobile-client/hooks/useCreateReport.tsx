import ReportService from "@/services/report.service";
import { TablesInsert } from "@/types/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReset } from "react-hook-form";
import { Alert } from "react-native";

export default (reset: UseFormReset<TablesInsert<'reports'>>) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ReportService.createReport,
    onSuccess: () => {
      reset();
      Alert.alert("Reporte enviado", "Tu reporte ha sido enviado con éxito");
      queryClient.invalidateQueries({
        queryKey: ["reports"],
      })
    },
    onError: (error) => {
      Alert.alert("Error", "No se pudo enviar el reporte");
      console.error("Error creating report:", error);
    },
  });

  return mutation
}
