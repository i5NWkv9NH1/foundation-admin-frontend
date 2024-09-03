<script setup lang="ts">
import { apiAccounts, apiOrganizations, apiRoles } from '@/api';
import { Account, AccountFilterPayload, CreateAccountDto, DeleteMode, FormField, Organization, Role, TableCallbackOptions, TableHeader, TableMeta, TableRowAction } from '@/types';
import AccountCreateEditDrawer from './components/AccountCreateEditDrawer.vue';
import AccountOrganizationsDialog from './components/AccountOrganizationsDialog.vue';

/**
 * * Table
 */
const headers: TableHeader[] = [
  { title: 'Avatar', key: 'avatarUrl', align: 'start', sortable: false },
  { title: 'Name', key: 'name', align: 'start', sortable: false, minWidth: '150px' },
  { title: 'Username', key: 'username', align: 'start', sortable: false },
  { title: 'Email', key: 'email', align: 'start', sortable: false },
  { title: 'Status', key: 'status', align: 'start', sortable: false },
  { title: 'Role', key: 'roles', align: 'start', sortable: false },
  { title: 'Gender', key: 'gender', align: 'start', sortable: false },
  { title: 'Actions', key: 'actions', align: 'start', sortable: false }
]
const tableMeta = ref<TableMeta>({
  page: 1,
  itemsPerPage: -1,
  itemsLength: 0,
  pagesLength: 0,
  loading: false
})
const selectedAccounts = ref<Account[]>()
const isSelectedAccounts = computed(() => selectedAccounts.value && !!selectedAccounts.value.length)
const tableRowActions = ref<TableRowAction[]>([
  { title: 'Update Organizations', icon: 'mdi-account-group-outline', cb: onOpenOrganizaitonDialog, color: '' },
  { title: 'Edit Account', icon: 'mdi-pencil-outline', cb: (account: Account) => onOpenCreateEditDrawer(true, account), color: '' },
  { title: 'Delete Account', icon: 'mdi-delete-outline', cb: (account: Account) => onOpenDeleteConfirmDialog('single', account), color: '' }
])

/**
 * * Filters
 */
const defaultFilters: AccountFilterPayload = {
  organizationId: '',
  roleId: '',
  status: 'ALL',
  text: '',
  startDate: '',
  endDate: ''
}
const filters = ref<AccountFilterPayload>({ ...defaultFilters })
// prettier-ignore
const fileterFields = ref<FormField[]>([
  { name: 'roleId', label: 'Roles', type: 'select',  options: [], attrs: { 'hide-details': true, grid: { cols: 4 }, 'item-title': 'name', 'item-value': 'id' , variant: 'outlined' } },
  { name: 'status', label: 'Status', type: 'select', attrs: { grid: { cols: 4 }, 'item-title': 'name',  'item-value': 'value',  'variant': 'outlined',
    items: [{ name: 'All', value: 'ALL' }, { name: 'Enabled', value: 'Enabled' }, { name: 'Disabled', value: 'Dsiabled' },]
  }},
  { name: 'gender', label: 'Gender', type: 'select', attrs: { grid: { cols: 4 }, 'item-title': 'name',  'item-value': 'value',  'variant': 'outlined',
    items: [{ name: 'Private', value: 'Private' }, { name: 'Male', value: 'Male' }, { name: 'Female', value: 'Female' },]
  }}
]);
const onFilterSubmit = async () => {
  await onFetchAccounts()
}
const onFilterReest = async () => {
  filters.value = { ...defaultFilters }
  await onFetchAccounts()
}
const onFilterCreate = () => {
  onOpenCreateEditDrawer(false)
}
const accounts = ref<Account[]>([])
const roles = ref<Role[]>([])
const organizations = ref<Organization[]>([])
const defaultAccount: CreateAccountDto = {
  name: '',
  username: '',
  password: '',
  organizationIds: [],
  roles: [],
  organizations: [],
  profile: { avatarUrl: '', bannerurl: '', socialMediaLinks: {}, bio: '', email: '', phone: '', address: '', status: 'Enabled', gender: 'Private', location: '' }
}
const currentAccount = ref<CreateAccountDto>({ ...defaultAccount })
/**
 * * API
 */
