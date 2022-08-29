import { register } from '@/api/user';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { ToastSuccess } from '@/utils/common';

const sendCodeDisableNumber = 60;

// 发送验证码
export function sendCode(
  account: string,
  setCodeText: Dispatch<SetStateAction<string>>,
  timer: MutableRefObject<NodeJS.Timer | undefined>,
  clearTimer: () => void,
) {
  ToastSuccess('发送成功');
  setCodeText(sendCodeDisableNumber + 's');

  // doRegEmailSendCodeApi(account, timer, clearTimer, sendCodeDisableNumber, setCodeText);
}

// 调用【用户注册-通过邮箱-发送验证码】接口
// function doRegEmailSendCodeApi(
//   email: string,
//   timer: MutableRefObject<NodeJS.Timer | undefined>,
//   clearTimer: () => void,
//   number: number,
//   setCodeText: Dispatch<SetStateAction<string>>,
// ) {
//   register({ account })
//     .then(res => {
//       ToastSuccess(res.data.msg);
//       timer.current = setInterval(() => {
//         number -= 1;
//         if (number <= 0) {
//           clearTimer();
//           setCodeText('获取验证码');
//           return;
//         }
//         setCodeText(number + 's');
//       }, 1000);
//     })
//     .catch(e => {
//       setCodeText('获取验证码');
//     });
// }
