import { Menu, MenuFilterPayload, ApiPaginatedResponse, ApiResponse, ApiResponseWithResult, RequestPayload } from '../types';
import { CreateMenuPayload, UpdateMenuPayload } from '../types';
import apiClient from './axios';

// * 获取菜单列表
const getMenus = (payload: RequestPayload<MenuFilterPayload>) => {
  const { page, itemsPerPage, filters } = payload;
  return apiClient.get<ApiPaginatedResponse<Menu>>('/system/menus', {
    params: {
      page,
      itemsPerPage,
      filters: JSON.stringify(filters) // 将 filters 序列化为 JSON 字符串
    }
  });
};

// * 获取单个菜单
const getMenuById = (id: string) => apiClient.get<ApiResponseWithResult<Menu>>(`/system/menus/${id}`);

// * 创建新菜单
export const createMenu = (payload: CreateMenuPayload) => apiClient.post<ApiResponseWithResult<Menu>>('/system/menus', payload);

// * 更新现有菜单
const updateMenu = (id: string, payload: UpdateMenuPayload) => apiClient.put<ApiResponseWithResult<Menu>>(`/system/menus/${id}`, payload);

// * 删除菜单
const deleteMenu = (id: string) => apiClient.delete<ApiResponse>(`/system/menus/${id}`);

export const apiMenus = {
  getMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu
};
