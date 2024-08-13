import { Account, ApiFindMeResponse, ApiResponse, ApiResponseWithResult, ApiSigninResponse, SigninPayload, SignupPayload, Token } from '../types';
import apiClient from './axios';

// * 用户登录
const signin = (payload: SigninPayload) => apiClient.post<ApiSigninResponse>('/system/auth/signin', payload);
// * 用户注册
const signup = (payload: SignupPayload) => apiClient.post<ApiResponseWithResult<Account>>('/system/auth/signup', payload);
// * 获取当前用户信息
const findMe = () => apiClient.get<ApiResponseWithResult<ApiFindMeResponse>>('/auth/me');
// * 用户登出
const logout = (payload: Token) => apiClient.post<ApiResponse>('/system/auth/logout', payload);
// * 刷新 Token
const refreshToken = (payload: { refreshToken: string }) => apiClient.post<ApiResponseWithResult<Token>>('/system/auth/refresh', payload);

export const apiAuth = { signin, signup, findMe, logout, refreshToken };
