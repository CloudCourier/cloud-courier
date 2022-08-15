import { IconExternalOpen } from '@douyinfe/semi-icons';
import { Typography } from '@douyinfe/semi-ui';

export default function CFooter() {
  return (
    <div style={{ bottom: '10px', position: 'fixed' }}>
      © 2021-{new Date().getFullYear()} 云信客服. All rights reserved.
      <Typography.Text
        className="m-l-5"
        strong
        icon={<IconExternalOpen />}
        link={{ href: 'https://beian.miit.gov.cn', target: '_blank' }}
      >
        {/* 渝ICP备2022000851号-1 */}
        豫xxxxxxxxxxxxxxxx
      </Typography.Text>
    </div>
  );
}
