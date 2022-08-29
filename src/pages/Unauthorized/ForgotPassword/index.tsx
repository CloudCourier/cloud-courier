import { forgotPasswordGetCodeByOpenApi } from '@/api/user';
import forgotPasswordUpdatePasswordByCodeApi from '@/api/user/forgotPasswordUpdatePasswordByCodeApi';
import { getAppNav } from '@/App';
import IUpdatePasswordByCodeForm from '@/model/form/user/IUpdatePasswordByCodeForm';
import { useAppSelector } from '@/store';
import { ToastSuccess } from '@/util/CommonUtil';
import { getQueryVariable } from '@/util/UrlUtil';
import { passwordRSAEncrypt, RSAEncryptPro } from '@/util/UserUtil';
import Validator from '@/util/validator';
import { Button, Form } from '@douyinfe/semi-ui';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import LoginRegisterBase from '../components/LoginRegisterBase';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const rsaPublicKey = useAppSelector(state => state.common.rsaPublicKey);

  const [code, setCode] = useState(''); // 用于 忘记密码-通过 code修改密码

  useEffect(() => {
    // 通过open码获取 code
    const open = getQueryVariable('open');
    if (!open) {
      getAppNav()('/login');
    }
    forgotPasswordGetCodeByOpenApi({ id: open })
      .then(({ data }) => {
        setCode(data.data);
      })
      .catch(() => {
        getAppNav()('/login');
      });
  }, []);

  return (
    <LoginRegisterBase name="忘记密码">
      <Form
        disabled={loading}
        className="w-300"
        onSubmit={form => {
          if (loading) return;
          submitClick({ ...form, id: code } as IUpdatePasswordByCodeForm, setLoading, rsaPublicKey);
        }}
      >
        <Form.Input
          label={{ text: '新密码', required: true }}
          field="newPassword"
          validate={Validator['passwordValidate']}
          showClear
          mode="password"
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
          修改密码
        </Button>
        <Button disabled={loading} block className="m-t-10" onClick={() => getAppNav()('/login')}>
          去登录
        </Button>
      </Form>
    </LoginRegisterBase>
  );
}

// 点击提交按钮
function submitClick(
  form: IUpdatePasswordByCodeForm,
  setLoading: Dispatch<SetStateAction<boolean>>,
  rsaPublicKey: string,
) {
  setLoading(true); // 设置 loading状态

  const date = new Date();
  form.newOrigPassword = RSAEncryptPro(form.newPassword, rsaPublicKey, date);
  form.newPassword = passwordRSAEncrypt(form.newPassword, rsaPublicKey, date);

  forgotPasswordUpdatePasswordByCodeApi(form)
    .then(({ data }) => {
      ToastSuccess(data.msg);
      setLoading(false);
      getAppNav()('/login');
    })
    .catch(() => {
      setLoading(false);
    });
}
