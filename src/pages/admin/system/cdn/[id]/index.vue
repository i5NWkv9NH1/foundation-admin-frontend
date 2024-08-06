<template>
  <VContainer fluid>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-h4 mb-4">{{ isEdit ? 'Edit CDN' : 'Add CDN' }}</div>
      <VBtn color="secondary" :to="'/admin/system/cdn'">Back to CDNs</VBtn>
    </div>
    <VForm @submit.prevent="handleSubmit">
      <VTextField v-model="form.name" label="Name" required />
      <VTextField v-model="form.baseUrl" label="Base URL" required />
      <VTextField v-model="form.description" label="Description" />
      <VBtn color="primary" type="submit">{{
        isEdit ? 'Save Changes' : 'Add CDN'
      }}</VBtn>
    </VForm>
  </VContainer>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'

  type CDNRouteParams = {
    id: string
  }

  const route = useRoute()
  const router = useRouter()

  const isEdit = ref(false)
  const form = ref({
    name: '',
    baseUrl: '',
    description: '',
  })

  const loadCDN = async (id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3200/api/system/cdn/${id}`
      )
      form.value = response.data
    } catch (error) {
      console.error('Failed to load CDN:', error)
    }
  }

  const handleSubmit = async () => {
    try {
      if (isEdit.value) {
        await axios.put(
          `http://localhost:3200/api/system/cdn/${(route.params as CDNRouteParams).id}`,
          form.value
        )
        alert('CDN updated successfully!')
      } else {
        await axios.post('http://localhost:3200/api/system/cdn', form.value)
        alert('CDN added successfully!')
      }
      router.push('/admin/system/cdn')
    } catch (error) {
      console.error('Failed to save CDN:', error)
    }
  }

  onMounted(() => {
    const id = (route.params as CDNRouteParams).id
    if (id === '-1') {
      isEdit.value = false
    } else {
      isEdit.value = true
      loadCDN(id)
    }
  })
</script>
