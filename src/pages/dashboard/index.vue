<script setup lang="ts">
defineOptions({
  name: 'Dashboard'
})
</script>

<template>
  <VContainer fluid>
    <VRow>
      <VCol>
        <HeartRate />
      </VCol>
      <VCol>
        <Weather />
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12" lg="8" md="8">
        <ProgressCard />
      </VCol>
      <VCol cols="12" lg="4" md="4">
        <EarningsGoal />
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12" lg="6" md="6">
        <TimelineWithEvent />
      </VCol>
      <VCol cols="12" lg="6" md="6">
        <SelectionTable />
      </VCol>
    </VRow>
  </VContainer>
</template>
