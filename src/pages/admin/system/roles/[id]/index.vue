<template>
  <VContainer fluid>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-h4 mb-4">{{ isEdit ? 'Edit Role' : 'Add Role' }}</div>
      <VBtn color="secondary" :to="'/admin/system/roles'"> Back to Roles </VBtn>
    </div>
    <VForm @submit.prevent="handleSubmit">
      <VTextField v-model="form.name" label="Name" required />
      <!-- Here you can add more fields if needed -->
      <VBtn color="primary" type="submit">{{
        isEdit ? 'Save Changes' : 'Add Role'
      }}</VBtn>
    </VForm>
  </VContainer>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'

  type RoleRouteParams = {
    id: string
  }

  const route = useRoute()
  const router = useRouter()

  const isEdit = ref(false)
  const form = ref({
    name: '',
  })

  const loadRole = async (id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3200/api/system/roles/${id}`
      )
      form.value = response.data
    } catch (error) {
      console.error('Failed to load role:', error)
    }
  }

  const handleSubmit = async () => {
    try {
      if (isEdit.value) {
        await axios.put(
          `http://localhost:3200/api/system/roles/${(route.params as RoleRouteParams).id}`,
          form.value
        )
        alert('Role updated successfully!')
      } else {
        await axios.post('http://localhost:3200/api/system/roles', form.value)
        alert('Role added successfully!')
      }
      router.push('/admin/system/roles')
    } catch (error) {
      console.error('Failed to save role:', error)
    }
  }

  onMounted(() => {
    const id = (route.params as RoleRouteParams).id
    if (id === '-1') {
      isEdit.value = false
    } else {
      isEdit.value = true
      loadRole(id)
    }
  })
</script>
