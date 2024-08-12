import { Organization, OrganizationFilterPayload, ApiPaginatedResponse, ApiResponse, ApiResponseWithResult, RequestPayload } from '../types';
import { CreateOrganizationPayload, UpdateOrganizationPayload } from '../types';
import apiClient from './axios';

// * 获取组织列表
export const getOrganizations = (payload: RequestPayload<OrganizationFilterPayload>) => {
  const { page, itemsPerPage, filters } = payload;
  return apiClient.get<ApiPaginatedResponse<Organization>>('/organizations', {
    params: {
      page,
      itemsPerPage,
      filters: JSON.stringify(filters) // 将 filters 序列化为 JSON 字符串
    }
  });
};

// * 获取单个组织
export const getOrganizationById = (id: number) => apiClient.get<ApiResponseWithResult<Organization>>(`/organizations/${id}`);

// * 创建新组织
export const createOrganization = (payload: CreateOrganizationPayload) => apiClient.post<ApiResponseWithResult<Organization>>('/organizations', payload);

// * 更新现有组织
export const updateOrganization = (id: number, payload: UpdateOrganizationPayload) => apiClient.put<ApiResponseWithResult<Organization>>(`/organizations/${id}`, payload);

// * 删除组织
export const deleteOrganization = (id: number) => apiClient.delete<ApiResponse>(`/organizations/${id}`);
