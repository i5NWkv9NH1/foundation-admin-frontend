<script setup lang="tsx">
import { RouteRecordRaw } from 'vue-router';
import { VList, VListItem, VListSubheader } from 'vuetify/components';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

// Function to generate menu items
const router = useRouter();
const items = computed(() => router.options.routes);

// Function to get the title for a route
function getTitle(route: RouteRecordRaw): string {
  const name = route.name as string | undefined;
  const metaName = route.meta?.name as string | undefined;
  const metaTitle = route.meta?.title as string | undefined;

  return name || metaName || metaTitle || 'Title';
}

// Function to create a menu item
function MenuItem({
  route,
  basePath
}: {
  route: RouteRecordRaw;
  basePath: string;
}) {
  const fullPath = `${basePath}/${route.path}`.replace(/\/{2,}/g, '/'); // Remove any double slashes

  return (
    <VListItem
      key={fullPath}
      to={fullPath}
      prependIcon={route.meta?.icon}
      title={getTitle(route)}
      exact
    />
  );
}

// Recursive function to create a list of menus
function Menus({
  items,
  basePath
}: {
  items: RouteRecordRaw[];
  basePath: string;
}) {
  // Filter out routes with redirect
  // Separate items with children and without children
  const withChildren = items.filter(
    (item) => item.children && item.children.length > 0
  );
  const withoutChildren = items.filter(
    (item) => !item.children || item.children.length === 0
  );

  // Special handling for items with only redirects in their children
  const withOnlyRedirects = withChildren.filter((item) =>
    item.children!.every((child) => child.redirect)
  );
  const withChildrenWithContent = withChildren.filter(
    (item) => !item.children!.every((child) => child.redirect)
  );

  // Sort to ensure `/` path is first, then items with children, then items without children
  const sortedItems = [
    ...(items.find((item) => item.path === '')
      ? [items.find((item) => item.path === '')]
      : []),
    ...withChildrenWithContent,
    ...withoutChildren,
    ...withOnlyRedirects
  ];

  return (
    <>
      {sortedItems.map((item) => (
        <>
          {item?.children &&
            item.children.length > 0 &&
            !item.redirect &&
            !withOnlyRedirects.includes(item) && (
              <>
                <VListSubheader key={`subheader-${basePath}/${item.path}`}>
                  {getTitle(item)}
                </VListSubheader>
                <Menus
                  items={item.children}
                  basePath={`${basePath}/${item.path}`}
                />
              </>
            )}
          {(!item?.children || item?.children.length === 0) &&
            !item?.redirect && (
              <MenuItem
                key={`${basePath}/${item?.path}`}
                route={item!}
                basePath={basePath}
              />
            )}
        </>
      ))}
    </>
  );
}
</script>

<template>
  <VList
    nav
    slim
  >
    <Menus
      :items="items"
      basePath=""
    />
  </VList>
</template>
