<script setup lang="ts">
  import { useAppStore } from '@/stores/app'

  const appStore = useAppStore()
</script>

<template>
  <VAppBar order="2">
    <!-- <VAppBarNavIcon
      :icon="
        appStore.drawer ? 'mdi-arrow-expand-left' : 'mdi-arrow-expand-right'
      "
      @click="appStore.toggleDrawer"
    /> -->
    <VAppBarNavIcon @click="appStore.toggleDrawer" />
    <!-- <VAppBarTitle> Foundation Admin </VAppBarTitle> -->
    <VSpacer />
    <ThemeSwitch />
    <VBtn to="/">Home</VBtn>
  </VAppBar>
</template>
