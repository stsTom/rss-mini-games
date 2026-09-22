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
];
