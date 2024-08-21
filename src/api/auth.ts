import { ApiFindMeResponse, ApiResponse, ApiResponseWithResult, ApiSigninResponse, SigninPayload, SignupPayload, Tokens } from '../types'
import apiClient from './axios'

// * 用户登录
const signin = (payload: SigninPayload) => apiClient.post<ApiSigninResponse>('/system/auth/signin', payload)
// * 用户注册
const signup = (payload: SignupPayload) => apiClient.post<ApiSigninResponse>('/system/auth/signup', payload)
// * 获取当前用户信息
const findMe = () => apiClient.post<ApiFindMeResponse>('/system/auth/me')
// * 用户登出
const logout = (payload: Tokens) => apiClient.post<ApiResponse>('/system/auth/logout', payload)
// * 刷新 Token
const refreshToken = (payload: { refreshToken: string }) => apiClient.post<ApiResponseWithResult<Tokens>>('/system/auth/refresh', payload)

export const apiAuth = { signin, signup, findMe, logout, refreshToken }
