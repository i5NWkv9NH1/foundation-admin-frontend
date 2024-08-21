<script setup lang="ts">
import { apiMenus } from '@/api'
import { CreateMenuDto, DeleteMode, Menu, TableHeader, TableMeta, TableRowAction } from '@/types'
import MenuCreateEditDialog from './MenCreateEditDialog.vue'
import MenuActionsTable from './MenuActionsTable.vue'

const props = defineProps<{
  items: Menu[]
  level: number
  itemsLength: number
  loading: boolean
  refresh: (options?: any) => Promise<void>
}>()
const headers = ref<TableHeader[]>([
  { title: 'Level', value: 'level', width: '50px' },
  { title: 'Name', value: 'name', sortable: false, key: 'name' },
  { title: 'Router', value: 'router', sortable: false, key: 'router' },
  { title: 'Icon', value: 'icon', sortable: false, key: 'icon' },
  { title: 'Component', value: 'component', sortable: false, key: 'component' },
  { title: 'Parent', value: 'parent.name', sortable: false, key: 'parent.id' },
  { title: 'Actions', value: 'actions', key: 'actions' }
])
// prettier-ignore
const tableRowActions = ref<TableRowAction[]>([
  { title: 'Create Sub Menu', icon: 'mdi-vector-polyline-plus', color: '', cb: (menu: Menu) => onCreateSubMenu(menu.id!) },
  { title: 'Create Menu', icon: 'mdi-vector-square-plus', color: '',  cb: (menu: Menu) => {
    if (!menu.parent) return onCreateRootMenu()
    //* Same level
    return onCreateSubMenu(menu.parent.id!)
  }},
  { title: 'Edit Menu', icon: 'mdi-pencil-outline', color: '', cb: (menu: Menu) => onEditMenu(menu.id!) },
  { title: 'Delete Menu', icon: 'mdi-delete-outline', color: '',  cb: (menu: Menu) => onOpenDeleteConfirmDialog('single', menu)},
]);
const paddingLeftStyle = computed(() => `${props.level * 2}rem`)
const selectedMenus = ref<string[]>([])
const expandedMenus = ref<string[]>([])
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
//     expandedMenus.value = props.items.map((item) => item.id!)
//   },
//   { deep: true, immediate: true }
// )
// watch(selectedMenus, () => {
//   console.log(selectedMenus.value)
// })
// watch(selectedActions, () => {
//   console.log(selectedActions.value)
// })

// Dialog
const defaultMenu: CreateMenuDto = {
  name: '',
  router: '',
  parent: null,
  parentId: null,
  icon: '',
  component: '',
  sort: 1,
  path: '',
  redirect: null
}
const createEditDialog = ref(false)
const currentMenu = ref<CreateMenuDto>({ ...defaultMenu })
// prettier-ignore
const isEditing = ref(false)
const onOpenCreateEditDialog = async (isEditMode: boolean, menuId?: string, isSubMenuCreation: boolean = false) => {
  isEditing.value = isEditMode
  if (isEditMode) {
    if (!menuId) {
      throw new Error('Editing mode requires a menu ID.')
    }
    const {
      data: { result }
    } = await apiMenus.getMenuById(menuId)
    currentMenu.value = result as unknown as CreateMenuDto
  } else {
    // Edit
    if (isSubMenuCreation && menuId) {
      // Create Sub Menu
      currentMenu.value = {
        ...defaultMenu,
        parentId: menuId
      }
    } else {
      // Create Root Menu
      currentMenu.value = { ...defaultMenu, parentId: null }
    }
  }
  createEditDialog.value = true
}

const onCreateRootMenu = () => {
  onOpenCreateEditDialog(false)
}
const onEditMenu = (menuId: string) => {
  onOpenCreateEditDialog(true, menuId)
}
const onCreateSubMenu = (parentMenuId: string) => {
  onOpenCreateEditDialog(false, parentMenuId, true)
}
const onSaveCreateEditDialog = async (form: any) => {
  currentMenu.value = form
  try {
    if (isEditing.value) {
      await apiMenus.updateMenu(currentMenu.value.id!, currentMenu.value)
    } else {
      await apiMenus.createMenu(currentMenu.value)
    }
  } catch (error) {
    console.log(error)
  } finally {
    await props.refresh()
    currentMenu.value = { ...defaultMenu }
    // await fetchctionsByMenuId();
    // await props.refresh();
    // await findActionsByMenuId()
  }
}

/**
 * * DeleteConfirmDialog
 */
const deleteMode = ref<DeleteMode>('single')
const deleteConfirmDialog = ref(false)
const onOpenDeleteConfirmDialog = (mode: DeleteMode, menu?: Menu) => {
  deleteMode.value = mode
  deleteConfirmDialog.value = true
  if (mode === 'single' && menu) {
    currentMenu.value = menu as unknown as CreateMenuDto
  }
}
const onConfirmDelete = async () => {
  try {
    if (deleteMode.value === 'single') {
      await apiMenus.deleteMenu(currentMenu.value.id!)
    } else if (deleteMode.value === 'multiple') {
      // TODO: API
      console.log(selectedMenus.value)
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
    v-model="selectedMenus"
    v-model:page="tableMeta.page"
    v-model:items-per-page="tableMeta.itemsPerPage"
    v-model:expanded="expandedMenus"
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
      <div>No submens.</div>
    </template>
    <template
      v-if="props.level !== 1"
      #top
    >
      <VCardTitle>Sub Menus</VCardTitle>
    </template>

    <template #[`item.router`]="{ item }">
      <VBtn
        variant="text"
        :to="item.parent ? `${item.parent.router}/${item.router}` : `${item.router}`"
        class="text-decoration-underline"
        exact
      >
        {{ item.router }}
      </VBtn>
    </template>
    <template #[`item.level`]>
      <VCode :class="['text-secondary', 'font-weight-bold', 'text-center', 'text-body-2']">
        {{ props.level }}
      </VCode>
    </template>
    <template #[`item.parent`]="{ item }">
      <VCode :class="['text-secondary', 'font-weight-bold', 'text-center', 'text-body-2']">
        {{ item.parent?.name }}
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
        <!-- Render actions if available -->
        <MenuActionsTable
          :item="item"
          :level="props.level + 1"
        />
        <!-- Render children if available -->
        <MenuChildrenTable
          v-model="selectedMenus"
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

  <MenuCreateEditDialog
    v-model="createEditDialog"
    :menu="currentMenu"
    @save="onSaveCreateEditDialog"
    :is-eidting="isEditing"
  />

  <DeleteConfirmDialog
    v-model="deleteConfirmDialog"
    :mode="deleteMode"
    @confirm="onConfirmDelete"
  />
</template>
