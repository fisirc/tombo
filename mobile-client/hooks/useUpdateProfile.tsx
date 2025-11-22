import ProfileService from "@/services/profile.service";
import { TablesUpdate } from "@/types/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export default (id: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (formData: TablesUpdate<'profiles'>) => ProfileService.updateProfile(id, formData),
    onSuccess: () => {
      Alert.alert("Perfil actualizado", "Tu perfil ha sido actualizado con éxito");
      queryClient.invalidateQueries({
        queryKey: ["profile", id],
      })
    },
    onError: (error) => {
      Alert.alert("Error", "No se pudo actualizar el perfil");
      console.error("Error updating profile:", error);
    }
  })

  return mutation
}
