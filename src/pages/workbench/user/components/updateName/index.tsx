import { updateUsername } from '@/api/user';
import { getUserInfo, onModalCancel, ToastError, ToastSuccess } from '@/utils/common';
import { Form, Modal } from '@douyinfe/semi-ui';
import type { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { Dispatch, SetStateAction, useRef, useState } from 'react';

interface IUpdateName {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}

export default function UpdateName(props: IUpdateName) {
  const formApi = useRef<FormApi>();
  const [confirmLoading, setConfirmLoading] = useState(false); // modal确认按钮的 loading状态

  return (
    <Modal
      title="修改昵称"
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
          label={{ text: '新昵称', required: true }}
          field="username"
          rules={[{ required: true, message: '请输入名称' }]}
          showClear
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
  setConfirmLoading(true);
  updateUsername(form.username)
    .then(() => {
      ToastSuccess('修改成功');
      setConfirmLoading(false);
      setModalVisible(false);
      const user = getUserInfo();
      user.username = form.username;
      localStorage.setItem('userInfo', JSON.stringify(user));
    })
    .finally(() => {
      setConfirmLoading(false);
    });
}
