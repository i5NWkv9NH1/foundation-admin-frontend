import { ref } from 'vue';
import axios from 'axios';
import {
  PaginateMeta,
  SystemPaginateResponse,
  SystemResponse
} from '@/types/response';
import { BaseEntity } from '@/types';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3200/api/system',
  timeout: 10000
});

export function useCrud<T extends BaseEntity>(
  url: string,
  initialPage = 1,
  initialPageSize = -1
) {
  const items = ref<T[]>();
  const loading = ref(false);
  const meta = ref<PaginateMeta>({
    page: initialPage,
    itemPerPage: initialPageSize,
    itemsCount: 0,
    pagesCount: 0
  });
  const search = ref('');
  const error = ref<string | null>(null);

  const handleError = (err: any) => {
    error.value = err.message || 'An error occurred';
  };

  const apiCall = async <R>(promise: Promise<R>): Promise<R | void> => {
    try {
      return await promise;
    } catch (err: any) {
      handleError(err);
    }
  };

  const fetchData = async (
    page = initialPage,
    itemsPerPage = initialPageSize,
    filters: Record<string, any> = {}
  ) => {
    loading.value = true;
    const response = await apiCall(
      axiosInstance.get<SystemPaginateResponse<T>>(url, {
        params: { page, itemsPerPage, filters: JSON.stringify(filters) }
      })
    );
    if (response) {
      items.value = response.data.result.items;
      meta.value = response.data.result.meta;
    }
    loading.value = false;
  };

  const create = async (entity: T) => {
    return apiCall(axiosInstance.post<SystemResponse<T>>(url, entity));
  };

  const update = async (entity: T) => {
    return apiCall(
      axiosInstance.put<SystemResponse<T>>(`${url}/${entity.id}`, entity)
    );
  };

  const findById = async (id: string) => {
    return apiCall(axiosInstance.get<SystemResponse<T>>(`${url}/${id}`));
  };

  const deleteById = async (id: string) => {
    return apiCall(axiosInstance.delete<SystemResponse<null>>(`${url}/${id}`));
  };

  const deleteByIds = async (ids: string[]) => {
    return apiCall(
      axiosInstance.delete<SystemResponse<null>>(url, {
        params: { ids: JSON.stringify(ids) }
      })
    );
  };

  return {
    items,
    meta,
    loading,
    search,
    error,
    findAll: fetchData,
    findById,
    refetch: fetchData,
    create,
    update,
    deleteById,
    deleteByIds
  };
}
