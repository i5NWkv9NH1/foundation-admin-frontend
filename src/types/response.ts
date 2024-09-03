import { Account, Permissions } from './entities'
import { Tokens } from './payload'

export interface ApiResponse {
  meta?: {
    processedBy: string
    version: string
  }
  message: string
  statusCode: number
  errors?: any
  timestamp: string
}
export interface ApiResponseWithResult<T> extends ApiResponse {
  result: T
}
export interface ApiSigninResponse
  extends ApiResponseWithResult<{
    account: Account
    tokens: Tokens
    permissions: Permissions
  }> {}
export interface ApiSignupResponse extends ApiSigninResponse {}

export interface ApiFindMeResponse
  extends ApiResponseWithResult<{
    account: Account
    permissions: Permissions
  }> {}

export interface PaginationMeta {
  page: number
  itemsPerPage: number
  itemsLength: number
  pagesLength: number
}

export interface ApiPaginatedResponse<T> extends ApiResponse {
  result: {
    items: T[]
    meta: PaginationMeta
  }
}
