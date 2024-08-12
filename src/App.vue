<script lang="ts" setup>
import { useAppStore, useUIStore } from './stores';

const appStore = useAppStore();
const uiStore = useUIStore();
onMounted(() => {
  appStore.initialize();
});
</script>

<template>
  <ProgressBar
    v-model:model-value="uiStore.showProgress"
    v-model:progress="uiStore.progress"
  />
  <RouterView />
</template>
