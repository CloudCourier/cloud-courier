import forgotPasswordApi from '@/api/user/forgotPasswordApi';
import { getAppNav } from '@/App';
import IEmailNotBlank from '@/model/form/common/IEmailNotBlank';
import { ToastSuccess } from '@/util/CommonUtil';
import Validator from '@/util/Validator';
import { Button, Form } from '@douyinfe/semi-ui';
import { Dispatch, SetStateAction, useState } from 'react';
import LoginRegisterBase from '../../components/LoginRegisterBase/LoginRegisterBase';

export default function ForgotPasswordSend() {
  const [loading, setLoading] = useState(false);

  return (
    <LoginRegisterBase name="忘记密码">
      <Form
        disabled={loading}
        className="w-300"
        onSubmit={form => {
          if (loading) return;
          submitClick(form as IEmailNotBlank, setLoading);
        }}
      >
        <Form.Input
          field="email"
          placeholder="邮箱"
          noLabel
          validate={Validator['emailValidate']}
          showClear
        />
        <Button
          block
          theme="solid"
          type="warning"
          size="large"
          loading={loading}
          htmlType="submit"
          className="m-t-10"
        >
          发送
        </Button>
        <Button disabled={loading} block className="m-t-10" onClick={() => getAppNav()('/login')}>
          去登录
        </Button>
      </Form>
    </LoginRegisterBase>
  );
}

// 点击提交按钮
function submitClick(form: IEmailNotBlank, setLoading: Dispatch<SetStateAction<boolean>>) {
  setLoading(true); // 设置 loading状态

  forgotPasswordApi(form)
    .then(({ data }) => {
      ToastSuccess(data.msg);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
}
