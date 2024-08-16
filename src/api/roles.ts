import { Role, RoleFilterPayload, ApiPaginatedResponse, ApiResponse, ApiResponseWithResult, RequestPayload, Action } from '../types';
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
const getRoleById = (id: string) => apiClient.get<ApiResponseWithResult<Role>>(`/system/roles/${id}`);

// * 创建新角色
const createRole = (payload: CreateRolePayload) => apiClient.post<ApiResponseWithResult<Role>>('/system/roles', payload);

// * 更新现有角色
const updateRole = (id: string, payload: UpdateRolePayload) => apiClient.put<ApiResponseWithResult<Role>>(`/system/roles/${id}`, payload);

// * 删除角色
const deleteRole = (id: string) => apiClient.delete<ApiResponse>(`/system/roles/${id}`);
// * 获取某个角色的某个菜单的权限
const getRoleActionsByRoleIdMenuId = (roleId: string, menuId: string, page?: number, itemsPerPage?: number) =>
  apiClient.get<ApiPaginatedResponse<Action>>(`/system/roles/${roleId}/menus/${menuId}`, {
    params: { page, itemsPerPage }
  });
// * 更新某个角色的某个菜单的权限
const updateRoleActionsByRoleIdMenuId = (roleId: string, menuId: string, actions: Action[]) => apiClient.put<ApiResponseWithResult<Role>>(`/system/roles/${roleId}/menus/${menuId}`, { actions });

export const apiRoles = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getRoleActionsByRoleIdMenuId,
  updateRoleActionsByRoleIdMenuId
};
