import { ApiPaginatedResponse, ApiResponse, ApiResponseWithResult, CreateOrganizationDto, Organization, OrganizationFilterPayload, RequestPayload, UpdateOrganizationDto } from '../types'
import apiClient from './axios'

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

const getOrganizationById = (id: string) => apiClient.get<ApiResponseWithResult<Organization>>(`/system/organizations/${id}`)
const createOrganization = (dto: CreateOrganizationDto) => apiClient.post<ApiResponseWithResult<Organization>>('/system/organizations', dto)
const updateOrganization = (id: string, dto: UpdateOrganizationDto) => apiClient.put<ApiResponseWithResult<Organization>>(`/system/organizations/${id}`, dto)
const deleteOrganization = (id: string) => apiClient.delete<ApiResponse>(`/system/organizations/${id}`)

export const apiOrganizations = {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization
}
