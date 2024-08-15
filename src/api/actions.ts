import { Action, ApiPaginatedResponse, ApiResponse, ApiResponseWithResult, RequestPayload, ActionFilterPayload } from '../types';
import { CreateMenuPayload, UpdateMenuPayload } from '../types';
import apiClient from './axios';

// * 获取菜单列表
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

// * 获取单个菜单
const getMenuById = (id: number) => apiClient.get<ApiResponseWithResult<Action>>(`/system/actions/${id}`);

// * 创建新菜单
export const createMenu = (payload: CreateMenuPayload) => apiClient.post<ApiResponseWithResult<Action>>('/system/actions', payload);

// * 更新现有菜单
const updateMenu = (id: number, payload: UpdateMenuPayload) => apiClient.put<ApiResponseWithResult<Action>>(`/system/actions/${id}`, payload);

// * 删除菜单
const deleteMenu = (id: number) => apiClient.delete<ApiResponse>(`/system/actions/${id}`);

export const apiActions = {
  getActions,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu
};
