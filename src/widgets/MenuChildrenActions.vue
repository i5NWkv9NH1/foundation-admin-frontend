<script setup lang="ts">
import { defineProps, computed, ref } from 'vue';
import { FormField, Menu, PaginationMeta, TableHeader } from '@/types';
import { apiMenus } from '@/api';

const props = defineProps<{
  items: Menu[];
  headers: TableHeader[];
  level: number;
  itemsLength: number;
  loading: boolean;
  refresh: (options?: any) => Promise<void>;
}>();
// prettier-ignore
const tableRowActions = ref([
  { title: '新增子菜单', icon: 'mdi-vector-polyline-plus', color: 'primary', action: (item: Menu) => onCreateSubMenu(item.id!) },
  { title: '新增同级菜单', icon: 'mdi-vector-square-plus', color: 'primary',  action: (item: Menu) => {
    if (!item.parent) return onCreateRootMenu()
    return onCreateSubMenu(item.parent.id!)
  }},
  { title: '编辑菜单', icon: 'mdi-pencil-outline', color: 'warning', action: (item: Menu) => onEditMenu(item.id!) },
  { title: '删除', icon: 'mdi-delete-outline', color: 'error',  action: (item: Menu) => onOpenDeleteConfirmDialog('single', item)},
]);
const paddingLeftStyle = computed(() => `${props.level * 2}rem`);
const selectedMenus = ref<string[]>([]);
const expandedMenus = ref<string[]>([]);
const selectedActions = ref<string[]>([]);
const tableMeta = ref<PaginationMeta>({
  page: 1,
  itemsCount: 0,
  pagesCount: 0,
  itemsPerPage: -1
});
/**
 * ? Expanded All
 */
// watch(
//   () => props.items,
//   () => {
//     expandedMenus.value = props.items.map((item) => item.id!);
//   },
//   { deep: true, immediate: true }
// );
watch(selectedMenus, () => {
  console.log(selectedMenus.value);
});
watch(selectedActions, () => {
  console.log(selectedActions.value);
});

// Dialog
const defaultMenu = ref<Menu>({
  name: '',
  router: '',
  parent: null,
  parentId: null,
  icon: '',
  component: '',
  children: [],
  sort: 1,
  actions: [],
  path: '',
  reidrect: null
});
const createEditDialog = ref(false);
const currentMenu = ref<Menu>({ ...defaultMenu.value });
const fields = ref<FormField[]>([
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'router', label: 'Router', type: 'text' },
  { name: 'parentId', label: 'Parent Id', type: 'text', readonly: true, placeholder: '留空为一级菜单', attrs: { 'persistent-placeholder': true } },
  { name: 'icon', label: 'Icon', type: 'text' },
  { name: 'sort', label: 'Sort', type: 'number', attrs: { max: 100, min: 0 } },
  { name: 'redirect', label: 'Redirect', type: 'text' },
  { name: 'component', label: 'Component', type: 'text' }
]);
const isEditing = ref(false);
const onOpenCreateEditDialog = async (isEditMode: boolean, menuId?: string, isSubMenuCreation: boolean = false) => {
  isEditing.value = isEditMode;

  if (isEditMode) {
    // 编辑模式
    if (!menuId) {
      throw new Error('Editing mode requires a menu ID.');
    }
    const {
      data: { result }
    } = await apiMenus.getMenuById(menuId);
    currentMenu.value = result;
  } else {
    // 创建模式
    if (isSubMenuCreation && menuId) {
      // 创建子菜单，继承 parentId
      currentMenu.value = {
        ...defaultMenu.value,
        parentId: menuId
      };
    } else {
      // 创建一级菜单
      currentMenu.value = { ...defaultMenu.value, parentId: null };
    }
  }

  createEditDialog.value = true;
};

// 创建一级菜单
const onCreateRootMenu = () => {
  onOpenCreateEditDialog(false);
};

// 编辑菜单
const onEditMenu = (menuId: string) => {
  onOpenCreateEditDialog(true, menuId);
};

// 创建子菜单
const onCreateSubMenu = (parentMenuId: string) => {
  onOpenCreateEditDialog(false, parentMenuId, true);
};

