<script setup lang="ts">
  import { useTheme } from 'vuetify'
  const theme = useTheme()
  const icon = computed(() =>
    theme.global.current.value.dark ? 'mdi-brightness-5' : 'mdi-brightness-2'
  )
  const themes = ref([
    { name: 'Light', value: 'light', icon: 'mdi-brightness-5' },
    { name: 'Dark', value: 'dark', icon: 'mdi-brightness-2' },
    { name: 'System', value: 'light', icon: 'mdi-laptop' },
  ])

  const props = withDefaults(
    defineProps<{ variant?: any; openHover?: boolean }>(),
    {
      variant: 'plain',
      openHover: true,
    }
  )
</script>
<template>
  <VMenu
    offset="10"
    :open-on-hover="props.openHover"
    transition="slide-x-transition"
  >
    <template #activator="e">
      <VBtn
        v-bind="e.props"
        icon="mdi-theme-light-dark"
        rounded="lg"
        text="Theme"
        :variant="props.variant"
      />
    </template>

    <VList density="compact" nav rounded="lg">
      <VListItem
        v-for="item in themes"
        :key="item.name"
        :disabled="theme.global.name.value === item.value"
        :prepend-icon="item.icon"
        :title="item.name"
        :value="item.value"
        @click="theme.global.name.value = item.value"
      />
    </VList>
  </VMenu>
</template>
