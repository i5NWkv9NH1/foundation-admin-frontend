<script setup lang="ts"></script>

<!-- Parent Template -->
<template>
  <VApp>
    <Drawer />
    <SettingsDrawer />
    <TopBar />
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
    <BottomBar />
  </VApp>
</template>
