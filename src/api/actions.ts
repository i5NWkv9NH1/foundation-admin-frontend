import { Action, ApiPaginatedResponse, ApiResponse, ApiResponseWithResult, RequestPayload, ActionFilterPayload } from '../types';
import { CreateActionPayload, UpdateActionPayload } from '../types';
import apiClient from './axios';

// * 获取动作列表
const getActions = (payload: RequestPayload<ActionFilterPayload>) => {
  const { page, itemsPerPage, filters } = payload;
  return apiClient.get<ApiPaginatedResponse<Action>>('/system/actions', {
    params: {
      page,
      itemsPerPage,
      filters: JSON.stringify(filters) // 将 filters 序列化为 JSON 字符串
    }
  });
};

// * 获取单个动作
const getActionById = (id: string) => apiClient.get<ApiResponseWithResult<Action>>(`/system/actions/${id}`);

// * 创建新动作
export const createAction = (payload: CreateActionPayload) => apiClient.post<ApiResponseWithResult<Action>>('/system/actions', payload);

// * 更新现有动作
const updateAction = (id: string, payload: UpdateActionPayload) => apiClient.put<ApiResponseWithResult<Action>>(`/system/actions/${id}`, payload);

// * 删除动作
const deleteAction = (id: string) => apiClient.delete<ApiResponse>(`/system/actions/${id}`);

export const apiActions = {
  getActions,
  getActionById,
  createAction,
  updateAction,
  deleteAction
};
