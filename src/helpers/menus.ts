import { RouteRecordRaw } from 'vue-router';

export function generateAdminMenu(
  routes: readonly RouteRecordRaw[]
): RouteRecordRaw[] {
  const findAdminRoutes = (
    routes: readonly RouteRecordRaw[]
  ): RouteRecordRaw[] => {
    for (const route of routes) {
      if (route.path === '/admin') {
        return route.children || [];
      }
    }
    return [];
  };

  const traverseRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
    const menu: RouteRecordRaw[] = [];
    for (const route of routes) {
      if (route.children) {
        menu.push({
          ...route,
          children: traverseRoutes(route.children)
        });
      } else {
        menu.push({
          ...route
        });
      }
    }
    return menu;
  };

  const adminRoutes = findAdminRoutes(routes);
  return traverseRoutes(adminRoutes);
}

export function generateMenu(
  routes: readonly RouteRecordRaw[]
): readonly RouteRecordRaw[] {
  const traverseRoutes = (routes: readonly RouteRecordRaw[]): any => {
    return routes.map((route) => {
      const { children } = route;
      if (children) {
        return {
          ...routes,
          type: 'catalog',
          children: traverseRoutes(children as readonly RouteRecordRaw[])
        };
      } else {
        return {
          ...routes,
          type: 'menu'
        };
      }
    });
  };

  return traverseRoutes(routes);
}
