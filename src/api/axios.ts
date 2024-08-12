import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';
import { useAuthStore } from '@/stores';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

const noAuthPaths = ['/auth/login'];

apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const isNoAuth = noAuthPaths.some((path) => config.url && config.url.startsWith(path));
    if (!isNoAuth && authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // ! 自定义业务代码错误
    // const { data } = response;
    // if (data.code && data.code !== 200) {
    //   let message = 'An error occurred';
    //   switch (data.code) {
    //     case 1001:
    //       message = 'Invalid credentials';
    //       break;
    //     case 1002:
    //       message = 'User not found';
    //       break;
    //     default:
    //       message = 'An unexpected error occurred';
    //       break;
    //   }
    //   return Promise.reject(new Error(message));
    // }
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default apiClient;
