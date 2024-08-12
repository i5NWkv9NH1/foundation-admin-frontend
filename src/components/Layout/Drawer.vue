<script setup lang="ts">
import { VResizeDrawer } from '@wdns/vuetify-resize-drawer';
import { useUIStore } from '@/stores';

const uiStore = useUIStore();
</script>

<template>
  <VResizeDrawer
    v-model="uiStore.drawer"
    order="1"
  >
    <VList>
      <VListItem title="Foundation Admin">
        <template #prepend>
          <VAvatar image="@/assets/logo.svg" />
        </template>
      </VListItem>
    </VList>
    <VDivider />
    <Menu />
  </VResizeDrawer>
</template>

<style scoped lang="scss"></style>
