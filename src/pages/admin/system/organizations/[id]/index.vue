<template>
  <VContainer fluid>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-h4">
        {{ isEdit ? 'Edit Organization' : 'Add Organization' }}
      </div>
      <VBtn
        color="secondary"
        :to="'/admin/system/organizations'"
      >
        Back to Organizations
      </VBtn>
    </div>
    <VForm @submit.prevent="handleSubmit">
      <VTextField
        v-model="form.label"
        label="Label"
        required
      />
      <VTextField
        v-model="form.type"
        label="Type"
        required
      />
      <VTextField
        v-model="form.icon"
        label="Icon"
        readonly
        @click.stop="openIconSelector"
      >
        <template #append-inner>
          <VBtn
            icon="mdi-emoticon-happy-outline"
            variant="text"
            @click="openIconSelector"
          />
        </template>
      </VTextField>
      <IconSelector
        v-model="dialog"
        v-model:icon="form.icon"
      />
      <VBtn
        color="primary"
        type="submit"
      >
        {{ isEdit ? 'Save Changes' : 'Add Organization' }}
      </VBtn>
    </VForm>
  </VContainer>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

type OrganizationRouteParams = {
  id: string;
};

const route = useRoute();
const router = useRouter();

const isEdit = ref(false);
const form = ref({
  label: '',
  type: '',
  icon: ''
});

const loadOrganization = async (id: string) => {
  try {
    const response = await axios.get(`http://localhost:3200/api/system/organizations/${id}`);
    form.value = response.data;
  } catch (error) {
    console.error('Failed to load organization:', error);
  }
};

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await axios.put(`http://localhost:3200/api/system/organizations/${(route.params as OrganizationRouteParams).id}`, form.value);
      alert('Organization updated successfully!');
    } else {
      await axios.post('http://localhost:3200/api/system/organizations', form.value);
      alert('Organization added successfully!');
    }
    router.push('/admin/system/organizations');
  } catch (error) {
    console.error('Failed to save organization:', error);
  }
};

const openIconSelector = () => {
  dialog.value = true;
};

const dialog = ref(false);

onMounted(() => {
  const id = (route.params as OrganizationRouteParams).id;
  if (id !== '-1') {
    isEdit.value = true;
    loadOrganization(id);
  }
});
</script>
