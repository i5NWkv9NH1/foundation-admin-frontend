<script setup lang="ts">
  import { ref, watch } from 'vue'
  import dayjs from 'dayjs'
  import { useCrud } from '@/composables'
  import { Role, TableHeader } from '@/types'

  const headers = ref<TableHeader[]>([
    { title: 'Name', key: 'name', align: 'start', sortable: false },
    { title: 'Code', key: 'code', align: 'start', sortable: false },
    { title: 'CreatedAt', key: 'createdAt', align: 'start', sortable: true },
    { title: 'Actions', key: 'actions', align: 'start', sortable: false },
  ])

  const itemsPerPage = ref(10)
  const page = ref(1)
  const { items, meta, loading, search, refetch } = useCrud<Role>('/roles')

  type DialogType = 'assignPermissions' | 'edit' | 'delete'
  const dialogs = ref<Record<DialogType, boolean>>({
    assignPermissions: false,
    edit: false,
    delete: false,
  })

  const selectedItem = ref<Role[] | null>()

  const loadItems = async ({ page: pageNum, itemsPerPage: pageSize }: any) => {
    await refetch(pageNum, pageSize)
  }

  const openDialog = (dialog: DialogType, item: any = null) => {
    selectedItem.value = item
    dialogs.value[dialog] = true
  }

  const closeDialog = (dialog: DialogType) => {
    dialogs.value[dialog] = false
    selectedItem.value = null
  }

  const handleAction = (dialog: DialogType) => {
    // Logic for saving permissions, editing role, or deleting role
    closeDialog(dialog)
  }

  watch([page, itemsPerPage, search], () =>
    loadItems({ page: page.value, itemsPerPage: itemsPerPage.value })
  )
</script>

<template>
  <VContainer fluid>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-h4">Roles</div>
      <VBtn color="primary" @click="openDialog('edit')"> Add Role </VBtn>
    </div>
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      v-model:model-value="selectedItem"
      :headers="headers"
      item-value="name"
      :items="items"
      :items-length="meta.itemsCount"
      :loading="loading"
      :search="search"
      show-select
      @update:options="loadItems"
    >
      <template #item.createdAt="{ item }">
        {{ dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex align-center">
          <VBtn
            icon="mdi-shield-account"
            variant="text"
            @click="openDialog('assignPermissions', item)"
          />
          <VBtn
            icon="mdi-pencil"
            variant="text"
            @click="openDialog('edit', item)"
          />
          <VBtn
            color="red"
            icon="mdi-delete"
            variant="text"
            @click="openDialog('delete', item)"
          />
        </div>
      </template>
    </VDataTableServer>

    <VDialog v-model="dialogs.assignPermissions" max-width="500">
      <VCard>
        <VCardTitle>Assign Permissions</VCardTitle>
        <VCardText>
          <!-- Content for assigning permissions goes here -->
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn @click="closeDialog('assignPermissions')">Cancel</VBtn>
          <VBtn
            color="primary"
            @click="handleAction('assignPermissions')"
          >Save</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog v-model="dialogs.edit" max-width="500">
      <VCard>
        <VCardTitle>{{ selectedItem ? 'Edit Role' : 'Add Role' }}</VCardTitle>
        <VCardText>
          <!-- Content for editing role goes here -->
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn @click="closeDialog('edit')">Cancel</VBtn>
          <VBtn color="primary" @click="handleAction('edit')">Save</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog v-model="dialogs.delete" max-width="400">
      <VCard>
        <VCardTitle>Delete Role</VCardTitle>
        <VCardText> Are you sure you want to delete this role? </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn @click="closeDialog('delete')">Cancel</VBtn>
          <VBtn color="red" @click="handleAction('delete')">Delete</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VContainer>
</template>
