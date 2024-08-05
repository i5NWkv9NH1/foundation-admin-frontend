// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    drawer: true,
    rail: false,
  }),
  actions: {
    toggleDrawer () {
      this.drawer = !this.drawer
    },
    toggleRail () {
      this.rail = !this.rail
    },
  },
})