// prettier-ignore
async function onFetchAccounts(options: TableCallbackOptions = {
  page: tableMeta.value.page,
  itemsPerPage: tableMeta.value.itemsPerPage
}) {
  try {
    tableMeta.value.loading = true
    const { page, itemsPerPage } = options
    const { data: { result }} = await apiAccounts.getAccounts({
      page, itemsPerPage, filters: filters.value
    })
    accounts.value = result.items
    tableMeta.value = { ...result.meta, loading: false }
  } catch(error) {
    console.log(error)
  }
}
// prettier-ignore
async function onFetchAccountById(id: string) {
  try {
    const { data: { result: { roles, organizations, ...rest }}} = await apiAccounts.getAccountById(id)
    const organizationIds = organizations.map(org => org.id)
    currentAccount.value = {...rest, roles, organizations, organizationIds }
  } catch(error) {
    console.log(error)
  }
}
async function onUpdateAccountById() {
  try {
    await apiAccounts.updateAccount(currentAccount.value.id!, currentAccount.value)
  } catch (error) {
    console.log(error)
  }
}
async function onCreateAccount() {
  try {
    await apiAccounts.createAccount(currentAccount.value)
  } catch (error) {
    console.log(error)
  }
}
// prettier-ignore
async function onFetchRoles() {
  try {
    // * fetch all roles
    const { data: { result }} = await apiRoles.getRoles({ page: 1, itemsPerPage: -1 })
    roles.value = result.items
      // ? Set the query field optiosn
    fileterFields.value.map((field) => {
      if (field.name === 'roleId') field.options = roles.value
      return field
    })
  } catch(error) {
    console.log(error)
  }
}
// prettier-ignore
async function onFetchOrganizations() {
  try {
    // prettier-ignore
    const { data: { result } } = await apiOrganizations.getOrganizations({ page: 1, itemsPerPage: -1 })
    organizations.value = result.items
    // ? Set the organizations tree id
    activatedIds.value = [organizations.value[0].id]
    // ? Set the fitlers
    defaultFilters.organizationId = organizations.value[0].id
    filters.value = { ...defaultFilters }
  } catch(error) {
    console.log(error)
  }
}
/**
 * * Organizations Tree
 * ? Always return string[], selected default 0 index
 */
const activatedIds = ref<string[]>([])
/**
 * * Watcher
 */
// ? Update accounts when change organizaiton
watch(activatedIds, async () => {
  filters.value.organizationId = activatedIds.value[0]
  await onFetchAccounts()
})
/**
 * * AccountCreateEditDrawer
 */
const isEditing = ref(false)
const createEditDrawer = ref(false)
async function onOpenCreateEditDrawer(value: boolean, account?: Account) {
  isEditing.value = value
  if (isEditing.value && account) {
    try {
      await onFetchAccountById(account.id)
    } catch (error) {
      console.log('Open CreateEditDrawer Failed')
    }
  } else {
    currentAccount.value = { ...defaultAccount }
  }
  createEditDrawer.value = true
}
async function onSaveCreateEditDrawer(account: CreateAccountDto) {
  currentAccount.value = account
  try {
    if (isEditing.value) {
      await onUpdateAccountById()
    } else {
      await onCreateAccount()
    }
  } catch {
    console.log('Save CreateEditDrawer Failed')
  } finally {
    createEditDrawer.value = false
    await onFetchAccounts()
  }
}

/**
 * * AccountOrganizationsDialog
 */
const organizationsDialog = ref(false)
async function onOpenOrganizaitonDialog(account: Account) {
  organizationsDialog.value = true
  await onFetchAccountById(account.id)
}
async function onSaveOrganizationsDialog() {
  await onUpdateAccountById()
  organizationsDialog.value = false
}

/**
 * * DeleteConfirmDialog
 */
const deleteConfirmDialog = ref(false)
const deleteMode = ref<DeleteMode>('single')
function onOpenDeleteConfirmDialog(mode: DeleteMode, account?: Account) {
  deleteMode.value = mode
  deleteConfirmDialog.value = true
  if (mode === 'single') {
    currentAccount.value.id = account?.id
  }
}
async function onConfirmDelete(mode: DeleteMode) {
  try {
    if (mode === 'single') {
      await apiAccounts.deleteAccount(currentAccount.value.id!)
    } else {
      // TODO: API
      console.log(selectedAccounts.value)
    }
  } catch (error) {
    console.log('onConfirmDelete Failed')
  } finally {
    await onFetchAccounts()
    deleteConfirmDialog.value = false
  }
}

