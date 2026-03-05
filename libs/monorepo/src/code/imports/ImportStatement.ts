import { CodeBlock } from '../CodeBlock'
import { ImportKeywords } from './ImportKeywords'
import { ImportSpecifiers } from './ImportSpecifiers'
import { Inspector } from '@mono/composition'
import { ModuleSpecifier } from './ModuleSpecifier'
import { Parenting } from '@mono/composition'
import { TsCode } from '../TsCode'
import { TsFile } from '../../file/TsFile'
import { lazyProp } from '@mono/decorators'

/**
 * Represents an import statement in TypeScript code with parsing and manipulation capabilities.
 */
@Parenting.compose
export class ImportStatement<P extends TsCode = TsCode> extends CodeBlock<P> {
  static readonly inspector = Inspector.compose(ImportStatement, {
    keys: ['keywords', 'specifiers', 'module'],
    inspect: { compact: true },
  })

  toOneLine(): string {
    return (
      this.code
        // remove newlines
        .replaceAll(/\r?\n/g, ' ')
        // remove consecutive whitespace
        .replaceAll(/\s{2,}/g, ' ')
        // remove trailing commas
        .replace(/,\s+}/, ' }')
    )
  }

  @lazyProp
  get keywords() {
    const match = this.code.match(/^import\s+(?:type\s+)?/)
    const code = match![0].trim()
    return new ImportKeywords(this, this.codeIndexRangeOf(code))
  }

  @lazyProp
  get specifiers() {
    const match = this.code.match(/import\s+([^"']+)\s+from\s+/)
    const code = match ? match[1].trim() : ''
    if (!code) {
      return
    }
    return new ImportSpecifiers(this, this.codeIndexRangeOf(code))
  }

  @lazyProp
  get module() {
    const match = this.code.match(/(?:from|import)\s+["']([^"']+)["']/)
    const code = match![1].trim()
    return new ModuleSpecifier(this, this.codeIndexRangeOf(code))
  }

  split() {
    return (
      this.specifiers?.splitSpecifiers().map((specifier) => {
        return `import ${specifier} from '${this.module.from}'`
      }) ?? [this.code]
    )
  }

  get filepath() {
    return this.getParentDeep(TsFile).path
  }
}
