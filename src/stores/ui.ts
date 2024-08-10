// stores/ui.ts
import { defineStore } from 'pinia';

export const useUIStore = defineStore('ui', {
  state: () => ({
    drawer: true
  }),
  actions: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    setDrawerState(isOpen: boolean) {
      this.drawer = isOpen;
    }
  }
});
