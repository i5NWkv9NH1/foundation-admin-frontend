<script setup lang="ts">
import { useUIStore } from '@/stores';
const uiStore = useUIStore();
</script>

<template>
  <VAppBar order="2">
    <VAppBarNavIcon @click="uiStore.toggleDrawer" />
    <VSpacer />
    <ThemeSwitch />
    <UserProfileMenu />
  </VAppBar>
</template>
