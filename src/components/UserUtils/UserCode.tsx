import { sendCode } from './utils';
import { Button, Form, useFormApi } from '@douyinfe/semi-ui';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import styles from './index.scss';

interface UserCode {
  setCodeText: Dispatch<SetStateAction<string>>;
  timer: MutableRefObject<NodeJS.Timer | undefined>;
  clearTimer: () => void;
  codeText: string;
  loading: boolean;
  noLabel?: boolean;
  type: string;
}

export default function UserCode(props: UserCode) {
  const formApi = useFormApi();
  const { setCodeText, timer, clearTimer, codeText, noLabel, type, loading } = props;
  return (
    <div className={styles.smsContain}>
      <Form.Input
        label={{ text: '验证码', required: true }}
        field="code"
        placeholder={noLabel ? '请输入验证码' : ''}
        noLabel={noLabel}
        rules={[{ required: true, message: '请输入6位验证码', len: 6 }]}
        noErrorMessage
        autoComplete="off"
      />
      <Button
        block
        className={styles.smsBtn}
        onClick={() => {
          sendCode(type, formApi.getValue(type), setCodeText, timer, clearTimer);
        }}
        disabled={codeText !== '获取验证码' || loading}
      >
        {codeText}
      </Button>
    </div>
  );
}
