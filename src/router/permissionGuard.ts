import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import router from '@/router';
import { useAuthStore } from '@/stores';
import { whiteList } from '@/constants';

export function setupPermission() {
  router.beforeEach(async (to, from, next) => {
    // NProgress.start();
    const authStore = useAuthStore();

    if (authStore.isAuthenticated) {
      handleAuthenticated(to, from, next);
    } else {
      handleUnauthenticated(to, next);
    }
  });

  router.afterEach(() => {
    // NProgress.done();
  });
}

async function handleAuthenticated(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const authStore = useAuthStore();
  const hasRoles = authStore.account.roles && authStore.account.roles.length > 0;

  if (to.path === '/auth/signin') {
    next({ path: '/' });
  } else if (hasRoles) {
    if (to.matched.length === 0) {
      next(from.name ? { name: from.name } : '/404');
    } else {
      // @ts-ignore
      const title = (to.params.title as string) || (to.query.title as string);
      if (title) {
        to.meta.title = title;
      }
      next();
    }
  } else {
    // 动态添加路由
    try {
      // const dynamicRoutes = await permissionStore.generateRoutes();
      // dynamicRoutes.forEach((route: RouteRecordRaw) => router.addRoute(route));
      // next({ ...to, replace: true });
      next(to);
    } catch (error) {
      // 移除 token 并重定向到登录页
      authStore.clearTokens();
      redirectToLogin(to, next);
    }
  }
}

function handleUnauthenticated(to: RouteLocationNormalized, next: NavigationGuardNext) {
  if (whiteList.includes(to.path)) {
    next();
  } else {
    // redirectToLogin(to, next);
    next('/auth/signin');
  }
}

function redirectToLogin(to: RouteLocationNormalized, next: NavigationGuardNext) {
  const params = new URLSearchParams(to.query as Record<string, string>);
  const queryString = params.toString();
  const redirect = queryString ? `${to.path}?${queryString}` : to.path;
  next(`/auth/sigin?redirect=${encodeURIComponent(redirect)}`);
}
