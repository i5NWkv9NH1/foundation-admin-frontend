<script lang="ts" setup>
import { useAppStore, useSettingStore } from './stores'

const appStore = useAppStore()
appStore.clearSnackbars()
const settingStore = useSettingStore()
settingStore.updateTheme()
</script>

<template>
  <SnackbarQueue />
  <RouterView />
</template>
