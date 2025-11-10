import { ProfileService } from "@/api/services/profile";
import Button from "@/components/Button";
import Input from "@/components/Input";
import QueryWait from "@/components/QueryWait";
import Select from "@/components/Select";
import Switch from "@/components/Switch";
import { Profile } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, View, Image, Alert } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  scopes: ["profile", "email"],
  offlineAccess: true,
});

type Radius = {
  label: string;
  value: number;
};

const radii: Radius[] = [
  {
    label: "1km",
    value: 1,
  },
  {
    label: "5km",
    value: 5,
  },
  {
    label: "10km",
    value: 10,
  },
  {
    label: "20km",
    value: 20,
  },
];

const LoginScreen = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      onLogin(userInfo.data?.user);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Inicio de sesión cancelado");
      } else {
        console.log("Error en el login:", error);
      }
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-default">
      <Text className="text-xl font-medium mb-4 text-white">
        Inicia sesión para continuar
      </Text>
      <GoogleSigninButton onPress={handleGoogleLogin} />
    </View>
  );
};

const Form = ({
  defaultValues,
  user,
  onLogout,
}: {
  defaultValues: Profile;
  user: any;
  onLogout: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(true);
  const { control, handleSubmit } = useForm<Profile>({ defaultValues });

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      Alert.alert("Éxito", "Los cambios han sido guardados correctamente");
    }
  };

  const handleLogout = async () => {
    try {
      await GoogleSignin.signOut();
      onLogout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View className="px-5 py-10 flex gap-14">
      <View className="flex gap-8">
        <Text className="text-default text-xl font-medium">General</Text>
        <View className="flex gap-6">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                label="Nombre*"
                value={field.value}
                onChangeText={field.onChange}
                placeholder="Juan Pérez"
                editable={isEditing}
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                label="Teléfono*"
                value={field.value}
                onChangeText={field.onChange}
                placeholder="987654321"
                editable={isEditing}
              />
            )}
          />
        </View>
      </View>
      <View className="flex gap-8">
        <Text className="text-default text-xl font-medium">Notificaciones</Text>
        <View className="flex gap-6">
          <Controller
            name="notifications"
            control={control}
            render={({ field }) => (
              <Switch
                label="Notificar sobre alertas cercanas"
                value={field.value}
                onValueChange={field.onChange}
                disabled={!isEditing}
              />
            )}
          />
        </View>
      </View>
      <Controller
        name="notificationsRadius"
        control={control}
        render={({ field }) => (
          <View className="flex gap-2">
            <Text className="text-default">Rango de cercanía</Text>
            <Select
              placeholder="1km"
              data={radii}
              defaultValue={radii.find(
                (r) => r.value === defaultValues.notificationsRadius
              )}
              onSelect={field.onChange}
              onBlur={field.onBlur}
            />
          </View>
        )}
      />
      <Button
        label={isEditing ? "Guardar cambios" : "Editar"}
        onPress={isEditing ? handleSubmit(toggleEditMode) : toggleEditMode}
      />
      <Button
        label="Cerrar sesión"
        onPress={handleLogout}
        variant="secondary"
        className="mt-4 self-center opacity-70"
      />
    </View>
  );
};

const QueryLayer = ({
  user,
  onLogout,
}: {
  user: any;
  onLogout: () => void;
}) => {
  const defaultValuesQuery = useQuery({
    queryKey: ["profile"],
    queryFn: ProfileService.getProfile,
  });

  const defaultValues = defaultValuesQuery.data;

  useEffect(() => {
    if (user && defaultValues) {
      defaultValues.name = user.name || defaultValues.name;
      defaultValues.phone = defaultValues.phone || "";
    }
  }, [user, defaultValues]);

  if (!defaultValues) {
    return <QueryWait query={defaultValuesQuery} />;
  }

  return <Form defaultValues={defaultValues} user={user} onLogout={onLogout} />;
};

export default function Settings() {
  const [user, setUser] = useState<any>(null);

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return (
    <ScrollView className="flex-1 bg-default">
      <View className="p-5 flex items-center">
        <Image
          source={{ uri: user.photo }}
          className="w-20 h-20 rounded-full mb-3"
        />
        <Text className="text-lg font-bold text-white">{user.name}</Text>
        <Text className="text-md text-white">{user.email}</Text>
      </View>
      <QueryLayer user={user} onLogout={handleLogout} />
    </ScrollView>
  );
}
