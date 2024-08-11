<template>
  <VContainer fluid>
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-h4 mb-4">{{ isEdit ? 'Edit Menu' : 'Add Menu' }}</div>
      <VBtn
        color="secondary"
        :to="'/admin/system/menus'"
        >Back to Menus</VBtn
      >
    </div>
    <VForm @submit.prevent="handleSubmit">
      <VTextField
        v-model="form.label"
        label="Label"
        required
      />
      <VTextField
        v-model="form.router"
        label="Router"
        required
      />
      <VTextField
        v-model="form.path"
        label="Path"
      />
      <VTextField
        v-model="form.icon"
        label="Icon"
        readonly
        @click.stop="openIconSelector"
      >
        <template #append-inner>
          <VBtn
            icon="mdi-heart"
            variant="text"
            @click="openIconSelector"
          />
        </template>
      </VTextField>
      <IconSelector
        v-model:dialog="IconSelectorDialog"
        v-model:icon="form.icon"
      />
      <VBtn
        color="primary"
        type="submit"
        >{{ isEdit ? 'Save Changes' : 'Add Menu' }}</VBtn
      >
    </VForm>
  </VContainer>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import IconSelector from '@/components/IconSelector.vue';

// Define the MenuRouteParams type
type MenuRouteParams = {
  id: string;
};

const route = useRoute();
const router = useRouter();

const isEdit = ref(false);
const form = ref({
  label: '',
  router: '',
  path: '',
  icon: ''
});

// Define the dialog state
const IconSelectorDialog = ref(false);

const openIconSelector = () => {
  IconSelectorDialog.value = true;
};

const loadMenu = async (id: string) => {
  try {
    const response = await axios.get(`http://localhost:3200/api/system/menus/${id}`);
    form.value = response.data;
  } catch (error) {
    console.error('Failed to load menu:', error);
  }
};

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await axios.put(`http://localhost:3200/api/system/menus/${(route.params as MenuRouteParams).id}`, form.value);
      alert('Menu updated successfully!');
    } else {
      await axios.post('http://localhost:3200/api/system/menus', form.value);
      alert('Menu added successfully!');
    }
    router.push('/admin/system/menus');
  } catch (error) {
    console.error('Failed to save menu:', error);
  }
};

onMounted(() => {
  const id = (route.params as MenuRouteParams).id;
  if (id === '-1') {
    isEdit.value = false;
  } else {
    isEdit.value = true;
    loadMenu(id);
  }
});
</script>
