<script lang="ts" setup>
import { useAppStore } from './stores';

const appStore = useAppStore();
appStore.clearSnackbars();
</script>

<template>
  <SnackbarQueue />
  <RouterView />
</template>
