<script setup lang="ts">
import { useSettingStore } from '@/stores';
import Drawer from './components/Drawer.vue';
import NotificationSheet from './components/NotificationSheet.vue';
import SettingsDrawer from './components/SettingsDrawer.vue';
import UserProfileDropdown from './components/UserProfileDropdown.vue';

const settingStore = useSettingStore()
const route = useRoute()

const matched = computed(() =>
  route.matched
    .filter((match) => match.path !== '/')
    .map((match) => {
      return {
        key: match.name as string,
        title: (match.name || match.meta.title) as string,
        to: match.path
      }
    })
)
</script>

<!-- Parent Template -->
<template>
  <VApp>
    <Drawer />
    <SettingsDrawer />
    <VAppBar order="2" flat>
      <VAppBarNavIcon @click="settingStore.toggleDrawer" />
      <VBreadcrumbs :items="matched" />
      <VSpacer />
      <div class="d-flex ga-2">
        <NotificationSheet />
        <VBtn icon="mdi-cog-outline" @click="settingStore.toggleSettingsDrawer" />
        <UserProfileDropdown />
      </div>
    </VAppBar>
    <VMain>
      <RouterView v-slot="{ Component, route }">
        <VScrollYReverseTransition hide-on-leave leave-absolute>
          <component :is="Component" :key="route.path" />
        </VScrollYReverseTransition>
      </RouterView>
      <!-- <RouterView /> -->
    </VMain>
    <VFooter app>
      <div>Build with Vuetify.js and ❤️</div>
    </VFooter>
  </VApp>
</template>
