import { Modal, Button, Avatar } from '@douyinfe/semi-ui';
import { getUserInfo, ToastError, ToastSuccess } from '@/utils/common';
import { useRef, useState } from 'react';
import { updateAvatar } from '@/api/user';
import { upload } from './utils';
import { CropperCard } from './cropper';
import { IconCloud, IconCamera } from '@douyinfe/semi-icons';
import styles from './index.scss';
import { useEffect } from 'react';

export default function UploadImg({ avatarUrl, setAvatarUrl }: any) {
  // TODO: 图片上传，添加旋转功能
  const [image, setImage] = useState(''); // 图片初始值
  const inputR = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<any>('');
  const choiceImg = () => {
    inputR.current?.click();
  };

  // 原始图片选择器
  const imgChange = (e: any) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    reader.readAsDataURL(files[0]);
  };
  /**
   * 弹出框
   */
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('上传图片');

  const showModal = () => {
    setVisible(true);
  };

  // 确认上传
  const handleOk = async () => {
    setModalText('上传中...');
    setConfirmLoading(true);
    // 通过获取子组件的方法获取裁剪后的图片blob
    uploadRef.current.upload().then(async blob => {
      const url = (await upload(blob)) as string;
      updateAvatar(url).then(() => {
        ToastSuccess('修改成功');
        setAvatarUrl(url);
        const user = getUserInfo();
        user.avatar = url;
        localStorage.setItem('userInfo', JSON.stringify(user));
        setVisible(false);
        setImage('');
        setConfirmLoading(false);
        setModalText('上传图片');
      });
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const uploadButton = (
    <div className={styles.UpButtonContain} onClick={choiceImg} onKeyDown={choiceImg}>
      <IconCloud style={{ fontSize: '26px' }} />
      <input
        style={{ display: 'none' }}
        type="file"
        ref={inputR}
        name="file"
        id="file"
        onChange={imgChange}
      />
    </div>
  );
  const hover = (
    <div className={styles.AvatarHover}>
      <IconCamera size="extra-large" />
    </div>
  );
  return (
    <>
      <Avatar hoverMask={hover} onClick={showModal} src={avatarUrl} size="large" />
      <Modal
        title={modalText}
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={390}
      >
        {image ? <CropperCard imageUrl={image} ref={uploadRef} /> : uploadButton}
      </Modal>
    </>
  );
}
