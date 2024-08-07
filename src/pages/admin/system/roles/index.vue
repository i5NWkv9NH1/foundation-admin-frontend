<template>
  <VContainer fluid>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-h4">Roles</div>
      <VBtn color="primary" :to="'/admin/system/roles/-1'"> Add Role </VBtn>
    </div>
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      item-value="name"
      :items="items"
      :items-length="meta.itemsCount"
      :loading="loading"
      :search="search"
      @update:options="loadItems"
    >
      <template #item.createdAt="{ item }: { item: any }">
        <span>
          {{ dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
        </span>
      </template>
      <template #item.name="{ item }: { item: any }">
        <VBtn
          color="primary"
          :text="item.name"
          :to="`/admin/system/roles/${item.id}`"
          variant="plain"
        />
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
    { title: 'CreatedAt', key: 'createdAt', align: 'start', sortable: true },
  ])

  const itemsPerPage = ref(10)
  const page = ref(1)
  const { items, meta, loading, search, refetch } = useCrud('/roles')

  const loadItems = async ({ page: pageNum, itemsPerPage: pageSize }: any) => {
    await refetch(pageNum, pageSize)
  }

  watch([page, itemsPerPage, search], async () => {
    await loadItems({ page: page.value, itemsPerPage: itemsPerPage.value })
  })
</script>
