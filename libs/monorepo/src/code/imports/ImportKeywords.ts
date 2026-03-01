import { CodeBlock } from '../CodeBlock'
import { ImportStatement } from './ImportStatement'
import { Inspector } from '@mono/composition'
import { Parenting } from '@mono/composition'

/**
 * Represents the imported keywords/specifiers in an import statement.
 */
@Parenting.compose
export class ImportKeywords<P extends ImportStatement = ImportStatement> extends CodeBlock<P> {
  static readonly inspector = Inspector.compose(ImportKeywords, { keys: ['code'] })

  get keywords() {
    return this.code
      .split(/\s+/)
      .map((s) => {
        return s.trim()
      })
      .filter((s) => {
        return !!s
      })
  }

  has(kw: string) {
    return this.keywords.includes(kw)
  }

  get isType() {
    return this.has('type')
  }
}
