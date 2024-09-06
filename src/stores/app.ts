// stores/app.ts
import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'

export const useAppStore = defineStore(
  'app',
  () => {
    const uniqueId = ref(uuid())

    // * Auth
    return {
      /**
       * * state
       */
      uniqueId,
      /**
       * * actions
       */
    }
  },
  { persist: true }
)
