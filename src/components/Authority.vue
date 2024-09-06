<script setup lang="ts">
import { usePermissionStore } from '@/stores';
import { every, isArray, isEmpty, some } from 'lodash';

interface Props {
  permission: string[] | string;
}
const props = withDefaults(defineProps<Props>(), {
  permission: () => [],
});


const permissionStore = usePermissionStore()
const showSlot = computed(() => {
  if (!props.permission) return false;

  if (isEmpty(permissionStore.permissions.actions)) {
    return false;
  }

  if (isArray(props.permission)) {
    return every(props.permission, (p) => some(permissionStore.permissions.actions, { code: p }))
  }
  return some(permissionStore.permissions.actions, { code: props.permission })

});
</script>

<template>
  <slot v-if="showSlot" :userPermissions="permissionStore.permissions.actions" />
</template>
