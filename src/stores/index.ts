// Utilities
export * from './app'
export * from './auth'
export * from './permissions'
export * from './settings'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
