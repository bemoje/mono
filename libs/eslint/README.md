# @bemoje/eslint

Custom ESLint plugin and rule utilities for consistent code style in TypeScript projects.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Installation

```bash
npm install --save-dev @bemoje/eslint
```

## Features

- Custom ESLint plugin with a recommended config
- Auto-fixable rules for consistent whitespace formatting
- Built on `@typescript-eslint/utils` for TypeScript-aware linting
- ESM flat config compatible

## Usage

### Plugin Setup (Flat Config)

```js
// eslint.config.mjs
import { eslintPluginBemoje } from '@bemoje/eslint'

export default [
  {
    plugins: { 'eslint-plugin-bemoje': eslintPluginBemoje() },
    rules: { 'eslint-plugin-bemoje/no-blank-line-between-comment-and-declaration': 'error' },
  },
]
```

### Using the Recommended Config

```js
import { eslintPluginBemoje } from '@bemoje/eslint'

const plugin = eslintPluginBemoje()
const { plugins, rules } = plugin.configs.recommended

export default [{ plugins, rules }]
```

## Rules

### no-blank-line-between-comment-and-declaration

Enforces that there are no blank lines between a block comment (JSDoc or multi-line) and the declaration it
documents. Auto-fixable.

**Incorrect:**

```ts
/**
 * Adds two numbers.
 */

export function add(a: number, b: number) {
  return a + b
}
```

**Correct:**

```ts
/**
 * Adds two numbers.
 */
export function add(a: number, b: number) {
  return a + b
}
```

Single-line block comments and line comments between the block comment and the declaration are ignored.

## API Reference

| Export                                    | Description                                                  |
| ----------------------------------------- | ------------------------------------------------------------ |
| `eslintPluginBemoje`                      | Returns the ESLint plugin object with rules and configs      |
| `createRule`                              | Helper for creating ESLint rules with consistent metadata    |
| `noBlankLineBetweenCommentAndDeclaration` | Rule: no blank lines between block comments and declarations |
