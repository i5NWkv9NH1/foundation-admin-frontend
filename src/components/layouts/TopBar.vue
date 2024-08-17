<script setup lang="ts">
import { useSettingStore } from '@/stores';
const settingStore = useSettingStore();

const items = ref([
  {
    title: 'Dashboard',
    disabled: false,
    href: '/'
  },
  {
    title: 'System',
    disabled: false,
    href: '/system'
  },
  {
    title: 'Roles',
    disabled: true,
    href: '/system/roles'
  }
]);
</script>

<template>
  <VAppBar
    order="2"
    flat
  >
    <VAppBarNavIcon @click="settingStore.toggleDrawer" />
    <v-breadcrumbs :items="items">
      <template v-slot:title="{ item }">
        {{ item.title.toUpperCase() }}
      </template>
    </v-breadcrumbs>
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
