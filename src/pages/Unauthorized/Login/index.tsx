import { login } from '@/api/user';
import { ToastSuccess } from '@/utils/common';
import { Button, Form, Typography } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginRegisterBase from '../components/LoginRegisterBase';
import styles from './index.scss';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // 点击提交按钮
  function submitClick(form) {
    setLoading(true);
    login(form)
      .then(res => {
        if (res.status === 200) {
          ToastSuccess('欢迎回来 (oﾟ▽ﾟ)o', 5);
          localStorage.setItem('userInfo', JSON.stringify(res.data));
          setLoading(false);
          navigate('/');
          return;
        }
        console.log('res:', res);
      })
      .finally(() => {
        if (loading) {
          setLoading(false);
        }
      });
  }
  return (
    <LoginRegisterBase name="登录">
      <Form
        disabled={loading}
        className={styles.baseForm}
        onSubmit={form => {
          if (loading) return;
          submitClick(form);
        }}
      >
        <Form.Input
          field="login"
          placeholder="请输入账号"
          noLabel
          rules={[{ required: true, message: '请输入账号' }]}
          showClear
        />
        <Form.Input
          field="password"
          placeholder="密码"
          noLabel
          rules={[{ required: true, message: '请输入密码' }]}
          showClear
          mode="password"
        />
        {/* <div className={styles.fromBox}>
          <Form.Checkbox field="rememberMe" noLabel>
            记住我
          </Form.Checkbox>
          <Form.Checkbox field="hiddenFlag" noLabel>
            隐身登录
          </Form.Checkbox>
        </div> */}
        <Button
          block
          size="large"
          loading={loading}
          htmlType="submit"
          className={styles.formButton}
        >
          登 录
        </Button>
        <Button
          disabled={loading}
          block
          type="warning"
          className={styles.formButton}
          onClick={() => navigate('/register')}
        >
          去注册
        </Button>
        <div className={styles.forgetPassword}>
          <Typography.Text
            link={!loading}
            disabled={loading}
            onClick={() => {
              if (loading) return;
              navigate('/forgotPasswordSend');
            }}
          >
            忘记密码
          </Typography.Text>
        </div>
      </Form>
    </LoginRegisterBase>
  );
}
