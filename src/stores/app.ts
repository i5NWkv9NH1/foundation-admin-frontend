// Utilities
import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';

export const useAppStore = defineStore('app', {
  state: () => ({
    drawer: true,
    rail: false,
    uniqueId: localStorage.getItem('uuid') || uuid()
  }),
  actions: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    toggleRail() {
      this.rail = !this.rail;
    },
    initialize() {
      if (!localStorage.getItem('uuid')) {
        this.uniqueId = uuid();
        localStorage.setItem('uuid', this.uniqueId);
      }
    }
  }
});
