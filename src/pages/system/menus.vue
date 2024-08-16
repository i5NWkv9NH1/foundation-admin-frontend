<template>
  <VContainer>
    <MenuChildrenActions
      v-if="items && items.length >= 0"
      :items="items || []"
      :headers="headers"
      :level="1"
      :selected-items.sync="selectedMenus"
      :itemsLength="tree.length || 0"
      :loading="loading"
      :refresh="loadItems"
    />
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { apiMenus } from '@/api';
import { buildTree, menuFieldMapping } from '@/helpers';
import { Action, Menu, PaginationMeta, TableHeader } from '@/types';

const loading = ref(false);
const headers = ref<TableHeader[]>([
  { title: 'Level', value: 'level', width: '50px' },
  { title: 'Name', value: 'name', sortable: false, key: 'name' },
  { title: 'Router', value: 'router', sortable: false, key: 'router' },
  { title: 'Icon', value: 'icon', sortable: false, key: 'icon' },
  { title: 'Component', value: 'component', sortable: false, key: 'component' },
  { title: 'Parent Name', value: 'parentName' },
  { title: 'Actions', value: 'actions', key: 'actions' }
]);
const tableMeta = ref<PaginationMeta>({
  page: 1,
  itemsCount: 0,
  itemsPerPage: -1,
  pagesCount: 0
});
const items = ref<Menu[]>();
const tree = computed(() => {
  return buildTree(items.value!, menuFieldMapping);
});
watch(tree, () => {
  tableMeta.value.itemsCount = tree.value.length;
});
async function loadItems({ page, itemsPerPage }: { page: number; itemsPerPage: number } = { page: tableMeta.value.page, itemsPerPage: tableMeta.value.itemsPerPage }) {
  loading.value = true;
  const {
    data: { result }
  } = await apiMenus.getMenus({ page, itemsPerPage });
  items.value = buildTree(result.items!, menuFieldMapping);
  tableMeta.value = result.meta;
  loading.value = false;
}
const selectedMenus = ref<Menu[]>([]);
const selectedActions = ref<Action[]>([]);
watch(selectedMenus, () => console.log(selectedMenus.value));
watch(selectedActions, () => console.log(selectedActions.value));

onMounted(async () => {
  await loadItems({ page: 1, itemsPerPage: -1 });
});
</script>
