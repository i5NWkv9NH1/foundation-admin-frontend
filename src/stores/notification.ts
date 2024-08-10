// stores/notifications.ts
import { defineStore } from 'pinia';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[]
  }),
  actions: {
    addNotification(message: string, type: 'success' | 'error' | 'info') {
      const id = Date.now().toString();
      this.notifications.push({ id, message, type });
    },
    removeNotification(id: string) {
      this.notifications = this.notifications.filter((notif) => notif.id !== id);
    }
  }
});
