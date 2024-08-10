<script setup lang="ts">
  interface Props {
    title?: string
    width?: number | string
  }
  const props = withDefaults(defineProps<Props>(), {
    title: 'Title',
    width: '400px',
  })
</script>

<template>
  <VCard :max-width="props.width">
    <VCardTitle>{{ props.title }}</VCardTitle>
    <VCardText>
      <slot name="default" />
    </VCardText>
  </VCard>
</template>
