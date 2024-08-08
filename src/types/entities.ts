/* eslint-disable no-use-before-define */
export interface BaseEntity {
  id?: string
  createdAt?: string
  updatedAt?: string
}
export interface Role extends BaseEntity {
  name: string
  code: string
  actions: []
}
export interface Menu extends BaseEntity {
  label: string
  router: string
  icon: string
  path: string
  parentId: null | string
  parent: Menu | null
  children: Menu[]
  actions: Action[]
}
export interface Action extends BaseEntity {
  name: string
  code: string
  icon: string
  menuId: string
  // menu?: Menu
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
