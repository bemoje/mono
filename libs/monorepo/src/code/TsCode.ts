import { AbstractCode } from './AbstractCode'
import { ImportStatement } from './imports/ImportStatement'
import { Inspector } from '@mono/composition'
import { Parenting } from '@mono/composition'
import type { TsFile } from '../file/TsFile'
import { arrRemoveDuplicates } from '@mono/array'
import { lazyProp } from '@mono/decorators'
import { rexec } from '@mono/regex'
import { tsExtractImports } from '@mono/tscode'

/**
 * Represents TypeScript code with import parsing and manipulation capabilities.
 */
@Parenting.compose
export class TsCode<P extends TsFile = TsFile> extends AbstractCode<P> {
  static readonly inspector = Inspector.compose(TsCode, { keys: ['imports'] })

  #code: string

  override get code(): string {
    return this.#code
  }

  constructor(parent: P, code: string) {
    super(parent)
    this.#code = code
  }

  toString(): string {
    return this.code
  }

  requires(format: 'lines' | 'modules' = 'modules') {
    if (format === 'lines') {
      return this.code.split(/\r*\n/).filter((line) => {
        return this.requireRegex.test(line)
      })
    }
    return arrRemoveDuplicates(
      Array.from(this.code.matchAll(this.requireRegex)).map((o) => {
        return o[1]
      }),
    )
  }

  @lazyProp
  get imports(): ImportStatement[] {
    const statements = tsExtractImports(this.code).map((o) => {
      return o.match
    })
    return statements.map((line) => {
      return new ImportStatement(this, this.codeIndexRangeOf(line))
    })
  }

  get exportedClassNames() {
    return rexec(/^export (abstract )?class (?<name>\w+)/gm, this.code)
      .map((o) => {
        return o.groups?.name
      })
      .filter(Boolean)
  }

  get dependencies(): string[] {
    return this.imports
      .map((imp) => {
        return imp.module.dependency
      })
      .filter(Boolean)
      .sort() as string[]
  }

  private get requireRegex() {
    return /require\(['"](.+)['"]\)/g
  }
}
