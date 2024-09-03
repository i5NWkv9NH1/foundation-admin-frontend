import { RouteRecordRaw } from 'vue-router'

// * show in drawer as a single menu
export const defaultRoutes = <RouteRecordRaw[]>[
  {
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/dashboard/index.vue'),
    meta: {
      title: 'Dashboard',
      icon: 'mdi-apps',
      hidden: false,
      keepAlive: false,
      affix: true
    }
  }
]
