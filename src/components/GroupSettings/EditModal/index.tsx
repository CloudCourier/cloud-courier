import { Input, Modal, TextArea } from '@douyinfe/semi-ui';
import type { ModalReactProps } from '@douyinfe/semi-ui/lib/es/modal';
import type { FC } from 'react';
import styles from './index.scss';
interface EditModalProps extends ModalReactProps {
  groupInfo: {
    name: string;
    description: string;
  };
  setGroupInfo: any;
}

const EditModal: FC<EditModalProps> = props => {
  const { groupInfo, setGroupInfo } = props;

  function getTextAreaStrLength(str) {
    const filteredStr = str.replace(/\s/g, '');
    return filteredStr.length;
  }
  return (
    <Modal {...props} title="编辑群信息" className={styles.editorModal}>
      <p style={{ margin: '10px 0' }}>组织名称</p>
      <Input
        value={groupInfo.name}
        onChange={v => {
          setGroupInfo(pre => ({
            ...pre,
            name: v,
          }));
        }}
      ></Input>
      <p style={{ margin: '20px 0 10px' }}>组织介绍</p>
      <TextArea
        autosize
        maxCount={1000}
        getValueLength={getTextAreaStrLength}
        value={groupInfo.description}
        onChange={v => {
          setGroupInfo(pre => ({
            ...pre,
            description: v,
          }));
        }}
      />
    </Modal>
  );
};

export default EditModal;
