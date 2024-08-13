// stores/app.ts
import { DEFAULT_DARK_THEME, DEFAULT_LIGHT_THEME } from '@/constants';
import { History } from '@/types';
import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';
import { useTheme } from 'vuetify';
import { getLocalStorageItem, setLocalStorageItem } from '@/helpers';

export const useAppStore = defineStore('app', () => {
  const uniqueId = ref(getLocalStorageItem('uuid', uuid()));
  const histories = ref(getLocalStorageItem('histories', [] as History[]));
  const authVideo = ref('/public/signin.mp4');

  // Themes
  const { themes, global } = useTheme();
  const localThemes = ref(JSON.parse(localStorage.getItem('themes')!) || toRaw(themes.value));
  const lightThemes = computed(() => Object.values(localThemes.value).filter((theme: any) => !theme.dark));
  const darkThemes = computed(() => Object.values(localThemes.value).filter((theme: any) => theme.dark));
  const selectedLightTheme = ref(getLocalStorageItem('LIGHT_THEME', DEFAULT_LIGHT_THEME));
  const selectedDarkTheme = ref(getLocalStorageItem('DARK_THEME', DEFAULT_DARK_THEME));
  const themeMode = ref(getLocalStorageItem('THEME_MODE', 'system'));
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const isSystemDark = computed(() => prefersDarkScheme.matches);

  // Function to update theme
  const updateTheme = () => {
    if (themeMode.value === 'dark') {
      global.name.value = selectedDarkTheme.value;
    } else if (themeMode.value === 'light') {
      global.name.value = selectedLightTheme.value;
    } else {
      global.name.value = isSystemDark.value ? selectedDarkTheme.value : selectedLightTheme.value;
    }
    setLocalStorageItem('themeMode', themeMode.value.toString());
  };

  // Watchers to handle theme changes
  watch(selectedLightTheme, updateTheme);
  watch(selectedDarkTheme, updateTheme);
  watch(themeMode, updateTheme, { immediate: true });

  const initialize = () => {
    if (!localStorage.getItem('uuid')) {
      uniqueId.value = uuid();
      setLocalStorageItem('uuid', uniqueId.value);
    }

    // Initialize theme
    updateTheme();

    // Handle system color scheme changes
    prefersDarkScheme.addEventListener('change', (event) => {
      if (themeMode.value === 'system') {
        isSystemDark.value ? selectedDarkTheme.value : selectedLightTheme.value;
      }
    });
  };

  return {
    uniqueId,
    histories,
    authVideo,
    initialize,
    lightThemes,
    darkThemes
  };
});
