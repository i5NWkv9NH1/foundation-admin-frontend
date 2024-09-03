<script setup lang="ts">
import { apiMenus } from '@/api'
import { Action, Menu, TableMeta } from '@/types'
import MenuChildrenTable from './components/MenuChildrenTable.vue'

const tableMeta = ref<TableMeta>({
  page: 1,
  itemsPerPage: -1,
  itemsLength: 0,
  pagesLength: 0,
  loading: false
})
const items = ref<Menu[]>()
async function loadItems(
  { page, itemsPerPage }: { page: number; itemsPerPage: number } = {
    page: tableMeta.value.page,
    itemsPerPage: tableMeta.value.itemsPerPage
  }
) {
  tableMeta.value.loading = true
  const {
    data: { result }
  } = await apiMenus.getMenus({ page, itemsPerPage })
  items.value = result.items
  tableMeta.value = { ...result.meta, loading: false }
}
const selectedMenus = ref<Menu[]>([])
const selectedActions = ref<Action[]>([])
watch(selectedMenus, () => console.log(selectedMenus.value))
watch(selectedActions, () => console.log(selectedActions.value))

onMounted(async () => {
  await loadItems({ page: 1, itemsPerPage: -1 })
})
</script>

<template>
  <VContainer fluid>
    <VCard>
      <VCardTitle>Menus</VCardTitle>
      <VCardText>
        <MenuChildrenTable
          v-if="items && !!items.length"
          :items="items || []"
          :level="1"
          v-model:selected-items="selectedMenus"
          :itemsLength="items.length || 0"
          :loading="tableMeta.loading"
          :refresh="loadItems"
        />
      </VCardText>
    </VCard>
  </VContainer>
</template>
