<script setup lang="ts">
import { FormField, TableHeader } from '@/types';
import { Account, Organization, Role } from '@/types/entities';
import { ref, watch } from 'vue';

// Account Table state
// prettier-ignore
const headers = ref<TableHeader[]>([{ title: 'Avatar', key: 'avatarUrl', align: 'start', sortable: false }, { title: 'Name', key: 'name', align: 'start', sortable: false, minWidth: '150px' }, { title: 'Username', key: 'username', align: 'start', sortable: false }, { title: 'Email', key: 'email', align: 'start', sortable: false }, { title: 'Status', key: 'status', align: 'start', sortable: false }, { title: 'Gender', key: 'gender', align: 'start', sortable: false }, { title: 'Actions', key: 'actions', align: 'start', sortable: false }]);

// Account Table Utils
// prettier-ignore
const genderIcon = (gender: string) => { switch (gender) { case 'PRIVATE': return 'mdi-help'; case 'MALE': return 'mdi-gender-male'; case 'FEMALE': return 'mdi-gender-female'; } };
const selectedAccounts = ref<Account[]>([]);
const itemsPerPage = ref(-1);
const page = ref(1);
const loadItems = async ({ page, itemsPerPage }: any) => {
  await refetchAccounts(page, itemsPerPage, filters.value);
};
const isSelectedAccounts = computed(() => !!selectedAccounts.value.length);
// Fetch
// prettier-ignore
const { items: accounts, meta, loading, search, refetch: refetchAccounts, findById, create, update } = useCrud<Account>('/accounts', page.value, itemsPerPage.value);
const { items: organizations, refetch: refetchOrganizations } = useCrud<Organization>('/organizations');
const { items: roles, refetch: refetchRoles } = useCrud<Role>('/roles');
// Tree
const activatedIds = ref<string[]>([]);
watch(activatedIds, async (newValue, oldValue) => {
  if (newValue[0] === oldValue[0]) return;
  // Reset filters when organizaiton change
  filters.value = { ...defaultFilters.value };
  filters.value.organizationId = activatedIds.value![0] || '';
  await refetchAccounts(page.value, itemsPerPage.value, filters.value);
});

// Filters
const defaultFilters = ref<Record<string, any>>({
  organizationId: '',
  status: 'ALL',
  text: ''
});
const filters = ref<Record<string, any>>({ ...defaultFilters.value });
// prettier-ignore
const filterFields = ref<FormField[]>([{ name: 'name', label: 'Name', type: 'text', required: true, attrs: { variant: 'outlined', density: 'compact' } }, { name: 'status', label: 'Status', type: 'select', required: true, attrs: { 'item-title': 'name', density: 'compact', variant: 'outlined', width: '120px', 'item-value': 'value' }, options: [{ name: 'All', value: 'ALL' }, { name: 'Enable', value: 'ENABLE' }, { name: 'Disable', value: 'DISABLE' }] }]);

