import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
  { files: ['**/*.{js,mjs,cjs,ts}', '*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: { ...globals.node }, parserOptions: { project: './tsconfig.json' } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  {
    plugins: { 'unused-imports': unusedImports },
    rules: {
      // IMPORTANT: check no missing 'await'
      '@typescript-eslint/no-floating-promises': 'error',

      // allow ts-ignore
      '@typescript-eslint/ban-ts-comment': 'off',

      // PLUGIN: unused imports
      'unused-imports/no-unused-imports': 'warn',
    },
  },

  {
    files: ['**/*.ts'],
    languageOptions: { parserOptions: { project: './tsconfig.json' } },
    rules: {
      // unuSRC
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_|^args$',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          vars: 'local',
          args: 'after-used',
          // caughtErrors: 'all',
          ignoreRestSiblings: true,
          // reportUsedIgnorePattern: true,
        },
      ],

      // any
      '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },

  {
    files: ['**/*.{js,cjs,mjs}', '*.{js,cjs,mjs}', '**/*.{test,spec}.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },

  eslintConfigPrettier,
]
