<script setup lang="ts">
import { apiMenus, apiRoles } from '@/api';
import { apiActions } from '@/api/actions';
import { buildTree, menuFieldMapping } from '@/helpers';
import { Action, FormField, Menu, PaginationMeta, Role, RoleDto, RoleFilterPayload, RoleName, Status, TableHeader } from '@/types';
import dayjs from 'dayjs';
import _ from 'lodash';

// * Table
const headers = ref<TableHeader[]>([
  // { title: 'Id', value: 'id', sortable: false, key: 'id' },
  { title: 'Label', value: 'label', sortable: false, key: 'label' },
  { title: 'Name', value: 'name', sortable: false, key: 'name' },
  { title: 'Status', value: 'status', sortable: false, key: 'status' },
  { title: 'Created At', value: 'createdAt', sortable: false, key: 'createdAt' },
  { title: 'Updated At', value: 'updatedAt', sortable: false, key: 'updatedAt' },
  { title: 'Sort', value: 'sort', sortable: false, key: 'sort' },
  { title: 'Actions', value: 'actions', sortable: false }
]);
// prettier-ignore
function roleNameStyles(roleName: RoleName) {
  switch(roleName) {
    case 'ROOT': return 'error'
    case 'ADMIN': return 'warning'
    case 'USER': return 'info'
    case 'GUEST': return 'success'
  }
}
const tableMeta = ref<PaginationMeta & { loading?: boolean }>({
  page: 1,
  itemsPerPage: -1,
  itemsCount: 0,
  pagesCount: 0,
  loading: false
});
const selectedRoles = ref<Role[]>();
const isSelectedRoles = computed(() => selectedRoles.value && !!!selectedRoles.value);
const tableRowActions = ref([
  { name: 'Actions', icon: 'mdi-shield-lock-outline', label: 'Update your organizations', action: (role: Role) => onOpenRoleActionsDialog(role), color: 'primary' },
  { name: 'Edit', icon: 'mdi-pencil-outline', label: 'Edit account profile', action: (role: Role) => onOpenCreateEditDialog(true, role), color: 'info' },
  { name: 'Delete', icon: 'mdi-delete-outline', label: 'Delete account', action: (role: Role) => onOpenDeleteConfirmDialog('single', role), color: 'error' }
]);

// Filters
// prettier-ignore
const filterFields = ref<FormField[]>([
  { name: 'status', label: 'Status', type: 'select', attrs: { grid: { cols: 4 }, 'item-title': 'name',  'item-value': 'value', items: [{ name: 'All', value: 'ALL' }, { name: 'Enable', value: 'ENABLE' }, { name: 'Disable', value: 'DISABLE' },
  ] }},
  { name: 'name', label: 'Name', type: 'select', options: [], attrs: { 'hide-details': true, grid: { cols: 4 }, itemTitle: (item: Role) => item.name, itemValue: (item: Role) => item.nam } }
])
const defaultFilters = ref<RoleFilterPayload>({
  text: '',
  status: 'ALL',
  name: undefined
});
const filters = ref<RoleFilterPayload>({ ...defaultFilters.value });
const roles = ref<Role[]>();
const fetchRoles = async ({ page, itemsPerPage }: { page: number; itemsPerPage: number } = { page: tableMeta.value.page, itemsPerPage: tableMeta.value.itemsPerPage }) => {
  try {
    tableMeta.value.loading = true;
    const {
      data: { result }
    } = await apiRoles.getRoles({ page, itemsPerPage, filters: filters.value });
    roles.value = result.items;
    tableMeta.value = result.meta;
  } catch (error) {
    throw new Error(fetchRoles.name);
  } finally {
    tableMeta.value.loading = false;
  }
};
const onFilterSubmit = async () => {
  await fetchRoles();
};
const onFilterReest = async () => {
  filters.value = { ...defaultFilters.value };
  await fetchRoles();
};
// const onFilterCreate = () => {
//   onOpenCreateEditDialog(false);
// };
// * CreateEdit
const isEditing = ref(false);
const createEditDialog = ref(false);
// prettier-ignore
const fields = ref<FormField[]>([
  { name: 'label', label: 'Label', type: 'text', attrs: { grid: { cols: 6 } } },
  { name: 'name', label: 'Name', type: 'text', options: [], attrs: { grid: { cols: 6 }, color: 'error' } },
  { name: 'status', label: 'Status', type: 'radios', options: [
      { value: 'ENABLE', text: 'Enable' },
      { value: 'DISABLE', text: 'Disable' }
  ], inline: true, attrs: {} },
  { name: 'sort', label: 'Sort', type: 'number', attrs: { grid: { cols: 6 }, max: 100, min: 0 }, controlVariant: 'split', inset: true,  }
]);
const defaultRole = { label: '', name: '' as RoleName, status: 'ENABLE' as Status, sort: 1, actions: [], accounts: [] };
const currentRole = ref<RoleDto>({ ...defaultRole });
const onOpenCreateEditDialog = async (value: boolean, role?: any) => {
  isEditing.value = value;
  if (isEditing && role) {
    try {
      const {
        data: { result }
      } = await apiRoles.getRoleById(role.id);
      currentRole.value = { ...result };
    } catch {
      throw new Error(onOpenCreateEditDialog.name);
    }
  } else {
    currentRole.value = { ...defaultRole };
  }
  createEditDialog.value = true;
};
const onSaveCreateEditDialog = async () => {
  try {
    if (isEditing.value) {
      await apiRoles.updateRole(currentRole.value.id!, currentRole.value);
    } else {
      await apiRoles.createRole(currentRole.value);
    }
  } catch {
    throw new Error(onSaveCreateEditDialog.name);
  } finally {
    await fetchRoles();
  }
};
/**
 * * Delete
 */
