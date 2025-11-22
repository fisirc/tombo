import React, { useState } from "react";
import { Alert, Image, View } from "react-native";
import { supabase } from "@/services/supabase";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { Link, useRouter } from "expo-router";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  // const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      // phone,
      options: { data: { username } },
    });

    if (error) {
      Alert.alert(error.message);
      return;
    }

    Alert.alert(
      "Cuenta creada",
      "Por favor revisa tu correo para verificar tu cuenta."
    );
    router.navigate("/sign-in");
    setLoading(false);
  }

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
          <Input
            label="Nombre"
            onChangeText={(text) => setUsername(text)}
            value={username}
            placeholder="Juan Tapia"
          />
          <Input
            label="Correo electrónico"
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@dirección.com"
            autoCapitalize={"none"}
          />
          {/* <Input
            label="Teléfono"
            onChangeText={(text) => setPhone(text)}
            value={phone}
            placeholder="987654321"
          /> */}
          <Input
            label="Contraseña"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Usa una contraseña segura"
            autoCapitalize={"none"}
          />
          <Input
            label="Repetir contraseña"
            onChangeText={(text) => setRepassword(text)}
            value={repassword}
            secureTextEntry={true}
            placeholder="Repite tu contraseña"
            autoCapitalize={"none"}
          />
          <Button
            className="mt-4"
            label="Crear cuenta"
            disabled={
              loading ||
              password !== repassword ||
              !username ||
              !email ||
              !password
            }
            onPress={() => signUpWithEmail()}
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
