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
import { OCEAN_BREEZE_LIGHT, OCEAN_BREEZE_DARK, FOREST_RETREAT_LIGHT, FOREST_RETREAT_DARK, SUNSET_GLOW_LIGHT, SUNSET_GLOW_DARK, GPT_LIGHT, GPT_DARK, TWITTER_LIGHT, TWITTER_DARK, GOOGLE_LIGHT, GOOGLE_DARK, FACEBOOK_LIGHT, FACEBOOK_DARK, PINTEREST_LIGHT, PINTEREST_DARK, LINKED_LIGHT, LINKED_DARK, SPOTIFY_LIGHT, SPOTIFY_DARK, GITHUB_LIGHT, GITHUB_DARK } from '@/themes';
import { DEFAULT_LIGHT_THEME } from '@/constants';
import { md3 } from 'vuetify/blueprints';
import { mdi, aliases } from 'vuetify/iconsets/mdi';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  // blueprint: md3,
  defaults: {
    VAppBar: {
      flat: true
    },
    VAutocomplete: {
      variant: 'filled'
    },
    VBanner: {
      color: 'primary'
    },
    VBottomSheet: {
      contentClass: 'rounded-t-xl overflow-hidden'
    },
    VBtn: {
      color: 'primary',
      rounded: 'xl'
    },
    VBtnGroup: {
      rounded: 'xl',
      VBtn: {
        rounded: null
      }
    },
    VCard: {
      rounded: 'lg'
    },
    VCheckbox: {
      color: 'secondary',
      inset: true
    },
    VChip: {
      rounded: 'sm'
    },
    VCombobox: {
      variant: 'filled'
    },
    VNavigationDrawer: {
      VList: {
        nav: true,
        VListItem: {
          rounded: 'xl'
        }
      }
    },
    VSelect: {
      variant: 'filled'
    },
    VSlider: {
      color: 'primary'
    },
    VTabs: {
      color: 'primary'
    },
    VTextarea: {
      variant: 'filled'
    },
    VTextField: {
      variant: 'filled'
    },
    VToolbar: {
      VBtn: {
        color: null
      }
    },
    VNumberInput: {
      VBtn: {
        color: null,
        rounded: false
      }
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  // defaults: {
  //   global: {
  //     ripple: false,
  //   },
  // },
  directives,
  theme: {
    // ? preset light and dark
    themes: {
      FACEBOOK_DARK,
      FACEBOOK_LIGHT,
      FOREST_RETREAT_DARK,
      FOREST_RETREAT_LIGHT,
      GITHUB_DARK,
      GITHUB_LIGHT,
      GOOGLE_DARK,
      GOOGLE_LIGHT,
      GPT_DARK,
      GPT_LIGHT,
      LINKED_DARK,
      LINKED_LIGHT,
      OCEAN_BREEZE_DARK,
      OCEAN_BREEZE_LIGHT,
      PINTEREST_DARK,
      PINTEREST_LIGHT,
      SPOTIFY_DARK,
      SPOTIFY_LIGHT,
      SUNSET_GLOW_DARK,
      SUNSET_GLOW_LIGHT,
      TWITTER_DARK,
      TWITTER_LIGHT
    }
  }
});
