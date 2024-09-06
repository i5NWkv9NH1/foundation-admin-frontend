<script setup lang="ts">
import { apiMenus, apiRoles } from '@/api'
import { CreateRoleDto, DeleteMode, FormField, Menu, Role, RoleFilterPayload, TableCallbackOptions, TableHeader, TableMeta, TableRowAction } from '@/types'
import dayjs from 'dayjs'
import RoleActionsDialog from './components/RoleActionsDialog.vue'
import RoleCreateEditDialog from './components/RoleCreateEditDialog.vue'

/**
 * * Table
 */
const headers = ref<TableHeader[]>([
  { title: 'Label', value: 'label', sortable: false, key: 'label' },
  { title: 'Name', value: 'name', sortable: false, key: 'name' },
  { title: 'Status', value: 'status', sortable: false, key: 'status' },
  { title: 'Created At', value: 'createdAt', sortable: false, key: 'createdAt' },
  { title: 'Updated At', value: 'updatedAt', sortable: false, key: 'updatedAt' },
  { title: 'Sort', value: 'sort', sortable: false, key: 'sort' },
  { title: 'Actions', value: 'actions', sortable: false }
])

// * Role table meta
const tableMeta = ref<TableMeta>({
  page: 1,
  itemsPerPage: -1,
  itemsLength: 0,
  pagesLength: 0,
  loading: false
})
const selectedRoles = ref<Role[]>()
const isSelectedRoles = computed(() => selectedRoles.value && !!selectedRoles.value.length)
const tableRowActions = ref<TableRowAction[]>([
  { title: 'Update Actions', icon: 'mdi-shield-lock-outline', cb: (role: Role) => onOpenRoleActionDialog(role), color: '' },
  { title: 'Edit Role', icon: 'mdi-pencil-outline', cb: (role: Role) => onOpenCreateEditDialog(true, role), color: '' },
  { title: 'Delete Actions', icon: 'mdi-delete-outline', cb: (role: Role) => onOpenDeleteConfirmDialog('single', role), color: '' }
])

/**
 * * Filters
 */
const defaultFilters = ref<RoleFilterPayload>({
  text: '',
  status: 'ALL',
  name: undefined
})
const filters = ref<RoleFilterPayload>({ ...defaultFilters.value })
const filterFields = ref<FormField[]>([
  // prettier-ignore
  {
    name: 'status', label: 'Status', type: 'select',
    attrs: {
      'hide-details': true, grid: { cols: 4 }, 'item-title': 'name', 'item-value': 'value', variant: 'outlined',
      items: [
        { name: 'All', value: 'ALL' },
        { name: 'Enable', value: 'Enabled' },
        { name: 'Disable', value: 'Disabled' },
      ]
    }
  },
  { name: 'name', label: 'Name', type: 'select', options: [], attrs: { 'hide-details': true, variant: 'outlined', grid: { cols: 4 }, itemTitle: (item: Role) => item.name, itemValue: (item: Role) => item.name } }
])
const onFilterSubmit = async () => {
  await onFetchRoles()
}
const onFilterReest = async () => {
  filters.value = { ...defaultFilters.value }
  await onFetchRoles()
}
const onFilterCreate = () => {
  onOpenCreateEditDialog(false)
}
const defaultRole: CreateRoleDto = {
  label: '',
  name: '',
  status: 'Enabled',
  sort: 1
}
const currentRole = ref<CreateRoleDto>({ ...defaultRole })
const roles = ref<Role[]>()
const menus = ref<Menu[]>()
/**
 * * API
 */
// prettier-ignore
async function onFetchRoles(options: TableCallbackOptions = {
  page: tableMeta.value.page,
  itemsPerPage: tableMeta.value.itemsPerPage
}) {
  try {
    tableMeta.value.loading = true
    const { page, itemsPerPage } = options
    const { data: { result } } = await apiRoles.getRoles({
      page, itemsPerPage, filters: filters.value
    })
    roles.value = result.items
    tableMeta.value = { ...result.meta, loading: false }
    //* update field options
    filterFields.value.filter((field) => {
      if (field.name === 'name') {
        field.options = roles.value
        return field
      }
    })
  }
  catch (error) {
    console.log(error)
  }
}
// prettier-ignore
async function onFetchRoleById(id: string) {
  try {
    const { data: { result } } = await apiRoles.getRoleById(id)
    currentRole.value = result
  } catch (error) {
    console.log(error)
  }
}
async function onUpdateRole() {
  try {
    await apiRoles.updateRole(currentRole.value.id!, currentRole.value)
  } catch (error) {
    console.log(error)
  }
}
async function onCreateRole() {
  try {
    await apiRoles.createRole(currentRole.value)
  } catch (error) {
    console.log(error)
  }
}
// prettier-ignore
async function onFetchMenus() {
  try {
    const { data: { result } } = await apiMenus.getMenus({ page: 1, itemsPerPage: -1 })
    menus.value = result.items
  } catch (error) {
    console.log(error)
  }
}

