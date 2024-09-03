import { DEFAULT_DARK_THEME, DEFAULT_LIGHT_THEME } from '@/constants'
import { defineStore } from 'pinia'
import { useTheme } from 'vuetify'

export const useSettingStore = defineStore(
  'settings',
  () => {
    const drawer = ref(false)
    const settingsDrawer = ref(false)

    function toggleDrawer() {
      drawer.value = !drawer.value
    }
    function toggleSettingsDrawer() {
      settingsDrawer.value = !settingsDrawer.value
    }

    // Themes
    const { themes, global } = useTheme()

    const localThemes = computed(() => toRaw(themes.value))
    const lightThemes = computed(() => Object.values(localThemes.value).filter((theme: any) => !theme.dark))
    const darkThemes = computed(() => Object.values(localThemes.value).filter((theme: any) => theme.dark))

    const selectedLightTheme = ref<string>(DEFAULT_LIGHT_THEME)
    const selectedDarkTheme = ref<string>(DEFAULT_DARK_THEME)
    const themeMode = ref('system')
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')
    const isSystemDark = computed(() => prefersDarkScheme.matches)

    // Function to update theme
    const updateTheme = () => {
      prefersDarkScheme.addEventListener('change', (_) => {
        if (themeMode.value === 'system') {
          if (_.matches) {
            global.name.value = selectedDarkTheme.value
          } else {
            global.name.value = selectedLightTheme.value
          }
        }
      })
      if (themeMode.value === 'dark') {
        global.name.value = selectedDarkTheme.value
      } else if (themeMode.value === 'light') {
        global.name.value = selectedLightTheme.value
      } else {
        global.name.value = isSystemDark.value ? selectedDarkTheme.value : selectedLightTheme.value
      }
    }

    // Watchers to handle theme changes
    watch(selectedLightTheme, updateTheme)
    watch(selectedDarkTheme, updateTheme)
    watch(themeMode, updateTheme)

    return {
      /**
       * * state
       */
      drawer,
      localThemes,
      lightThemes,
      darkThemes,
      selectedLightTheme,
      selectedDarkTheme,
      themeMode,
      settingsDrawer,
      /**
       * * actions
       */
      updateTheme,
      toggleDrawer,
      toggleSettingsDrawer
    }
  },
  { persist: true }
)
