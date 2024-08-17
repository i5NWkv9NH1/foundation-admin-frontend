<script setup lang="ts">
import { apiActions } from '@/api/actions';
import { highlights } from '@/helpers';
import { Action, ActionFilterPayload, FormField, Menu, PaginationMeta, TableHeader } from '@/types';

interface Props {
  item: Menu;
  level: number;
}
const headers = ref<TableHeader[]>([
  { title: 'Level', value: 'level', width: '50px' },
  { title: 'Label', value: 'name' },
  { title: 'Code', value: 'code' },
  { title: 'Icon', value: 'icon' },
  { title: 'Menu', value: 'parentName' },
  { title: 'Actions', value: 'actions' }
]);
const tableMeta = ref<PaginationMeta>({
  page: 1,
  itemsCount: 0,
  itemsPerPage: -1,
  pagesCount: 0
});
const loading = ref(false);
const props = defineProps<Props>();
const actions = ref<Action[]>();
const selectedActions = ref<Action[]>([]);
const filters = ref<ActionFilterPayload>({
  menuId: props.item.id || ''
});
async function fetchctionsByMenuId(
  { page, itemsPerPage } = {
    page: tableMeta.value.page,
    itemsPerPage: tableMeta.value.itemsPerPage
  }
) {
  loading.value = true;
  try {
    const response = await apiActions.getActions({ page: 1, itemsPerPage: -1, filters: filters.value });
    actions.value = response.data.result.items;
    tableMeta.value = response.data.result.meta;
  } catch (error) {
  } finally {
    loading.value = false;
    // * reset selected items after update
    selectedActions.value = [];
  }
}
// Dialog
const defaultAction = ref<Partial<Action>>({
  name: '',
  code: 'view:',
  icon: '',
  menuId: props.item.id,
  menu: props.item,
  sort: 1
});
// @ts-ignore
const currentAction = ref<Action>({ ...defaultAction.value } as Action);
const deleteMode = ref<'single' | 'multiple'>('single');
const deleteConfirmDialog = ref(false);
const onOpenDeleteConfirmDialog = (mode: 'single' | 'multiple', item?: Action) => {
  deleteMode.value = mode;
  deleteConfirmDialog.value = true;
  if (mode === 'single') {
    currentAction.value = item!;
  }
};
// TODO: API
const onConfirmDelete = async (mode: 'single' | 'multiple') => {
  try {
    deleteMode.value = mode;
    if (deleteMode.value === 'single') {
      await apiActions.deleteAction(currentAction.value.id!);
    } else if (deleteMode.value === 'multiple') {
      // TODO: 多选删除
    }
  } catch {
    throw new Error(onConfirmDelete.name);
  } finally {
    deleteConfirmDialog.value = false;
    //* refresh
    await fetchctionsByMenuId();
    //
    // await props.refresh();
  }
};
const fields = computed<FormField[]>(() => {
  return [
    { name: 'name', label: 'Name', type: 'text', grid: { cols: 6 } },
    { name: 'code', label: 'code', type: 'text', grid: { cols: 6 } },
    { name: 'menuId', label: 'Menu Id', type: 'text', readonly: true },
    { name: 'icon', label: 'Icon', type: 'text', attrs: {} },
    { name: 'sort', label: 'Sort', type: 'number', attrs: { grid: { cols: 6 }, max: 100, min: 0 }, controlVariant: 'split', inset: true }
  ];
});
const createEditDialog = ref(false);
const isEditing = ref<boolean>(false);
const onOpenCreateEditDialog = async (value: boolean, action?: Action) => {
  isEditing.value = value;
  if (isEditing && action) {
    // prettier-ignore
    // const { data: { result }} = await apiActions.getActionById(action.id!)
    const response = await apiActions.getActionById(action.id!)
    currentAction.value = response.data.result;
  } else {
    currentAction.value = { ...defaultAction.value } as Action;
  }
  createEditDialog.value = true;
};
const onSaveCreateEditDialog = async () => {
  // @ts-ignore
  delete currentAction.value.menu;
  try {
    if (isEditing.value) {
      await apiActions.updateAction(currentAction.value.id!, currentAction.value);
    } else {
      await apiActions.createAction(currentAction.value);
    }
  } catch (error) {
  } finally {
    currentAction.value = { ...defaultAction.value } as Action;
    await fetchctionsByMenuId();
    // await props.refresh();
    // await findActionsByMenuId()
  }
};

// prettier-ignore
const tableRowActions = ref([
  { title: '编辑', icon: 'mdi-pencil-outline', color: 'warning', action: (item: Action) => onOpenCreateEditDialog(true, item)},
  { title: '删除', icon: 'mdi-delete-outline', color: 'error',  action: (item: Action) => onOpenDeleteConfirmDialog('single', item) },
]);
</script>

<template>
  <VDataTableServer
    v-model="selectedActions"
    v-model:page="tableMeta.page"
    v-model:items-per-page="tableMeta.itemsPerPage"
    v-bind="$attrs"
    return-object
    hide-default-footer
    @update:options="fetchctionsByMenuId"
    :items="actions"
    :items-length="tableMeta.pagesCount"
    :headers="headers"
    :loading="loading"
  >
    <template #loading>
      <VSkeletonLoader type="table-row@4" />
    </template>
    <template #top>
      <VCardActions>
        <VBtn
          color="primary"
          @click="onOpenCreateEditDialog(false)"
        >
          <VIcon
            start
            icon="mdi-content-save-outline"
          />
          <span>Create Action</span>
        </VBtn>
        <VBtn
          :disabled="!!!selectedActions.length"
          color="error"
          @click="onOpenDeleteConfirmDialog('multiple')"
        >
          <VIcon
            start
            icon="mdi-delete-outline"
          />
          <span>Delete</span>
        </VBtn>
      </VCardActions>
    </template>
    <template #item.level="{ item }">
      <VCode :class="['text-secondary', 'font-weight-bold', 'text-center', 'text-body-2', 'git-tree', `git-tree-level-${props.level}`]">
        {{ props.level }}
      </VCode>
    </template>
    <template #item.code="{ item }">
      <!-- <VCode :class="[`bg-${highlights.action(item.code)}`, `font-weight-bold`, `text-body-2`]">
        {{ item.code }}
      </VCode> -->
      <VCode :class="[`bg-secondary`, `font-weight-bold`, `text-body-2`]">
        {{ item.code }}
      </VCode>
    </template>
    <template #item.icon="{ item }">
      <VIcon :icon="item.icon" />
    </template>
    <template #item.parentName="{ item }">
      <span class="text-primary font-weight-bold">
        {{ item.menu ? item.menu.name : 'Null' }}
      </span>
    </template>
    <template #item.actions="{ item }">
      <VCardActions>
        <VTooltip
          v-for="btn in tableRowActions"
          :key="btn.title"
          location="top"
        >
          <template #activator="args">
            <VBtn
              @click="btn.action(item)"
              :icon="btn.icon"
              :color="btn.color"
              v-bind="args.props"
            />
          </template>
          <span> {{ btn.title }}: </span>
          <span>{{ item.menu.name }}:权限 </span>
        </VTooltip>
      </VCardActions>
    </template>
  </VDataTableServer>

  <DeleteConfirmDialog
    v-model="deleteConfirmDialog"
    @confirm="onConfirmDelete"
    :mode="deleteMode"
  />

  <!-- OpenEditDialog -->
  <CreateEditDialog
    v-model="createEditDialog"
    :form="currentAction"
    :fields="fields"
    @save="onSaveCreateEditDialog"
    :is-eidting="isEditing"
  />
</template>
