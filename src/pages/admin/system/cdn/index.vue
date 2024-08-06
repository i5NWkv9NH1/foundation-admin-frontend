<template>
  <VContainer fluid>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-h4">CDN</div>
      <VBtn color="primary" :to="'/admin/system/cdn/-1'">Add CDN</VBtn>
    </div>
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      item-value="name"
      :items="items"
      :items-length="meta.total"
      :loading="loading"
      :search="search"
      @update:options="loadItems"
    >
      <template #item.name="{ item }: { item: any }">
        <VBtn
          color="primary"
          :text="item.name"
          :to="`/admin/system/cdn/${item.id}`"
          variant="plain"
        />
      </template>
      <template #item.baseUrl="{ item }: { item: any }">
        <span>{{ item.baseUrl }}</span>
      </template>
      <template #item.description="{ item }: { item: any }">
        <span>{{ item.description || 'N/A' }}</span>
      </template>
      <template #item.createdAt="{ item }: { item: any }">
        <span>
          {{ dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
        </span>
      </template>
    </VDataTableServer>
  </VContainer>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import dayjs from 'dayjs'
  import { useCrud } from '@/composables'

  const headers = ref<any>([
    { title: 'Name', key: 'name', align: 'start', sortable: false },
    { title: 'Base URL', key: 'baseUrl', align: 'start', sortable: false },
    { title: 'Description', key: 'description', align: 'start', sortable: false },
    { title: 'Created At', key: 'createdAt', align: 'start', sortable: true },
  ])

  const itemsPerPage = ref(10)
  const page = ref(1)
  const { items, meta, loading, search, refetch } = useCrud('/system/cdn')

  const loadItems = async ({ page: pageNum, itemsPerPage: pageSize }: any) => {
    await refetch(pageNum, pageSize)
  }

  watch([page, itemsPerPage, search], async () => {
    await loadItems({ page: page.value, itemsPerPage: itemsPerPage.value })
  })
</script>
