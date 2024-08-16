<template>
  <VSnackbarQueue v-model="appStore.snackbars" />
</template>

<script setup>
import { useAppStore } from '@/stores';

const appStore = useAppStore();
</script>
