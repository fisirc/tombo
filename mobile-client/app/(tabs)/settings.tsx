import Button from "@/components/Button";
import Input from "@/components/Input";
import QueryWait from "@/components/QueryWait";
import Select from "@/components/Select";
import Switch from "@/components/Switch";
import useSessionProfile from "@/hooks/useSessionProfile";
import useSignOut from "@/hooks/useSignOut";
import useUpdateProfile from "@/hooks/useUpdateProfile";
import { Tables, TablesUpdate } from "@/types/supabase";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

type Radius = {
  label: string;
  value: number;
};

const radii: Radius[] = [
  { label: "1 km", value: 1 },
  { label: "5 km", value: 5 },
  { label: "10 km", value: 10 },
  { label: "20 km", value: 20 },
];

const Account = () => {
  const { mutate: signOut } = useSignOut();

  return (
    <View className="flex flex-col gap-2 mt-8">
      <Button
        variant="secondary"
        label="Cerrar sesión"
        onPress={() => signOut()}
      />
      <Button variant="danger" label="Borrar cuenta" />
    </View>
  );
};

const Form = ({ profile }: { profile: Tables<"profiles"> }) => {
  const { mutate: updateProfile, isPending } = useUpdateProfile(profile.id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<TablesUpdate<"profiles">>({
    defaultValues: profile,
  });

  const onSubmit = (formData: TablesUpdate<"profiles">) =>
    updateProfile(formData, {
      onSuccess: (updatedProfile) => reset(updatedProfile),
    });

  console.log(profile);

  return (
    <View className="my-8 flex flex-col gap-14 px-5">
      <View className="flex flex-col gap-8">
        <Text className="text-default text-xl font-medium">
          Perfil y preferencias
        </Text>
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <Input
              label="Nombre de usuario*"
              value={field.value}
              onChangeText={field.onChange}
              placeholder="Juan Tapia"
              editable={!isPending}
            />
          )}
        />
        <View className="flex gap-8">
          <Text className="text-default text-xl font-medium">
            Notificaciones
          </Text>
          <View className="flex gap-6">
            <Controller
              name="alerts_on"
              control={control}
              render={({ field }) => (
                <Switch
                  label="Notificar sobre alertas cercanas"
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                />
              )}
            />
          </View>
        </View>
        <View className="flex flex-col gap-6">
          <Controller
            name="alert_radius_km"
            control={control}
            render={({ field }) => (
              <View className="flex gap-2">
                <Text className="text-default">Rango de cercanía</Text>
                {/* <Select
                  data={radii}
                  onSelect={field.onChange}
                  onBlur={field.onBlur}
                  defaultValue={radii.find(
                    (r) => r.value === (profile.alert_radius_km as number)
                  )}
                  placeholder="1 km"
                  // disabled={isPending}
                /> */}
              </View>
            )}
          />
        </View>
        <Button
          label="Guardar cambios"
          onPress={handleSubmit(onSubmit)}
          disabled={isPending || !isDirty}
        />
      </View>
      <Account />
    </View>
  );
};

export default function Settings() {
  const sessionProfileQR = useSessionProfile();
  const { data: profile } = sessionProfileQR;

  if (!profile) {
    return (
      <View className="flex-1 bg-default">
        <QueryWait qr={sessionProfileQR} />
      </View>
    );
  }

  return (
    <SafeAreaView className="h-full bg-default">
      <KeyboardAwareScrollView enableOnAndroid keyboardOpeningTime={2000}>
        <Form profile={profile} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
