<script setup lang="ts">
  const items = ref([
    { name: 'Profile', path: 'profile', icon: 'mdi-face-man-profile' },
    { name: 'Settings', path: 'settings', icon: 'mdi-cogs' },
    { name: 'Help', path: 'help', icon: 'mdi-help-box' },
    { name: 'Logout', path: 'logout', icon: 'mdi-logout' },
  ])
</script>

<template>
  <VMenu offset="10" transition="slide-x-transition">
    <template #activator="{ props, isActive }">
      <VBtn :active="isActive" class="mr-4" icon>
        <VAvatar
          v-bind="props"
          image="https://avatars.githubusercontent.com/u/90951316"
          size="36"
        />
      </VBtn>
    </template>
    <VList nav slim>
      <VListItem
        v-for="item in items"
        :key="item.name"
        :prepend-icon="item.icon"
        :title="item.name"
        :to="item.path"
      />
    </VList>
  </VMenu>
</template>
