import AuthLayout from '@/layouts/AuthLayout.vue'

export const authRoutes = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'Signin',
        path: 'signin',
        component: () => import('@/pages/auth/signin/index.vue'),
        meta: {
          hidden: false,
          title: 'Signin',
          icon: 'mdi-cancel',
          alwaysShow: false,
          keepAlive: false,
          affix: true,
          breadcrumb: false
        }
      },
      {
        name: 'Signup',
        path: 'signup',
        component: () => import('@/pages/auth/signup/index.vue'),
        meta: {
          hidden: false,
          title: 'Signup',
          icon: 'mdi-cancel',
          alwaysShow: false,
          keepAlive: false,
          affix: true,
          breadcrumb: false
        }
      }
    ],
    meta: {
      title: 'Auth',
      hidden: true,
      icon: 'mdi-cancel',
      alwaysShow: false,
      keepAlive: false,
      affix: true,
      breadcrumb: false
    }
  }
]
