<script setup lang="ts">
  const colors = ref([
    'primary',
    'secondary',
    'tertiary',
    'error',
    'surface',
    'info',
    'warning',
    'success',
  ])
</script>
<template>
  <VContainer>
    <VBtn v-for="color in colors" :key="color" :color="color">
      <span>{{ color }}</span>
    </VBtn>
  </VContainer>
</template>
