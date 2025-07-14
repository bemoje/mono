import { AbstractBase } from '../common/AbstractBase'
import { Inspector, Parenting } from '@mono/composition'
import { File } from '../file/File'

/**
 * Abstract base class for representing code structures in the monorepo with inspection and preview capabilities.
 */
@Parenting.compose
export abstract class AbstractCode<P extends AbstractBase = AbstractBase> extends AbstractBase<P> {
  static readonly inspector = Inspector.compose(AbstractCode, {
    keys: [],
  })

  static readonly codePreviewOptions = {
    maxLines: 10,
    maxLineLength: 90,
  }

  constructor(parent: P) {
    super(parent)
  }

  get path(): string {
    return this.getParentDeep(File).path
  }

  get code(): string {
    return this.toString()
  }

  get isMultiLine(): boolean {
    return this.code.includes('\n')
  }

  get lines(): string[] {
    return this.code.split(/\r*\n/)
  }

  get codePreview() {
    const maxLines = AbstractCode.codePreviewOptions.maxLines
    const maxLineLength = AbstractCode.codePreviewOptions.maxLineLength
    const applyMaxLineLength = (line: string) => {
      return line.length > maxLineLength ? line.substring(0, maxLineLength - 3) + '...' : line
    }
    return this.isMultiLine ? this.lines.slice(0, maxLines).map(applyMaxLineLength) : applyMaxLineLength(this.code)
  }

  codeIndexRangeOf(code: string): { index: number; lastIndex: number } {
    const index = this.code.indexOf(code)
    if (index === -1) throw new Error(`Code not found: ${code}`)
    const lastIndex = index + code.length
    return { index, lastIndex }
  }

  getCodeRange(range: { index: number; lastIndex: number }) {
    return this.code.substring(range.index, range.lastIndex)
  }
}
