import axios from 'axios';
import { ToastError, ToastInfo, ToastWaring } from '@/utils/common';

const http = axios.create({
  baseURL: 'https://cccs.sunxinao.cn',
  // timeout: 5000, // request timeout
  withCredentials: true,
});

http.interceptors.request.use(
  config => {
    return config;
  },
  error => Promise.reject(error),
);

// 添加响应拦截器
http.interceptors.response.use(
  response => response,
  err => {
    const { response } = err;
    if (response.status === 401 && response.data.path !== '/members/login') {
      ToastInfo('请登录');
      window.location.href = '#/login';
    }

    ToastError(response.data.message);
  },
);
export default http;
