import useTheme from "@/hooks/useTheme"
import { IconChevronDown, IconChevronUp, IconProps } from "@tabler/icons-react-native"
import { Pressable, Text, View } from "react-native"
import SelectDropdown, { SelectDropdownProps } from "react-native-select-dropdown"

export type SelectProps = Omit<SelectDropdownProps, 'renderItem' | 'renderButton'> & {
  label: string
}

export type Item = {
  label: string
  value: string | number
}

export default (props: SelectProps) => {
  const theme = useTheme()

  const chevronProps: IconProps = {
    color: theme['--color-text-muted'],
    size: 20,
    strokeWidth: 2
  }

  return (
    <View className='flex gap-2'>
      <Text className='text-default text-sm'>
        {props.label}
      </Text>
      <SelectDropdown
        {...props}
        onSelect={({ value }: Item) => props.onSelect(value, props.data.find(item => item.value === value))}
        dropdownStyle={{
          borderRadius: 8,
          backgroundColor: theme['--color-bg-default']
        }}
        renderItem={(item: Item, isSelected) => (
          <View
            // className={`flex-1 flex justify-center p-4 ${isSelected ? 'bg-inverse' : 'bg-transparent'}`}
            className='flex-1 flex justify-center p-4 bg-transparent'
          >
            <Text
              // className={`${isSelected ? 'text-inverse' : 'text-default'}`}
              className='text-default'
            >
              {item.label}
            </Text>
          </View>
        )}
        renderButton={(selectedItem: Item, isOpened) => (
          <View className='rounded-xl h-16 flex flex-row justify-between items-center p-4 bg-foreground'>
            <Text className="text-default">
              {selectedItem?.label || 'Seleccione un valor'}
            </Text>
            {isOpened
            ? <IconChevronUp {...chevronProps} />
            : <IconChevronDown {...chevronProps} />}
          </View>
        )}
      />
    </View>
  )
}
