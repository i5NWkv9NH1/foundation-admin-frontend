import { Account, ApiResponse, ApiResponseWithResult, SigninPayload, SignupPayload, Token } from '../types';
import apiClient from './axios';

// * 用户登录
export const signin = (payload: SigninPayload) => apiClient.post<ApiResponseWithResult<Token>>('/auth/signin', payload);
// * 用户注册
export const signup = (payload: SignupPayload) => apiClient.post<ApiResponseWithResult<Token>>('/auth/signup', payload);
// * 获取当前用户信息
export const getCurrentUser = () => apiClient.get<ApiResponseWithResult<Account>>('/auth/me');
// * 用户登出
export const logout = () => apiClient.post<ApiResponse>('/auth/logout');
