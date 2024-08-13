import { Account, Organization, Status } from './entities';

// 通用分页参数
export interface PaginationPayload {
  page?: number;
  itemsPerPage?: number;
}

// 每个模块特定的过滤器参数
export interface FilterPayload {
  [key: string]: any; // 通用过滤器字段
}

// 分页和过滤器的请求参数
export interface RequestPayload<T = FilterPayload> {
  page: number;
  itemsPerPage: number;
  filters?: T;
}

// 登录请求的 payload 类型
export interface SigninPayload {
  username: string;
  password: string;
  captcha: string;
  uniqueId: string;
}
export interface SignupPayload {
  username: string;
  password: string;
  email?: string;
  captcha: string;
  uniqueId: string;
}
export interface Token {
  accessToken: string;
  refreshToken: string;
}

// 获取账户的请求参数
// 特定于账户模块的过滤器参数
export interface AccountFilterPayload {
  text?: string;
  status?: Status | 'ALL';
  organizationId?: string;
  roleId?: string;
  // 其他字段...
}
export interface RoleFilterPayload {}
export interface OrganizationFilterPayload {}
export interface MenuFilterPayload {}

// 创建账户的请求参数
export type CreateAccountPayload = Pick<Account, 'name' | 'username' | 'avatarUrl' | 'phone' | 'address' | 'gender' | 'status' | 'email' | 'roles'> & {
  organizations?: Organization[] | string[];
  organizationIds?: string[];
};
export type UpdateAccountPayload = CreateAccountPayload & {};

// 创建角色的请求参数
export interface CreateRolePayload {
  name: string;
  // 其他字段...
}

// 更新角色的请求参数
export interface UpdateRolePayload {
  name?: string;
  // 其他字段...
}

// 创建组织的请求参数
export interface CreateOrganizationPayload {
  name: string;
  // 其他字段...
}

// 更新组织的请求参数
export interface UpdateOrganizationPayload {
  name?: string;
  // 其他字段...
}

// 创建组织的请求参数
export interface CreateMenuPayload {
  name: string;
  // 其他字段...
}

// 更新组织的请求参数
export interface UpdateMenuPayload {
  name?: string;
  // 其他字段...
}
