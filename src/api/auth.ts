import { ApiFindMeResponse, ApiResponse, ApiSigninResponse, SigninPayload, SignupPayload, Tokens } from '../types'
import apiClient from './axios'

const signin = (payload: SigninPayload) => apiClient.post<ApiSigninResponse>('/system/auth/signin', payload)
const signup = (payload: SignupPayload) => apiClient.post<ApiSigninResponse>('/system/auth/signup', payload)
const findMe = () => apiClient.post<ApiFindMeResponse>('/system/auth/me')
const logout = (payload: Tokens) => apiClient.post<ApiResponse>('/system/auth/logout', payload)
const refreshToken = (payload: { refreshToken: string }) => apiClient.post<ApiSigninResponse>('/system/auth/refresh', payload)
export const apiAuth = { signin, signup, findMe, logout, refreshToken }
