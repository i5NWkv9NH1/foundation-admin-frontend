import { Action, Gender, Menu, Organization, Role, Status } from './entities'

export interface PaginationPayload {
  page?: number
  itemsPerPage?: number
}
export interface FilterPayload {
  [key: string]: any
}

export interface AccountFilterPayload {
  text?: string
  status?: Status | 'ALL'
  organizationId?: string
  roleId?: string
  startDate?: string
  endDate?: string
}
export interface RoleFilterPayload {
  text?: string
  status?: Status | 'ALL'
  name?: string | undefined
}
export interface OrganizationFilterPayload { }
export interface MenuFilterPayload { }
export interface ActionFilterPayload {
  menuId?: string
}

export interface RequestPayload<T = FilterPayload> {
  page?: number
  itemsPerPage?: number
  filters?: T
}

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

export interface UpdateAccountDto extends CreateAccountDto { }

export interface CreateRoleDto {
  id?: string
  label: string
  name: string
  status: Status
  sort: number
}
export interface UpdateRoleDto extends CreateRoleDto { }

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

export interface UpdateMenuDto extends CreateMenuDto { }

export interface CreateOrganizationDto {
  id?: string
  label: string
  name: string
  status: Status
  icon?: string | null
  parent: Organization | null
  parentId: string | null
  sort: number
  path: string
}
export interface UpdateOrganizationDto extends CreateOrganizationDto { }

export interface CreateActionDto extends Partial<Action> {
  id?: string
  name: string
  code: string
  icon: string
  menuId: string
  sort: number
  status: Status
}
export interface UpdateActionDto extends CreateActionDto { }
