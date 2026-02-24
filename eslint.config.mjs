import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import pluginJs from '@eslint/js'
import splitAndSortImports from '@sngn/eslint-plugin-split-and-sort-imports'
import tseslint from 'typescript-eslint'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
  { languageOptions: { globals: { ...globals.node }, parserOptions: { project: './tsconfig.json' } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  eslintConfigPrettier,

  {
    files: ['**/*.{ts,tsx,js,mjs}'],
    plugins: {
      'split-and-sort-imports': splitAndSortImports,

      'unused-imports': unusedImports,
    },
    rules: {
      // allow {}
      '@typescript-eslint/no-empty-object-type': 'off',

      // IMPORTANT: check no missing 'await'
      '@typescript-eslint/no-floating-promises': 'error',

      // allow ts-ignore
      '@typescript-eslint/ban-ts-comment': 'off',

      // PLUGIN: unused imports
      'unused-imports/no-unused-imports': 'warn',

      // PLUGIN: split imports
      'split-and-sort-imports/split-imports': ['warn'],
      'split-and-sort-imports/sort-imports': ['off', { separateGroups: true }],

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_|^args$',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          vars: 'local',
          args: 'after-used',
          // caughtErrors: 'none',
          // caughtErrors: 'all',
          ignoreRestSiblings: true,
          // reportUsedIgnorePattern: true,
        },
      ],

      'no-empty': ['error', { allowEmptyCatch: true }],

      // any
      '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],

      'no-useless-assignment': 'off',
    },
  },

  {
    files: ['**/*.test.ts'],
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
]
