export interface BaseEntity {
  id?: string
  createdAt?: string
  updatedAt?: string
}
export interface Role extends BaseEntity {
  name: string
}
export interface Account extends BaseEntity {
  name: string
  username: string
  email: string
  phone: string
  address: string
  avatarUrl: string
  roles?: Role[]
}
