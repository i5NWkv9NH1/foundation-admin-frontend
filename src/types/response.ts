export interface Response {
  meta?: {
    processedBy: string;
    version: string;
  };
  message: string;
  statusCode: number;
  errors?: any;
  timestamp: string; // To include the response timestamp
}
export interface SystemResponse<T> extends Response {
  result: T;
}
export interface PaginateMeta {
  page: number;
  itemPerPage: number;
  itemsCount: number;
  pagesCount: number;
}
export interface SystemPaginateResponse<T> extends Response {
  result: {
    items: T[];
    meta: PaginateMeta;
  };
}
