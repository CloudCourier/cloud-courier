import SparkMD5 from 'spark-md5';
import http from '@/utils/http';
import { ToastError } from '@/utils/common';

/**
 * 计算文件 md5
 * @param file 浏览器文件 (File|Blob) 对象
 * @returns {Promise<string>} 异步返回 md5
 */
export function Md5File(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const blobSlice = File.prototype.slice;
    const chunkSize = 2097152; // 分为 2MB 的块
    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();

    function loadNext() {
      const start = currentChunk * chunkSize;
      let end;
      if (start + chunkSize >= file.size) {
        end = file.size;
      } else {
        end = start + chunkSize;
      }
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }
    fileReader.onload = (e: any) => {
      spark.append(e.target.result);
      currentChunk++;

      if (currentChunk < chunks) {
        loadNext();
      } else {
        resolve(spark.end());
      }
    };

    fileReader.onerror = e => {
      reject(e);
    };

    loadNext();
  });
}

export async function getFormData(md5: any) {
  if (!md5 || !/[0-9a-f]{32}/gi.test(md5)) {
    console.log('md5 未计算正确');
    return undefined;
  }
  const url = `files/${md5}/params`;
  try {
    const data = (await http.get(url)).data;
    const dataEntries = Object.entries(data) as [string, string][];
    const formData = new FormData();
    for (const [key, value] of dataEntries) {
      formData.set(key, value);
    }
    return formData;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
const endpoint = 'https://oss.sunxinao.cn';
const prefix = '/cloud-courier/upload/';

export async function DoUpload(url: string, md5Code: any, ImgFile: any) {
  const exist =
    (
      await http.head(`${url}?random=${Math.random()}`, {
        validateStatus() {
          return true; // 把所有响应码视为正常防止抛异常
        },
      })
    ).status /
      100 ===
    2;
  if (exist) {
    console.log('已存在', url);
    return url;
  } else {
    // 第一次上传
    const form = await getFormData(md5Code);
    if (form === undefined) {
      // 上传失败
      ToastError('上传失败');
      return;
    }
    form.append('file', ImgFile);
    return new Promise((resolve, reject) => {
      http({
        url: endpoint,
        method: 'POST',
        data: form,
      })
        .then(() => {
          resolve(url);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
}

export function upload(file: Blob) {
  return new Promise((resolve, reject) => {
    Md5File(file)
      .then(async (result: any) => {
        const md5Code = result.toString();
        const imgUrl = endpoint + prefix + md5Code;
        const uploadUrl = DoUpload(imgUrl, md5Code, file);
        resolve(uploadUrl);
      })
      .catch(error => {
        reject(error);
      });
  });
}
