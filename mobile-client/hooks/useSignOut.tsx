import AuthService from "@/services/auth.service"
import { useMutation } from "@tanstack/react-query"
import { Alert } from "react-native";

export default () => {
  const mutation = useMutation({
    mutationFn: AuthService.signOut,
    onError: (error) => {
      Alert.alert("Error: " + error.name, error.message);
      console.error("Error signing out:", error);
    },
  })
  return mutation
}
