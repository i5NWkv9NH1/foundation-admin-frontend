<template>
  <VContainer fluid>
    <VRow>
      <VCol cols="12" lg="4" md="4" sm="4">
        <VCard>
          <VCardText>
            <VTreeview
              v-model:activated="selectedMenu"
              activatable
              :item-children="itemChildren"
              item-props
              :item-title="itemTitle"
              :item-value="itemValue"
              :items="items"
              mandatory
            >
              <template #prepend="{ item, isActive }">
                <VBtn
                  v-if="item.children && item.children.length > 0"
                  :icon="isActive ? 'mdi-menu-down' : 'mdi-menu-right'"
                  size="24"
                  variant="text"
                />
              </template>
            </VTreeview>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" lg="8" md="8" sm="8">
        <VSlideXTransition hide-on-leave>
          <VForm :key="selectedMenu[0]">
            <div class="d-flex ga-4 mb-4">
              <VSlideXTransition group hide-on-leave>
                <template v-if="!readonly">
                  <VBtn variant="tonal" @click="handleCancelUpdate">
                    <VIcon start>mdi-close</VIcon>
                    <span>Cancel</span>
                  </VBtn>
                  <VBtn color="primary" @click="handleDone">
                    <VIcon start>mdi-check</VIcon>
                    <span>Done</span>
                  </VBtn>
                  <VBtn
                    v-if="savedForm.id"
                    color="error"
                    @click="handleDeleteMenu"
                  >
                    <VIcon start>mdi-delete</VIcon>
                    <span>Delete</span>
                  </VBtn>
                </template>
                <template v-else>
                  <VBtn variant="text" @click="toggleReadonly">
                    <VIcon start>mdi-plus</VIcon>
                    <span>Edit</span>
                  </VBtn>
                  <VBtn color="primary" @click="openCreateMenuDialog">
                    <VIcon start>mdi-plus</VIcon>
                    <span>New Menu</span>
                  </VBtn>
                </template>
              </VSlideXTransition>
            </div>
            <div class="d-flex flex-column ga-4">
              <VCard>
                <VCardTitle>Info: {{ savedForm.id }}</VCardTitle>
                <VCardText>
                  <div class="d-flex ga-4">
                    <VTextField
                      v-model="savedForm.label"
                      label="Label"
                      :readonly="readonly"
                    />
                    <VTextField
                      v-model="savedForm.router"
                      label="Router"
                      :readonly="readonly"
                    />
                    <VTextField
                      v-model="savedForm.icon"
                      label="Icon"
                      :prepend-inner-icon="savedForm.icon"
                      :readonly="readonly"
                    />
                  </div>
                  <div
                    v-if="selectedMenu.length"
                    class="d-flex flex-wrap ga-4 mb-4"
                  >
                    <VChip
                      v-for="menu in savedForm.path.split('.')"
                      :key="menu"
                      color="primary"
                      rounded="xl"
                      :text="menu"
                    />
                  </div>
                  <div class="d-flex ga-4">
                    <!-- <VTextField
                      v-model="savedForm.path"
                      label="path.id"
                      readonly
                    /> -->
                    <!-- <VTextField
                      active
                      label="path"
                      :value="
                        isSelectedMenu
                          ? savedForm.parent
                            ? `/${savedForm.parent.router}/${savedForm.router}`
                            : `/` + savedForm.router
                          : ''
                      "
                    /> -->
                    <VTextField
                      active
                      label="Parent"
                      :value="
                        isSelectedMenu
                          ? savedForm.parent
                            ? savedForm.parent.label
                            : 'Root'
                          : null
                      "
                    />
                  </div>
                </VCardText>
              </VCard>
              <VCard>
                <VCardTitle>Actions</VCardTitle>
                <VCardText>
                  <div class="d-flex ga-4 align-center mb-4">
                    <VBtn
                      :disabled="readonly"
                      icon="mdi-plus"
                      variant="text"
                      @click="openActionDialog()"
                    />
                    <VBtn
                      color="primary"
                      :disabled="readonly"
                      variant="elevated"
                      @click="addDefaultActions"
                    >
                      Add Default Actions
                    </VBtn>
                  </div>
                  <VDataTable :headers="headers" :items="savedForm.actions">
                    <template #item.crud="{ item }: { item: Action }">
                      <VBtn
                        color="primary"
                        :disabled="readonly"
                        icon="mdi-pen"
                        title="edit"
                        variant="text"
                        @click="openActionDialog(item)"
                      />
                      <VBtn
                        color="red"
                        :disabled="readonly"
                        icon="mdi-delete"
                        title="delete"
                        variant="text"
                        @click="handleRemoveAction(item.id!)"
                      />
                    </template>
                  </VDataTable>
                </VCardText>
              </VCard>
            </div>
          </VForm>
        </VSlideXTransition>
      </VCol>
    </VRow>

    <!-- Dialog for Creating/Editing Actions -->
    <VDialog v-model="isActionDialogVisible" max-width="500">
      <VCard>
        <VCardTitle>{{
          isEditingAction ? 'Edit Action' : 'Create Action'
        }}</VCardTitle>
        <VCardText>
          <VForm>
            <VTextField
              v-model="actionForm.name"
              label="Action Name"
              required
            />
            <VTextField
              v-model="actionForm.code"
              label="Action Code"
              required
            />
            <VTextField
              v-model="actionForm.icon"
              label="Action Icon"
              :prepend-inner-icon="actionForm.icon"
            />
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn color="red" @click="isActionDialogVisible = false">
            Cancel
          </VBtn>
          <VBtn color="green" @click="handleSaveAction"> Save </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Dialog for Creating Menu -->
    <VDialog v-model="isCreateMenuDialogVisible" max-width="500">
      <VCard>
        <VCardTitle>Create Menu</VCardTitle>
        <VCardText>
          <VForm>
            <VTextField v-model="createMenuForm.label" label="Label" required />
            <VTextField
              v-model="createMenuForm.router"
              label="Router"
              required
            />
            <VTextField
              v-model="createMenuForm.icon"
              label="Icon"
              :prepend-inner-icon="createMenuForm.icon"
            />
            <VTextField
              v-model="createMenuForm.parentId"
              active
              label="Parent ID"
            />
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn color="red" @click="closeCreateMenuDialog"> Cancel </VBtn>
          <VBtn color="green" @click="handleCreateMenu">Create</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VContainer>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import axios from 'axios'
  import { v4 } from 'uuid'
  import { Action, convertToTree, Menu } from '@/types'

  // Constants
  const API_BASE_URL = 'http://localhost:3200/api/system/menus'

  // State
  const items = ref<Menu[]>([])
  const loading = ref(true)
  const readonly = ref(true)
  const selectedMenu = ref<string[]>([])
  const isSelectedMenu = computed(() => selectedMenu.value.length !== 0)
  const headers = ref<any>([
    { title: 'Name', key: 'name', sortable: false },
    { title: 'Code', key: 'code', sortable: false },
    { title: 'Icon', key: 'icon', sortable: false },
    { title: 'CRUD', key: 'crud', sortable: false },
  ])

  // TODO: Icon picker

  // Default forms
  const defaultMenuForm = {
    id: '',
    createdAt: '',
    updatedAt: '',
    label: '',
    router: '',
    icon: '',
    actions: [],
    children: [],
    path: '',
    parent: null,
    parentId: null,
  }

  // Form states
  const form = ref<Menu>({ ...defaultMenuForm })
  const savedForm = ref<Menu>({ ...defaultMenuForm })
  const isActionDialogVisible = ref(false)
  const isCreateMenuDialogVisible = ref(false)
  const createMenuForm = ref<Menu>({ ...defaultMenuForm })

  const isEditingAction = ref(false)
  const actionForm = ref<Partial<Action>>({
    id: '',
    name: '',
    code: '',
    icon: '',
  })

  // API Functions
  async function apiGetMenu (id: string) {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data.result
  }

  async function apiCreateMenu (data: Menu) {
    const response = await axios.post(`${API_BASE_URL}`, data)
    return response.data
  }

  async function apiUpdateMenu (id: string, data: Menu) {
    const response = await axios.put(`${API_BASE_URL}/${id}`, data)
    return response.data.result
  }

  async function apiFindMenus (params: { page: number; itemsPerPage: number }) {
    const response = await axios.get(API_BASE_URL, { params })
    return response.data.result
  }

  async function apiDeleteMenu (id: string) {
    await axios.delete(`${API_BASE_URL}/${id}`)
    await refreshMenuList()
  }

  // Utility Functions
  const itemChildren = (item: any): any =>
    item.children.length === 0 ? false : item.children
  const itemTitle = (item: Menu) => `${item.label}`
  const itemValue = (item: Menu) => item.id

  function toggleReadonly () {
    readonly.value = !readonly.value
  }

  async function handleDone () {
    if (savedForm.value.id) {
      try {
        const updatedMenu = await apiUpdateMenu(
          savedForm.value.id,
          savedForm.value
        )
        await refreshMenuList()
        selectedMenu.value = [updatedMenu.id]
        form.value = { ...savedForm.value }
      } catch (error) {
        console.error('Error updating menu:', error)
      }
    }
    readonly.value = true
  }

  function handleCancelUpdate () {
    savedForm.value = { ...form.value }
    readonly.value = true
  }
  function addDefaultActions () {
    if (!isSelectedMenu.value) return // Ensure a menu is selected

    const menuId = selectedMenu.value[0] // Get the selected menu ID
    const newActions = [
      { id: v4(), name: 'Create', code: 'create', icon: 'mdi-plus', menuId },
      { id: v4(), name: 'Read', code: 'read', icon: 'mdi-eye', menuId },
      { id: v4(), name: 'Update', code: 'update', icon: 'mdi-pencil', menuId },
      { id: v4(), name: 'Delete', code: 'delete', icon: 'mdi-delete', menuId },
    ]

    savedForm.value.actions = [...savedForm.value.actions, ...newActions]
  }

  async function handleDeleteMenu () {
    await apiDeleteMenu(selectedMenu.value[0])
    selectedMenu.value = []
    readonly.value = true
  }
  async function handleSaveAction () {
    const actionList = [...savedForm.value.actions]
    if (isEditingAction.value) {
      const index = actionList.findIndex(a => a.id === actionForm.value.id)
      if (index !== -1) actionList[index] = { ...actionForm.value } as Action
    } else {
      actionForm.value.id = v4()
      actionList.push({ ...actionForm.value } as Action)
    }
    savedForm.value.actions = actionList
    isActionDialogVisible.value = false
  }

  async function handleCreateMenu () {
    try {
      const menu = { ...createMenuForm.value, id: v4() }
      delete menu.createdAt
      delete menu.updatedAt
      if (selectedMenu.value.length) {
        menu.parentId = selectedMenu.value[0]
      }
      const newMenu = await apiCreateMenu(menu)
      await refreshMenuList()
      selectedMenu.value = [newMenu.id]
    // form.value = { ...newMenu }
    // savedForm.value = { ...newMenu }
    } catch (error) {
      console.error('Error creating menu:', error)
    } finally {
      closeCreateMenuDialog()
    }
  }

  function handleRemoveAction (id: string) {
    savedForm.value.actions = savedForm.value.actions.filter(
      action => action.id !== id
    )
  }

  function openActionDialog (action?: Action) {
    isEditingAction.value = !!action
    actionForm.value = action
      ? { ...action }
      : { id: v4(), name: '', code: '', icon: '' }
    isActionDialogVisible.value = true
  }

  function openCreateMenuDialog () {
    createMenuForm.value = {
      ...defaultMenuForm,
      parentId: isSelectedMenu.value ? selectedMenu.value[0] : null,
    }
    isCreateMenuDialogVisible.value = true
  }

  function closeCreateMenuDialog () {
    isCreateMenuDialogVisible.value = false
  }

  async function refreshMenuList () {
    loading.value = true
    try {
      const result = await apiFindMenus({ page: 1, itemsPerPage: 9999 })
      items.value = convertToTree(result.items)
      console.log(items.value)
    } finally {
      loading.value = false
    }
  }

  watch(
    selectedMenu,
    async () => {
      if (selectedMenu.value.length) {
        readonly.value = true
        const selectedMenuId = selectedMenu.value[0]
        savedForm.value = await apiGetMenu(selectedMenuId)
        form.value = { ...savedForm.value }
      }
    },
    { deep: true }
  )

  await refreshMenuList()
</script>
