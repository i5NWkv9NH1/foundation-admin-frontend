<template>
  <VContainer fluid>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-h4 mb-4">
        {{ isEdit ? 'Edit Action' : 'Add Action' }}
      </div>
      <VBtn
        color="secondary"
        :to="'/admin/system/actions'"
      >Back to Actions</VBtn>
    </div>
    <VForm @submit.prevent="handleSubmit">
      <VTextField v-model="form.name" label="Name" required />
      <VTextField v-model="form.code" label="Code" required />
      <VTextField v-model="form.icon" label="Icon" required />
      <VTextField v-model="form.menuId" label="Menu ID" />
      <VBtn color="primary" type="submit">{{
        isEdit ? 'Save Changes' : 'Add Action'
      }}</VBtn>
    </VForm>
  </VContainer>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'

  type ActionRouteParams = {
    id: string
  }

  const route = useRoute()
  const router = useRouter()

  const isEdit = ref(false)
  const form = ref({
    name: '',
    code: '',
    icon: '',
    menuId: '',
  })

  const loadAction = async (id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3200/api/system/actions/${id}`
      )
      form.value = response.data
    } catch (error) {
      console.error('Failed to load action:', error)
    }
  }

  const handleSubmit = async () => {
    try {
      if (isEdit.value) {
        await axios.put(
          `http://localhost:3200/api/system/actions/${(route.params as ActionRouteParams).id}`,
          form.value
        )
        alert('Action updated successfully!')
      } else {
        await axios.post('http://localhost:3200/api/system/actions', form.value)
        alert('Action added successfully!')
      }
      router.push('/admin/system/actions')
    } catch (error) {
      console.error('Failed to save action:', error)
    }
  }

  onMounted(() => {
    const id = (route.params as ActionRouteParams).id
    if (id === '-1') {
      isEdit.value = false
    } else {
      isEdit.value = true
      loadAction(id)
    }
  })
</script>
