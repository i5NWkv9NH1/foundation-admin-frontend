<script setup lang="ts">
import { usePermissionStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const permissionStore = usePermissionStore()

const breadcrumbList = computed(() => {
  const matchedRoutes = route.matched[route.matched.length - 1]
  const breadcrumbs = []
  console.log(permissionStore.breadcrumbRoutes)

  // 添加固定的 Dashboard 面包屑项
  breadcrumbs.push({
    text: 'Dashboard',
    href: '/dashboard',
    disabled: route.path === '/dashboard'
  })

  const matched = permissionStore.permissions.menus.find((_) => _.path === matchedRoutes.path)
  console.log(matched)

  // 查找当前路径的父级路径
  // matchedRoutes.forEach((matchedRoute) => {
  //   const foundMenu = permissionStore.permissions.menus.find((menu) => matchedRoute.path.includes(menu.router));

  //   if (foundMenu) {
  //     breadcrumbs.push({
  //       text: foundMenu.name,
  //       href: foundMenu.router,
  //       disabled: matchedRoute.path === foundMenu.router
  //     });
  //   }
  // });

  return breadcrumbs
})

// 面包屑点击处理逻辑
const handleBreadcrumb = (breadcrumb: any, _index: number) => {
  if (!breadcrumb.disabled) {
    router.push(breadcrumb.href)
  }
}
</script>

<template>
  <v-breadcrumbs>
    <v-breadcrumbs-item
      v-for="(breadcrumb, index) in breadcrumbList"
      :key="breadcrumb.text"
      :disabled="breadcrumb.disabled"
      @click="handleBreadcrumb(breadcrumb, index)"
    >
      {{ breadcrumb.text }}
    </v-breadcrumbs-item>
  </v-breadcrumbs>
</template>