const onResetFilters = () => {
  filters.value = { ...defaultFilters.value };
};
const onSubmitFilters = async () => {
  await refetchAccounts(page.value, itemsPerPage.value, filters.value);
};
// Dialogs
// Delete dialog
const isDeleteDialogVisible = ref(false);
const deleteDialogAction = ref<'single' | 'multiple'>('single'); // Default action
const onOpenDeleteDialog = (action: 'single' | 'multiple') => {
  deleteDialogAction.value = action;
  isDeleteDialogVisible.value = true;
};
// prettier-ignore
const onDeleteConfirmDialog = (action: 'single' | 'multiple') => { if (action === 'single') { /* Handle single item deletion */ /* TODO: api */ } else if (action === 'multiple') { /* Handle multiple items deletion */ /* TODO: api */ } isDeleteDialogVisible.value = false; };
// Create and Edit dialog
const isDialogVisible = ref(false);
const isEditing = ref(false);
// Default account data
// prettier-ignore
const defaultItem = ref<Account>({
  name: '', username: '', email: '', phone: '', address: '', avatarUrl: '', status: 'ENABLE', gender: 'PRIVATE',  roles: [], organizations: []
});
// be used to do create or edit in dialog
const currentItem = ref<Account>({ ...defaultItem.value });
// prettier-ignore
const fields = ref<FormField[]>([
  { name: 'name', label: 'Name', type: 'text', required: true, attrs: { 'variant': 'solo'} },
  { name: 'username', label: 'Username', type: 'text', required: true, attrs: { 'variant': 'solo'}  },
  { name: 'password', label: 'Password', type: 'text', required: true, attrs: {'variant': 'solo', type: 'password'}},
  { name: 'gender', label: 'Gender', type: 'radios', options: [{ value: 'PRIVATE', text: 'Private', color: 'grey', icon: 'mdi-help' }, { value: 'MALE', text: 'Male', color: 'blue',icon: 'mdi-gender-male' }, { value: 'FEMALE', text: 'Female', color: 'pink', icon: 'mdi-gender-female' }], required: true, attrs: { 'inline': true, 'hide-details': true,  } },
  { name: 'phone', label: 'Phone', type: 'text', attrs: { 'variant': 'solo'}  },
  { name: 'address', label: 'Address', type: 'text', attrs: { 'variant': 'solo'}  },
  { name: 'email', label: 'Email', type: 'text', required: false , attrs: { type: 'email', 'variant': 'solo'} },
  { name: 'avatarUrl', label: 'Avatar', type: 'text', attrs: { 'variant': 'solo'}  },
  { name: 'status', label: 'Status', type: 'radios', options: [{ value: 'ENABLE', text: 'Enable' }, { value: 'DISABLE', text: 'Disable' }], required: true, attrs: { 'inline': true, 'hide-details': true  } },
  { name: 'roles', label: 'Roles', type: 'select', multiple: true, chips: true, attrs: {'item-props': true, 'item-title': 'name', 'return-object': true, 'variant': 'solo' }, placeholder: 'Select roles' },
  // { name: 'organizations', label: 'Organizations', type: 'treeview', activeStrategy: 'independent', options: [] },
]);

const onOpenDialog = async (isEdit: boolean, item?: Record<string, any>) => {
  isEditing.value = isEdit;
  if (isEdit && item) {
    const response = await findById(item.id);
    currentItem.value = response?.data.result || { ...defaultItem.value };
  } else {
    currentItem.value = { ...defaultItem.value };
  }
  isDialogVisible.value = true;
};
const onSubmitDialog = async () => {
  if (isEditing.value) {
    await update(currentItem.value);
  } else {
    await create(currentItem.value);
  }
  await refetchAccounts(page.value, itemsPerPage.value, filters.value);
  isDialogVisible.value = false;
};
const onCloseDialog = () => {};

// Drawer
const drawer = ref(false);
function toggleDrawer() {
  drawer.value = !drawer.value;
}
function onDrawerSave(activateds: string[]) {
  currentItem.value.organizationIds = activateds;
}
// Mounted
onMounted(async () => {
  await Promise.all([refetchOrganizations(), refetchRoles()]);
  const updatedFields = fields.value.map((field) => {
    switch (field.name) {
      case 'roles':
        field.options = roles.value;
        break;
      case 'organizations':
        field.options = organizations.value;
        break;
    }
    return field;
  });
  // Update form component options
  fields.value = updatedFields;
  // Update treeview activated
  activatedIds.value = [organizations.value![0].id || ''];
  // Update filters
  defaultFilters.value.organizationId = organizations.value![0].id || '';
});
</script>

