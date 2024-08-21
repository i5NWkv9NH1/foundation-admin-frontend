<!--
  *  With API and state
  *
-->
<script setup lang="ts">
import { apiMenus, apiRoles } from '@/api'
import { Action, Menu, Role, TableHeader, TableMeta } from '@/types'

interface Props {
  menus?: Menu[]
  activatedRole?: Role
  closeOnSave?: boolean
}
/**
 * * Table
 */
const headers = ref<TableHeader[]>([
  { title: 'Name', value: 'name', sortable: false, key: 'name' },
  { title: '@Code', value: 'code', sortable: false, key: 'code' },
  { title: 'Icon', value: 'icon', sortable: false, key: 'icon' }
])
const tableMeta = ref<TableMeta>({
  page: 1,
  itemsPerPage: -1,
  itemsLength: 0,
  pagesLength: 0,
  loading: false
})

const props = withDefaults(defineProps<Props>(), {
  closeOnSave: false
})
const modelValue = defineModel<boolean>('modelValue', { required: true })
/**
 * * Menus
 */
const activatedMenuIds = ref<string[]>([])
const activatedMenuId = computed(() => activatedMenuIds.value && activatedMenuIds.value[0])

watchEffect(async () => {
  if (!props.menus || !props.activatedRole) return
  activatedMenuIds.value = [props.menus[0].id]
})

watch(activatedMenuIds, async () => {
  await Promise.all([onFetchActionsByMenuId(), onFetchActionsByRoleIdByMenuId()])
})

/**
 * * Actions
 */
const actions = shallowRef<Action[]>()
// ? Be equal activatedActions of menu of role
const selectedActions = ref<string[]>([])
// ? Transform object type: MutableReactiveHandler.MutableReactiveHandler
// ? To MutableReactiveHandler.raw
/**
 * * API
 */
//? Fetch all actions of menu id
async function onFetchActionsByMenuId() {
  // if (!activatedMenuId.value) return
  try {
    tableMeta.value.loading = true
    const {
      data: { result }
    } = await apiMenus.getMenuById(activatedMenuId.value)
    actions.value = result.actions
  } catch (error) {
    console.log(error)
  } finally {
    tableMeta.value.loading = false
  }
}
//? Fetch actions of menu id of role id
async function onFetchActionsByRoleIdByMenuId() {
  // if (!props.activatedRole || !activatedMenuId.value) return
  try {
    const {
      data: { result }
    } = await apiRoles.getRoleActionsByRoleIdMenuId({
      roleId: props.activatedRole!.id,
      menuId: activatedMenuId.value,
      page: tableMeta.value.page,
      itemsPerPage: tableMeta.value.itemsPerPage
    })
    // ids
    selectedActions.value = result.items.map((action) => action.id)
    // selectedActions.value = result.items
  } catch (error) {
    console.log(error)
  }
}
async function onUpdateActionsByRoleIdByMenuId() {
  try {
    await apiRoles.updateRoleActionsByRoleIdMenuId(props.activatedRole!.id, activatedMenuId.value, selectedActions.value)
  } catch (error) {
    console.log(error)
  } finally {
    modelValue.value = false
  }
}
async function onSave() {
  await onUpdateActionsByRoleIdByMenuId()
  // await onFetchActionsByMenuId()
  // await onFetchActionsByRoleIdByMenuId()
}
</script>

<template>
  <VDialog
    v-model="modelValue"
    scrollable
    close-on-back
    max-width="800px"
    max-height="600px"
  >
    <VCard>
      <VCardTitle>Role Actions</VCardTitle>
      <VCardSubtitle> Current Role: {{ props.activatedRole?.name }} </VCardSubtitle>
      <VCardText>
        <VRow>
          <!-- prettier-ignore -->
          <VCol cols="12" sm="4" md="4" lg="4">
            <TreeActivator
              v-model="activatedMenuIds"
              :items="props.menus"
              :item-title="(menu: Menu) => menu.name"
              :item-value="(menu: Menu) => menu.id"
              class="overflow-y-scroll position-sticky top-0"
              :style="{ maxHeight: '400px' }"
              mandatory
            />
          </VCol>
          <!-- prettier-ignore -->
          <VCol
            cols="12"  sm="8" md="8" lg="8"
          >
            <VDataTableServer
              v-model:model-value="selectedActions"
              v-model:page="tableMeta.page"
              v-model:items-per-page="tableMeta.itemsPerPage"
              :loading="tableMeta.loading"
              :items="actions"
              :items-length="tableMeta.itemsLength"
              :headers="headers"
              show-select
              :item-key="(action: Action) => action.id"
              :item-value="(action: Action) => action.id"
              hide-default-footer
              hover
            >
            <template #loading>
              <VSkeletonLoader type="table-row@4" />
            </template>
              <template #[`item.icon`]="{ item }">
                <VIcon :icon="item.icon || 'mdi-empty'" />
              </template>
              <template #[`item.code`]="{ item }">
                <VCode class="bg-secondary text-body-2 font-weight-bold">{{ item.code }}</VCode>
              </template>
            </VDataTableServer>
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VBtn @click="modelValue = false">
          <VIcon
            icon="mdi-close-thick"
            start
          />
          <span>Cancel</span>
        </VBtn>
        <VBtn
          @click="onSave"
          color="primary"
        >
          <VIcon
            icon="mdi-content-save-outline"
            start
          />
          <span>Save</span>
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
