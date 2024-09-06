<script lang="ts" setup>
import { useSettingStore } from './stores';

const settingStore = useSettingStore()
settingStore.updateTheme()
</script>

<template>
  <RouterView />
</template>