onMounted(async () => {
  await Promise.all([onFetchOrganizations(), onFetchRoles()])
})
</script>

<template>
  <VContainer fluid>
    <VRow>
      <!-- Organizations Tree -->
      <VCol
        cols="12"
        lg="3"
        md="4"
        sm="4"
      >
        <VCard>
          <VCardTitle>Organizations</VCardTitle>
          <VCardText>
            <!-- Tree -->
            <TreeActivator
              v-model="activatedIds"
              :items="organizations"
              mandatory
            />
          </VCardText>
        </VCard>
      </VCol>
      <VCol
        cols="12"
        lg="9"
        md="8"
        sm="8"
      >
        <div class="d-flex flex-column ga-4">
          <!-- Query -->
          <QueryFilterPanel
            :fields="fileterFields"
            :form="filters"
            @submit="onFilterSubmit"
            @reset="onFilterReest"
            @create="onFilterCreate"
          />
          <!-- Table -->
          <VCard>
            <VCardTitle>Accounts</VCardTitle>
            <VCardText>
              <VDataTableServer
                v-model="selectedAccounts"
                v-model:page="tableMeta.page"
                v-model:items-per-page="tableMeta.itemsPerPage"
                show-select
                @update:options="onFetchAccounts"
                :loading="tableMeta.loading"
                :items="accounts"
                :items-length="tableMeta.itemsLength"
                :headers="headers"
              >
                <template #top>
                  <VCardActions>
                    <VBtn
                      color="primary"
                      @click="onOpenCreateEditDrawer(false)"
                    >
                      <VIcon
                        icon="mdi-plus-thick"
                        start
                      />
                      <span>New Item</span>
                    </VBtn>
                    <VSlideXTransition>
                      <VBtn
                        v-if="isSelectedAccounts"
                        color="error"
                        @click="onOpenDeleteConfirmDialog('multiple')"
                      >
                        <VIcon
                          icon="mdi-delete-outline"
                          start
                        />
                        <span>Delete Selected</span>
                      </VBtn>
                    </VSlideXTransition>
                  </VCardActions>
                </template>
                <template #loading>
                  <VSkeletonLoader type="table-row@4" />
                </template>
                <template #[`item.avatarUrl`]="{ item }">
                  <AvatarWithError
                    :image="item.profile.avatarUrl"
                    :size="40"
                    :text="item.name"
                  />
                </template>
                <template #[`item.email`]="{ item }">
                  <span>{{ item.profile.email }}</span>
                </template>
                <template #[`item.status`]="{ item }">
                  <span>{{ item.profile.status }}</span>
                </template>
                <template #[`item.gender`]="{ item }">
                  <span>{{ item.profile.gender }}</span>
                </template>
                <template #[`item.roles`]="{ item }">
                  <pre>{{ JSON.stringify(item.roles.map((role) => role.name)) }}</pre>
                </template>
                <template #[`item.actions`]="{ item }">
                  <VCardActions>
                    <VTooltip
                      v-for="btn in tableRowActions"
                      :key="btn.title"
                      :text="btn.title"
                      location="top"
                    >
                      <template #activator="args">
                        <VBtn
                          v-bind="args.props"
                          :icon="btn.icon"
                          @click="btn.cb(item)"
                          :color="btn.color"
                        />
                      </template>
                    </VTooltip>
                  </VCardActions>
                </template>
              </VDataTableServer>
            </VCardText>
          </VCard>
        </div>
      </VCol>
    </VRow>

    <!-- * AccountCreateEditDrawer -->
    <AccountCreateEditDrawer
      v-model="createEditDrawer"
      @save="onSaveCreateEditDrawer"
      :roles="roles"
      :organizaitons="organizations"
      :is-editing="isEditing"
      :account="currentAccount"
    />

    <!-- * AccountOrganizations -->
    <AccountOrganizationsDialog
      v-model="organizationsDialog"
      v-model:selected="currentAccount.organizationIds"
      @save="onSaveOrganizationsDialog"
      :organizationIds="currentAccount.organizationIds"
      :items="organizations"
    />

    <!-- * Dialog -->
    <DeleteConfirmDialog
      v-model="deleteConfirmDialog"
      @confirm="onConfirmDelete"
      :mode="deleteMode"
    />
  </VContainer>
</template>
