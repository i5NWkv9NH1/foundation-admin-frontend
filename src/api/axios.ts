// utils/axios.js
import { whiteList } from '@/constants'
import router from '@/router'
import { useAuthStore, useUserStore } from '@/stores'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

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

    if (!whiteList.includes(config.url!)) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  // business error
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    const userStore = useUserStore()
    let isRetrying = false
    if (isRetrying) {
      return
    }

    if (originalRequest.url.includes('logout')) {
      return
    }

    if (axios.isAxiosError(error) && error.response?.status === 401 && !whiteList.includes(originalRequest.url)) {
      const tokenExpire = isTokenExpire(userStore.tokens.accessToken)
      try {
        if (tokenExpire) {
          originalRequest._retry = true;
          isRetrying = true
          await userStore.refresh()
          if (userStore.tokens.accessToken) {
            originalRequest.headers.Authorization = `Bearer ${userStore.tokens.accessToken}`
            isRetrying = false
            return apiClient(originalRequest)
          }
        }
        //  else {
        //   router.push('/auth/signin')
        // }
      } catch (refreshError) {
        return router.push('/auth/signin')
      }
    }
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return router.push('/403')
    }
    return Promise.reject(error)
  }
)

function isTokenExpire(token?: string) {
  if (!token) return true
  const decoded = jwtDecode(token)
  return decoded.exp && decoded.exp < Date.now() / 1000
}

export default apiClient
