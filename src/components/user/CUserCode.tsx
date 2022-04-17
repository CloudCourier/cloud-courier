import { sendCode } from './utils';
import { Button, Form, useFormApi } from '@douyinfe/semi-ui';
import { Dispatch, MutableRefObject, SetStateAction, useState } from 'react';
import Center from '@/pages/user/center';
import styles from './index.scss';

interface ICUserCode {
  setCodeText: Dispatch<SetStateAction<string>>;
  timer: MutableRefObject<NodeJS.Timer | undefined>;
  clearTimer: () => void;
  codeText: string;
  loading: boolean;
  noLabel?: boolean;
}

export default function CUserCode(props: ICUserCode) {
  const formApi = useFormApi();
  return (
    <div className={styles.smsContain}>
      <Form.Input
        label={{ text: '验证码', required: true }}
        field="code"
        placeholder={props.noLabel ? '请输入验证码' : ''}
        noLabel={props.noLabel}
        rules={[{ required: true, message: '请输入验证码' }]}
        noErrorMessage
      />
      <Button
        block
        className={styles.smsBtn}
        onClick={() => {
          formApi.validate(['email']).then(() => {
            sendCode(formApi.getValue('email'), props.setCodeText, props.timer, props.clearTimer);
          });
        }}
        disabled={props.codeText !== '获取验证码' || props.loading}
      >
        {props.codeText}
      </Button>
    </div>
  );
}
