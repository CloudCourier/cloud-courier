import { Input, Modal, TextArea } from '@douyinfe/semi-ui';
import type { ModalReactProps } from '@douyinfe/semi-ui/lib/es/modal';
import type { FC } from 'react';

interface EditModalProps extends ModalReactProps {
  username: string;
}

const RemoveModal: FC<EditModalProps> = props => {
  const { username } = props;
  return (
    <Modal {...props} title="移除组织成员">
      <p style={{ margin: '10px 0' }}>
        是否移除 <b> {username} </b> ?
      </p>
    </Modal>
  );
};

export default RemoveModal;
