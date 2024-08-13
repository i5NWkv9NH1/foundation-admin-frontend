<script setup lang="ts">
import { useUIStore } from '@/stores';
const uiStore = useUIStore();
</script>

<template>
  <VAppBar
    order="2"
    flat
  >
    <VAppBarNavIcon @click="uiStore.toggleDrawer" />
    <VSpacer />
    <NotificationSheet />
    <UserProfileDropdown />
  </VAppBar>
</template>
