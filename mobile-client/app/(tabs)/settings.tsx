import { ProfileService } from "@/api/services/profile";
import Button from "@/components/Button";
import Input from "@/components/Input";
import QueryWait from "@/components/QueryWait";
import Select from "@/components/Select";
import Switch from "@/components/Switch";
import { ProfileData } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";

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
  defaultValues: ProfileData
}) => {
  const { control, handleSubmit } = useForm<ProfileData>({ defaultValues })

  const queryClient = useQueryClient()

  const updateProfileMutation = useMutation({
    mutationFn: ProfileService.updateProfile,
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ['profile']
    })
  })

  const onSubmit: SubmitHandler<ProfileData> = (data) => {
    updateProfileMutation.mutate(data)
  }

  return (
    <View className="px-5 py-10 flex gap-12">
      <View className="flex gap-6">
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
              />
            )}
          />
        </View>
      </View>
      <View className="flex gap-6">
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
              />
            )}
          />
        </View>
      </View>
      <Button
        label="Guardar cambios"
        onPress={handleSubmit(onSubmit)}
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
