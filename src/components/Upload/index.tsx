import { Modal, Button, Avatar } from '@douyinfe/semi-ui';
import { getUserInfo, ToastError, ToastInfo, ToastSuccess, ToastWaring } from '@/utils/common';
import { FC, useRef, useState } from 'react';
import { updateAvatar } from '@/api/user';
import { upload } from './utils';
import { CropperCard } from './Cropper';
import { IconCloud, IconCamera } from '@douyinfe/semi-icons';
import styles from './index.scss';
import { STORGENAME, UPLOAD_SIZE } from '@/utils/const';
import { updateSubject } from '@/api/subjects';

interface UplodaImgProps {
  avatarUrl: string;
  setAvatarUrl: React.Dispatch<React.SetStateAction<string>>;
  id?: number;
}

const UploadImg: FC<UplodaImgProps> = ({ avatarUrl, setAvatarUrl, id }) => {
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
      // 经过裁剪后，图片体积会变大，详情见 https://github.com/react-cropper/react-cropper/issues/24
      if (blob.size > UPLOAD_SIZE) {
        setVisible(false);
        setImage('');
        ToastWaring('超出最大图片体积限制');
        ToastInfo(
          '理论上来说，只要选择 1MB 以下的图片，都可以上传通过。实际上这是一个BUG，上传的图片在剪裁后体积会变大，根据图片质量，变大的倍数不可控，我们正在积极跟进这个问题！',
        );
        setConfirmLoading(false);
        setModalText('上传图片');
        return;
      }
      const url = (await upload(blob)) as string;
      console.log('id: ', id);

      if (id === undefined) {
        console.log('111');

        updateAvatar(url).then(() => {
          ToastSuccess('修改成功');
          setAvatarUrl(url);
          const user = getUserInfo();
          user.avatar = url;
          localStorage.setItem(STORGENAME, JSON.stringify(user));
          setVisible(false);
          setImage('');
          setConfirmLoading(false);
          setModalText('上传图片');
        });
      } else {
        updateSubject({ id, logo: url }).then(() => {
          ToastSuccess('修改成功');
          setAvatarUrl(url);
          setVisible(false);
          setImage('');
          setConfirmLoading(false);
          setModalText('上传图片');
        });
      }
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
    <div>
      <Avatar hoverMask={hover} onClick={showModal} src={avatarUrl} size="large" />
      <Modal
        title={modalText}
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={390}
        zIndex={99999}
      >
        {image ? <CropperCard imageUrl={image} ref={uploadRef} /> : uploadButton}
      </Modal>
    </div>
  );
};

export default UploadImg;
