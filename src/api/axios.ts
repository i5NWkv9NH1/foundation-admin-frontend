// utils/axios.js
import { useAuthStore } from '@/stores'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3200/api',
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
    if (error.response && error.response.status === 401) {
    }
    if (error.response && error.response.status === 403) {
    }
    return Promise.reject(error)
  }
)

export default apiClient
