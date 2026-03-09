import { ESLintUtils } from '@typescript-eslint/utils'

/**
 * Helper to create an ESLint rule with a consistent format.
 */
export const createRule = ESLintUtils.RuleCreator<{
  description: string
  recommended?: boolean
  requiresTypeChecking?: boolean
}>((name) => {
  return `https://github.com/bemoje/mono/blob/dev/libs/eslint/README.md#${name}`
})
