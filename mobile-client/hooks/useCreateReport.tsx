import ReportService from "@/services/report.service";
import { TablesInsert } from "@/types/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReset } from "react-hook-form";
import { Alert } from "react-native";
import useSession from "./useSession";
import { FormData } from "@/app/(tabs)/new";

export default () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      if (!session)
        throw new Error("report submission attempted without signed-in user");
      return ReportService.createReport({
        ...formData,
        user_id: session.user.id,
      });
    },
    onSuccess: () => {
      Alert.alert("Reporte enviado", "Tu reporte ha sido enviado con éxito");
      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });
    },
    onError: (error) => {
      Alert.alert("Error", "No se pudo enviar el reporte");
      console.error("Error creating report:", error);
    },
  });

  return mutation;
};
