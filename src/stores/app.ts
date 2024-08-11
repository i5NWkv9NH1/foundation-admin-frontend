// stores/app.ts
import { History } from '@/types';
import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';

export const useAppStore = defineStore('app', {
  state: () => ({
    uniqueId: localStorage.getItem('uuid') || uuid(),
    histories: JSON.parse(localStorage.getItem('histories') || '[]') as History[]
  }),
  actions: {
    initialize() {
      const isExistLocal = localStorage.getItem('uuid');
      if (!isExistLocal) {
        this.uniqueId = uuid();
        localStorage.setItem('uuid', this.uniqueId);
      }
    }
  }
});
