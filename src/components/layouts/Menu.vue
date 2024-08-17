<!-- TODO -->
<script setup lang="tsx">
import { RouteRecordRaw } from 'vue-router';
import { VList, VListItem, VListSubheader } from 'vuetify/components';
import { useAuthStore } from '@/stores';
import { convertToTree } from '@/helpers';

const authStore = useAuthStore();
// const items = authStore.drawerMenus as unknown as RouteRecordRaw[];
// const items = convertToTree(authStore.permissions.menus);
const items = authStore.routes;

// Function to get the title for a route
function getTitle(route: RouteRecordRaw): string {
  // @ts-ignore
  return route.name || route.meta?.name || route.meta?.title || 'Title';
}

// Function to create a menu item
function MenuItem({ route, parentRouter }: { route: RouteRecordRaw; parentRouter: string }) {
  // @ts-ignore
  const fullPath = `${parentRouter}/${route.router || route.path}`.replace(/\/{2,}/g, '/'); // Remove any double slashes

  return (
    <VListItem
      key={fullPath}
      to={fullPath}
      prependIcon={route.icon}
      title={getTitle(route)}
      exact
    />
  );
}

// Recursive function to create a list of menus
function Menus({ items, parentRouter }: { items: RouteRecordRaw[]; parentRouter: string }) {
  return (
    <>
      {items.map((item) => (
        <>
          {item.children && item.children.length > 0 ? (
            <>
              {/* @ts-ignore */}
              <VListSubheader key={`subheader-${parentRouter}/${item.router || item.path}`}>{getTitle(item)}</VListSubheader>
              <Menus
                items={item.children}
                // @ts-ignore
                parentRouter={`${parentRouter}/${item.router || item.path}`}
              />
            </>
          ) : (
            <MenuItem
              // @ts-ignore
              key={`${parentRouter}/${item.router || item.path}`}
              route={item}
              parentRouter={parentRouter}
            />
          )}
        </>
      ))}
    </>
  );
}
</script>

<template>
  <VList nav>
    <Menus
      :items="items"
      parentRouter=""
    />
  </VList>
</template>
