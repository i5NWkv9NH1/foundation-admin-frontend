<script setup lang="ts">
import { useSettingStore } from '@/stores'

const settingStore = useSettingStore()
</script>

<template>
  <VNavigationDrawer
    v-model="settingStore.drawer"
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
  </VNavigationDrawer>
</template>
