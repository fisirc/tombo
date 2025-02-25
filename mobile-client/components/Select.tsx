import useTheme from "@/hooks/useTheme"
import { IconChevronDown, IconChevronUp, IconProps } from "@tabler/icons-react-native"
import { Pressable, Text, View } from "react-native"
import SelectDropdown, { SelectDropdownProps } from "react-native-select-dropdown"

export type SelectProps = Omit<SelectDropdownProps, 'renderItem' | 'renderButton'> & {
  placeholder: string
  label: string
}

export type SelectItem = {
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

  const total = props.data.length

  let dropdownHeight = 175 + (props.search ? 50 : 0)
  if (total <= 3) dropdownHeight = 50 * total

  return (
    <View className='flex gap-2'>
      <Text className='text-default'>
        {props.label}
      </Text>
      <SelectDropdown
        {...props}
        onSelect={({ value }: SelectItem) => props.onSelect(value, props.data.find(item => item.value === value))}
        dropdownStyle={{
          borderRadius: 8,
          backgroundColor: theme['--color-bg-default'],
          height: dropdownHeight,
        }}
        renderItem={(item: SelectItem, isSelected) => (
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
        renderButton={(selectedItem: SelectItem, isOpened) => (
          <View className='rounded-xl h-16 flex flex-row justify-between items-center p-4 bg-foreground-mild'>
            <Text className={selectedItem ? 'text-default' : 'text-muted'}>
              {selectedItem?.label || props.placeholder || 'Buscar...'}
            </Text>
            {isOpened
            ? <IconChevronUp {...chevronProps} />
            : <IconChevronDown {...chevronProps} />}
          </View>
        )}
        searchInputStyle={{
          backgroundColor: theme['--color-bg-default'],
          paddingLeft: 11,
          paddingRight: 11,
        }}
        searchPlaceHolderColor={theme['--color-text-muted']}
        searchInputTxtColor={theme['--color-text-default']}
        searchPlaceHolder={props.searchPlaceHolder || 'Buscar...'}
      />
    </View>
  )
}
