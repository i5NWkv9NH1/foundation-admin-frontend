<script setup lang="ts">
import { useSettingStore } from '@/stores';
const settingStore = useSettingStore();
</script>

<template>
  <VAppBar
    order="2"
    flat
  >
    <VAppBarNavIcon @click="settingStore.toggleDrawer" />
    <VSpacer />
    <NotificationSheet />
    <UserProfileDropdown />
  </VAppBar>
</template>
