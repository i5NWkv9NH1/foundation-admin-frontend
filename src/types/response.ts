import { Token } from './payload';
import { Account, Permissions } from './entities';

export interface ApiResponse {
  meta?: {
    processedBy: string;
    version: string;
  };
  message: string;
  statusCode: number;
  errors?: any;
  timestamp: string;
}
export interface ApiResponseWithResult<T> extends ApiResponse {
  result: T;
}
export interface ApiSigninResponse extends ApiResponseWithResult<Account> {}

export interface ApiFindMeResponse
  extends ApiResponseWithResult<{
    account: Account;
    permissions: Permissions;
  }> {}

export interface PaginationMeta {
  page: number;
  itemsPerPage: number;
  itemsCount: number;
  pagesCount: number;
}

export interface ApiPaginatedResponse<T> extends ApiResponse {
  result: {
    items: T[];
    meta: PaginationMeta;
  };
}
