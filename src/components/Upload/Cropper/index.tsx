import { useState, useImperativeHandle, forwardRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import styles from './index.scss';
import { compress } from '@/utils/compressor';

export const CropperCard = forwardRef(({ imageUrl }: any, uploadRef) => {
  const [cropper, setCropper] = useState<any>();
  useImperativeHandle(uploadRef, () => ({
    // 返回裁剪后的图片blob
    upload: () => getCropData(),
  }));
  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      return new Promise(resolve => {
        cropper.getCroppedCanvas().toBlob(async (blob: Blob) => {
          const result = await compress(blob);
          resolve(result);
        });
      });
    }
  };
  return (
    <div className={styles.cropperContainer}>
      <div className={styles.cropperCard}>
        <Cropper
          style={{ height: 300, width: '100%' }}
          src={imageUrl}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          responsive
          autoCropArea={1}
          checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
          onInitialized={instance => {
            setCropper(instance);
          }}
          guides
        />
      </div>
    </div>
  );
});

export default CropperCard;
