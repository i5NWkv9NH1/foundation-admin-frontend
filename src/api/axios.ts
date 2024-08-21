// utils/axios.js
import { useAuthStore } from '@/stores'
import axios from 'axios'

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: 'http://localhost:3200/api', // 替换为你的 API 基础 URL
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.tokens.accessToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 处理错误（例如，token 过期）
    if (error.response && error.response.status === 401) {
      // 例如，重定向到登录页
    }
    return Promise.reject(error)
  }
)

export default apiClient
