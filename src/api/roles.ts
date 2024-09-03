import { Action, ApiPaginatedResponse, ApiResponse, ApiResponseWithResult, CreateRoleDto, RequestPayload, Role, RoleFilterPayload, UpdateRoleDto } from '../types'
import apiClient from './axios'

// * 获取角色列表
const getRoles = (payload: RequestPayload<RoleFilterPayload>) => {
  const { page, itemsPerPage, filters } = payload
  return apiClient.get<ApiPaginatedResponse<Role>>('/system/roles', {
    params: {
      page,
      itemsPerPage,
      filters: JSON.stringify(filters) // 将 filters 序列化为 JSON 字符串
    }
  })
}

// * 获取单个角色
const getRoleById = (id: string) => apiClient.get<ApiResponseWithResult<Role>>(`/system/roles/${id}`)

// * 创建新角色
const createRole = (dto: CreateRoleDto) => apiClient.post<ApiResponseWithResult<Role>>('/system/roles', dto)

// * 更新现有角色
const updateRole = (id: string, dto: UpdateRoleDto) => apiClient.put<ApiResponseWithResult<Role>>(`/system/roles/${id}`, dto)

// * 删除角色
const deleteRole = (id: string) => apiClient.delete<ApiResponse>(`/system/roles/${id}`)
// * 获取某个角色的某个菜单的权限
const getRoleActionsByRoleIdMenuId = ({ roleId, menuId, page, itemsPerPage }: { roleId: string; menuId: string; page?: number; itemsPerPage?: number }) =>
  apiClient.get<ApiPaginatedResponse<Action>>(`/system/roles/${roleId}/menus/${menuId}`, {
    params: { page, itemsPerPage }
  })
// * 更新某个角色的某个菜单的权限
const updateRoleActionsByRoleIdMenuId = (roleId: string, menuId: string, actionIds: string[]) =>
  apiClient.put<ApiResponseWithResult<Role>>(`/system/roles/${roleId}/menus/${menuId}`, {
    actionIds
  })

export const apiRoles = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getRoleActionsByRoleIdMenuId,
  updateRoleActionsByRoleIdMenuId
}
