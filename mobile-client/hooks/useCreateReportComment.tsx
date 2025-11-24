import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import useSession from "./useSession";
import { supabase } from "@/services/supabase";
import CommentService from "@/services/comment.service";

export default (report_id: string) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const mutation = useMutation({
    mutationFn: (message: string) => {
      if (!session)
        throw new Error("comment submission attempted without signed-in user");
      return CommentService.createReportComment({
        message,
        report_id,
        user_id: session.user.id,
      });
    },
    onSuccess: (comment) => {
      // Alert.alert("Comentario enviado", "Tu comentario ha sido enviado con éxito");
      queryClient.invalidateQueries({
        queryKey: ["reports", report_id, "comments"],
      });
      supabase
        .channel("reports:" + report_id + '/comments')
        .send({
          type: "broadcast",
          event: "comment_created",
          payload: { comment },
        })
        .then((res) => console.log("Broadcasted comment_created event:", res))
        .catch((error) => {
          console.error("Error broadcasting comment_created event:", error);
        })
        .finally(() =>
          console.log("Finished attempting to broadcast comment_created event")
        );
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
      Alert.alert("Error", "No se pudo enviar el comentario");
    },
  });

  return mutation;
};
