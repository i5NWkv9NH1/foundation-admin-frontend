import 'vue-router'

declare module 'vue-router' {
  // https://router.vuejs.org/zh/guide/advanced/meta.html#typescript
  interface RouteMeta {
    title?: string
    icon?: string
    hidden?: boolean

    /**
     * 始终显示父级菜单，即使只有一个子菜单
     * true 显示父级菜单, false 隐藏父级菜单，显示唯一子节点
     * @default false
     */
    alwaysShow?: boolean

    /**
     * 是否固定在页签上
     * true 固定, false 不固定
     * @default false
     */
    affix?: boolean

    /**
     * 是否缓存页面
     * true 缓存, false 不缓存
     * @default false
     */
    keepAlive?: boolean

    /**
     * 是否在面包屑导航中隐藏
     * true 隐藏, false 显示
     * @default false
     */
    breadcrumb?: boolean
  }
}
