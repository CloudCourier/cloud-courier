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
export function logout() {
  return http({
    url: '/members/logout',
    method: 'post',
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
