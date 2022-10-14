import { IconExternalOpen } from '@douyinfe/semi-icons';
import { Typography } from '@douyinfe/semi-ui';

export default function Footer() {
  return (
    <div style={{ bottom: '0px', position: 'fixed', left: '50%', fontSize: '14px' }}>
      © 2021-{new Date().getFullYear()} 云信客服. All rights reserved.
      <Typography.Text
        className="m-l-5"
        strong
        icon={<IconExternalOpen />}
        link={{ href: 'https://beian.miit.gov.cn', target: '_blank' }}
      >
        豫ICP备2020029001号-5
      </Typography.Text>
    </div>
  );
}
