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

<style scoped lang="scss"></style>
