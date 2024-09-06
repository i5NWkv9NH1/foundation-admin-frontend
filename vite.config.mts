// Plugins
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import Fonts from 'unplugin-fonts/vite';
import Components from 'unplugin-vue-components/vite';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

// Utilities
import { fileURLToPath, URL } from 'node:url';
import { ConfigEnv, loadEnv, UserConfig } from 'vite';

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      VueJsx(),
      // VueRouter({
      //   logs: true,
      //   dts: 'src/typed-router.d.ts'
      //   // routesFolder: ['src/pages']
      // }),
      // Layouts(),
      AutoImport({
        imports: [
          'vue',
          {
            'vue-router/auto': ['useRoute', 'useRouter']
          },
          'pinia'
        ],
        dts: 'src/auto-imports.d.ts',
        eslintrc: {
          enabled: true
        },
        vueTemplate: true,
        dirs: ['./src/composables']
      }),
      Components({
        dts: 'src/components.d.ts',
        dirs: ['src/components', 'src/widgets']
      }),
      Vue({
        template: { transformAssetUrls }
      }),
      // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
      Vuetify({
        autoImport: {
          labs: true
        },
        styles: {
          configFile: 'src/styles/settings.scss'
        }
      }),
      Fonts({
        // # https://github.com/vuetifyjs/vuetify/issues/19140#issuecomment-2202578585
        fontsource: {
          families: [
            {
              name: 'Roboto',
              weights: [100, 300, 400, 500, 700, 900],
              styles: ['normal', 'italic']
            }
          ]
        }
      })
    ],
    esbuild: {
      drop: env.VITE_DROP_CONSOLE.length < 5 ? ["console", "debugger"] : []
    },
    css: {
      preprocessorOptions: {
        sass: {
          api: 'modern'
        }
      },
      preprocessorMaxWorkers: true
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
    },
    server: {
      port: 3100,
      host: '127.0.0.1'
    }
  }
};
