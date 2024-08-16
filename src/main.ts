/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import 'unfonts.css';
import '@/styles/index.scss';
// Plugins
import { registerPlugins } from '@/plugins';

// Components
import App from './App.vue';

// Composables
import { createApp } from 'vue';
import { setupPermission } from './router/permissionGuard';

const app = createApp(App);

registerPlugins(app);
setupPermission();
app.mount('#root');
