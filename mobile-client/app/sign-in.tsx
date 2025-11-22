import React from "react";
import { Image, Text, View } from "react-native";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { Link } from "expo-router";
import useSignIn from "@/hooks/useSignIn";
import { useForm, Controller } from "react-hook-form";
import { SignInData } from "@/types/";

export default function Auth() {
  const { mutate: signIn, isPending } = useSignIn();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignInData>({
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (formData: SignInData) => signIn(formData);

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
            name="email"
            rules={{ required: "El correo es requerido" }}
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
            rules={{ required: "La contraseña es requerida" }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Contraseña"
                onChangeText={onChange}
                value={value}
                secureTextEntry={true}
                placeholder="Contraseña"
                autoCapitalize={"none"}
              />
            )}
          />

          <Button
            className="mt-4"
            label="Iniciar sesión"
            disabled={isPending || !isValid}
            onPress={handleSubmit(onSubmit)}
          />
        </View>

        <Text className="text-default text-center mt-12">
          ¿No tienes cuenta?{" "}
          <Link href="/sign-up" className="underline">
            Crea una nueva
          </Link>
        </Text>
      </View>
    </View>
  );
}
