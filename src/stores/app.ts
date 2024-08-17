// stores/app.ts
import { DEFAULT_DARK_THEME, DEFAULT_LIGHT_THEME } from '@/constants';
import { SnackbarOptions } from '@/types';
import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';
import { useTheme } from 'vuetify';

export const useAppStore = defineStore(
  'app',
  () => {
    const uniqueId = ref(uuid());

    // * Auth
    const authVideo = ref('/public/signin.mp4');

    function updateAuthVideo(url: string) {
      authVideo.value = url;
    }

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
      /**
       * * state
       */
      uniqueId,
      authVideo,
      snackbars,
      /**
       * * actions
       */
      updateAuthVideo,
      addSnackbar,
      clearSnackbars
    };
  },
  { persist: true }
);
