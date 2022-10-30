import { sms } from '@/api/user';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { ToastSuccess } from '@/utils/common';

const sendCodeDisableNumber = 60;

// 发送验证码
export function sendCode(
  type: string,
  account: string,
  setCodeText: Dispatch<SetStateAction<string>>,
  timer: MutableRefObject<NodeJS.Timer | undefined>,
  clearTimer: () => void,
) {
  setCodeText(sendCodeDisableNumber + 's');
  runSendCodeApi(type, account, timer, clearTimer, sendCodeDisableNumber, setCodeText);
}

function runSendCodeApi(
  type: string,
  account: string,
  timer: MutableRefObject<NodeJS.Timer | undefined>,
  clearTimer: () => void,
  number: number,
  setCodeText: Dispatch<SetStateAction<string>>,
) {
  sms(type, account)
    .then(res => {
      console.log('res.status: ', res.status);
      if (res.status === 204) {
        ToastSuccess('发送成功');
        timer.current = setInterval(() => {
          number -= 1;
          if (number <= 0) {
            clearTimer();
            setCodeText('获取验证码');
            return;
          }
          setCodeText(number + 's');
        }, 1000);
      }
    })
    .catch(e => {
      setCodeText('获取验证码');
    });
}
