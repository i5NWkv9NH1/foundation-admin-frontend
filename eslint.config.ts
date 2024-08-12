import js from '@eslint/js';
import ts from 'typescript-eslint';
import type { Linter } from 'eslint';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';
import autoJSON from './.eslintrc-auto-import.json';

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['*.vue', '**/*.vue', '**/*.ts', '**/*.ts'],
    languageOptions: {
      ...autoJSON,
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    },
    rules: {
      'no-console': [0],
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'vue/no-v-html': 'off',
      'vue/valid-v-slot': 'off',
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  }
  // eslintConfigPrettier
] satisfies Linter.Config[];
