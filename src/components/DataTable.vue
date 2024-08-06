<template>
  <VDataTableServer
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="items"
    :items-length="meta.total"
    :loading="loading"
    :search="search"
    @update:options="loadItems"
  >
    <slot />
  </VDataTableServer>
</template>

<script setup lang="ts">
  import { defineEmits, defineProps, ref, watch } from 'vue'
  import { useCrud } from '@/composables'

  const props = defineProps<{
    url: string
    headers: any
  }>()

  const emit = defineEmits([
    'update:items-per-page',
    'update:page',
    'update:search',
  ])

  const itemsPerPage = ref(10)
  const page = ref(1)
  const { items, meta, loading, search, refetch } = useCrud(props.url)
  console.log(items.value)

  const loadItems = async ({ page: pageNum, itemsPerPage: pageSize }: any) => {
    await refetch(pageNum, pageSize)
  }

  watch([page, itemsPerPage, search], async () => {
    await loadItems({ page: page.value, itemsPerPage: itemsPerPage.value })
  })

  function updateSearch (query: string) {
    search.value = query
    loadItems({ page: page.value, itemsPerPage: itemsPerPage.value })
  }

  emit('update:search', updateSearch)
</script>
