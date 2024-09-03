<script setup lang="ts">
import { usePermissionStore } from '@/stores';

interface Props {
  permission: string[];
}
const props = withDefaults(defineProps<Props>(), {
  permission: () => [],
});


const permissionStore = usePermissionStore()
const showSlot = computed(() => {
  // 没有传入权限，直接显示
  if (!props.permission) return true;

  if (!permissionStore.permissions.actions) {
    return false;
  }

  // 如果插槽按钮需要多个权限才能显示
  if (Array.isArray(props.permission)) {
    // 判断父组件传过来的 permission 是不是当前用户权限拥有的
    return props.permission.every(p => permissionStore.permissions.actions.some(a => a.name === p));
  } else {
    // 如果父组件传过来单个权限
    return permissionStore.permissions.actions.includes(props.permission);
  }
});
</script>

<template>
  <slot v-if="showSlot" :userPermissions="permissionStore.permissions.actions" />
</template>
