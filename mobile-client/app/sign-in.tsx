import React, { useState } from "react";
import { Alert, Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { supabase } from "@/services/supabase";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { Link } from "expo-router";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
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
            label="Correo electrónico"
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@dirección.com"
            autoCapitalize={"none"}
          />
          <Input
            label="Contraseña"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Contraseña"
            autoCapitalize={"none"}
          />
          <Button
            className="mt-4"
            label="Iniciar sesión"
            disabled={loading || !email || !password}
            onPress={() => signInWithEmail()}
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
