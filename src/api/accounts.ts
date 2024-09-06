import { Account, AccountFilterPayload, ApiPaginatedResponse, ApiResponse, ApiResponseWithResult, CreateAccountDto, RequestPayload, UpdateAccountDto } from '../types'
import apiClient from './axios'

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
const getAccountById = (id: string) => apiClient.get<ApiResponseWithResult<Account>>(`/system/accounts/${id}`)
const createAccount = (dto: CreateAccountDto) => apiClient.post<ApiResponseWithResult<Account>>('/system/accounts', dto)
const updateAccount = (id: string, dto: UpdateAccountDto) => apiClient.put<ApiResponseWithResult<Account>>(`/system/accounts/${id}`, dto)
const deleteAccount = (id: string) => apiClient.delete<ApiResponse>(`/system/accounts/${id}`)

export const apiAccounts = {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount
}
