<script setup lang="ts">
import { useSettingStore } from '@/stores'

const settingStore = useSettingStore()
const themeModes = ref([
  { name: 'Light', value: 'light', icon: 'mdi-sun' },
  { name: 'Dark', value: 'dark', icon: 'mdi-moon' },
  { name: 'System', value: 'system', icon: 'mdi-laptop' }
])
</script>

<template>
  <VNavigationDrawer
    v-model="settingStore.settingsDrawer"
    location="right"
    width="300"
    temporary
  >
    <VList>
      <VListSubheader>Themes</VListSubheader>
      <VListItem>
        <VRadioGroup
          v-model="settingStore.themeMode"
          color="primary"
          inline
        >
          <VRadio
            v-for="mode in themeModes"
            :key="mode.value"
            :value="mode.value"
            :label="mode.name"
          />
        </VRadioGroup>
      </VListItem>
      <VListSubheader>Light Themes</VListSubheader>
      <VListItem>
        <!-- @vue-ignore -->
        <VSelect
          v-model="settingStore.selectedLightTheme"
          density="compact"
          :items="settingStore.lightThemes"
          :item-title="(item) => item.label ?? 'light'"
          :item-value="(item) => item.value ?? 'light'"
        />
      </VListItem>
      <VListSubheader>Dark Themes</VListSubheader>
      <VListItem>
        <!-- @vue-ignore -->
        <VSelect
          v-model="settingStore.selectedDarkTheme"
          density="compact"
          :items="settingStore.darkThemes"
          :item-title="(item) => item.label ?? 'dark'"
          :item-value="(item) => item.value ?? 'dark'"
        />
      </VListItem>
    </VList>
  </VNavigationDrawer>
</template>
