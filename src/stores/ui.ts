// stores/ui.ts
import { defineStore } from 'pinia';

export const useUIStore = defineStore('ui', {
  state: () => ({
    drawer: true,
    showProgress: false,
    progress: 0
  }),
  actions: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    setDrawerState(isOpen: boolean) {
      this.drawer = isOpen;
    },
    /** progress */
    startProgress() {
      this.showProgress = true;
      this.progress = 0;
    },
    updateProgress(value: number) {
      this.progress = value;
    },
    stopProgress() {
      this.showProgress = false;
      this.progress = 100;
    }
  }
});
