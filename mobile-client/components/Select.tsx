import { Text, View } from "react-native"
import SelectDropdown, { SelectDropdownProps } from "react-native-select-dropdown"

export type SelectProps = SelectDropdownProps & {
  label: string
}

export default (props: SelectProps) => {
  return (
    <View className='flex gap-2'>
      <Text className='text-default text-sm'>
        {props.label}
      </Text>
      <SelectDropdown

      />
    </View>
  )
}