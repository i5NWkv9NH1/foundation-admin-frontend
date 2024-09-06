import { Action, ApiPaginatedResponse, ApiResponse, ApiResponseWithResult, CreateRoleDto, RequestPayload, Role, RoleFilterPayload, UpdateRoleDto } from '../types'
import apiClient from './axios'

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

const getRoleById = (id: string) => apiClient.get<ApiResponseWithResult<Role>>(`/system/roles/${id}`)
const createRole = (dto: CreateRoleDto) => apiClient.post<ApiResponseWithResult<Role>>('/system/roles', dto)
const updateRole = (id: string, dto: UpdateRoleDto) => apiClient.put<ApiResponseWithResult<Role>>(`/system/roles/${id}`, dto)
const deleteRole = (id: string) => apiClient.delete<ApiResponse>(`/system/roles/${id}`)
const getRoleActionsByRoleIdMenuId = ({ roleId, menuId, page, itemsPerPage }: { roleId: string; menuId: string; page?: number; itemsPerPage?: number }) =>
  apiClient.get<ApiPaginatedResponse<Action>>(`/system/roles/${roleId}/menus/${menuId}`, {
    params: { page, itemsPerPage }
  })
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
