import { Role, RoleFilterPayload, ApiPaginatedResponse, ApiResponse, ApiResponseWithResult, RequestPayload } from '../types';
import { CreateRolePayload, UpdateRolePayload } from '../types';
import apiClient from './axios';

// * 获取角色列表
export const getRoles = (payload: RequestPayload<RoleFilterPayload>) => {
  const { page, itemsPerPage, filters } = payload;
  return apiClient.get<ApiPaginatedResponse<Role>>('/roles', {
    params: {
      page,
      itemsPerPage,
      filters: JSON.stringify(filters) // 将 filters 序列化为 JSON 字符串
    }
  });
};

// * 获取单个角色
export const getRoleById = (id: number) => apiClient.get<ApiResponseWithResult<Role>>(`/roles/${id}`);

// * 创建新角色
export const createRole = (payload: CreateRolePayload) => apiClient.post<ApiResponseWithResult<Role>>('/roles', payload);

// * 更新现有角色
export const updateRole = (id: number, payload: UpdateRolePayload) => apiClient.put<ApiResponseWithResult<Role>>(`/roles/${id}`, payload);

// * 删除角色
export const deleteRole = (id: number) => apiClient.delete<ApiResponse>(`/roles/${id}`);
