<script setup lang="tsx">
import { usePermissionStore } from '@/stores';
import { VList, VListGroup, VListItem } from 'vuetify/components';

const permissionStore = usePermissionStore()

function MenuItem({ items, subgroup }: { items: any[]; subgroup?: boolean }) {
  return (
    <>
      {items.map((item) => {
        if (!item.children || item.children.length === 0) {
          return (
            <VListItem
              title={item.name as string}
              key={item.name}
              prependIcon={item.meta.icon}
              //* Fix default router and api router field
              to={(item.router && item.parent) ? `${item.parent.router}/${item.path}` : `/${item.path}`}
              exact
            />
          )
        } else {
          return (
            <VListGroup
              key={item.name}
              subgroup={subgroup}
              value={item.name}
              v-slots={{
                activator: ({ props }) => (
                  <VListItem
                    title={item.name as string}
                    prependIcon={item.meta.icon}
                    {...props}
                    value={item.name}
                  />
                ),
                default: () => (
                  <MenuItem
                    items={item.children}
                    subgroup={true}
                  />
                )
              }}
            />
          )
        }
      })}
    </>
  )
}
</script>

<template>
  <VList open-strategy="multiple" nav slim>
    <MenuItem :items="permissionStore.allVisibleRoutes" />
  </VList>
</template>
