import { RouteLocationNormalized } from 'vue-router';

export interface BaseEntity {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}
export interface Role extends BaseEntity {
  name: string;
  code: string;
  actions: Action[];
  accounts: Account[];
}
export interface Menu extends BaseEntity {
  label: string;
  router: string;
  icon: string;
  path: string;
  parentId: null | string;
  parent: Menu | null;
  children: Menu[];
  actions: Action[];
}
export interface Action extends BaseEntity {
  name: string;
  code: string;
  icon: string;
  menuId: string;
}

export interface Account extends BaseEntity {
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl: string;
  status: 'DISABLE' | 'ENABLE';
  gender: 'MALE' | 'FEMALE' | 'PRIVATE';
  roles?: Role[];
  organizations?: Organization[];
}

export interface Organization extends BaseEntity {
  name: string;
  code: string;
  type: 'GROUP' | 'COMPANY' | 'DEPARTMENT';
  status: 'DISABLE' | 'ENABLE';
  sort: number;
  icon: string;
  path: string;
  parentId: string | null;
  parent: Organization;
  children: Organization[];
  accounts: Account[];
}

export interface History extends Pick<RouteLocationNormalized, 'name' | 'path' | 'query' | 'params' | 'fullPath' | 'hash' | 'meta'> {
  timestamp?: number;
}

// prettier-ignore
export interface AccountDto extends Pick<Account, 'name' | 'username' | 'avatarUrl' | 'email' | 'phone' | 'address' | 'status' | 'gender'>{
  organizationIds: string[]
  roles: any[]
}
export interface Permissions {
  actions: Action[];
  menus: Menu[];
}
// prettier-ignore
export interface CreateAccountDto extends AccountDto {}
export interface UpdateAccountDto extends AccountDto {}
export interface UpdateAccountOrganizationsDto {}
export interface OrganizationDto {}
