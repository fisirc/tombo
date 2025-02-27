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
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AuthService } from "@/api/services/auth";

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

  const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleGoogleLogin = async () => {
		setLoading(true);
		try {
			const response = await GoogleLogin();
			const { data } = response;

			if (response.type === 'success') {
        const { idToken } = response.data;
        const user = {
          email: response.data.user.email,
        }
				/*const resp = await AuthService.validateToken({
					token: idToken,
					email: user.email,
				});
				await handlePostLoginData(resp.data);*/
			}
		} catch (apiError) {
			setError(
				'Something went wrong'
			);
		} finally {
			setLoading(false);
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
      <Button
        label="Google Sign In"
        onPress={handleGoogleLogin}
      />
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
