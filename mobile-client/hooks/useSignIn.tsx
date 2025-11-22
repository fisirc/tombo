import AuthService from "@/services/auth.service"
import { useMutation } from "@tanstack/react-query"
import { Alert } from "react-native"
import { SignInData } from "@/types/"

export default () => {
  const mutation = useMutation({
    mutationFn: AuthService.signIn,
    onError: (error) => {
      Alert.alert("Error: " + error.name, error.message);
      console.error("Error signing in:", error);
    },
  })

  return mutation
}
