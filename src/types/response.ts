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

export interface PaginationMeta {
  page: number;
  itemsPerPage: number;
  itemCount: number;
  pageCount: number;
}

export interface ApiPaginatedResponse<T> extends ApiResponse {
  result: {
    items: T[];
    meta: PaginationMeta;
  };
}
