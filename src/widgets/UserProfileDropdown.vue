<script setup lang="ts">
import { useAuthStore } from '@/stores';

const items = ref([
  { name: 'Profile', path: 'profile', icon: 'mdi-face-man-profile' },
  { name: 'Settings', path: 'settings', icon: 'mdi-cogs' },
  { name: 'Help', path: 'help', icon: 'mdi-help-box' }
]);
const authStore = useAuthStore();
</script>

<template>
  <VMenu
    offset="10"
    transition="slide-x-transition"
  >
    <template #activator="{ props, isActive }">
      <VBtn
        :active="isActive"
        class="mr-4"
        icon
        v-bind="props"
      >
        <VAvatar
          v-if="authStore.account.avatarUrl"
          v-bind="props"
          :image="authStore.account.avatarUrl"
        />
        <VAvatar
          v-else
          color="secondary"
        >
          <span class="text-caption">{{ authStore.account.name }}</span>
        </VAvatar>
      </VBtn>
    </template>
    <VList
      nav
      slim
      max-width="200"
    >
      <VListItem
        lines="three"
        :title="`Name: ${authStore.account.name}`"
        :subtitle="`Username: ${authStore.account.username}`"
      >
        <template #default>
          <div class="d-flex flex-wrap ga-2 mt-1">
            <VChip
              density="compact"
              v-for="role in authStore.account.roles"
              :key="role.id"
              :text="role.name"
              rounded
              class="text-caption"
            />
          </div>
        </template>
      </VListItem>
      <VListItem
        v-for="item in items"
        :key="item.name"
        :prepend-icon="item.icon"
        :title="item.name"
        :to="item.path"
      />
      <VListItem
        prepend-icon="mdi-logout"
        @click="authStore.logout"
        title="Logout"
      />
    </VList>
  </VMenu>
</template>
