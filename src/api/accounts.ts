import { Account, AccountFilterPayload, ApiPaginatedResponse, ApiResponse, ApiResponseWithResult, RequestPayload } from '../types';
import { CreateAccountPayload, UpdateAccountPayload } from '../types';
import apiClient from './axios';

// 获取账户列表
export const getAccounts = (payload: RequestPayload<AccountFilterPayload>) => {
  const { page, itemsPerPage, filters } = payload;
  return apiClient.get<ApiPaginatedResponse<Account>>('/accounts', {
    params: {
      page,
      itemsPerPage,
      filters: JSON.stringify(filters) // 将 filters 序列化为 JSON 字符串
    }
  });
};

// * 获取单个账户
const getAccountById = (id: number) => apiClient.get<ApiResponseWithResult<Account>>(`/accounts/${id}`);
// * 创建新账户
const createAccount = (payload: CreateAccountPayload) => apiClient.post<ApiResponseWithResult<Account>>('/accounts', payload);
/// * 更新现有账户
const updateAccount = (id: number, payload: UpdateAccountPayload) => apiClient.put<ApiResponseWithResult<Account>>(`/accounts/${id}`, payload);
// * 删除账户
const deleteAccount = (id: number) => apiClient.delete<ApiResponse>(`/accounts/${id}`);

export const apiAccounts = {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount
};
