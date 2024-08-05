<template>
  <VContainer>
    <div class="text-h4">Users</div>
    <StatusHandler :status="status">
      <v-data-table v-if="status === UIStatus.OK" :items="data" />
    </StatusHandler>
  </VContainer>
</template>

<script setup lang="ts">
  import StatusHandler from '@/components/StatusHandler.vue'
  import { useFetchData } from '@/composables'
  import { UIStatus } from '@/types'

  const { data, status } = useFetchData('/users')
</script>
