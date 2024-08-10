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
    'vue/multi-word-component-names': 'off'
  }
};
