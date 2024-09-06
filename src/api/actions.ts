import { Action, ActionFilterPayload, ApiPaginatedResponse, ApiResponse, ApiResponseWithResult, CreateActionDto, RequestPayload, UpdateActionDto } from '../types'
import apiClient from './axios'

// * 获取动作列表
const getActions = (payload: RequestPayload<ActionFilterPayload>) => {
  const { page, itemsPerPage, filters } = payload
  return apiClient.get<ApiPaginatedResponse<Action>>('/system/actions', {
    params: {
      page,
      itemsPerPage,
      filters: JSON.stringify(filters) // 将 filters 序列化为 JSON 字符串
    }
  })
}

const getActionById = (id: string) => apiClient.get<ApiResponseWithResult<Action>>(`/system/actions/${id}`)
const createAction = (dto: CreateActionDto) => apiClient.post<ApiResponseWithResult<Action>>('/system/actions', dto)
const updateAction = (id: string, dto: UpdateActionDto) => apiClient.put<ApiResponseWithResult<Action>>(`/system/actions/${id}`, dto)
const deleteAction = (id: string) => apiClient.delete<ApiResponse>(`/system/actions/${id}`)
export const apiActions = {
  getActions,
  getActionById,
  createAction,
  updateAction,
  deleteAction
}