/**
 * * CreateEditDialog
 */
const isEditing = ref(false)
const createEditDialog = ref(false)
async function onOpenCreateEditDialog(value: boolean, role?: Role) {
  isEditing.value = value
  if (isEditing.value && role) {
    try {
      await onFetchRoleById(role.id)
    } catch (error) {
      console.log('Open CreateEditDrawer Failed')
    }
  } else {
    // ? reset form
    currentRole.value = { ...defaultRole }
  }
  createEditDialog.value = true
}
async function onSaveCreateEditDialog(role: CreateRoleDto) {
  currentRole.value = role
  try {
    if (isEditing.value) {
      await onUpdateRole()
    } else {
      await onCreateRole()
    }
  } catch {
    console.log('Save CreateEditDialog Failed')
  } finally {
    createEditDialog.value = false
    await onFetchRoles()
  }
}
/**
 * * RoleActionsDialog
 */
const roleActionsDialog = ref(false)
const activatedRole = ref<Role>()
function onOpenRoleActionDialog(role: Role) {
  activatedRole.value = role
  roleActionsDialog.value = true
}
/**
 * * DeleteConfirmDialog
 */
const deleteMode = ref<DeleteMode>('single')
const deleteConfirmDialog = ref(false)
const onOpenDeleteConfirmDialog = (mode: DeleteMode, role?: Role) => {
  deleteMode.value = mode
  deleteConfirmDialog.value = true
  if (mode === 'single') {
    currentRole.value.id = role!.id
  }
}
const onConfirmDelete = async (mode: 'single' | 'multiple') => {
  try {
    if (mode === 'single') {
      await apiRoles.deleteRole(currentRole.value.id!)
    } else if (mode === 'multiple') {
      // TODO: api
      console.log(selectedRoles.value)
    }
  } catch {
    throw new Error(onConfirmDelete.name)
  } finally {
    deleteConfirmDialog.value = false
    await onFetchRoles()
  }
}
/**
 * * Hooks
 */
onMounted(async () => {
  await Promise.all([onFetchMenus()])
})
</script>

<template>
  <VContainer fluid>
    <div class="d-flex flex-column ga-4">
      <!-- * Query Filter -->

      <QueryFilterPanel :form="filters" :fields="filterFields" @submit="onFilterSubmit" @reset="onFilterReest"
        @create="onFilterCreate" />

      <!-- * Table -->
      <VCard>
        <VCardTitle> Roles </VCardTitle>
        <VCardText>
          <VDataTableServer v-model="selectedRoles" v-model:items-per-page="tableMeta.itemsPerPage" show-select
            @update:options="onFetchRoles" :page="tableMeta.page" :loading="tableMeta.loading" :items="roles"
            :items-length="tableMeta.itemsLength" :item-value="(item: Role) => item" :headers="headers">
            <template #top>
              <VCardActions>
                <VBtn color="primary" @click="onOpenCreateEditDialog(false)">
                  <VIcon icon="mdi-plus-thick" start />
                  <span>New Role</span>
                </VBtn>
                <VSlideXTransition>
                  <VBtn v-if="isSelectedRoles" color="error" @click="onOpenDeleteConfirmDialog('multiple')">
                    <VIcon icon="mdi-delete-outline" start />
                    <span>Delete</span>
                  </VBtn>
                </VSlideXTransition>
              </VCardActions>
            </template>

            <template #loading>
              <VSkeletonLoader type="table-row@4" />
            </template>
            <template #[`item.actions`]="{ item }">
              <VCardActions>
                <VTooltip v-for="btn in tableRowActions" :key="btn.title" :text="btn.title" location="top">
                  <template #activator="args">
                    <VBtn v-bind="args.props" :icon="btn.icon" :color="btn.color" @click="btn.cb(item)" />
                  </template>
                </VTooltip>
              </VCardActions>
            </template>
            <template #[`item.createdAt`]="{ item }">
              <span>{{ dayjs(item.createdAt).format('YYYY-MM-DD') }}</span>
            </template>
            <template #[`item.updatedAt`]="{ item }">
              <span>{{ dayjs(item.updatedAt).format('YYYY-MM-DD') }}</span>
            </template>
          </VDataTableServer>
        </VCardText>
      </VCard>
    </div>

    <!-- * CreateEditDialog -->
    <RoleCreateEditDialog v-model="createEditDialog" @save="onSaveCreateEditDialog" :role="currentRole"
      :is-eidting="isEditing" />

    <!-- * RoleActionsDialog -->
    <RoleActionsDialog v-model="roleActionsDialog" :menus="menus!" :activatedRole="activatedRole" />

    <!-- * Dialog -->
    <DeleteConfirmDialog v-model="deleteConfirmDialog" @confirm="onConfirmDelete" :mode="deleteMode" />
  </VContainer>
</template>
