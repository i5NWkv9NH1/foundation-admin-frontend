import { ApiPaginatedResponse, ApiResponse, ApiResponseWithResult, CreateMenuDto, Menu, MenuFilterPayload, RequestPayload, UpdateMenuDto } from '../types'
import apiClient from './axios'

const getMenus = (payload: RequestPayload<MenuFilterPayload>) => {
  const { page, itemsPerPage, filters } = payload
  return apiClient.get<ApiPaginatedResponse<Menu>>('/system/menus', {
    params: {
      page,
      itemsPerPage,
      filters: JSON.stringify(filters)
    }
  })
}

const getMenuById = (id: string) => apiClient.get<ApiResponseWithResult<Menu>>(`/system/menus/${id}`)
const createMenu = (dto: CreateMenuDto) => apiClient.post<ApiResponseWithResult<Menu>>('/system/menus', dto)
const updateMenu = (id: string, dto: UpdateMenuDto) => apiClient.put<ApiResponseWithResult<Menu>>(`/system/menus/${id}`, dto)
const deleteMenu = (id: string) => apiClient.delete<ApiResponse>(`/system/menus/${id}`)
export const apiMenus = {
  getMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu
}
