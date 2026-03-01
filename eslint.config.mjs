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
      'split-and-sort-imports/sort-imports': ['warn'],

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

      '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],

      'no-useless-assignment': 'off',

      'require-atomic-updates': 'error',
      'arrow-body-style': ['error', 'always'],
      'complexity': ['warn'],
      'dot-notation': 'error',
      'max-classes-per-file': ['warn', 1],
      'max-depth': ['warn', 4],
      'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['warn', { max: 100, skipBlankLines: true, skipComments: true }],
      'no-extra-bind': 'error',
      'curly': ['error'],
      'no-irregular-whitespace': 'error',
      'no-extra-boolean-cast': 'error',
      'no-throw-literal': 'error',
      'no-unneeded-ternary': 'error',
      'no-useless-computed-key': 'error',
      'prefer-promise-reject-errors': 'error',
      'prefer-template': 'error',
      'preserve-caught-error': ['error', { requireCatchParameter: false }],
    },
  },

  {
    files: ['**/*.test.ts', 'apps/playground/src/**/*.{ts,tsx,js,mjs}', '**/dist/**/*'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      'arrow-body-style': ['error', 'always'],
      'complexity': 'off',
      'max-classes-per-file': 'off',
      'max-depth': 'off',
      'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': 'off',
    },
  },

  {
    files: ['**/dist/*.{ts,mjs}'],
    rules: {
      'max-lines': 'off',
      'split-and-sort-imports/split-imports': ['off'],
      'split-and-sort-imports/sort-imports': ['off'],
      'no-cond-assign': 'off',
      'no-control-regex': 'off',
      'no-var': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
]
