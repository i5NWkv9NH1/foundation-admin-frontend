<!--
 * 重定向用
-->

<script setup lang="ts">
  const router = useRouter()
  router.push('/admin/system/users') // 自动重定向到默认页面
</script>

<template>
  <RouterView />
</template>
