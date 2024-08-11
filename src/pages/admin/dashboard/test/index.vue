<script setup lang="ts">
import { useCrud } from '@/composables';

const roleService = useCrud('/roles');
const orgService = useCrud('/organizations');
const accountService = useCrud('/accounts');

onMounted(async () => {
  await Promise.all([
    accountService.refetch(),
    orgService.refetch(),
    roleService.refetch()
  ]);
});
const form = ref({
  roles: []
});
</script>

<template>
  <VContainer>
    <VSelect
      v-model="form.roles"
      item-props
      :item-title="'name'"
      :items="roleService.items.value"
      multiple
      return-object
    />
  </VContainer>
</template>
