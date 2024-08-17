/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router/auto';
// import { setupLayouts } from 'virtual:generated-layouts';
// import { routes } from 'vue-router/auto-routes';
import { useAppStore, useAuthStore } from '@/stores';
import { buildRoutes, convertToTree } from '@/helpers';

const AuthLayout = () => import('@/layouts/AuthLayout.vue');
const AdminLayout = () => import('@/layouts/AdminLayout.vue');

export const defaultRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: AuthLayout,
    meta: {
      title: 'Auth',
      icon: 'mdi-lock-outline'
    },
    children: [
      {
        path: 'signin',
        name: 'SignIn',
        component: () => import('@/pages/auth/signin.vue'),
        meta: {
          title: 'Signin',
          icon: 'mdi-login',
          vidoeUrl: '/public/signin.mp4'
        }
      },
      {
        path: 'signup',
        name: 'SignUp',
        component: () => import('@/pages/auth/signup.vue'),
        meta: {
          title: 'Signup',
          icon: 'mdi-account-plus-outline',
          vidoeUrl: '/public/signup.mp4'
        }
      }
    ]
  },
  {
    path: '/',
    component: AdminLayout,
    meta: {
      title: 'Quick View'
    },
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/dashboard.vue'),
        meta: {
          title: 'dashboard',
          icon: 'mdi-view-dashboard-edit-outline',
          affix: true,
          keepAlive: true
        }
      },
      {
        path: 'forbidden',
        name: 'Forbidden',
        component: () => import('@/pages/forbidden.vue'),
        meta: {
          title: 'Forbidden',
          icon: 'mdi-cancel'
        }
      },
      {
        path: ':pathMatch(.*)*',
        name: 'Not Found',
        component: () => import('@/pages/[...404].vue'),
        meta: {
          title: 'Not Found',
          icon: 'mdi-help-circle-outline'
        }
      },
      {
        path: 'system',
        name: 'System',
        redirect: '/system/accounts',
        meta: {
          title: 'System',
          icon: 'mdi-view-dashboard-outline',
          alwaysShow: true,
          keepAlive: true,
          affix: true,
          breadcrumb: true
        },
        children: [
          { name: 'Accounts', path: 'accounts', component: () => import('@/pages/system/accounts.vue'), meta: { title: 'Account', icon: 'mdi-account-outline', alwaysShow: true, keepAlive: true, affix: true, breadcrumb: true } },
          { name: 'Roles', path: 'roles', component: () => import('@/pages/system/roles.vue'), meta: { title: 'Roles', icon: 'mdi-face-man', alwaysShow: true, keepAlive: true, affix: true, breadcrumb: true } },
          { name: 'Menus', path: 'menus', component: () => import('@/pages/system/menus.vue'), meta: { title: 'System', icon: 'mdi-dots-vertical-circle-outline', alwaysShow: true, keepAlive: true, affix: true, breadcrumb: true } }
        ]
      }
    ]
  }
];

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: defaultRoutes
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;