const onSaveCreateEditDialog = async () => {
  console.log('Saved');
  console.log(currentMenu.value);
  try {
    if (isEditing.value) {
      await apiMenus.updateMenu(currentMenu.value.id!, currentMenu.value);
    } else {
      await apiMenus.createMenu(currentMenu.value);
    }
  } catch (error) {
  } finally {
    await props.refresh();
    currentMenu.value = { ...defaultMenu.value };
    // await fetchctionsByMenuId();
    // await props.refresh();
    // await findActionsByMenuId()
  }
};

// Delete
const deleteMode = ref<'single' | 'multiple'>('single');
const deleteConfirmDialog = ref(false);

// 打开删除确认对话框
const onOpenDeleteConfirmDialog = (mode: 'single' | 'multiple', item?: Menu) => {
  deleteMode.value = mode;
  deleteConfirmDialog.value = true;
  if (mode === 'single' && item) {
    currentMenu.value = item;
  }
};

// 确认删除
const onConfirmDelete = async () => {
  try {
    if (deleteMode.value === 'single') {
      await apiMenus.deleteMenu(currentMenu.value.id!);
    } else if (deleteMode.value === 'multiple') {
      // TODO: API
    }
  } catch (error) {
  } finally {
    deleteConfirmDialog.value = false;
    await props.refresh(); // 刷新数据
  }
};
</script>

<template>
  <VDataTableServer
    v-model="selectedMenus"
    v-model:expanded="expandedMenus"
    v-model:page="tableMeta.page"
    v-model:items-per-page="tableMeta.itemsPerPage"
    :items-length="props.items.length"
    v-bind="$attrs"
    expand-on-click
    :loading="props.loading"
    hide-default-footer
    :items="props.items"
    :headers="props.headers"
    :items-per-page-text="`level: ${props.level} : ${items[0]?.parent?.name || 'Null'} `"
  >
    <template #loading>
      <VSkeletonLoader type="table-row@4" />
    </template>
    <template #item.parentName="{ item }">
      <span class="text-primary font-weight-bold">
        {{ item.parent ? item.parent.name : 'Null' }}
      </span>
    </template>
    <template #item.router="{ item }">
      <VBtn
        variant="text"
        :to="item.parent ? `/${item.parent.router}/${item.router}` : `/${item.router}`"
      >
        {{ item.router }}
      </VBtn>
    </template>
    <template #item.component="{ item }">
      <span class="font-weight-bold">
        {{ `<${item.component} />` }}
      </span>
    </template>
    <template #item.level="{ item }">
      <VCode :class="['text-secondary', 'font-weight-bold', 'text-center', 'text-body-2', 'git-tree', `git-tree-level-${props.level}`]">
        {{ props.level }}
      </VCode>
    </template>
    <template #item.icon="{ item }">
      <VIcon :icon="item.icon" />
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
              @click.stop="btn.action(item)"
              :icon="btn.icon"
              :color="btn.color"
              v-bind="args.props"
            />
          </template>
          <span> {{ btn.title }}</span>
        </VTooltip>
      </VCardActions>
    </template>
    <template #expanded-row="{ item }">
      <td
        colspan="9999"
        :style="{ paddingLeft: paddingLeftStyle }"
      >
        <!-- Render actions if available -->
        <MenuActionsTable
          :item="item"
          :level="props.level + 1"
        />
        <!-- Render children if available -->
        <MenuChildrenActions
          v-model="selectedMenus"
          v-if="item.children && item.children.length"
          :loading="props.loading"
          :level="props.level + 1"
          :items="item.children"
          :items-length="item.children.length"
          :headers="props.headers"
          :refresh="props.refresh"
        />
      </td>
    </template>
  </VDataTableServer>

  <CreateEditDialog
    v-model="createEditDialog"
    :form="currentMenu"
    :fields="fields"
    @save="onSaveCreateEditDialog"
    :is-eidting="isEditing"
  />

  <DeleteConfirmDialog
    v-model="deleteConfirmDialog"
    :mode="deleteMode"
    @confirm="onConfirmDelete"
  />
</template>
