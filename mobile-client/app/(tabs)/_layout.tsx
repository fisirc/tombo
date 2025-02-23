import TabButton, { TabButtonProps } from '@/components/TabButton';
import useTheme from '@/hooks/useTheme';
import { IconAlertSquareRounded, IconAlertSquareRoundedFilled, IconCompass, IconCompassFilled, IconUser } from '@tabler/icons-react-native';
import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';

const tabs: TabButtonProps[] = [
  {
    name: 'index',
    href: '/',
    label: 'Inicio',
    IconDefault: IconCompass,
    IconFocused: IconCompassFilled
  },
  {
    name: 'new',
    href: '/new',
    label: 'Reportar',
    IconDefault: IconAlertSquareRounded,
    IconFocused: IconAlertSquareRoundedFilled
  },
  {
    name: 'settings',
    href: '/settings',
    label: 'Perfil',
    IconDefault: IconUser,
    IconFocused: IconUser,
  }
]

export default function TabLayout() {
  const theme = useTheme()

  return (
    <Tabs>
      <TabSlot />
      <TabList className='h-24 bg-deep'>
      {
        tabs.map((tab) => (
          <TabTrigger key={tab.label} name={tab.name} href={tab.href} asChild>
            <TabButton {...tab} />
          </TabTrigger>
        ))
      }
      </TabList>
    </Tabs>
  );
}
