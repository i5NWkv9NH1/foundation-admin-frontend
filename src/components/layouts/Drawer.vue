<script setup lang="ts">
import { VResizeDrawer } from '@wdns/vuetify-resize-drawer';
import { useAppStore } from '@/stores';

const appStore = useAppStore();
</script>

<template>
  <VResizeDrawer
    v-model="appStore.drawer"
    order="1"
    class="drawer"
  >
    <template #prepend>
      <VToolbar
        color="transparent"
        class="px-4"
      >
        <div class="logo">
          <VAvatar image="@/assets/logo.svg" />
        </div>
        <VToolbarTitle> Foundation </VToolbarTitle>
      </VToolbar>
    </template>
    <VDivider />
    <Menu />
  </VResizeDrawer>
</template>

<!-- <style lang="scss">
.drawer {
  background: var(--v-theme-surface);
}
</style> -->
