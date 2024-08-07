<template>
  <VContainer>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-h4">Accounts</div>
      <VBtn color="primary" :to="'/admin/system/accounts/-1'"> Add User </VBtn>
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
      <template #item.avatarUrl="{ item }: { item: Account }">
        <VAvatar
          :image="item.avatarUrl || getRandomAvatar(item.phone)"
          size="40"
        />
      </template>
      <template #item.createdAt="{ item }: { item: Account }">
        <span>
          {{ dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
        </span>
      </template>
      <template #item.username="{ item }: { item: Account }">
        <VBtn
          color="primary"
          :text="item.username"
          :to="`/admin/system/accounts/${item.id}`"
          variant="plain"
        />
      </template>
      <template #item.actions="{ item }: { item: Account }">
        <div class="d-flex">
          <VBtn
            class="mr-2"
            color="primary"
            icon="mdi-pencil"
            :to="`/admin/system/accounts/${item.id}`"
            variant="text"
          />
          <VBtn
            color="red"
            icon="mdi-delete"
            variant="text"
            @click="remove(item.id)"
          />
        </div>
      </template>
    </VDataTableServer>
  </VContainer>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import dayjs from 'dayjs'
  import { useCrud } from '@/composables/use-crud'
  import { getRandomAvatar } from '@/helpers'
  import { Account } from '@/types/entities'

  const headers = ref<any>([
    { title: 'Avatar', key: 'avatarUrl', align: 'start', sortable: false },
    { title: 'Name', key: 'name', align: 'start', sortable: false },
    { title: 'Username', key: 'username', align: 'start', sortable: false },
    { title: 'Phone', key: 'phone', align: 'start', sortable: false },
    { title: 'Email', key: 'email', align: 'start', sortable: false },
    { title: 'Address', key: 'address', align: 'start', sortable: false },
    { title: 'CreatedAt', key: 'createdAt', align: 'start', sortable: true },
    { title: 'Actions', key: 'actions', align: 'center', sortable: false },
  ])

  const itemsPerPage = ref(10)
  const page = ref(1)
  const { items, meta, loading, search, refetch, remove } =
    useCrud<Account>('/accounts')

  const loadItems = async ({ page, itemsPerPage }: any) => {
    await refetch(page, itemsPerPage)
  }

  watch([page, itemsPerPage, search], async () => {
    await loadItems({ page: page.value, itemsPerPage: itemsPerPage.value })
  })
</script>
