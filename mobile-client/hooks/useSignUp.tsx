import AuthService from "@/services/auth.service"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import { Alert } from "react-native"

export default () => {
  const router = useRouter()
  
  const mutation = useMutation({
    mutationFn: AuthService.signUp,
    onError: (error) => {
      Alert.alert("Error: " + error.name, error.message);
      console.error("Error signing in:", error);
    },
    onSuccess: () => {
      Alert.alert("Éxito", "Cuenta creada exitosamente. Por favor, verifica tu correo e inicia sesión.");
      router.navigate("/sign-in");
    }
  })

  return mutation
}
