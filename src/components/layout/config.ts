import { IconApps, IconUser, IconComment } from '@douyinfe/semi-icons';

export interface MenuItem {
  itemKey: string;
  text: string;
  icon?: React.ReactNode;
  path?: string;
  items?: MenuItem[];
  component?: React.ComponentType<any>;
}

const MENU_CONFIG: MenuItem[] = [
  {
    itemKey: '1',
    text: 'app.chat',
    icon: IconComment,
    path: '/customer/chat',
  },
  {
    itemKey: '2',
    text: 'app.workbench',
    icon: IconApps,
    path: '/workbench',
  },
  {
    itemKey: '7',
    text: 'app.user',
    icon: IconUser,
    path: '/user/center',
  },
];

export default MENU_CONFIG;
