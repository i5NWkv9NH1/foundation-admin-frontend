// useFetchData.ts
import { ref } from 'vue'
import axios from 'axios'
import { UIStatus } from '@/types/ui-status'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3200', // 设置默认基础地址
  timeout: 10000, // 设置请求超时时间，可选
})

export function useFetchData<T> (url: string) {
  const data = ref<T[]>([])
  const status = ref<UIStatus>(UIStatus.LOADING)
  const error = ref<string | null>(null)

  const fetchData = async () => {
    status.value = UIStatus.LOADING
    try {
      const response = await axiosInstance.get<T[]>(url)
      data.value = response.data
      status.value = data.value.length > 0 ? UIStatus.OK : UIStatus.EMPTY
    } catch (err: any) {
      error.value = err.message || 'An error occurred'
      status.value = UIStatus.FAILED
    }
  }

  fetchData()

  return {
    data,
    status,
    error,
    refetch: fetchData,
  }
}
