import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';
import { useAuthStore } from '@/stores';
import { isTokenExpired } from '@/helpers';
import { useSnackbar } from '@/composables/useSnackbar';
import { whiteList } from '@/constants';

const apiClient = axios.create({
  baseURL: 'http://localhost:3200/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

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
    const isNoAuth = whiteList.some((path) => config.url && config.url.startsWith(path));
    if (!isNoAuth && authStore.isAuthenticated) {
      console.log('axios::request::authed');
      if (isTokenExpired(authStore.token.accessToken!)) {
        console.log('axios::request::token expired');
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            // *
            config.headers.Authorization = `Bearer ${authStore.token.accessToken}`;
            await authStore.refresh();
            isRefreshing = false;
            notifySubscribers(authStore.token.accessToken!);
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
        config.headers.Authorization = `Bearer ${authStore.token.accessToken}`;
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
    console.log('axios::response::error');
    const { showErrorMessage } = useSnackbar();
    const authStore = useAuthStore();
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (!authStore.token.refreshToken) {
        authStore.logout();
        showErrorMessage('No refresh token available. Please sign in again.');
        return;
        return Promise.reject(new Error('No refresh token available. Please sign in again.'));
      }

      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // *
          originalRequest.headers['Authorization'] = `Bearer ${authStore.token.accessToken}`;
          await authStore.refresh();
          isRefreshing = false;
          notifySubscribers(authStore.token.accessToken!);
          return apiClient(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          authStore.logout();
          //! redirect to signin
          console.log('axios::response::error::refresh token failed');
          showErrorMessage('Token refresh failed. Please sign in again.');
          return;
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
    } else if (error.response?.status === 401) {
      // redirect to signin
    }

    if (error.response?.status === 403) {
      showErrorMessage('You have no permission');
      return;
    }

    // showErrorMessage('Request failed');
    return Promise.reject(error);
  }
);

export default apiClient;