const deleteMode = ref<'single' | 'multiple'>('single');
const deleteConfirmDialog = ref(false);
const onOpenDeleteConfirmDialog = (mode: 'single' | 'multiple', role?: Role) => {
  deleteMode.value = mode;
  deleteConfirmDialog.value = true;
  if (mode === 'single') {
    currentRole.value.id = role?.id;
  }
};
const onConfirmDelete = async (mode: 'single' | 'multiple') => {
  try {
    if (mode === 'single') {
      await apiRoles.deleteRole(currentRole.value.id!);
    } else if (mode === 'multiple') {
      // TODO: api
    }
  } catch {
    throw new Error(onConfirmDelete.name);
  } finally {
    deleteConfirmDialog.value = false;
    await fetchRoles();
  }
};

// RoleActions
const roleActionsDialog = ref(false);
const menus = ref<Menu[]>([]);
// tree items
const menuTree = ref<Menu[]>([]);
const actions = ref<Action[]>([]);
const menuActions = ref<Action[]>([]);
// activited from dialog
const activated = ref<string[]>([]);
// find menu
const activatedId = computed(() => activated.value && activated.value[0]);
const actionsTableMeta = ref<PaginationMeta & { loading: boolean }>({
  page: 1,
  itemsCount: 0,
  itemsPerPage: -1,
  pagesCount: 0,
  loading: true
});
const onRoleActionsTableUpdate = async () => {
  await fetchRoleActionsByRoleIdMenuId();
};
const fetchMenus = async () => {
  try {
    const {
      data: { result }
    } = await apiMenus.getMenus({ page: 1, itemsPerPage: -1 });
    menus.value = result.items;
  } catch {
    throw new Error(fetchMenus.name);
  }
};
const fetchActions = async () => {
  try {
    const {
      data: { result }
    } = await apiActions.getActions({ page: 1, itemsPerPage: -1 });
    actions.value = result.items;
  } catch {
    throw new Error(fetchActions.name);
  }
};
const fetchMenuActionsByMenuId = async () => {
  if (!activatedId.value) return;
  try {
    actionsTableMeta.value.loading = true;
    const {
      data: { result }
    } = await apiMenus.getMenuById(activatedId.value);
    menuActions.value = result.actions;
  } catch {
    throw new Error(fetchMenuActionsByMenuId.name);
  } finally {
    actionsTableMeta.value.loading = false;
  }
};
const fetchRoleActionsByRoleIdMenuId = async () => {
  if (!(currentRole.value && currentRole.value.id)) return;
  actionsTableMeta.value.loading = true;
  try {
    const {
      data: { result }
    } = await apiRoles.getRoleActionsByRoleIdMenuId(currentRole.value.id, activatedId.value, tableMeta.value.page, tableMeta.value.itemsPerPage);
    actions.value = result.items;
    (actionsTableMeta.value as PaginationMeta) = result.meta;
  } catch {
    throw new Error(onOpenRoleActionsDialog.name);
  } finally {
    actionsTableMeta.value.loading = false;
  }
};
watch(activatedId, async () => {
  // * 获取当前角色、当前菜单的权限
  await fetchRoleActionsByRoleIdMenuId();
  // * 获取当前菜单的所有权限
  await fetchMenuActionsByMenuId();
});
const onOpenRoleActionsDialog = async (role: any) => {
  roleActionsDialog.value = true;
  menuTree.value = buildTree(menus.value, menuFieldMapping);
  activated.value = [menuTree.value[0].id!];
  currentRole.value = role;
  // await fetchActionsByRoleIdMenuId();
  // 根据菜单ID获取角色的权限表
};
const onSaveRoleActionsDialog = async (actions: Action[]) => {
  // 保存角色的权限
  if (!currentRole.value) return;
  try {
    await apiRoles.updateRoleActionsByRoleIdMenuId(currentRole.value.id!, activatedId.value, actions);
  } catch {
    throw new Error(onSaveRoleActionsDialog.name);
  } finally {
    await Promise.all([fetchMenus(), fetchRoleActionsByRoleIdMenuId(), fetchMenuActionsByMenuId()]);
  }
};
onMounted(async () => {
  // await fetchRoles();
  await fetchMenus();
  filterFields.value.map((field) => {
    if (field.name === 'name') {
      field.options = Array.from(new Set(roles.value));
    }
    return field;
  });
});
</script>

