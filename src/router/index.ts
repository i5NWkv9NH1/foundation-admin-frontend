/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router/auto';
// import { setupLayouts } from 'virtual:generated-layouts';
// import { routes } from 'vue-router/auto-routes';
import { useAppStore, useAuthStore, useUIStore } from '@/stores';

const AuthLayout = () => import('@/layouts/AuthLayout.vue');
const AdminLayout = () => import('@/layouts/AdminLayout.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: '',
        redirect: '/auth/signin'
      },
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
    children: [
      {
        path: '',
        name: 'dashboard',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/dashboard.vue')
      },
      {
        path: 'forbidden',
        name: 'Forbidden',
        component: () => import('@/pages/forbidden.vue')
      },
      {
        path: 'unauthorized',
        name: 'Unauthorized',
        component: () => import('@/pages/unauthorized.vue')
      },
      {
        path: 'system',
        name: 'System',
        children: [
          {
            path: '',
            redirect: '/system/accounts'
          },
          {
            path: 'accounts',
            name: 'Accounts',
            component: () => import('@/pages/system/accounts.vue')
          },
          {
            path: 'roles',
            name: 'Roles',
            component: () => import('@/pages/system/roles.vue')
          }
        ]
      },
      {
        path: 'workplace',
        name: 'Workplace',
        children: [
          {
            path: '',
            redirect: '/workplace/analysis'
          },
          {
            path: 'analysis',
            name: 'Analysis',
            component: () => import('@/pages/workplace/analysis.vue')
          },
          {
            path: 'test',
            name: 'Test',
            component: () => import('@/pages/workplace/test.vue')
          },
          {
            path: 'tools',
            name: 'Tools',
            component: () => import('@/pages/workplace/tools.vue')
          }
        ]
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
  history: createWebHistory(import.meta.env.BASE_URL),
  // routes: setupLayouts(routes)
  routes
});

let progressInterval: number | null = null;
router.beforeEach(async (to, from, next) => {
  // * ProgressBar
  const uiStore = useUIStore();
  uiStore.startProgress();
  // Simulate progress increase
  let progress = 0;
  progressInterval = setInterval(() => {
    progress += 10; // Increase progress
    if (progress > 90) {
      progress = 90; // Cap progress at 90%
    }
    uiStore.updateProgress(progress);
  }, 100);

  const authStore = useAuthStore();
  if (to.path !== '/auth/signin' && to.path !== '/auth/signup' && !authStore.isAuthenticated) {
    next('/auth/signin');
    return;
  }
  next();
});
router.afterEach((to) => {
  const appStore = useAppStore();
  const uiStore = useUIStore();
  if (!appStore.histories.some((_) => _.fullPath === to.fullPath)) {
    appStore.histories.push({ ...to, timestamp: new Date().getTime() });
    localStorage.setItem('histories', JSON.stringify(appStore.histories));
  }

  if (progressInterval) {
    clearInterval(progressInterval);
  }
  uiStore.stopProgress();
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
