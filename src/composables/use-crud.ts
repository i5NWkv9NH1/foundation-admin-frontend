// use-crud.ts
import { ref } from 'vue'
import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3200/api',
  timeout: 10000,
})

export function useCrud<T> (url: string, initialPage = 1, initialPageSize = 10) {
  const items = ref<T[]>([])
  const loading = ref(true)
  const meta = ref({
    currentPage: initialPage,
    pageSize: initialPageSize,
    total: 0,
    totalPages: 0,
  })
  const search = ref('')
  const error = ref<string | null>(null)

  const fetchData = async (pageNum = initialPage, size = initialPageSize) => {
    loading.value = true
    try {
      const response = await axiosInstance.get<{
        items: T[]
        meta: typeof meta.value
      }>(url, {
        params: { page: pageNum, pageSize: size, search: search.value },
      })
      items.value = response.data.items
      meta.value = response.data.meta
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
