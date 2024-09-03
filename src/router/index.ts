/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { authRoutes } from './modules/auth'
import { constantRoutes } from './modules/constants'
import { errorRoutes } from './modules/error'
export * from './modules/auth'
export * from './modules/constants'
export * from './modules/default'
export * from './modules/error'

const router = createRouter({
  history: createWebHistory(),
  routes: [...constantRoutes, ...authRoutes, ...errorRoutes],
  scrollBehavior: () => ({ left: 0, top: 0 })
})
// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
