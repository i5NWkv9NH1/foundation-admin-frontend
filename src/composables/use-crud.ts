// use-crud.ts
import { ref } from 'vue'
import axios from 'axios'
import { PaginateMeta, SystemPaginateResponse } from '@/types/response'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3200/api/system',
  timeout: 10000,
})

export function useCrud<T> (url: string, initialPage = 1, initialPageSize = 10) {
  const items = ref<T[]>([])
  const loading = ref(true)
  const meta = ref<PaginateMeta>({
    page: initialPage,
    itemPerPage: initialPageSize,
    itemsCount: 0,
    pagesCount: 0,
  })
  const search = ref('')
  const error = ref<string | null>(null)

  const fetchData = async (
    page = initialPage,
    itemsPerPage = initialPageSize
  ) => {
    loading.value = true
    try {
      const response = await axiosInstance.get<SystemPaginateResponse<T>>(url, {
        params: { page, pageSize: itemsPerPage, search: search.value },
      })
      items.value = response.data.result.items
      meta.value = response.data.result.meta
    } catch (err: any) {
      error.value = err.message || 'An error occurred'
    } finally {
      loading.value = false
    }
  }

  const remove = async (id: string) => {
    try {
      await axiosInstance.delete(`${url}/${id}`)
      await fetchData()
    } catch (error: any) {
      alert(error)
    }
  }

  return {
    items,
    meta,
    loading,
    search,
    error,
    refetch: fetchData,
    remove,
  }
}
