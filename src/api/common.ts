import apiClient from './axios'

const getCaptcha = (uniqueId: string) => apiClient.post('/captcha/generate', { uniqueId })

export const apiCommon = {
  getCaptcha
}
