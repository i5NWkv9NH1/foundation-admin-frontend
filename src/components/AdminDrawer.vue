<script setup lang="ts">
  import { useAppStore } from '@/stores/app'
  import { VDivider, VList, VListItem, VListSubheader } from 'vuetify/components'
  const appStore = useAppStore()

  const list = ref([
    {
      name: 'Dashboard',
      value: 'dashboard',
      routes: [
        { name: 'Analysis', value: 'analysis', icon: 'mdi-history' },
        { name: 'Workplace', value: 'workplace', icon: 'mdi-history' },
      ],
    },
    {
      name: 'System',
      value: 'system',
      routes: [
        { name: 'Users', value: 'users', icon: 'mdi-account-outline' },
        {
          name: 'Roles',
          value: 'roles',
          icon: 'mdi-account-multiple',
        },
        {
          name: 'Menus',
          value: 'menus',
          icon: 'mdi-routes',
        },
        {
          name: 'Actions',
          value: 'actions',
          icon: 'mdi-pencil-plus',
        },
        {
          name: 'Organizations',
          value: 'organizations',
          icon: 'mdi-domain',
        },
      ],
    },
    {
      name: 'Business',
      value: 'business',
      routes: [
        {
          name: 'Account',
          value: 'account',
          icon: 'mdi-account-circle',
        },
        { name: 'Posts', value: 'posts', icon: 'mdi-note' },
        {
          name: 'Comments',
          value: 'comments',
          icon: 'mdi-comment-text-multiple',
        },
        {
          name: 'Review',
          value: 'review',
          icon: 'mdi-archive-eye',
        },
        {
          name: 'Shop',
          value: 'shop',
          icon: 'mdi-shopping',
        },
      ],
    },
    {
      name: 'Others',
      value: 'others',
    },
  ])
</script>

<template>
  <VNavigationDrawer
    v-model:model-value="appStore.drawer"
    order="1"
    :rail="appStore.rail"
  >
    <VList density="compact" nav>
      <VListItem title="Foundation Admin">
        <template #prepend>
          <VAvatar
            image="@/assets/logo.svg"
            :size="appStore.rail ? 'x-small' : 'small'"
          />
        </template>
        <template #append>
          <v-btn
            :icon="appStore.rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            size="small"
            variant="text"
            @click="appStore.toggleRail"
          />
        </template>
      </VListItem>
    </VList>
    <VDivider />
    <VList density="compact" nav>
      <template v-for="item in list" :key="item.name">
        <VListSubheader>{{ item.name }}</VListSubheader>
        <VListItem
          v-for="route in item.routes"
          :key="route.value"
          :prepend-icon="route.icon"
          :title="route.name"
          :to="`/admin/${item.value}/${route.value}`"
          :value="route.value"
        />
      </template>
    </VList>
    <template #append>
      <VBtn
        v-if="appStore.rail"
        icon="mdi-chevron-right"
        variant="text"
        @click="appStore.toggleRail"
      />
    </template>
  </VNavigationDrawer>
</template>

<style scoped lang="scss"></style>
