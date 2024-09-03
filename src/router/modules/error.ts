export const errorRoutes = [
  {
    path: '/403',
    name: '403',
    component: () => import('@/pages/error/403.vue'),
    meta: {
      title: '403 Error',
      icon: 'mdi-cancel',
      hidden: true,
      alwaysShow: false,
      keepAlive: false,
      affix: true,
      breadcrumb: false
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/pages/error/404.vue'),
    meta: {
      title: '404 Error',
      icon: 'mdi-cancel',
      hidden: true,
      alwaysShow: false,
      keepAlive: false,
      affix: true,
      breadcrumb: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/error/404.vue')
  }
]
