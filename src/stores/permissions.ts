import { defaultRoutes } from '@/router'
import { Permissions } from '@/types'
import { toRaw } from 'vue'

export const usePermissionStore = defineStore('permissions', () => {
  const permissions = ref<Permissions>({
    actions: [],
    menus: [],
    routes: []
  })

  const visibleDefaultRoutes = computed(() => defaultRoutes.filter((route) => !route.meta?.hidden))
  // 用于显示在侧边菜单的路由
  const allVisibleRoutes = computed(() => {
    return [...visibleDefaultRoutes.value, ...permissions.value.routes]
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
    allVisibleRoutes,
    breadcrumbRoutes,
    setPermissions,
    clearPermissions
  }
})
