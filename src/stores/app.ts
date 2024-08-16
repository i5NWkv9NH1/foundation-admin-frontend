// stores/app.ts
import { DEFAULT_DARK_THEME, DEFAULT_LIGHT_THEME } from '@/constants';
import { History, SnackbarOptions } from '@/types';
import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';
import { useTheme } from 'vuetify';
import { getLocalStorageItem, setLocalStorageItem } from '@/helpers';

export const useAppStore = defineStore('app', () => {
  // * Global
  // Drawer and progress states
  const drawer = ref(true);
  const progress = ref(0);
  const showProgress = ref(false);
  const uniqueId = ref(getLocalStorageItem('uuid', uuid()));
  const histories = ref(getLocalStorageItem('histories', [] as History[]));

  // * Auth
  const authVideo = ref('/public/signin.mp4');
  const updateAuthVideo = (path: string) => (authVideo.value = path);

  const toggleDrawer = () => {
    drawer.value = !drawer.value;
  };
  const startProgress = () => {
    showProgress.value = true;
    progress.value = 0;
  };
  const updateProgress = (value: number) => {
    progress.value = value;
  };
  const stopProgress = () => {
    showProgress.value = false;
    progress.value = 100;
  };

  // Themes
  // TODO
  const { themes, global } = useTheme();
  const localThemes = ref(JSON.parse(localStorage.getItem('themes')!) || toRaw(themes.value));
  const lightThemes = computed(() => Object.values(localThemes.value).filter((theme: any) => !theme.dark));
  const darkThemes = computed(() => Object.values(localThemes.value).filter((theme: any) => theme.dark));
  const selectedLightTheme = ref(getLocalStorageItem('LIGHT_THEME', DEFAULT_LIGHT_THEME));
  const selectedDarkTheme = ref(getLocalStorageItem('DARK_THEME', DEFAULT_DARK_THEME));
  const themeMode = ref(getLocalStorageItem('THEME_MODE', 'SYSTEM'));
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
    setLocalStorageItem('THEME_MODE', themeMode.value.toString());
    setLocalStorageItem('LIGHT_THEME', selectedLightTheme.value.toString());
    setLocalStorageItem('DARK_THEME', selectedDarkTheme.value.toString());
  };

  // Watchers to handle theme changes
  watch(selectedLightTheme, updateTheme);
  watch(selectedDarkTheme, updateTheme);
  watch(themeMode, updateTheme);

  const initialize = () => {
    if (!localStorage.getItem('uuid')) {
      uniqueId.value = uuid();
      setLocalStorageItem('uuid', uniqueId.value);
    }

    // Initialize theme
    updateTheme();

    // Handle system color scheme changes
    prefersDarkScheme.addEventListener('change', (_) => {
      if (themeMode.value === 'system') {
        if (_.matches) {
          global.name.value = selectedDarkTheme.value;
        } else {
          global.name.value = selectedLightTheme.value;
        }
      }
    });

    clearSnackbars();
  };

  const snackbars = ref<SnackbarOptions[]>([]);

  function addSnackbar(options: SnackbarOptions) {
    // @ts-ignore
    snackbars.value.push(options);
    console.log(snackbars.value);
  }

  function clearSnackbars() {
    snackbars.value = [];
  }

  return {
    uniqueId,
    histories,
    authVideo,
    updateAuthVideo,
    drawer,
    progress,
    showProgress,
    toggleDrawer,
    startProgress,
    updateProgress,
    stopProgress,
    initialize,
    lightThemes,
    darkThemes,
    snackbars,
    addSnackbar,
    clearSnackbars
  };
});
