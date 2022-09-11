import Compressor from 'compressorjs';
import imageCompression from 'browser-image-compression';
export function compress(file: Blob, quality = 0.3): Promise<Blob> {
  return new Promise(async resolve => {
    if (file.type.endsWith('png')) {
      // @ts-ignore
      resolve(
        await imageCompression(file, {
          useWebWorker: true,
          initialQuality: quality,
        }),
      );
    } else {
      new Compressor(file, {
        quality,
        success: resolve,
      });
    }
  });
}
