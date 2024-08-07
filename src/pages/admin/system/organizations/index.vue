<template>
  <VContainer fluid>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-h4">Organizations</div>
      <VBtn color="primary" :to="'/admin/system/organizations/-1'">
        Add Organization
      </VBtn>
    </div>
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      item-value="label"
      :items="items"
      :items-length="meta.itemsCount"
      :loading="loading"
      :search="search"
      @update:options="loadItems"
    >
      <template #item.label="{ item }: { item: any }">
        <VBtn
          color="primary"
          :text="item.label"
          :to="`/admin/system/menus/${item.id}`"
          variant="plain"
        />
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
    { title: 'Label', key: 'label', align: 'start', sortable: false },
    { title: 'Type', key: 'type', align: 'start', sortable: false },
    { title: 'Icon', key: 'icon', align: 'start', sortable: false },
    { title: 'Path', key: 'path', align: 'start', sortable: false },
    { title: 'ParentId', key: 'parentId', align: 'start', sortable: true },
  ])

  const itemsPerPage = ref(10)
  const page = ref(1)
  const { items, meta, loading, search, refetch } = useCrud('/organizations')

  const loadItems = async ({ page: pageNum, itemsPerPage: pageSize }: any) => {
    await refetch(pageNum, pageSize)
  }

  watch([page, itemsPerPage, search], async () => {
    await loadItems({ page: page.value, itemsPerPage: itemsPerPage.value })
  })
</script>