<template>
  <VContainer fluid>
    <div class="d-flex flex-column ga-4">
      <!-- QueryFilter -->
      <QueryFilterPanel
        :form="filters"
        :fields="filterFields"
        @create="onOpenCreateEditDialog(false)"
        @reset="onFilterReest"
        @submit="onFilterSubmit"
      />
      <!-- Table -->
      <VCard>
        <VCardText>
          <VDataTableServer
            v-model:items-per-page="tableMeta.itemsPerPage"
            v-model="selectedRoles"
            :headers="headers"
            :item-value="(item: Role) => item"
            :items="roles"
            :items-length="tableMeta.itemsCount"
            :loading="tableMeta.loading"
            :page="tableMeta.page"
            show-select
            @update:options="fetchRoles"
          >
            <template #top>
              <div class="d-flex align-center ga-4 mb-4">
                <VBtn
                  color="primary"
                  @click="onOpenCreateEditDialog(false)"
                >
                  <VIcon
                    icon="mdi-plus"
                    start
                  />
                  <span>New Role</span>
                </VBtn>
                <VSlideXTransition>
                  <template v-if="isSelectedRoles">
                    <VBtn
                      color="error"
                      @click="onOpenDeleteConfirmDialog('multiple')"
                    >
                      <VIcon start> mdi-delete-outline </VIcon>
                      <span>Delete</span>
                    </VBtn>
                  </template>
                </VSlideXTransition>
              </div>
            </template>
            <template #loading>
              <v-skeleton-loader type="table-row@4" />
            </template>
            <template #item.status="{ item }">
              <VChip
                :color="item.status === 'DISABLE' ? 'grey' : 'success'"
                :text="item.status"
              />
            </template>
            <template #item.name="{ item }">
              <VChip
                :color="roleNameStyles(item.name)"
                :text="item.name"
                rounded
              />
            </template>
            <template #item.createdAt="{ item }">
              <span>{{ dayjs(item.createdAt).format('YYYY-MM-DD') }}</span>
            </template>
            <template #item.updatedAt="{ item }">
              <span>{{ dayjs(item.updatedAt).format('YYYY-MM-DD') }}</span>
            </template>
            <template #item.actions="{ item }">
              <VCardActions>
                <VBtn
                  v-for="btn in tableRowActions"
                  :key="btn.name"
                  :icon="btn.icon"
                  @click="btn.action(item)"
                  :color="btn.color"
                />
              </VCardActions>
            </template>
          </VDataTableServer>
        </VCardText>
      </VCard>
    </div>

    <!-- OpenEditDialog -->
    <CreateEditDialog
      v-model="createEditDialog"
      :fields="fields"
      :form="currentRole"
      @save="onSaveCreateEditDialog"
      :is-eidting="isEditing"
    />

    <!-- Delete -->
    <DeleteConfirmDialog
      v-model="deleteConfirmDialog"
      :mode="deleteMode"
      @confirm="onConfirmDelete"
    />

    <RoleActionsDialog
      v-model="roleActionsDialog"
      v-model:activated="activated!"
      :items="menuTree"
      :actions="actions"
      :table-meta="actionsTableMeta"
      :menu-actions="menuActions"
      @save="onSaveRoleActionsDialog"
      @role-actions-table-update="onRoleActionsTableUpdate"
    />
  </VContainer>
</template>
