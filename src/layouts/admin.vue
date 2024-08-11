<template>
  <VApp>
    <AdminDrawer />
    <AdminTopbar />
    <VMain>
      <RouterView v-slot="{ Component, route }">
        <VScrollYReverseTransition
          hide-on-leave
          leave-absolute
        >
          <component
            :is="Component"
            :key="route.path"
          />
        </VScrollYReverseTransition>
      </RouterView>
      <!-- <RouterView /> -->
    </VMain>
    <AdminFooter />
  </VApp>
</template>

<script lang="ts" setup>
//
</script>
