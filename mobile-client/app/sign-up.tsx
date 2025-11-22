import { Image, View } from "react-native";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { Link } from "expo-router";
import { SignUpData } from "@/types/";
import { useForm, Controller } from "react-hook-form";
import useSignUp from "@/hooks/useSignUp";

export default function Auth() {
  const { mutate: signUp, isPending } = useSignUp();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { isValid }
  } = useForm<SignUpData>({
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: ""
    },
  });

  const password = watch("password")

  const onSubmit = (data: SignUpData) => signUp(data)

  return (
    <View className="h-full flex flex-col justify-center bg-default px-5">
      <View className="flex flex-col">
        <View className="flex flex-row justify-center mb-16">
          <Image
            source={require("../assets/logo-white.png")}
            style={{
              width: 180,
              height: undefined,
              aspectRatio: 100 / 23.27,
            }}
          />
        </View>
        <View className="flex flex-col gap-4">
          <Controller
            control={control}
            name="full_name"
            rules={{ required: "El nombre es requerido" }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Nombre"
                onChangeText={onChange}
                value={value}
                placeholder="Juan Tapia"
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{
              required: "El correo es requerido",
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "El correo no es válido"
              }
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Correo electrónico"
                onChangeText={onChange}
                value={value}
                placeholder="email@dirección.com"
                autoCapitalize={"none"}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: "La contraseña es requerida",
              minLength: {
                value: 8,
                message: "La contraseña debe tener al menos 8 caracteres",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Contraseña"
                onChangeText={onChange}
                value={value}
                secureTextEntry={true}
                placeholder="Usa una contraseña segura"
                autoCapitalize={"none"}
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            rules={{
              validate: value => value === password || "Las contraseñas no coinciden"
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Confirmar contraseña"
                onChangeText={onChange}
                value={value}
                secureTextEntry={true}
                placeholder="Repite tu contraseña"
                autoCapitalize={"none"}
              />
            )}
          />

          <Button
            className="mt-4"
            label={isPending ? "Creando..." : "Crear cuenta"}
            disabled={isPending || !isValid}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
        <Link
          href="/sign-up"
          className="text-default text-center mt-12 underline"
        >
          Ya tengo cuenta
        </Link>
      </View>
    </View>
  );
}
