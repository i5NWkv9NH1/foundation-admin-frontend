<script setup lang="ts">
import { apiOrganizations } from '@/api'
import { CreateOrganizationDto, DeleteMode, Organization, TableHeader, TableMeta, TableRowAction } from '@/types'
import OrganizationCreateEditDialog from './OrganizationCreateEditDialog.vue'

const props = defineProps<{
  items: Organization[]
  level: number
  itemsLength: number
  loading: boolean
  refresh: (options?: any) => Promise<void>
}>()
const headers = ref<TableHeader[]>([
  { title: 'Level', value: 'level', width: '50px' },
  { title: 'Label', value: 'label', sortable: false, key: 'label' },
  { title: 'Name', value: 'name', sortable: false, key: 'name' },
  { title: 'Icon', value: 'icon', sortable: false, key: 'icon' },
  { title: 'Parent', value: 'parent.label', sortable: false, key: 'parent.id' },
  { title: 'Actions', value: 'actions', key: 'actions', sortable: false }
])
// prettier-ignore
const tableRowActions = ref<TableRowAction[]>([
  { title: 'Create Sub Organization', icon: 'mdi-vector-polyline-plus', color: '', cb: (organization: Organization) => onCreateSubOrganization(organization.id!) },
  { title: 'Create Organization', icon: 'mdi-vector-square-plus', color: '',  cb: (organization: Organization) => {
    if (!organization.parent) return onCreateRootOrganization()
    //* Same level
    return onCreateSubOrganization(organization.parent.id!)
  }},
  { title: 'Edit Organization', icon: 'mdi-pencil-outline', color: '', cb: (organization: Organization) => onEditOrganization(organization.id!) },
  { title: 'Delete Organization', icon: 'mdi-delete-outline', color: '',  cb: (organization: Organization) => onOpenDeleteConfirmDialog('single', organization)},
]);
const paddingLeftStyle = computed(() => `${props.level * 2}rem`)
const selectedOrganizations = ref<string[]>([])
const expandedOrganizations = ref<string[]>([])
// const selectedActions = ref<string[]>([])
const tableMeta = ref<TableMeta>({
  page: 1,
  itemsPerPage: -1,
  itemsLength: 0,
  pagesLength: 0,
  loading: false
})
/**
 * ? Expanded All
 */
// watch(
//   () => props.items,
//   () => {
//     expandedOrganizations.value = props.items.map((item) => item.id!)
//   },
//   { deep: true, immediate: true }
// )
// watch(selectedOrganizations, () => {
//   console.log(selectedOrganizations.value)
// })
// watch(selectedActions, () => {
//   console.log(selectedActions.value)
// })

// Dialog
const defaultOrganization: CreateOrganizationDto = {
  label: '',
  name: '',
  parent: null,
  parentId: null,
  icon: '',
  sort: 1,
  path: '',
  status: 'Enabled'
}
const createEditDialog = ref(false)
const currentOrganization = ref<CreateOrganizationDto>({ ...defaultOrganization })
// prettier-ignore
const isEditing = ref(false)
const onOpenCreateEditDialog = async (isEditMode: boolean, organizationId?: string, isSubOrganizationCreation: boolean = false) => {
  isEditing.value = isEditMode
  if (isEditMode) {
    if (!organizationId) {
      throw new Error('Editing mode requires a organization ID.')
    }
    const {
      data: { result }
    } = await apiOrganizations.getOrganizationById(organizationId)
    currentOrganization.value = result as unknown as CreateOrganizationDto
  } else {
    // Edit
    if (isSubOrganizationCreation && organizationId) {
      // Create Sub Organization
      currentOrganization.value = {
        ...defaultOrganization,
        parentId: organizationId
      }
    } else {
      // Create Root Organization
      currentOrganization.value = { ...defaultOrganization, parentId: null }
    }
  }
  createEditDialog.value = true
}

