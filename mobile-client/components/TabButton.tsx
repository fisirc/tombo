import useTheme from '@/hooks/useTheme';
import { Icon, IconProps } from '@tabler/icons-react-native';
import { Href } from 'expo-router';
import { TabTriggerSlotProps } from 'expo-router/ui';
import { Ref, forwardRef } from 'react';
import { Text, Pressable, View } from 'react-native';

export type TabButtonProps = TabTriggerSlotProps & {
  name: string
  href: Href
  label: string
  IconDefault: Icon
  IconFocused: Icon
};

export default forwardRef(
  ({ label, IconDefault, isFocused, ...props }: TabButtonProps, ref: Ref<View>) => {
    const theme = useTheme()
    
    const iconProps = (isFocused: boolean | undefined): IconProps => ({
      size: 28,
      strokeWidth: 1.5,
      color: isFocused ? theme['--color-text-inverse'] : theme['--color-text-default']
    });
    
    return (
      <Pressable
        ref={ref}
        {...props}
        className={`m-1 flex-1 items-center rounded-2xl ${isFocused ? 'bg-inverse' : 'bg-transparent'}`}
      >
        <View className="flex flex-col items-center flex-1 gap-1">
          <IconDefault {...iconProps(isFocused)} />
          <Text className={`text-sm font-medium ${isFocused ? 'text-inverse' : 'text-default'}`}>
            {label}
          </Text>
        </View>
      </Pressable>
    );
  }
);
