<!--
 * 父级模板
 * 使用 layout 去定义
 * 显示子路由: dashboard/*, system/*
-->

<template>
  <RouterView />
</template>

<route lang="yaml">
meta:
  layout: admin
</route>
