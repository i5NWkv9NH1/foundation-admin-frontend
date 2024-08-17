<script setup lang="ts">
const current = ref(0);
const tabs = ref(['Message', 'Notice', 'Todo']);
const items = ref([
  {
    id: 1,
    title: 'Item 1 Title',
    subtitle: 'Item 1 Subtitle',
    avatar: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
    image: 'https://picsum.photos/80/80?random=1'
  },
  {
    id: 2,
    title: 'Item 2 Title',
    subtitle: 'Item 2 Subtitle',
    avatar: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
    image: 'https://picsum.photos/80/80?random=2'
  }
]);
</script>

<template>
  <VMenu
    offset="10"
    :close-on-content-click="false"
    transition="slide-y-transition"
  >
    <template #activator="args">
      <VBtn
        v-bind="args.props"
        icon
      >
        <VBadge
          content="2"
          color="error"
        >
          <VIcon>mdi-bell-outline</VIcon>
        </VBadge>
      </VBtn>
    </template>
    <VCard>
      <VCardText>
        <VTabs v-model="current">
          <VTab
            v-for="item in tabs"
            :key="item"
            :text="item"
          />
        </VTabs>
        <VTabsWindow v-model="current">
          <VTabsWindowItem
            v-for="tab in tabs"
            :key="tab"
          >
            <VList
              lines="two"
              item-props
            >
              <VListItem
                v-for="i in items"
                :title="i.title"
                :subtitle="i.subtitle"
                :prepend-avatar="i.avatar"
              >
                <template #append>
                  <VImg
                    :src="i.image"
                    width="40"
                  />
                </template>
              </VListItem>
            </VList>
          </VTabsWindowItem>
        </VTabsWindow>
      </VCardText>
    </VCard>
  </VMenu>
</template>
