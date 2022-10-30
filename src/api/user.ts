import type { LoginForm, RegisterForm } from '@/types/authForm';
import http from '../utils/http';

export function getInfo() {
  return http('/members/info');
}
export function login(values: LoginForm) {
  return http({
    url: '/members/login',
    method: 'post',
    data: values,
  });
}
export function register(values: RegisterForm) {
  return http({
    url: '/members/register',
    method: 'post',
    data: values,
  });
}

export function query(keyword: string | number) {
  return http(`/members/query?keyword=${keyword}`);
}
export function updateAvatar(avatar) {
  return http({
    url: '/members/update/avatar',
    method: 'post',
    data: {
      avatar,
    },
  });
}
export function updatePassword(password: string, old_password: string) {
  return http({
    url: '/members/update/password',
    method: 'post',
    data: { password, old_password },
  });
}
export function updateUsername(username: string) {
  return http({
    url: '/members/update/username',
    method: 'post',
    data: {
      username,
    },
  });
}
export function queryMembers(keyword: string) {
  return http({
    url: '/members/query',
    method: 'get',
    params: {
      keyword,
    },
  });
}

export function logout() {
  return http('/members/logout');
}
export function sms(type: string, account: string) {
  const data =
    type === 'phone'
      ? {
          type,
          phone: account,
        }
      : {
          type,
          email: account,
        };
  console.log(type, account, data);
  return http({
    url: '/otp/send',
    method: 'post',
    data,
  });
}

export function updatePhone(phone: string, code: string) {
  return http({
    url: '/members/update/phone',
    method: 'post',
    data: {
      phone,
      code,
    },
  });
}

export function updateEmail(email: string, code: string) {
  return http({
    url: '/members/update/email',
    method: 'post',
    data: {
      email,
      code,
    },
  });
}
