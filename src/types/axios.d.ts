import 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean; // 添加 _retry 属性
  }
}
