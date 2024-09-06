import { RouteRecordRaw } from 'vue-router'

export type Gender = 'Private' | 'Female' | 'male'
export type Status = 'Disabled' | 'Enabled'

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}
export interface AccountProfile extends BaseEntity {
  email: string
  phone: string
  address: string
  avatarUrl: string
  bannerurl: string
  bio: string
  website: string
  location: string
  status: Status
  gender: Gender
  socialMediaLinks: Record<string, string>
}
export interface Account extends BaseEntity {
  name: string
  username: string
  password: string
  roles: Role[]
  organizations: Organization[]
  profile: AccountProfile
}
export interface Role extends BaseEntity {
  label: string
  name: string
  status: Status
  sort: number
  actions: Action[]
  accounts: Account[]
}
export interface Menu extends BaseEntity {
  name: string
  router: string
  icon: string
  path: string
  redirect: string | null
  component: string
  parent: null | Menu
  parentId: null | string
  sort: number
  children: Menu[]
  actions: Action[]
}
export interface Action extends BaseEntity {
  name: string
  code: string
  icon: string
  menuId: string
  sort: number
}

export interface Organization extends BaseEntity {
  label: string
  name: string
  type: 'Company' | 'Department' | 'Group'
  status: Status
  sort: number
  icon: string
  path: string
  parentId: string | null
  parent: Organization
  children: Organization[]
  accounts: Account[]
}

export interface Permissions {
  actions: Action[]
  menus: Menu[]
  routes: RouteRecordRaw[]
}
