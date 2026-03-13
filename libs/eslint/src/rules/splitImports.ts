import { createRule } from '../lib/createRule'

/**
 * Enforce no blank lines between block comments and the next declaration.
 */
export const splitImports = createRule({
  name: 'split-imports',
  meta: {
    docs: { description: 'Require one line per import, disallow multiple imports' },
    fixable: 'code',
    messages: { 'split-import': 'Split multi-import into seperate import declarations.' },
    type: 'suggestion',
    schema: [],
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.specifiers.length > 1) {
          const sourceCode = context.sourceCode

          const insideBraces =
            sourceCode
              .getText(node)
              .match(/{([^{}]+)}/)?.[1]
              ?.split(',')
              .map((s) => {
                return s.trim()
              })
              .filter((s) => {
                return !!s
              }) ?? []

          const maybeWrapInBraces = (code: string) => {
            return insideBraces.includes(code) ? `{ ${code} }` : code
          }

          const isType = (code: string) => {
            return node.importKind === 'type' || code.startsWith('type ')
          }

          const stripTypeKeyword = (code: string) => {
            return code.replace(/\btype\s+\b/, '').trim()
          }

          const importStrings = node.specifiers.map((specifier) => {
            const code = sourceCode.getText(specifier).trim()

            return [
              isType(code) ? 'import type' : 'import',
              maybeWrapInBraces(stripTypeKeyword(code)),
              `from "${node.source.value}";`,
            ].join(' ')
          })

          context.report({
            fix: (fixer) => {
              return fixer.replaceText(node, importStrings.join('\n'))
            },
            messageId: 'split-import',
            node,
          })
        }
      },
    }
  },
})
