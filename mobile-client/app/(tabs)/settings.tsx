import { ProfileService } from "@/api/services/profile";
import Button from "@/components/Button";
import Input from "@/components/Input";
import QueryWait from "@/components/QueryWait";
import Select from "@/components/Select";
import Switch from "@/components/Switch";
import { Profile } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { GoogleLogin } from "../_layout";
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

type Radius = {
  label: string
  value: number
}

const radii: Radius[] = [
  {
    label: '1km',
    value: 1
  },
  {
    label: '5km',
    value: 5
  },
  {
    label: '10km',
    value: 10
  },
  {
    label: '20km',
    value: 20
  }
]

const Form = ({ defaultValues }: {
  defaultValues: Profile
}) => {
  const { control, handleSubmit } = useForm<Profile>({ defaultValues })

  const queryClient = useQueryClient()

  const updateProfileMutation = useMutation({
    mutationFn: ProfileService.updateProfile,
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ['profile']
    })
  })

  const onSubmit: SubmitHandler<Profile> = (data) => {
    updateProfileMutation.mutate(data)
  }


  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    scopes: ['profile', 'email'], // what API you want to access on behalf of the user, default is email and profile
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    forceCodeForRefreshToken: false,
  });

  const GoogleLogin = async () => {
    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();
    console.log('User Info --> ', userInfo);
    return userInfo;
  };

  const googleSignIn = async () => {
    try {
      const response = await GoogleLogin();
      // retrieve user data
      const { idToken, user } = response.data ?? {};
      if (idToken) {
        //await processUserData(idToken, user); // Server call to validate the token & process the user data for signing In
      }
    } catch (error) {
      console.log('Error', error);
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
              />
            )}
          />
          <Controller
            name="notificationsRadius"
            control={control}
            render={({ field }) => (
              <Select
                label="Rango de cercanía"
                placeholder="1km"
                data={radii}
                defaultValue={radii.find(r => r.value === defaultValues.notificationsRadius)}
                onSelect={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </View>
      </View>
      <Button
        label="Guardar cambios"
        onPress={handleSubmit(onSubmit)}
      />
      <GoogleSigninButton onPress={googleSignIn} />
    </View>
  )
}

const QueryLayer = () => {
  const defaultValuesQuery = useQuery({
    queryKey: ['profile'],
    queryFn: ProfileService.getProfile
  })

  const defaultValues = defaultValuesQuery.data

  if (!defaultValues) {
    return <QueryWait query={defaultValuesQuery} />
  }

  return <Form defaultValues={defaultValues} />
}

export default function Settings() {
  return (
    <ScrollView className="flex-1 bg-default">
      <QueryLayer />
    </ScrollView>
  );
}
