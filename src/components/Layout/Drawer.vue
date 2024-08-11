<script setup lang="ts">
import { VResizeDrawer } from '@wdns/vuetify-resize-drawer';
import { useUIStore } from '@/stores';

const uiStore = useUIStore();
</script>

<template>
  <VResizeDrawer
    v-model="uiStore.drawer"
    order="1"
    :style="{
      border: '0'
    }"
  >
    <VList>
      <VListItem title="Foundation Admin">
        <template #prepend>
          <VAvatar image="@/assets/logo.svg" />
        </template>
      </VListItem>
    </VList>
    <VDivider />
    <!-- <template
        v-for="item in items"
        :key="item.name"
      >
        <VListSubheader>{{ item.name }}</VListSubheader>
        <VListItem
          v-for="children in item.children"
          :key="children.path"
          :prepend-icon="children.meta?.icon ?? 'mdi-heart'"
          :title="(children.name as string) || children.path"
          :to="children"
          :value="children"
          exact
        />
      </template> -->
    <Menu />
  </VResizeDrawer>
</template>

<style scoped lang="scss"></style>
