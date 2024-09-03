<script setup lang="ts">
import { apiOrganizations } from '@/api'
import { Action, Organization, TableMeta } from '@/types'
import OrganizationChildTable from './components/OrganizationChildTable.vue'

const tableMeta = ref<TableMeta>({
  page: 1,
  itemsPerPage: -1,
  itemsLength: 0,
  pagesLength: 0,
  loading: false
})
const items = ref<Organization[]>()
async function loadItems(
  { page, itemsPerPage }: { page: number; itemsPerPage: number } = {
    page: tableMeta.value.page,
    itemsPerPage: tableMeta.value.itemsPerPage
  }
) {
  tableMeta.value.loading = true
  const {
    data: { result }
  } = await apiOrganizations.getOrganizations({ page, itemsPerPage })
  items.value = result.items
  tableMeta.value = { ...result.meta, loading: false }
}
const selectedOrganizations = ref<Organization[]>([])
const selectedActions = ref<Action[]>([])
watch(selectedOrganizations, () => console.log(selectedOrganizations.value))
watch(selectedActions, () => console.log(selectedActions.value))

onMounted(async () => {
  await loadItems({ page: 1, itemsPerPage: -1 })
})
</script>

<template>
  <VContainer fluid>
    <VCard>
      <VCardTitle>Organizations</VCardTitle>
      <VCardText>
        <OrganizationChildTable
          v-if="items && !!items.length"
          :items="items || []"
          :level="1"
          v-model:selected-items="selectedOrganizations"
          :itemsLength="items.length || 0"
          :loading="tableMeta.loading"
          :refresh="loadItems"
        />
      </VCardText>
    </VCard>
  </VContainer>
</template>
