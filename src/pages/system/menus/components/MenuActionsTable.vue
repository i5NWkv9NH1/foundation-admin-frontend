<script setup lang="ts">
import { apiActions } from '@/api/actions';
import { Action, ActionFilterPayload, CreateActionDto, DeleteMode, Menu, TableHeader, TableMeta, TableRowAction } from '@/types';
import ActionCreateEditDialog from './ActionCreateEditDialog.vue';
/**
 * * Table
 */
const headers = ref<TableHeader[]>([
  { title: 'Level', value: 'level' },
  { title: 'Label', value: 'name' },
  { title: 'Code', value: 'code' },
  { title: 'Icon', value: 'icon' },
  { title: 'Actions', value: 'actions' }
])
const tableMeta = ref<TableMeta>({
  page: 1,
  itemsPerPage: -1,
  itemsLength: 0,
  pagesLength: 0,
  loading: false
})
const tableRowActions = ref<TableRowAction[]>([
  { title: 'Edit Action', icon: 'mdi-pencil-outline', color: 'warning', cb: (action: Action) => onOpenCreateEditDialog(true, action) },
  { title: 'Delete Action', icon: 'mdi-delete-outline', color: 'error', cb: (action: Action) => onOpenDeleteConfirmDialog('single', action) }
])

interface Props {
  item: Menu
  level: number
}
const props = defineProps<Props>()

const actions = ref<Action[]>()
const selectedActions = ref<string[]>([])
const filters = ref<ActionFilterPayload>({
  menuId: props.item.id || ''
})
async function onFetchActionsByMenuId() {
  tableMeta.value.loading = true
  try {
    const {
      data: {
        result: { items, meta }
      }
    } = await apiActions.getActions({
      page: 1,
      itemsPerPage: -1,
      filters: filters.value
    })
    actions.value = items
    tableMeta.value = { ...meta, loading: false }
  } catch (error) {
    console.log(error)
  } finally {
    selectedActions.value = []
  }
}
const defaultAction: CreateActionDto = {
  name: '',
  code: 'view:',
  status: 'Enabled',
  icon: '',
  sort: 1,
  menuId: props.item.id
}
const currentAction = ref<CreateActionDto>({ ...defaultAction })
/**
 * * ActionCreateEditDialog
 */
const createEditDialog = ref(false)
const isEditing = ref<boolean>(false)
const onOpenCreateEditDialog = async (value: boolean, action?: Action) => {
  isEditing.value = value
  if (isEditing.value && action) {
    // prettier-ignore
    // const { data: { result }} = await apiActions.getActionById(action.id!)
    const { data: { result } } = await apiActions.getActionById(action.id!)
    currentAction.value = result as CreateActionDto
  } else {
    currentAction.value = { ...defaultAction }
  }
  createEditDialog.value = true
}
const onSaveCreateEditDialog = async (form: CreateActionDto) => {
  currentAction.value = form
  try {
    if (isEditing.value) {
      await apiActions.updateAction(currentAction.value.id!, currentAction.value)
    } else {
      await apiActions.createAction(currentAction.value)
    }
  } catch (error) {
    console.log(error)
  } finally {
    currentAction.value = { ...defaultAction }
    await onFetchActionsByMenuId()
  }
}
/**
 * * DeleteConfirmDialog
 */
const deleteMode = ref<DeleteMode>('single')
const deleteConfirmDialog = ref(false)
const onOpenDeleteConfirmDialog = (mode: DeleteMode, action?: Action) => {
  deleteMode.value = mode
  deleteConfirmDialog.value = true
  if (mode === 'single' && action) {
    currentAction.value = action as CreateActionDto
  }
}
const onConfirmDelete = async (mode: DeleteMode) => {
  try {
    deleteMode.value = mode
    if (deleteMode.value === 'single') {
      await apiActions.deleteAction(currentAction.value.id!)
    } else if (deleteMode.value === 'multiple') {
      // TODO: API
    }
  } catch (error) {
    console.log(error)
  } finally {
    deleteConfirmDialog.value = false
    await onFetchActionsByMenuId()
  }
}
</script>

<template>
  <VDataTableServer v-model="selectedActions" v-model:page="tableMeta.page"
    v-model:items-per-page="tableMeta.itemsPerPage" v-bind="$attrs" hide-default-footer
    @update:options="onFetchActionsByMenuId" :loading="tableMeta.loading" :items="actions"
    :items-length="tableMeta.itemsLength" :headers="headers">
    <template #loading>
      <VSkeletonLoader type="table-row@4" />
    </template>
    <template #no-data>
      <div>You don't have actions on this menu</div>
    </template>
    <template #top>
      <VCardActions>
        <VBtn color="primary" @click="onOpenCreateEditDialog(false)">
          <VIcon start icon="mdi-content-save-outline" />
          <span>Create Action</span>
        </VBtn>
        <VBtn :disabled="!!!selectedActions.length" color="error" @click="onOpenDeleteConfirmDialog('multiple')">
          <VIcon start icon="mdi-delete-outline" />
          <span>Delete</span>
        </VBtn>
      </VCardActions>
    </template>
    <template #[`item.level`]>
      <VIcon :icon="`mdi-numeric-${props.level}`" size="32" />
    </template>
    <template #[`item.code`]="{ item }">
      <VCode :class="[`bg-secondary`, `font-weight-bold`, `text-body-2`]">
        {{ item.code }}
      </VCode>
    </template>
    <template #[`item.icon`]="{ item }">
      <VIcon :icon="item.icon" />
    </template>
    <template #[`item.actions`]="{ item }">
      <VCardActions>
        <VTooltip v-for="btn in tableRowActions" :key="btn.title" :text="btn.title" location="top">
          <template #activator="args">
            <VBtn @click="btn.cb(item)" :icon="btn.icon" :color="btn.color" v-bind="args.props" />
          </template>
        </VTooltip>
      </VCardActions>
    </template>
  </VDataTableServer>

  <ActionCreateEditDialog v-model="createEditDialog" @save="onSaveCreateEditDialog" :is-eidting="isEditing"
    :action="currentAction" />

  <DeleteConfirmDialog v-model="deleteConfirmDialog" @confirm="onConfirmDelete" :mode="deleteMode" />
</template>