<template>
  <VContainer fluid>
    <VRow>
      <VCol
        lg="3"
        md="4"
        sm="6"
        cols="12"
      >
        <VCard>
          <VCardText>
            <TreeView
              v-if="organizations"
              v-model:activated="activatedIds"
              :items="organizations"
              :active-strategy="'single-independent'"
              :item-value="(item: any) => item.id"
            />
          </VCardText>
        </VCard>
      </VCol>
      <VCol
        lg="9"
        md="8"
        sm="6"
        cols="12"
      >
        <div class="d-flex flex-column ga-4">
          <!-- Filters -->
          <FiltersPanel
            v-model="filters"
            :fields="filterFields"
            @reset="onResetFilters"
            @submit="onSubmitFilters"
          />
          <!-- Tables -->
          <VCard>
            <VCardText>
              <VDataTableServer
                v-model="selectedAccounts"
                v-model:items-per-page="itemsPerPage"
                :headers="headers"
                :item-value="(item: Account) => item"
                :items="accounts"
                :items-length="meta.itemsCount"
                :loading="loading"
                :page="page"
                :search="search"
                show-select
                @update:options="loadItems"
              >
                <template #top>
                  <div class="d-flex align-center ga-4 mb-4">
                    <VBtn
                      color="primary"
                      @click="onOpenDialog(false)"
                      density="compact"
                      variant="text"
                      icon
                    >
                      <VIcon> mdi-plus </VIcon>
                    </VBtn>
                    <VSlideXTransition>
                      <template v-if="isSelectedAccounts">
                        <VBtn
                          color="error"
                          @click="onOpenDeleteDialog"
                        >
                          <VIcon start> mdi-delete-outline </VIcon>
                          <span>Delete</span>
                        </VBtn>
                      </template>
                    </VSlideXTransition>
                  </div>
                </template>
                <template #loading>
                  <v-skeleton-loader type="table-row@10" />
                </template>

                <template #item.avatarUrl="{ item }">
                  <VAvatar
                    v-if="item.avatarUrl"
                    :image="item.avatarUrl"
                    size="40"
                  />
                  <VAvatar
                    v-else
                    color="primary"
                    size="40"
                  >
                    <span>{{ item.name }}</span>
                  </VAvatar>
                </template>
                <template #item.username="{ item }">
                  <div class="d-flex text-decoration-underline">
                    {{ item.username }}
                  </div>
                </template>
                <template #item.status="{ item }">
                  <VChip
                    :color="item.status === 'DISABLE' ? 'grey' : 'success'"
                    :text="item.status"
                  />
                </template>
                <template #item.gender="{ item }">
                  <VChip :color="item.gender === 'PRIVATE' ? 'Grey' : item.gender === 'FEMALE' ? 'pink' : 'blue'">
                    <template #prepend>
                      <VIcon start>
                        {{ genderIcon(item.gender) }}
                      </VIcon>
                    </template>
                    <template #default>
                      <strong>{{ item.gender }}</strong>
                    </template>
                  </VChip>
                </template>
                <!-- <template #item.createdAt="{ item }">
                  <span>{{ dayjs(item.createdAt).format('YYYY-MM-DD') }}</span>
                </template> -->
                <template #item.actions="{ item }">
                  <div class="d-flex">
                    <VBtn
                      color="primary"
                      icon="mdi-account-group-outline"
                      variant="text"
                      @click="toggleDrawer"
                    />
                    <VBtn
                      color="primary"
                      icon="mdi-pencil-outline"
                      variant="text"
                      @click="onOpenDialog(true, item)"
                    />
                    <VBtn
                      color="red"
                      icon="mdi-delete-outline"
                      variant="text"
                      @click="onOpenDeleteDialog('single')"
                    />
                  </div>
                </template>
              </VDataTableServer>
            </VCardText>
          </VCard>
        </div>
      </VCol>
    </VRow>

    <!-- Delete confirm dialog -->
    <DeleteConfirmDialog
      v-model="isDeleteDialogVisible"
      :action="deleteDialogAction"
      @confirm="onDeleteConfirmDialog"
    />

    <!-- Create and Edit Dialog  -->
    <CreateEditDialog
      v-model:form="currentItem"
      v-model:isVisible="isDialogVisible"
      :fields="fields"
      :is-edit="isEditing"
      @close="onCloseDialog"
      @submit="onSubmitDialog"
    />

    <TreeSelectorDrawer
      :model-value="drawer"
      :activateds="currentItem.organizations?.map((item) => item.id as string) || []"
      @save="onDrawerSave"
      :items="organizations || []"
    />
  </VContainer>
</template>
