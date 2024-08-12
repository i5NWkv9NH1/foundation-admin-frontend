import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import router from '@/router';
import { useAuthStore } from '@/stores';

const whiteList = ['/auth/signin', '/auth/signup', '/auth/logout', '/auth/refresh'];
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
    // 如果已登录，跳转到首页
    next({ path: '/' });
  } else if (hasRoles) {
    // 如果路由存在
    if (to.matched.length === 0) {
      next(from.name ? { name: from.name } : '/404');
    } else {
      // 设置路由标题
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
      next({ ...to, replace: true });
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
    redirectToLogin(to, next);
  }
}

function redirectToLogin(to: RouteLocationNormalized, next: NavigationGuardNext) {
  const params = new URLSearchParams(to.query as Record<string, string>);
  const queryString = params.toString();
  const redirect = queryString ? `${to.path}?${queryString}` : to.path;
  next(`/login?redirect=${encodeURIComponent(redirect)}`);
}
