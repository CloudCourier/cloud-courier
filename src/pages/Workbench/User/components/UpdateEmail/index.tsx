import { updateEmail, updatePassword } from '@/api/user';
import UserCode from '@/components/UserUtils/UserCode';
import { onModalCancel, ToastError, ToastSuccess } from '@/utils/common';
import Validator from '@/utils/validator';
import { Button, Form, Modal } from '@douyinfe/semi-ui';
import type { FormApi, ReactFieldError } from '@douyinfe/semi-ui/lib/es/form';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

interface UpdateEmail {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}

export default function UpdateEmail(props: UpdateEmail) {
  const formApi = useRef<FormApi>();
  const [confirmLoading, setConfirmLoading] = useState(false); // modal确认按钮的 loading状态

  const [codeText, setCodeText] = useState('获取验证码');

  const timer = useRef<NodeJS.Timer>();

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [timer]);

  function clearTimer() {
    if (timer.current) {
      clearInterval(timer.current);
    }
  }

  return (
    <Modal
      title="修改邮箱"
      visible={props.modalVisible}
      onOk={() => {
        formApi.current?.submitForm();
      }}
      onCancel={() => {
        onModalCancel(props.setModalVisible, formApi.current, {});
      }}
      maskClosable={false}
      confirmLoading={confirmLoading}
    >
      <Form
        onSubmit={form => {
          if (confirmLoading) return;
          modalSubmitClick(form.email, form.code, setConfirmLoading, props.setModalVisible);
        }}
        getFormApi={api => (formApi.current = api)}
        disabled={confirmLoading}
        onSubmitFail={(errors: Record<string, ReactFieldError>) => {
          errors.code ? ToastError(errors.code as string) : null;
        }}
      >
        <Form.Input
          field="email"
          label={{ text: '新邮箱', required: true }}
          validate={Validator['emailValidate']}
          showClear
        />
        <UserCode
          noLabel
          setCodeText={setCodeText}
          timer={timer}
          clearTimer={clearTimer}
          codeText={codeText}
          loading={confirmLoading}
          type={'email'}
        />
      </Form>
    </Modal>
  );
}

// 表单提交
function modalSubmitClick(
  email: string,
  code: string,
  setConfirmLoading: Dispatch<SetStateAction<boolean>>,
  setModalVisible: Dispatch<SetStateAction<boolean>>,
) {
  setConfirmLoading(true);
  updateEmail(email, code)
    .then(({ data }) => {
      ToastSuccess(data.msg);
      setConfirmLoading(false);
      setModalVisible(false);
    })
    .catch(() => {
      setConfirmLoading(false);
    });
}
