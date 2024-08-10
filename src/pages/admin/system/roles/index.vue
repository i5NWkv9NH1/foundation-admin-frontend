<template>
  <VContainer>
    <!-- 角色数据表格 -->
    <div class="d-flex align-center">
      <VBtn @click="openAddDialog">
        <VIcon start>mdi-plus</VIcon>
        <span>New Role</span>
      </VBtn>
    </div>
    <VDataTableServer
      v-model:items-per-page="paginate.itemsPerPage"
      :headers="headers"
      item-value="name"
      :items="roles"
      :items-length="paginate.itemsCount"
      :loading="loading"
    >
      <template #item.createdAt="{ item }">
        {{ dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex align-center">
          <VBtn
            icon="mdi-pencil"
            variant="text"
            @click="openRoleDialog(item)"
          />
          <VBtn
            color="red"
            icon="mdi-delete"
            variant="text"
            @click="openDeleteDialog(item.id)"
          />
          <VBtn
            icon="mdi-shield-account"
            variant="text"
            @click="openPermissionDialog(item)"
          />
        </div>
      </template>
    </VDataTableServer>

    <!-- 编辑角色对话框 -->
    <VDialog v-model="roleDialog.show" max-width="500px">
      <VCard>
        <VCardTitle>
          {{ roleDialog.isEdit ? '编辑角色' : '新增角色' }}
        </VCardTitle>
        <VCardText>
          <VForm @submit.prevent="saveRole">
            <VTextField
              v-model="roleDialog.form.name"
              label="角色名称"
              required
            />
            <VTextField
              v-model="roleDialog.form.code"
              label="角色代码"
              required
            />
            <VTextField
              v-model="roleDialog.form.createdAt"
              label="创建时间"
              readonly
            />
            <VBtn color="primary" type="submit">{{
              roleDialog.isEdit ? '更新' : '保存'
            }}</VBtn>
            <VBtn color="secondary" @click="closeRoleDialog">取消</VBtn>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- 权限分配对话框 -->
    <VDialog v-model="permissionDialog.show" max-width="800px">
      <VCard>
        <VCardTitle>权限分配</VCardTitle>
        <VCardText>
          <VTreeview
            v-model:activated="selectedMenuIds"
            item-children="children"
            item-text="name"
            item-value="id"
            :items="menus"
            @update:active="fetchPermissions"
          />
          <VDataTable
            :headers="actionHeaders"
            item-value="id"
            :items="permissionDialog.currentActions"
            :items-length="permissionDialog.currentActions.length"
          >
            <template #item.actions="{ item }">
              <VCheckbox
                v-model="item.selected"
                :label="item.name"
                :value="item.id"
              />
            </template>
          </VDataTable>
        </VCardText>
        <VCardActions>
          <VBtn color="secondary" @click="closePermissionDialog">取消</VBtn>
          <VBtn color="primary" @click="savePermissions">保存</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VContainer>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import axios from 'axios'
  import dayjs from 'dayjs'
  import { v4 } from 'uuid'
  import { Action, Menu, Role, TableHeader } from '@/types'

  const headers = ref<TableHeader[]>([
    { title: 'Name', key: 'name', align: 'start', sortable: false },
    { title: 'Code', key: 'code', align: 'start', sortable: false },
    { title: 'CreatedAt', key: 'createdAt', align: 'start', sortable: true },
    { title: 'Actions', key: 'actions', align: 'start', sortable: false },
  ])

  const paginate = ref({
    itemsPerPage: 999,
    page: 1,
    itemsCount: 0,
    pagesCount: 0,
  })

  const roles = ref<Role[]>([])
  const menus = ref<Menu[]>([])
  const loading = ref<boolean>(false)
  const url = 'http://localhost:3200/api/system'

  const defaultActions: Action[] = [
    { id: v4(), name: 'Create', code: 'create', icon: 'mdi-plus' },
    { id: v4(), name: 'Read', code: 'read', icon: 'mdi-eye' },
    { id: v4(), name: 'Update', code: 'update', icon: 'mdi-pencil' },
    { id: v4(), name: 'Delete', code: 'delete', icon: 'mdi-delete' },
  ]

  const roleDialog = ref({
    show: false,
    isEdit: false,
    form: {} as Role,
  })

  const permissionDialog = ref({
    show: false,
    selectedMenuIds: [] as string[],
    currentActions: [] as Action[],
  })

  const actionHeaders = ref([
    { text: '名称', value: 'name' },
    { text: '操作', value: 'actions' },
  ])

  async function apiFindRoles () {
    const response = await axios.get(`${url}/roles`)
    roles.value = response.data.result.items || []
    paginate.value.itemsCount = response.data.result.items.length
  }

  async function apiFindMenus () {
    const response = await axios.get(`${url}/menus`)
    menus.value = response.data.result || []
  }

  async function apiFindRole (id: string) {
    const response = await axios.get(`${url}/roles/${id}`)
    return response.data.result
  }

  async function apiUpdateRole (entity: Role) {
    const response = await axios.put(`${url}/roles/${entity.id}`, entity)
    return response.data.result
  }

  async function apiCreateRole (entity: Role) {
    const response = await axios.post(`${url}/roles`, entity)
    return response.data.result
  }

  async function apiDeleteRole (id: string) {
    await axios.delete(`${url}/roles/${id}`)
    await apiFindRoles() // Refresh roles list after deletion
  }

  async function fetchPermissions (menuIds: string[]) {
    if (menuIds.length > 0) {
      const selectedMenuId = menuIds[0]
      const response = await axios.get(`${url}/menus/${selectedMenuId}`)
      const permissions = response.data.result.actions
      permissionDialog.value.currentActions = permissions.map(action => ({
        ...action,
        selected: defaultActions.some(
          defaultAction => defaultAction.code === action.code
        ),
      }))
    } else {
      permissionDialog.value.currentActions = []
    }
  }

  function openRoleDialog (role: Role) {
    roleDialog.value.isEdit = true
    roleDialog.value.form = { ...role }
    roleDialog.value.show = true
  }

  function openAddDialog () {
    roleDialog.value.isEdit = false
    roleDialog.value.form = {} as Role
    roleDialog.value.show = true
  }

  function closeRoleDialog () {
    roleDialog.value.show = false
  }

  function openPermissionDialog (role: Role) {
    permissionDialog.value.show = true
  // Assuming role has a menuId or similar to fetch permissions for this role
  // Replace this with actual API call if needed
  }

  function closePermissionDialog () {
    permissionDialog.value.show = false
  }

  async function saveRole () {
    if (roleDialog.value.isEdit) {
      await apiUpdateRole(roleDialog.value.form)
    } else {
      await apiCreateRole(roleDialog.value.form)
    }
    await apiFindRoles()
    closeRoleDialog()
  }

  async function savePermissions () {
    // 保存权限逻辑
    closePermissionDialog()
  }

  function openDeleteDialog (id: string) {
    apiDeleteRole(id).then(() => apiFindRoles())
  }

  onMounted(async () => {
    await apiFindRoles()
    await apiFindMenus()
  })
</script>
