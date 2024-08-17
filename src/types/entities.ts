import { RouteLocationNormalized } from 'vue-router';

export interface BaseEntity {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}
export interface Role extends BaseEntity {
  label: string;
  name: RoleName;
  status: Status;
  sort: number;
  actions: Action[];
  accounts: Account[];
}
export interface Menu extends BaseEntity {
  name: string;
  router: string;
  icon: string;
  path: string;
  redirect: string | null;
  component: string;
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
  menu: Menu;
}
export type Gender = 'PRIVATE' | 'FEMALE' | 'MALE';
export type Status = 'DISABLE' | 'ENABLE';
export interface Account extends BaseEntity {
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl: string;
  status: Status;
  gender: Gender;
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
export interface AccountDto extends Pick<Account, 'id' | 'name' | 'username' | 'avatarUrl' | 'email' | 'phone' | 'address' | 'status' | 'gender'>{
  organizationIds: string[]
  roles?: Role[]
  organzations?: Organization[]
}
export interface RoleDto extends Pick<Role, 'id' | 'name' | 'label' | 'status' | 'sort' | 'actions' | 'accounts'> {}
export interface Permissions {
  actions: Action[];
  menus: Menu[];
}
// prettier-ignore
export interface CreateAccountDto extends AccountDto {}
export interface UpdateAccountDto extends AccountDto {}
export interface UpdateAccountOrganizationsDto {}
export interface OrganizationDto {}
export type RoleName = 'ROOT' | 'ADMIN' | 'USER' | 'GUEST';
