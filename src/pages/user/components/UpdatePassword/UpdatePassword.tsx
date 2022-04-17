import { updatePassword } from '@/api/user';
import { onModalCancel, ToastError, ToastSuccess } from '@/utils/common';
import Validator from '@/utils/Validator';
import { Form, Modal } from '@douyinfe/semi-ui';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { Dispatch, SetStateAction, useRef, useState } from 'react';

interface IUpdatePassword {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}

export default function UpdatePassword(props: IUpdatePassword) {
  const formApi = useRef<FormApi>();
  const [confirmLoading, setConfirmLoading] = useState(false); // modal确认按钮的 loading状态

  return (
    <Modal
      title="修改密码"
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
          modalSubmitClick(form, setConfirmLoading, props.setModalVisible);
        }}
        getFormApi={api => (formApi.current = api)}
        disabled={confirmLoading}
      >
        <Form.Input
          label={{ text: '旧密码', required: true }}
          field="old_password"
          rules={[{ required: true, message: '请输入密码' }]}
          showClear
          mode="password"
        />
        <Form.Input
          label={{ text: '新密码', required: true }}
          field="password"
          validate={Validator['passwordValidate']}
          showClear
          mode="password"
        />
      </Form>
    </Modal>
  );
}

// 表单提交
function modalSubmitClick(
  form,
  setConfirmLoading: Dispatch<SetStateAction<boolean>>,
  setModalVisible: Dispatch<SetStateAction<boolean>>,
) {
  if (form.old_password === form.password) {
    return ToastError('新旧密码不能一样，请重新输入 (ノ￣▽￣)');
  }
  setConfirmLoading(true);
  updatePassword(form.password, form.old_password)
    .then(() => {
      ToastSuccess('修改成功');
      setConfirmLoading(false);
      setModalVisible(false);
    })
    .finally(() => {
      setConfirmLoading(false);
    });
}
