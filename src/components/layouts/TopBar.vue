<script setup lang="ts">
import { useSettingStore } from '@/stores'
const settingStore = useSettingStore()
</script>

<template>
  <VAppBar
    order="2"
    flat
  >
    <VAppBarNavIcon @click="settingStore.toggleDrawer" />
    <BreadCrumb />
    <VSpacer />
    <div class="d-flex ga-2">
      <NotificationSheet />
      <VBtn
        icon="mdi-cog-outline"
        @click="settingStore.toggleSettingsDrawer"
      />
      <UserProfileDropdown />
    </div>
  </VAppBar>
</template>
