import useTheme from '@/hooks/useTheme'
import { Text, TextInput, TextInputProps, View } from 'react-native'

export type TextAreaProps = TextInputProps & {
  label?: string
}

export default (props: TextAreaProps) => {
  const theme = useTheme()

  return (
    <View className='flex gap-2'>
      {
        props.label &&
        <Text className='text-default'>
          {props.label}
        </Text>
      }
      <TextInput
        multiline
        numberOfLines={5}
        textAlignVertical='top'
        style={{
          color: theme['--color-text-default'],
          backgroundColor: theme['--color-bg-foreground-mild']
        }}
        className='h-32 p-4 rounded-xl placeholder:text-neutral-600'
        {...props}
      />
    </View>
  )
}
