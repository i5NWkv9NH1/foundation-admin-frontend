<script setup lang="ts">
import { useAppStore } from '@/stores';
const appStore = useAppStore();
</script>

<template>
  <VAppBar
    order="2"
    flat
  >
    <VAppBarNavIcon @click="appStore.toggleDrawer" />
    <VSpacer />
    <NotificationSheet />
    <UserProfileDropdown />
  </VAppBar>
</template>
