// @ts-check

import js from '@eslint/js';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default [
  {
    ignores: ['dist'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  eslintConfigPrettier,

  {
    linterOptions: {
      noInlineConfig: true,
    },
  },

  {
    files: ['**/*.{js,ts}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },

  {
    files: ['tests/**/*.ts'],
    rules: {
      'unicorn/no-null': 'off',
      'unicorn/prefer-scoped-selector': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/consistent-boolean-name': 'off',
      'unicorn/no-declarations-before-early-exit': 'off',
      'unicorn/no-global-object-property-assignment': 'off',
    },
  },
];
