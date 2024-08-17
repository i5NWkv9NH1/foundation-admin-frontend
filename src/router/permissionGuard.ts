import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import router, { defaultRoutes } from '@/router';
import { useAuthStore } from '@/stores';
import { whiteList } from '@/constants';
import { buildRoutes, convertToTree } from '@/helpers';
import { isEmpty } from 'lodash';

export async function setupPermission() {
  router.beforeEach(async (to, from, next) => {
    // NProgress.start();
    const authStore = useAuthStore();

    if (authStore.isAuthenticated) {
      await onAuthenticated(to, from, next);
    } else {
      onUnauthenticated(to, next);
    }
  });

  router.afterEach(() => {
    // NProgress.done();
  });
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    const hasRoutes = computed(() => !isEmpty(authStore.routes));
    if (!hasRoutes.value) {
      try {
        await authStore.findMe();
        const tree = convertToTree(authStore.permissions.menus);
        const dynamicRoutes = buildRoutes(tree);
        const mergeRoutes = defaultRoutes.concat(dynamicRoutes);
        mergeRoutes.forEach((route) => {
          router.addRoute(route);
        });
        // authStore.updateRoutes(mergeRoutes);
      } catch (error) {
        console.error(error);
        authStore.clearTokens();
      }
    } else {
      console.log(toRaw(authStore.routes));
    }
  }
}

async function onAuthenticated(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    if (to.path === '/auth/signin') {
      next({ path: '/' });
    } else {
      const hasRoutes = computed(() => !isEmpty(authStore.routes));
      if (hasRoutes.value) {
        if (!!!to.matched.length) {
          next(from.name ? { name: from.name } : '/:404(.*)');
        }
        // * overwrite title
        else {
          next();
        }
      } else {
        try {
          await authStore.findMe();
          const tree = convertToTree(authStore.permissions.menus);
          const dynamicRoutes = buildRoutes(tree);
          const mergeRoutes = defaultRoutes.concat(dynamicRoutes);
          mergeRoutes.forEach(async (route) => {
            router.addRoute(route);
            // @ts-ignore
            authStore.routes.push(route as unknown as RouteRecordRaw[]);
          });
          // authStore.updateRoutes(mergeRoutes);
          next({ ...to, replace: true });
        } catch (error) {
          // console.log(error);
          authStore.clearTokens();
          authStore.clearRoutes();
          redirectToSignin(to, next);
        }
      }
    }
  }
}

function onUnauthenticated(to: RouteLocationNormalized, next: NavigationGuardNext) {
  if (whiteList.includes(to.path)) {
    next();
  } else {
    redirectToSignin(to, next);
  }
}

function redirectToSignin(to: RouteLocationNormalized, next: NavigationGuardNext) {
  const params = new URLSearchParams(to.query as Record<string, string>);
  const queryString = params.toString();
  const redirect = queryString ? `${to.path}?${queryString}` : to.path;
  next(`/auth/signin?redirect=${encodeURIComponent(redirect)}`);
}

/** 路由对象 */
export interface RouteVO {
  /** 子路由列表 */
  children: RouteVO[];
  /** 组件路径 */
  component?: string;
  /** 路由属性 */
  meta?: Meta;
  /** 路由名称 */
  name?: string;
  /**  */
  // path?: string;
  router: string | null;
  /** 跳转链接 */
  redirect?: string;
  path: string;
  //
  parentId: string | null;
  parent: RouteVO;
}

/** Meta，路由属性 */
export interface Meta {
  /** 【目录】只有一个子路由是否始终显示 */
  alwaysShow?: boolean;
  /** 是否隐藏(true-是 false-否) */
  hidden?: boolean;
  /** ICON */
  icon?: string;
  /** 【菜单】是否开启页面缓存 */
  keepAlive?: boolean;
  /** 路由title */
  title?: string;
}
