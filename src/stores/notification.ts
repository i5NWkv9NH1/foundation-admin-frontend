import { defineStore } from 'pinia';

interface Notification {
  id: string;
  color: string;
  message: string;
}

export const useNotificationStore = defineStore('notification', () => {
  const items = ref<Notification[]>([]);

  const addNotification = (notification: Notification) => {
    items.value.push(notification);
  };

  const removeNotification = (id: string) => {
    items.value = items.value.filter((item) => item.id !== id);
  };

  return { items, addNotification, removeNotification };
});
