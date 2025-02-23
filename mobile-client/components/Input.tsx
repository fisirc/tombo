import { Text, TextInput, TextInputProps, View } from 'react-native'

export type InputProps = TextInputProps & {
  label: string
}

export default (props: InputProps) => {
  return (
    <View className='flex gap-2'>
      <Text className='text-default'>
        {props.label}
      </Text>
      <TextInput
        className='bg-foreground h-16 text-default p-4 rounded-xl'
        {...props}
      />
    </View>
  )
}
