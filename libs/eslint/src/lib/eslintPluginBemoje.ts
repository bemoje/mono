import { noBlankLineBetweenCommentAndDeclaration } from '../rules/noBlankLineBetweenCommentAndDeclaration'
import { splitImports } from '../rules/splitImports'

/**
 * ESLint plugin for Bemoje projects.
 */
export function eslintPluginBemoje() {
  const rules = {
    'no-blank-line-between-comment-and-declaration': noBlankLineBetweenCommentAndDeclaration,
    'split-imports': splitImports,
  }

  const plugins = {
    get 'eslint-plugin-bemoje'() {
      return eslintPluginBemoje()
    },
  }

  return {
    configs: {
      get recommended() {
        return { plugins, rules }
      },
    },
    meta: { name: 'eslint-plugin-bemoje', version: '1.2.0' },
    rules,
  }
}
