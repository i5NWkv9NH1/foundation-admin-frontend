import { defaultRoutes } from '@/router'
import { Permissions } from '@/types'

export const usePermissionStore = defineStore('permissions', () => {
  const permissions = ref<Permissions>({
    actions: [],
    menus: [],
    routes: []
  })

  // 用于显示在侧边菜单的路由
  const visibleRoutes = computed(() => {
    return [...defaultRoutes.filter((route) => !route.meta?.hidden), ...permissions.value.routes.filter((route) => !route.meta?.hidden)]
  })

  // 面包屑路径中的所有路由
  const breadcrumbRoutes = computed(() => {
    return [...defaultRoutes, ...toRaw(permissions.value.routes)]
  })

  // 设置权限数据
  function setPermissions(newPermissions: Permissions) {
    permissions.value = newPermissions
  }

  // 清除权限数据
  function clearPermissions() {
    permissions.value = { menus: [], actions: [], routes: [] }
  }

  return {
    permissions,
    visibleRoutes,
    breadcrumbRoutes,
    setPermissions,
    clearPermissions
  }
})
