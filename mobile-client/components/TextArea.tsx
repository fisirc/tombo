import { Text, TextInput, TextInputProps, View } from 'react-native'

export type TextAreaProps = TextInputProps & {
  label: string
}

export default (props: TextAreaProps) => {
  return (
    <View className='flex gap-2'>
      <Text className='text-default'>
        {props.label}
      </Text>
      <TextInput
        multiline
        numberOfLines={5}
        textAlignVertical='top'
        className='bg-foreground-mild h-32 text-default p-4 rounded-xl placeholder:text-muted'
        {...props}
      />
    </View>
  )
}
