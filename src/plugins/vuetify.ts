/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';
// import { md3 } from 'vuetify/blueprints';
import * as directives from 'vuetify/directives';
import { OCEAN_BREEZE_LIGHT, OCEAN_BREEZE_DARK, FOREST_RETREAT_LIGHT, FOREST_RETREAT_DARK, SUNSET_GLOW_LIGHT, SUNSET_GLOW_DARK, GPT_LIGHT, GPT_DARK, TWITTER_LIGHT, TWITTER_DARK, GOOGLE_LIGHT, GOOGLE_DARK, FACEBOOK_LIGHT, FACEBOOK_DARK, PINTEREST_LIGHT, PINTEREST_DARK, LINKED_LIGHT, LINKED_DARK, SPOTIFY_LIGHT, SPOTIFY_DARK } from '@/themes';
import { DEFAULT_LIGHT_THEME } from '@/constants';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  // blueprint: md3,
  // defaults: {
  //   global: {
  //     ripple: false,
  //   },
  // },
  directives,
  theme: {
    // ? preset light and dark
    defaultTheme: DEFAULT_LIGHT_THEME,
    themes: {
      OCEAN_BREEZE_LIGHT,
      OCEAN_BREEZE_DARK,
      FOREST_RETREAT_LIGHT,
      FOREST_RETREAT_DARK,
      SUNSET_GLOW_LIGHT,
      SUNSET_GLOW_DARK,
      GPT_LIGHT,
      GPT_DARK,
      TWITTER_LIGHT,
      TWITTER_DARK,
      GOOGLE_LIGHT,
      GOOGLE_DARK,
      FACEBOOK_LIGHT,
      FACEBOOK_DARK,
      PINTEREST_LIGHT,
      PINTEREST_DARK,
      LINKED_LIGHT,
      LINKED_DARK,
      SPOTIFY_LIGHT,
      SPOTIFY_DARK
    }
  }
});
