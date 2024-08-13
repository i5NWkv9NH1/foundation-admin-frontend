<!-- TODO: Delete -->
<script setup lang="tsx">
import { apiAccounts, apiOrganizations, apiRoles } from '@/api';
import { buildTree, organizationFieldMapping } from '@/helpers';
import { Account, AccountDto, AccountFilterPayload, FormField, Gender, Organization, PaginationMeta, Role, TableHeader } from '@/types';
import dayjs from 'dayjs';

/**
 * * Table
 */
const headers: TableHeader[] = [
  { title: 'Avatar', key: 'avatarUrl', align: 'start', sortable: false },
  { title: 'Name', key: 'name', align: 'start', sortable: false, minWidth: '150px' },
  { title: 'Username', key: 'username', align: 'start', sortable: false },
  { title: 'Email', key: 'email', align: 'start', sortable: false },
  { title: 'Status', key: 'status', align: 'start', sortable: false },
  { title: 'Gender', key: 'gender', align: 'start', sortable: false },
  { title: 'Actions', key: 'actions', align: 'start', sortable: false }
];
// prettier-ignore
function genderStyles(gender: Gender) {
  switch(gender) {
    case 'FEMALE': return { color: 'pink', icon: 'mdi-gender-female' }
    case 'MALE': return { color: 'blue', icon: 'mdi-gender-male'}
    case 'PRIVATE': return { color: 'pink', icon: 'mdi-help'}
    default: return { color: 'grey', icon: 'mdi-help' }
  }
}
const tableMeta = ref<PaginationMeta & { loading?: boolean }>({
  page: 1,
  itemsPerPage: -1,
  itemsCount: 0,
  pagesCount: 0,
  loading: false
});
const selectedAccounts = ref<Account[]>();
const isSelectedAccounts = computed(() => selectedAccounts.value && !!selectedAccounts.value.length);
const tableRowActions = ref([
  { name: 'Organizations', icon: 'mdi-eye-outline', label: 'Update your organizations', action: (account: any) => onOpenOrganizaitonDialog(account), color: 'primary' },
  { name: 'Edit', icon: 'mdi-pencil-outline', label: 'Edit account profile', action: (account: any) => onOpenCreateEditDialog(true, account), color: 'info' },
  { name: 'Delete', icon: 'mdi-delete-outline', label: 'Delete account', action: () => onOpenDeleteConfirmDialog('single'), color: 'error' }
]);
/**
 * * Accounts
 */
const defaultFilters: AccountFilterPayload = {
  organizationId: '',
  roleId: '',
  status: 'ALL',
  text: ''
};
const filters = ref<AccountFilterPayload>({ ...defaultFilters });
const onFilterSubmit = async () => {
  await fetchAccounts();
};
const onFilterReest = async () => {
  filters.value = { ...defaultFilters };
  await fetchAccounts();
};
const onFilterCreate = () => {
  onOpenCreateEditDialog(false);
};
// prettier-ignore
const fileterFields = ref<FormField[]>([
  { name: 'roleId', label: 'Roles', type: 'select', options: [], attrs: { 'hide-details': true, grid: { cols: 4 }, items: [], 'item-title': 'name', 'item-value': 'id' , } },
  { name: 'status', label: 'Status', type: 'select', attrs: { grid: { cols: 4 }, 'item-title': 'name',  'item-value': 'value', items: [{ name: 'All', value: 'ALL' }, { name: 'Enable', value: 'ENABLE' }, { name: 'Disable', value: 'DISABLE' },
  ] }},
  { name: 'gender', label: 'Gender', type: 'select', attrs: { grid: { cols: 4 }, 'item-title': 'name',  'item-value': 'value', items: [{ name: 'Private', value: 'PRIVATE' }, { name: 'Male', value: 'MALE' }, { name: 'FEMALE', value: 'FEMALE' },
  ] }}
]);
const accounts = ref<Account[]>();
async function fetchAccounts({ page, itemsPerPage }: { page: number; itemsPerPage: number } = { page: tableMeta.value.page, itemsPerPage: tableMeta.value.itemsPerPage }) {
  try {
    tableMeta.value.loading = true;
    const response = await apiAccounts.getAccounts({ page, itemsPerPage, filters: filters.value });
    const {
      data: {
        result: { items, meta }
      }
    } = response;
    accounts.value = items;
    tableMeta.value = meta;
  } catch (error) {
    throw new Error(fetchAccounts.name);
  } finally {
    tableMeta.value.loading = false;
  }
}
/**
 * * Roles
 */
const roles = ref<Role[]>();
async function fetchRoles() {
  try {
    const response = await apiRoles.getRoles({ page: 1, itemsPerPage: -1 });
    roles.value = response.data.result.items;
  } catch (error) {
    throw new Error(fetchRoles.name);
  }
}
/**
 * * Organizations
 */
