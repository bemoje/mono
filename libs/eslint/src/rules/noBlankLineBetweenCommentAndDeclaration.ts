import { AST_TOKEN_TYPES } from '@typescript-eslint/utils'
import { createRule } from '../lib/createRule.js'

/**
 * Enforce no blank lines between block comments and the next declaration.
 */
export const noBlankLineBetweenCommentAndDeclaration = createRule({
  name: 'no-blank-line-between-comment-and-declaration',
  meta: {
    fixable: 'whitespace',
    docs: { description: 'Consistant whitespace ', recommended: true },
    messages: {
      'no-blank-line-between-comment-and-declaration':
        'Block comments for a declaration must not leave blank lines between them.',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: ['error'],

  create(context) {
    return {
      Program(program) {
        if (!program.comments) {
          return
        }
        program.comments.forEach((comment) => {
          // ignore if not a block comment
          if (comment.type !== AST_TOKEN_TYPES.Block) {
            return
          }

          // ignore single line block comments
          if (Math.abs(comment.loc.start.line - comment.loc.end.line) < 2) {
            return
          }

          // skip if comment is last thing in file
          const nextToken = context.sourceCode.getTokenAfter(comment)
          if (!nextToken) {
            return
          }

          // end of comment should have no lines gap before the next token
          const actualNextTokenStartLine = nextToken.loc.start.line
          const expectedTokenStartLine = comment.loc.end.line + 1
          if (!(actualNextTokenStartLine > expectedTokenStartLine)) {
            return
          }

          // ignore if there is a line comment between the block comment and the next token
          const lineBeforeNextToken = context.sourceCode.lines[nextToken.loc.start.line - 1 - 1]
          const hasLineCommentBetween = lineBeforeNextToken.trim().startsWith('//')
          if (hasLineCommentBetween) {
            return
          }

          return context.report({
            node: program,
            messageId: 'no-blank-line-between-comment-and-declaration',
            fix(fixer) {
              const start = comment.range[0]
              const end = nextToken.range[1]
              const rangeCode = context.sourceCode.text.slice(start, end)
              const rangeCodeFixed = rangeCode.replaceAll(/\*\/\n\n+/gi, '*/\n')
              return fixer.replaceTextRange([start, end], rangeCodeFixed)
            },
          })
        })
      },
    }
  },
})
