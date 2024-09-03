import { Account, AccountFilterPayload, ApiPaginatedResponse, ApiResponse, ApiResponseWithResult, CreateAccountDto, RequestPayload, UpdateAccountDto } from '../types'
import apiClient from './axios'

// 获取账户列表
const getAccounts = (payload: RequestPayload<AccountFilterPayload>) => {
  const { page, itemsPerPage, filters } = payload
  return apiClient.get<ApiPaginatedResponse<Account>>('/system/accounts', {
    params: {
      page,
      itemsPerPage,
      filters: JSON.stringify(filters)
    }
  })
}

// * 获取单个账户
const getAccountById = (id: string) => apiClient.get<ApiResponseWithResult<Account>>(`/system/accounts/${id}`)
// * 创建新账户
const createAccount = (dto: CreateAccountDto) => apiClient.post<ApiResponseWithResult<Account>>('/system/accounts', dto)
/// * 更新现有账户
const updateAccount = (id: string, dto: UpdateAccountDto) => apiClient.put<ApiResponseWithResult<Account>>(`/system/accounts/${id}`, dto)
// * 删除账户
const deleteAccount = (id: string) => apiClient.delete<ApiResponse>(`/system/accounts/${id}`)

export const apiAccounts = {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount
}
