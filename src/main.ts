/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import '@/styles/index.scss'
import 'unfonts.css'
// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { initializePermissions } from './router/permissionGuard'

const app = createApp(App)

registerPlugins(app)
initializePermissions()
app.mount('#root')
