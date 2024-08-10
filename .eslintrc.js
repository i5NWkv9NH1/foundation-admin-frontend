/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['vuetify', 'plugin:vue/vue3-recommended', 'prettier', '@vue/eslint-config-typescript', './.eslintrc-auto-import.json'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',
    'vue/no-v-text-v-html-on-component': 'off'
  }
};
