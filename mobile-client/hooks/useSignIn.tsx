import AlertService from "@/services/alert.service"
import AuthService from "@/services/auth.service"
import { useMutation } from "@tanstack/react-query"
import { Alert } from "react-native"

export default () => {
  const mutation = useMutation({
    mutationFn: AuthService.signIn,
    onSuccess: ({ user }) => AlertService.allowAlerts(user.id),
    onError: (error) => {
      Alert.alert("Error: " + error.name, error.message);
      console.error("Error signing in:", error);
    },
  })

  return mutation
}
