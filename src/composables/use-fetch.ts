// useFetchData.ts
import { ref } from 'vue'
import axios from 'axios'
import { UIStatus } from '@/types/ui-status'
import { PaginiateMeta, PaginiateResponse } from '@/types'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3200/api', // 设置默认基础地址
  timeout: 10000, // 设置请求超时时间，可选
})

export function useFetchData<T> (
  url: string,
  initialPage = 1,
  initialPageSize = 10
) {
  return { axiosInstance }
}
