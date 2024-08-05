<!--
 * 父级模板
 * 使用 layout 去定义
 * 显示子路由: dashboard/*, system/*
-->

<template>
  <VApp>
    <AdminDrawer />
    <AdminTopbar />
    <VMain>
      <RouterView v-slot="{ Component, route }">
        <VSlideXReverseTransition>
          <component :is="Component" :key="route.path" />
        </VSlideXReverseTransition>
      </RouterView>
    </VMain>
    <AdminFooter />
  </VApp>
</template>