//! Tree
const organizations = ref<Organization[]>();
const organizationsTree = computed(() => {
  return buildTree(organizations.value, organizationFieldMapping);
});
const activated = ref<any[]>();
watch(activated, async () => {
  filters.value.organizationId = activated.value![0];
  await fetchAccounts();
});
async function fetchOrganizations() {
  try {
    const response = await apiOrganizations.getOrganizations({ page: 1, itemsPerPage: -1 });
    organizations.value = response.data.result.items;
  } catch (error) {
    throw new Error(fetchOrganizations.name);
  }
}
// watch(activated, async (newValue, oldValue) => {
//   if (newValue![0] === oldValue![0]) return;
// });

/**
 * * CreateEdit
 */
// prettier-ignore
const isEditing = ref(false)
const createEditDialog = ref(false);
// prettier-ignore
const fields = ref<FormField[]>([
  { name: 'avatarUrl', label: '', type: 'avatar', attrs: { size: 120, grid: { class: ['text-center'] } } },
  { name: 'name', label: 'Name', type: 'text', required: true, attrs: { variant: 'solo' } },
  { name: 'username', label: 'Username', type: 'text', required: true, attrs: { variant: 'solo' } },
  { name: 'password', label: 'Password', type: 'text', required: true, attrs: { variant: 'solo', type: 'password' } },
  { name: 'gender', label: 'Gender', type: 'radios', required: true, attrs: {   inline: true, 'hide-details': true },    options: [
      { value: 'PRIVATE', text: 'Private', color: 'grey', icon: 'mdi-help' },
      { value: 'MALE', text: 'Male', color: 'blue', icon: 'mdi-gender-male' },
      { value: 'FEMALE', text: 'Female', color: 'pink', icon: 'mdi-gender-female' }
    ],
  },
  { name: 'phone', label: 'Phone', type: 'text', attrs: { variant: 'solo' } },
  { name: 'address', label: 'Address', type: 'text', attrs: { variant: 'solo' } },
  { name: 'email', label: 'Email', type: 'text', required: false, attrs: { type: 'email', variant: 'solo' } },
  { name: 'avatarUrl', label: 'Avatar', type: 'text', attrs: { variant: 'solo' } },
  { name: 'status', label: 'Status', type: 'radios', options: [
      { value: 'ENABLE', text: 'Enable' },
      { value: 'DISABLE', text: 'Disable' }
  ],required: true, attrs: { inline: true, 'hide-details': true }
  },
  { name: 'roles', label: 'Roles', type: 'select', multiple: true, chips: true, attrs: { 'item-props': true, 'item-title': 'name', 'return-object': true, variant: 'solo' }, placeholder: 'Select roles' }
  // { name: 'organizations', label: 'Organizations', type: 'treeview', activeStrategy: 'independent', options: [] },
]);
// prettier-ignore
const defaultAccountDto: AccountDto = ({
  name: '', username: '', email: '', phone: '', address: '', status: 'ENABLE', gender: 'PRIVATE', avatarUrl: '', roles: [], organizationIds: []
})
const currentAccount = ref<AccountDto>({ ...defaultAccountDto });
const onOpenCreateEditDialog = async (value: boolean, account?: any) => {
  isEditing.value = value;
  if (isEditing && account) {
    try {
      const {
        data: { result }
      } = await apiAccounts.getAccountById(account.id);
      // currentAccount.value = response.data.result || { ...defaultAccountDto };
      const organizationIds = result.organizations!.map((item) => item.id!) || [];
      currentAccount.value = { ...result, organizationIds };
    } catch (error) {
      throw new Error(onOpenCreateEditDialog.name);
    }
  } else {
    currentAccount.value = { ...defaultAccountDto };
  }
  createEditDialog.value = true;
};
const onSaveCreateEditDialog = async () => {
  try {
    if (isEditing.value) {
      await apiAccounts.updateAccount(currentAccount.value.id!, currentAccount.value);
      await fetchAccounts();
    } else {
      await fetchAccounts();
      createEditDialog.value = false;
    }
  } catch (error) {
    await fetchAccounts();
    throw new Error(onSaveCreateEditDialog.name);
  }
};
/**
 * * Delete
 */
const onOpenDeleteConfirmDialog = (mode: 'single' | 'multiple') => {
  deleteMode.value = mode;
  deleteConfirmDialog.value = true;
};
const onConfirmDelete = (mode: 'single' | 'multiple') => {
  if (mode === 'single') {
    // TODO: api
  } else if (mode === 'multiple') {
    // TODO: api
  }
  deleteConfirmDialog.value = false;
};
const deleteMode = ref<'single' | 'multiple'>('single');
const deleteConfirmDialog = ref(false);
onMounted(async () => {
  // await Promise.all([fetchRoles(), fetchOrganizations()]);
  await fetchRoles();
  await fetchOrganizations();
  // Set default items in VSelect
  /**
   * TODO: use option
   */
  fields.value.map((field) => {
    if (field.name === 'roles') field.attrs!.items = roles.value;
    if (field.name === 'organizations') field.attrs!.items = organizations.value;
    return field;
  });
  fileterFields.value.map((field) => {
    if (field.name === 'roleId') field.attrs!.items = roles.value;
    return field;
  });
  activated.value = [organizations.value![0].id];
  // Update filters
  defaultFilters.organizationId = organizations.value![0].id;
});

