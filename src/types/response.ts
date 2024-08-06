import { PaginiateMeta } from './paginiate'

export interface PaginiateResponse<T> {
  items: T[]
  meta: PaginiateMeta
}
