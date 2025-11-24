import ReportService from "@/services/report.service";
import { TablesInsert } from "@/types/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReset } from "react-hook-form";
import { Alert } from "react-native";
import useSession from "./useSession";
import { FormData } from "@/app/(tabs)/new";
import { supabase } from "@/services/supabase";
import { useRouter } from "expo-router";
import { LocalMedia } from "@/types";

export default () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = useSession();

  const mutation = useMutation({
    mutationFn: ({ formData, media }: {
      formData: FormData;
      media: LocalMedia[];
    }) => {
      if (!session)
        throw new Error("report submission attempted without signed-in user");
      return ReportService.createReport({
        ...formData,
        user_id: session.user.id,
      }, media);
    },
    onSuccess: (report) => {
      Alert.alert("Reporte enviado", "Tu reporte ha sido enviado con éxito");
      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });
      supabase
        .channel("reports")
        .send({
          type: "broadcast",
          event: "report_created",
          payload: { report },
        })
        .then((res) => console.log("Broadcasted report_created event:", res))
        .catch((error) => {
          console.error("Error broadcasting report_created event:", error);
        })
        .finally(() =>
          console.log("Finished attempting to broadcast report_created event")
        );
      router.navigate('/');
    },
    onError: (error) => {
      console.error("Error creating report:", error);
      Alert.alert("Error", "No se pudo enviar el reporte");
    },
  });

  return mutation;
};
