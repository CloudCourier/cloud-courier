import { WINDOW_PROJECT_TOKEN } from '@/consts';
import { Button, Modal, Typography } from '@douyinfe/semi-ui';
import type { ModalReactProps } from '@douyinfe/semi-ui/lib/es/modal';
import type { FC } from 'react';

interface DeployModalIF extends ModalReactProps {
  token: string;
}
const DeployModal: FC<DeployModalIF> = props => {
  const { Paragraph } = Typography;
  const { token } = props;
  const deployString = `<script>
    (function () {
      let div = document.createElement('div');
      div.id = 'CloudCourierContainer';
      div.style.setProperty('position', 'fixed', 'important');
      div.style.setProperty('right', '20px', 'important');
      div.style.setProperty('bottom', '0', 'important');
      let body = document.querySelector('body');
      body.appendChild(div);
      window.${WINDOW_PROJECT_TOKEN} = ${token}
      var s1 = document.createElement('script'),
        s0 = document.getElementsByTagName('script')[0];
      s1.async = true;
      s1.src =
        'https://www.zhangbaolin001.cn/upload/2022/05/cloudcourierinit.js';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  </script>`;

  const DeployModalFooter = (
    <div style={{ textAlign: 'center' }}>
      <Button
        type="primary"
        theme="solid"
        onClick={() => console.log(11)}
        style={{
          width: 240,
          margin: '4px 50px',
        }}
      >
        Learn more
      </Button>
    </div>
  );
  return (
    <Modal
      title="部署脚本"
      {...props}
      footer={DeployModalFooter}
      centered
      bodyStyle={{ overflow: 'auto', height: 200 }}
    >
      {/* @ts-ignore */}
      <Paragraph copyable spacing="extended" code component="pre">
        {deployString}
      </Paragraph>
    </Modal>
  );
};

export default DeployModal;
