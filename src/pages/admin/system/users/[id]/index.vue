<template>
  <VContainer>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-h4 mb-4">{{ isEdit ? 'Edit User' : 'Add User' }}</div>
      <VBtn color="secondary" :to="'/admin/system/users'"> Back to Users </VBtn>
    </div>
    <!-- Form or other content here -->
    <VForm @submit.prevent="handleSubmit">
      <div class="d-flex align-center mb-4">
        <template v-if="!isEdit">
          <VAvatar class="mr-4" color="primary" size="80" />
        </template>
        <template v-else>
          <VAvatar
            class="mr-4"
            :image="form.avatarUrl || getRandomAvatar(form.phone)"
            size="80"
          />
        </template>
        <!-- <VBtn color="primary" @click="openImagePicker">Change Avatar</VBtn> -->
      </div>
      <VTextField v-model="form.name" label="Name" required />
      <VTextField v-model="form.username" label="Username" required />
      <VTextField v-model="form.phone" label="Phone" required />
      <VTextField v-model="form.email" label="Email" required />
      <VTextField v-model="form.address" label="Address" />
      <VBtn color="primary" type="submit">{{
        isEdit ? 'Save Changes' : 'Add User'
      }}</VBtn>
    </VForm>
  </VContainer>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'
  import { getRandomAvatar } from '@/helpers'

  type UserRouteParams = {
    id: string
  }

  const route = useRoute()
  const router = useRouter()

  const isEdit = ref(false)
  const form = ref({
    name: '',
    username: '',
    phone: '',
    email: '',
    avatarUrl: '',
    address: '',
  })

  const loadUser = async (id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3200/api/system/users/${id}`
      )
      form.value = response.data
    } catch (error) {
      console.error('Failed to load user:', error)
    }
  }

  const handleSubmit = async () => {
    try {
      if (isEdit.value) {
        await axios.put(
          `http://localhost:3200/api/system/users/${(route.params as UserRouteParams).id}`,
          form.value
        )
        alert('User updated successfully!')
      } else {
        await axios.post('http://localhost:3200/api/system/users', form.value)
        alert('User added successfully!')
      }
      router.push('/admin/system/users')
    } catch (error) {
      console.error('Failed to save user:', error)
    }
  }

  onMounted(() => {
    const id = (route.params as UserRouteParams).id
    if (id === '-1') {
      isEdit.value = false
    } else {
      isEdit.value = true
      loadUser(id)
    }
  })
</script>
