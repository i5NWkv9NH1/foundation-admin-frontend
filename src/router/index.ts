/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';
import { routes } from 'vue-router/auto-routes';
import { useUIStore } from '@/stores';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes)
});

let progressInterval: number | null = null;
router.beforeEach((to, from, next) => {
  const uiStore = useUIStore();
  uiStore.startProgress();

  // Simulate progress increase
  let progress = 0;
  progressInterval = window.setInterval(() => {
    progress += 10; // Increase progress
    if (progress > 90) {
      progress = 90; // Cap progress at 90%
    }
    uiStore.updateProgress(progress);
  }, 100);
  next();
});
router.afterEach(() => {
  const uiStore = useUIStore();
  if (progressInterval) {
    clearInterval(progressInterval);
  }
  uiStore.stopProgress(); // Ensure progress bar completes at 100%
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;