/**
 * * Drawer
 */
const organizationsDialog = ref(false);
const onOpenOrganizaitonDialog = async (account: any) => {
  try {
    const {
      data: { result }
    } = await apiAccounts.getAccountById(account.id);
    const organizationIds = result.organizations!.map((item) => item.id!);
    currentAccount.value = { ...result, organizationIds };
    organizationsDialog.value = true;
  } catch (error) {
    throw new Error(onOpenOrganizaitonDialog.name);
  }
};
const onSaveOrganizations = (organizationIds: string[]) => {
  console.log(organizationIds);
};
</script>

<template>
  <VContainer fluid>
    <VRow>
      <!-- Organization Tree -->
      <!-- prettier-ignore -->
      <VCol cols="12" lg="3" md="4" sm="4">
        <VCard>
          <VCardText>
            <TreeActivator
              v-model="activated"
              :items="organizationsTree"
            />
          </VCardText>
        </VCard>
      </VCol>
      <!-- prettier-ignore -->
      <VCol cols="12" lg="9" md="8" sm="8">
        <div class="d-flex flex-column ga-4">
          <!-- Filter Panel -->
          <QueryFilterPanel
            :form="filters"
            :fields="fileterFields"
            @create="onFilterCreate"
            @reset="onFilterReest"
            @submit="onFilterSubmit"
          />
          <!-- Data Table -->
           <VCard>
            <VCardText>
              <VDataTableServer
                v-model="selectedAccounts"
                v-model:items-per-page="tableMeta.itemsPerPage"
                :headers="headers"
                :item-value="(item: Account) => item"
                :items="accounts"
                :items-length="tableMeta.itemsCount"
                :loading="tableMeta.loading"
                :page="tableMeta.page"
                show-select
                @update:options="fetchAccounts"
              >
                <template #top>
                  <div class="d-flex align-center ga-4 mb-4">
                    <VBtn color="primary" @click="onOpenCreateEditDialog(false)">
                      <VIcon icon="mdi-plus" start />
                      <span>New Accout</span>
                    </VBtn>
                    <VSlideXTransition>
                      <template v-if="isSelectedAccounts">
                        <VBtn color="error" @click="onOpenDeleteConfirmDialog('multiple')">
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

                <template #item.avatarUrl="{ item }">
                  <VAvatar v-if="item.avatarUrl" :image="item.avatarUrl" size="40" />
                  <VAvatar v-else color="primary" size="40">
                    <span>{{ item.name }}</span>
                  </VAvatar>
                </template>
                <template #item.username="{ item }">
                  <div class="d-flex text-decoration-underline">
                    {{ item.username }}
                  </div>
                </template>
                <template #item.status="{ item }">
                  <VChip :color="item.status === 'DISABLE' ? 'grey' : 'success'" :text="item.status"
                  />
                </template>
                <template #item.gender="{ item }">
                  <VChip :color="genderStyles(item.gender).color">
                    <template #prepend>
                      <VIcon start>
                        {{ genderStyles(item.gender).icon }}
                      </VIcon>
                    </template>
                    <strong>{{ item.gender }}</strong>
                  </VChip>
                </template>
                <template #item.createdAt="{ item }">
                  <span>{{ dayjs(item.createdAt).format('YYYY-MM-DD') }}</span>
                </template>
                <template #item.actions="{ item }">
                  <VCardActions>
                    <VBtn v-for="btn in tableRowActions" :key="btn.name"
                  :icon="btn.icon" @click="btn.action(item)" :color="btn.color" />
                  </VCardActions>
                </template>
              </VDataTableServer>
            </VCardText>
           </VCard>
        </div>
      </VCol>
    </VRow>

    <!-- CreateEdit -->
    <CreateEditDialog
      :fields="fields"
      :form="currentAccount"
      @save="onSaveCreateEditDialog"
      v-model="createEditDialog"
      :is-eidting="isEditing"
    />
    <!-- Delete -->
    <DeleteConfirmDialog
      v-model="deleteConfirmDialog"
      :mode="deleteMode"
      @confirm="onConfirmDelete"
    />
    <!-- Organizations dialog -->
    <AccountOrganizationsDialog
      v-model="organizationsDialog"
      v-model:selected="currentAccount.organizationIds"
      @save="onSaveOrganizations"
      :items="organizationsTree"
    />
  </VContainer>
</template>
