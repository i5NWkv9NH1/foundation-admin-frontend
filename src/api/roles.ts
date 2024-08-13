import { Role, RoleFilterPayload, ApiPaginatedResponse, ApiResponse, ApiResponseWithResult, RequestPayload } from '../types';
import { CreateRolePayload, UpdateRolePayload } from '../types';
import apiClient from './axios';

// * 获取角色列表
const getRoles = (payload: RequestPayload<RoleFilterPayload>) => {
  const { page, itemsPerPage, filters } = payload;
  return apiClient.get<ApiPaginatedResponse<Role>>('/system/roles', {
    params: {
      page,
      itemsPerPage,
      filters: JSON.stringify(filters) // 将 filters 序列化为 JSON 字符串
    }
  });
};

// * 获取单个角色
const getRoleById = (id: number) => apiClient.get<ApiResponseWithResult<Role>>(`/system/roles/${id}`);

// * 创建新角色
const createRole = (payload: CreateRolePayload) => apiClient.post<ApiResponseWithResult<Role>>('/system/roles', payload);

// * 更新现有角色
const updateRole = (id: number, payload: UpdateRolePayload) => apiClient.put<ApiResponseWithResult<Role>>(`/system/roles/${id}`, payload);

// * 删除角色
const deleteRole = (id: number) => apiClient.delete<ApiResponse>(`/system/roles/${id}`);

export const apiRoles = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};
