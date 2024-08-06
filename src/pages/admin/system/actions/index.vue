<template>
  <VContainer fluid>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-h4">Actions</div>
      <VBtn color="primary" :to="'/admin/system/actions/-1'">Add Action</VBtn>
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
          :to="`/admin/system/actions/${item.id}`"
          variant="plain"
        />
      </template>
      <template #item.menu="{ item }: { item: any }">
        <span>{{ item.menu?.label || 'N/A' }}</span>
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
    { title: 'Code', key: 'code', align: 'start', sortable: false },
    { title: 'Icon', key: 'icon', align: 'start', sortable: false },
    { title: 'Menu', key: 'menu', align: 'start', sortable: false },
    { title: 'Created At', key: 'createdAt', align: 'start', sortable: true },
  ])

  const itemsPerPage = ref(10)
  const page = ref(1)
  const { items, meta, loading, search, refetch } = useCrud('/system/actions')

  const loadItems = async ({ page: pageNum, itemsPerPage: pageSize }: any) => {
    await refetch(pageNum, pageSize)
  }

  watch([page, itemsPerPage, search], async () => {
    await loadItems({ page: page.value, itemsPerPage: itemsPerPage.value })
  })
</script>
