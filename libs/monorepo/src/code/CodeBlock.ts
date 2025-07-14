import { AbstractCode } from './AbstractCode'
import { Inspector, Parenting } from '@mono/composition'
import { lazyProp } from '@mono/decorators'

/**
 * Represents a block of code within a larger code structure, defined by an index range.
 */
@Parenting.compose
export class CodeBlock<P extends AbstractCode = AbstractCode> extends AbstractCode<P> {
  static readonly inspector = Inspector.compose(CodeBlock, {
    keys: [],
  })

  readonly indexRange: { index: number; lastIndex: number }

  constructor(parent: P, indexRange: { index: number; lastIndex: number }) {
    super(parent)
    this.indexRange = indexRange
  }

  @lazyProp(2500)
  toString(): string {
    return this.parenting.getParent()!.getCodeRange(this.indexRange)
  }
}
