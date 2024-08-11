<!--
 * 父级模板
 * 使用 layout 去定义
 * 显示子路由: auth/*
-->
<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterView />
</template>

<route lang="yaml">
meta:
  layout: auth
</route>