const onCreateRootOrganization = () => {
  onOpenCreateEditDialog(false)
}
const onEditOrganization = (organizationId: string) => {
  onOpenCreateEditDialog(true, organizationId)
}
const onCreateSubOrganization = (parentOrganizationId: string) => {
  onOpenCreateEditDialog(false, parentOrganizationId, true)
}
const onSaveCreateEditDialog = async (form: any) => {
  currentOrganization.value = form
  try {
    if (isEditing.value) {
      await apiOrganizations.updateOrganization(currentOrganization.value.id!, currentOrganization.value)
    } else {
      await apiOrganizations.createOrganization(currentOrganization.value)
    }
  } catch (error) {
    console.log(error)
  } finally {
    await props.refresh()
    currentOrganization.value = { ...defaultOrganization }
    // await fetchctionsByOrganizationId();
    // await props.refresh();
    // await findActionsByOrganizationId()
  }
}

/**
 * * DeleteConfirmDialog
 */
const deleteMode = ref<DeleteMode>('single')
const deleteConfirmDialog = ref(false)
const onOpenDeleteConfirmDialog = (mode: DeleteMode, organization?: Organization) => {
  deleteMode.value = mode
  deleteConfirmDialog.value = true
  if (mode === 'single' && organization) {
    currentOrganization.value = organization as unknown as CreateOrganizationDto
  }
}
const onConfirmDelete = async () => {
  try {
    if (deleteMode.value === 'single') {
      await apiOrganizations.deleteOrganization(currentOrganization.value.id!)
    } else if (deleteMode.value === 'multiple') {
      // TODO: API
      console.log(selectedOrganizations.value)
    }
  } catch (error) {
    console.log(error)
  } finally {
    deleteConfirmDialog.value = false
    await props.refresh()
  }
}
</script>

<template>
  <VDataTableServer
    v-model="selectedOrganizations"
    v-model:page="tableMeta.page"
    v-model:items-per-page="tableMeta.itemsPerPage"
    v-model:expanded="expandedOrganizations"
    v-bind="$attrs"
    hide-default-footer
    expand-on-click
    :loading="props.loading"
    :items="props.items"
    :items-per-page-text="`level: ${props.level} : ${items[0]?.parent?.name || 'Null'} `"
    :items-length="props.items.length"
    :headers="headers"
  >
    <template #loading>
      <VSkeletonLoader type="table-row@4" />
    </template>
    <template #no-data>
      <div>No suborganizations.</div>
    </template>
    <template
      v-if="props.level !== 1"
      #top
    >
      <VCardTitle>Sub Organizations</VCardTitle>
    </template>

    <template #[`item.level`]>
      <VCode :class="['text-secondary', 'font-weight-bold', 'text-center', 'text-body-2']">
        {{ props.level }}
      </VCode>
    </template>

    <template #[`item.icon`]="{ item }">
      <VIcon :icon="item.icon" />
    </template>
    <template #[`item.actions`]="{ item }">
      <VCardActions>
        <VTooltip
          v-for="btn in tableRowActions"
          :key="btn.title"
          location="top"
        >
          <template #activator="args">
            <VBtn
              @click.stop="btn.cb(item)"
              :icon="btn.icon"
              :color="btn.color"
              v-bind="args.props"
            />
          </template>
          <span> {{ btn.title }}</span>
        </VTooltip>
      </VCardActions>
    </template>
    <template #expanded-row="{ item, columns }">
      <td
        :colspan="columns.length"
        :style="{ paddingLeft: paddingLeftStyle }"
      >
        <!-- Render children if available -->
        <OrganizationChildTable
          v-model="selectedOrganizations"
          :loading="tableMeta.loading"
          :level="props.level + 1"
          :items="item.children"
          :items-length="item.children.length"
          :headers="headers"
          :refresh="props.refresh"
        />
      </td>
    </template>
  </VDataTableServer>

  <OrganizationCreateEditDialog
    v-model="createEditDialog"
    :organization="currentOrganization"
    @save="onSaveCreateEditDialog"
    :is-eidting="isEditing"
  />

  <DeleteConfirmDialog
    v-model="deleteConfirmDialog"
    :mode="deleteMode"
    @confirm="onConfirmDelete"
  />
</template>
