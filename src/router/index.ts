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

const AuthLayout = () => import('@/layouts/AuthLayout.vue');
const AdminLayout = () => import('@/layouts/AdminLayout.vue');

export const defaultRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'signin',
        name: 'SignIn',
        component: () => import('@/pages/auth/signin.vue'),
        meta: {
          vidoeUrl: '/public/signin.mp4'
        }
      },
      {
        path: 'signup',
        name: 'SignUp',
        component: () => import('@/pages/auth/signup.vue'),
        meta: {
          vidoeUrl: '/public/signup.mp4'
        }
      }
    ]
  },
  {
    path: '/',
    component: AdminLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/dashboard.vue'),
        meta: {
          title: 'dashboard',
          icon: 'homepage',
          affix: true,
          keepAlive: true
        }
      },
      {
        path: 'forbidden',
        name: 'Forbidden',
        component: () => import('@/pages/forbidden.vue')
      },
      {
        path: ':pathMatch(.*)*',
        name: '404',
        component: () => import('@/pages/[...404].vue')
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
