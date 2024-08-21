import { Action, Gender, Menu, Organization, Role, Status } from './entities'

// 通用分页参数
export interface PaginationPayload {
  page?: number
  itemsPerPage?: number
}

// 每个模块特定的过滤器参数
export interface FilterPayload {
  [key: string]: any // 通用过滤器字段
}

// 获取账户的请求参数
// 特定于账户模块的过滤器参数
export interface AccountFilterPayload {
  text?: string
  status?: Status | 'ALL'
  organizationId?: string
  roleId?: string
  startDate?: string
  endDate?: string
  // 其他字段...
}
export interface RoleFilterPayload {
  text?: string
  status?: Status | 'ALL'
  name?: string | undefined
}
export interface OrganizationFilterPayload {}
export interface MenuFilterPayload {}
export interface ActionFilterPayload {
  menuId?: string
}

// 分页和过滤器的请求参数
export interface RequestPayload<T = FilterPayload> {
  page?: number
  itemsPerPage?: number
  filters?: T
}

// 登录请求的 payload 类型
export interface SigninPayload {
  account: {
    username: string
    password: string
  }
  verify: {
    captcha: string
    uniqueId: string
  }
}
export interface SignupPayload {
  username: string
  password: string
  email?: string
  captcha: string
  uniqueId: string
}
export interface Tokens {
  accessToken: string
  refreshToken: string
}

// prettier-ignore
export interface CreateAccountDto {
  id?: string;
  name: string;
  username: string
  password: string;
  roles?: Role[]
  organizations?: Organization[]
  organizationIds: string[]
  profile: {
    status: Status
    gender: Gender,
    email?: string;
    phone?: string;
    address?: string;
    avatarUrl?: string;
    bannerurl?: string
    bio?: string
    website?: string
    location?: string
    socialMediaLinks?: Record<string, string>
  }
}

export interface UpdateAccountDto extends CreateAccountDto {}

export interface CreateRoleDto {
  id?: string
  label: string
  name: string
  status: Status
  sort: number
}
export interface UpdateRoleDto extends CreateRoleDto {}

export interface CreateMenuDto {
  id?: string
  name: string
  router: string
  icon: string
  path: string
  redirect: string | null
  component: string
  parentId: string | null
  parent: null | Menu
  sort: number
}

export interface UpdateMenuDto extends CreateMenuDto {}

export interface CreateOrganizationDto {}
export interface UpdateOrganizationDto extends CreateOrganizationDto {}

export interface CreateActionDto extends Partial<Action> {
  name: string
  code: string
  icon: string
  menuId: string
  sort: number
}
export interface UpdateActionDto extends CreateActionDto {}
