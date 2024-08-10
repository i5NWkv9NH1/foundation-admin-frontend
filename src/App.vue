<script lang="ts" setup>
import { useAppStore } from './stores/app';

const store = useAppStore();

onMounted(() => {
  store.initialize();
});
</script>

<template>
  <RouterView />
</template>
