import { ApiPaginatedResponse, ApiResponse, ApiResponseWithResult, CreateOrganizationDto, Organization, OrganizationFilterPayload, RequestPayload, UpdateOrganizationDto } from '../types'
import apiClient from './axios'

// * 获取组织列表
const getOrganizations = (payload: RequestPayload<OrganizationFilterPayload>) => {
  const { page, itemsPerPage, filters } = payload
  return apiClient.get<ApiPaginatedResponse<Organization>>('/system/organizations', {
    params: {
      page,
      itemsPerPage,
      filters: JSON.stringify(filters)
    }
  })
}

// * 获取单个组织
const getOrganizationById = (id: string) => apiClient.get<ApiResponseWithResult<Organization>>(`/system/organizations/${id}`)

// * 创建新组织
const createOrganization = (dto: CreateOrganizationDto) => apiClient.post<ApiResponseWithResult<Organization>>('/system/organizations', dto)

// * 更新现有组织
const updateOrganization = (id: string, dto: UpdateOrganizationDto) => apiClient.put<ApiResponseWithResult<Organization>>(`/system/organizations/${id}`, dto)

// * 删除组织
const deleteOrganization = (id: string) => apiClient.delete<ApiResponse>(`/system/organizations/${id}`)

export const apiOrganizations = {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization
}
