import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';
import { useAuthStore } from '@/stores';
import { isTokenExpired } from '@/helpers';

const apiClient = axios.create({
  baseURL: 'http://localhost:3200/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const noAuthPaths = ['/system/auth/signin', '/system/auth/signup', '/system/auth/refresh'];

apiClient.interceptors.request.use(
  async (config) => {
    const authStore = useAuthStore();
    const isNoAuth = noAuthPaths.some((path) => config.url && config.url.startsWith(path));
    if (!isNoAuth && authStore.isAuthenticated) {
      if (authStore.isAuthenticated) {
        if (isTokenExpired(authStore.accessToken!)) {
          try {
            await authStore.refresh();
            config.headers.Authorization = `Bearer ${authStore.accessToken}`;
          } catch (refreshError) {
            authStore.logout();
            throw new Error('Token refresh failed');
          }
        } else {
          config.headers.Authorization = `Bearer ${authStore.accessToken}`;
        }
      }
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
  async (error: AxiosError) => {
    const authStore = useAuthStore();
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      // @ts-ignore
      !originalRequest._retry
    ) {
      // @ts-ignore
      originalRequest._retry = true;
      try {
        await authStore.refresh();
        originalRequest.headers['Authorization'] = `Bearer ${authStore.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
