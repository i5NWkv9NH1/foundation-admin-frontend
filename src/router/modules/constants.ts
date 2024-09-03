import AdminLayout from '@/layouts/AdminLayout.vue'
import { RouteRecordRaw } from 'vue-router'

export const constantRoutes = <RouteRecordRaw[]>[
  {
    path: '/',
    name: '/',
    component: AdminLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: 'Dashboard',
          icon: 'mdi-apps',
          hidden: false,
          alwaysShow: false,
          keepAlive: false,
          affix: true,
          breadcrumb: false
        }
      }
    ]
  }
]
