<script lang="ts" setup>
import { useAppStore } from './stores';

const appStore = useAppStore();
onMounted(() => {
  appStore.initialize();
});
</script>

<template>
  <ProgressBar
    v-model:model-value="appStore.showProgress"
    v-model:progress="appStore.progress"
  />
  <SnackbarQueue />
  <RouterView />
</template>
