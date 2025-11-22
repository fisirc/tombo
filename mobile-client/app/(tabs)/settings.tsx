import Button from '@/components/Button';
import QueryWait from '@/components/QueryWait';
import useSessionProfile from '@/hooks/useSessionProfile';
import useSignOut from '@/hooks/useSignOut';
import useUpdateProfile from '@/hooks/useUpdateProfile';
import { Tables, TablesUpdate } from '@/types/supabase';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const Account = () => {
  const { mutate: signOut } = useSignOut()

  return (
    <View className="flex flex-col gap-4 mt-8">
      <Button
        variant='secondary'
        label='Cerrar sesión'
        onPress={() => signOut()}
      />
      <Button
        variant='danger'
        label='Borrar cuenta'
      />
    </View>
  )
}

const Form = ({ profile }: {
  profile: Tables<'profiles'>
}) => {
  const { mutate: updateProfile } = useUpdateProfile(profile.id)

  const { control, handleSubmit, reset } = useForm<TablesUpdate<'profiles'>>({
    defaultValues: profile
  })

  const onSubmit = (formData: TablesUpdate<'profiles'>) => updateProfile(formData, {
    onSuccess: (updatedProfile) => reset(updatedProfile)
  })

  return (
    <View className="my-10 flex flex-col gap-14">
      <View className="flex flex-col gap-8">
        <Text className="text-default text-xl font-medium">Perfil y preferencias</Text>
        <View className="flex flex-col gap-6">

        </View>
      </View>
      <Account />
    </View>
  )
}

export default function Settings() {
  const sessionProfileQR = useSessionProfile()
  const { data: profile } = sessionProfileQR

  if (!profile) {
    return (
      <View className='flex-1 bg-default'>
        <QueryWait qr={sessionProfileQR} />
      </View>
    )
  }

  return (
    <KeyboardAwareScrollView className='flex-1 bg-default'>
      <View className='flex flex-col px-5'>
        <Form profile={profile} />
      </View>
    </KeyboardAwareScrollView>
  );
}
