import { login, register } from '@/api/user';
import UserCode from '@/components/UserUtils/UserCode';
import { randomString, ToastError, ToastSuccess } from '@/utils/common';
import type { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface';
import { Button, Form } from '@douyinfe/semi-ui';
import type { ReactFieldError } from '@douyinfe/semi-ui/lib/es/form';
import { ValidateStatus } from '@douyinfe/semi-ui/lib/es/input';
import { useEffect, useRef, useState } from 'react';
import LoginRegisterBase from '../components/LoginRegisterBase';
import { useNavigate } from 'react-router-dom';
import Validator from '@/utils/validator';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState('phone');
  const formApi = useRef<BaseFormApi>();
  const [codeText, setCodeText] = useState('获取验证码');

  const timer = useRef<NodeJS.Timer>();

  const navigate = useNavigate();

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
  // 点击提交按钮
  function submitClick(form) {
    setLoading(true);
    const temp = form.accountPrefix === 'phone' ? (form.phone as string) : (form.email as string);
    const regForm = {
      password: form.password,
      code: form.code,
      name: temp.substring(0, 3) + randomString(6), // 当个人用户注册时，随机生成一个用户名，为内部运行项目，应该不会出现重复的用户名(oﾟ▽ﾟ)o'
    };
    form.accountPrefix === 'phone'
      ? (regForm['phone'] = form.phone)
      : (regForm['email'] = form.email);
    register(regForm)
      .then(res => {
        if (res) {
          ToastSuccess('注册成功，正在登入系统(oﾟ▽ﾟ)o', 5);
          login({ login: form.account, password: form.password }).then(() => {
            ToastSuccess('欢迎回来 (oﾟ▽ﾟ)o', 5);
            navigate('/');
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <LoginRegisterBase name="注册">
      <Form
        disabled={loading}
        getFormApi={api => (formApi.current = api)}
        style={{ width: '300px' }}
        onSubmit={form => {
          if (loading) return;
          submitClick(form);
        }}
        onSubmitFail={(errors: Record<string, ReactFieldError>) => {
          errors.code ? ToastError(errors.code as string) : null;
        }}
      >
        <Form.InputGroup>
          <Form.Select
            style={{ width: 80 }}
            field="accountPrefix"
            initValue="phone"
            onChange={e => {
              const type = e as string;
              setAccountType(type);
            }}
          >
            <Form.Select.Option value="phone">手机</Form.Select.Option>
            <Form.Select.Option value="email">邮箱</Form.Select.Option>
          </Form.Select>
          {accountType === 'phone' ? (
            <Form.Input
              field="phone"
              style={{ width: 220 }}
              showClear
              validate={Validator['phoneValidate']}
              autoComplete="off"
            />
          ) : (
            <Form.Input
              field="email"
              style={{ width: 220 }}
              showClear
              validate={Validator['emailValidate']}
              autoComplete="off"
            />
          )}
        </Form.InputGroup>
        <Form.Input
          field="password"
          placeholder="密码"
          noLabel
          validate={Validator['passwordValidate']}
          showClear
          style={{ width: 300 }}
          mode="password"
          rules={[{ required: true, message: '请输入密码' }]}
          autoComplete="off"
        />
        <UserCode
          noLabel
          setCodeText={setCodeText}
          timer={timer}
          clearTimer={clearTimer}
          codeText={codeText}
          loading={loading}
        />
        <Button
          block
          type="warning"
          size="large"
          loading={loading}
          htmlType="submit"
          style={{ marginBottom: '10px' }}
        >
          注 册
        </Button>
        <Button
          disabled={loading}
          block
          style={{ marginBottom: '10px' }}
          onClick={() => navigate('/login')}
        >
          去登录
        </Button>
      </Form>
    </LoginRegisterBase>
  );
}
