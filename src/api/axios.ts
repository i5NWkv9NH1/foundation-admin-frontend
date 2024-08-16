import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';
import { useAuthStore } from '@/stores';
import { isTokenExpired } from '@/helpers';
import { useSnackbar } from '@/composables/useSnackbar';

const apiClient = axios.create({
  baseURL: 'http://localhost:3200/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const noAuthPaths = ['/system/auth/signin', '/system/auth/signup', '/system/auth/refresh'];
let isRefreshing = false; // 用于跟踪是否正在刷新 token
const subscribers: ((token: string) => void)[] = []; // 订阅者列表

const onRrefreshed = (cb: (token: string) => void) => {
  subscribers.push(cb);
};

const notifySubscribers = (token: string) => {
  subscribers.forEach((cb) => cb(token));
  subscribers.length = 0;
};

apiClient.interceptors.request.use(
  async (config) => {
    const { showErrorMessage, showSuccessMessage } = useSnackbar();
    const authStore = useAuthStore();
    const isNoAuth = noAuthPaths.some((path) => config.url && config.url.startsWith(path));
    if (!isNoAuth && authStore.isAuthenticated) {
      if (isTokenExpired(authStore.accessToken!)) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            await authStore.refresh();
            isRefreshing = false;
            notifySubscribers(authStore.accessToken!);
            config.headers.Authorization = `Bearer ${authStore.accessToken}`;
          } catch (refreshError) {
            isRefreshing = false;
            authStore.logout();
            showErrorMessage('Token refresh failed');
            throw new Error('Token refresh failed');
          }
        } else {
          return new Promise((resolve) => {
            onRrefreshed((token) => {
              config.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(config));
            });
          });
        }
      } else {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    const { showErrorMessage } = useSnackbar();
    showErrorMessage('Request failed');
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { showSuccessMessage } = useSnackbar();
    // showSuccessMessage('Request successful');
    // business code
    return response;
  },
  async (error: AxiosError) => {
    const { showErrorMessage } = useSnackbar();
    const authStore = useAuthStore();
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (!authStore.refreshToken) {
        authStore.logout();
        showErrorMessage('No refresh token available. Please sign in again.');
        return Promise.reject(new Error('No refresh token available. Please sign in again.'));
      }

      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await authStore.refresh();
          isRefreshing = false;
          notifySubscribers(authStore.accessToken!);
          originalRequest.headers['Authorization'] = `Bearer ${authStore.accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          authStore.logout();
          showErrorMessage('Token refresh failed. Please sign in again.');
          return Promise.reject(new Error('Token refresh failed. Please sign in again.'));
        }
      } else {
        return new Promise((resolve) => {
          onRrefreshed((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }
    }

    showErrorMessage('Request failed');
    return Promise.reject(error);
  }
);

export default apiClient;
