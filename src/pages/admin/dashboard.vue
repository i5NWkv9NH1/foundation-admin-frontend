<script setup lang="ts"></script>

<!--
 * 父级模板
 * 显示子路由: analysis, workplace
-->

<template>
  <!-- <RouterView v-slot="{ Component, route }">
    <VSlideXTransition mode="out-in">
      <component :is="Component" :key="route.path" />
    </VSlideXTransition>
  </RouterView> -->
  <RouterView />
</template>
