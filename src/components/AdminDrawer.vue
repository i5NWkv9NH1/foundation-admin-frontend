<script setup lang="ts">
  import { useAppStore } from '@/stores/app'
  import { VDivider, VList, VListItem, VListSubheader } from 'vuetify/components'
  import { VResizeDrawer } from '@wdns/vuetify-resize-drawer'
  const appStore = useAppStore()

  const list = ref([
    {
      name: 'Dashboard',
      value: 'dashboard',
      routes: [
        { name: 'Dashboard', value: '', icon: 'mdi-apps' },
        { name: 'Analysis', value: 'analysis', icon: 'mdi-poll' },
        { name: 'Workplace', value: 'workplace', icon: 'mdi-briefcase' },
        { name: 'Tools', value: 'tools', icon: 'mdi-tools' },
        { name: 'Test', value: 'test', icon: 'mdi-wrench' },
      ],
    },
    {
      name: 'System',
      value: 'system',
      routes: [
        { name: 'Accounts', value: 'accounts', icon: 'mdi-account' },
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
  <VResizeDrawer
    v-model:model-value="appStore.drawer"
    order="1"
    :style="{
      border: '0',
    }"
  >
    <VList>
      <VListItem title="Foundation Admin">
        <template #prepend>
          <VAvatar
            image="@/assets/logo.svg"
            :size="appStore.rail ? 'x-small' : 'small'"
          />
        </template>
        <!-- <template #append>
          <v-btn
            :icon="appStore.rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            size="small"
            variant="text"
            @click="appStore.toggleRail"
          />
        </template> -->
      </VListItem>
    </VList>
    <VDivider />
    <VList nav>
      <template v-for="item in list" :key="item.name">
        <VListSubheader>{{ item.name }}</VListSubheader>
        <VListItem
          v-for="route in item.routes"
          :key="route.value"
          exact
          :prepend-icon="route.icon"
          :title="route.name"
          :to="`/admin/${item.value}/${route.value}`"
          :value="route.value"
        />
      </template>
    </VList>
  </VResizeDrawer>
</template>

<style scoped lang="scss"></style>
