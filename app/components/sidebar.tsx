import { Navigation } from '@shopify/polaris';
import { HomeIcon, SettingsIcon, QuestionCircleIcon } from '@shopify/polaris-icons';

export default function SidebarNavigation() {
  return (
    <Navigation location="/">
      <Navigation.Section
        items={[
          {
            label: 'Home',
            icon: HomeIcon,
            url: '/',
          },
          {
            label: 'Help',
            icon: QuestionCircleIcon,
            url: '/help',
          },
          {
            label: 'Settings',
            icon: SettingsIcon,
            url: '/settings',
          },
        ]}
      />
    </Navigation>
  );
}
