import { File } from './File'
import { Inspector } from '@mono/composition'
import { Parenting } from '@mono/composition'
import { TsCode } from '../code/TsCode'
import type { Workspace } from '../repo/Workspace'
import { lazyProp } from '@mono/decorators'

/**
 * Represents a TypeScript file in the monorepo with code analysis and dependency tracking capabilities.
 */
@Parenting.compose
export class TsFile<P extends Workspace = Workspace> extends File<P> {
  static readonly inspector = Inspector.compose(TsFile, {
    keys: ['tsCode'],
  })

  @lazyProp(5000)
  get tsCode(): TsCode {
    return new TsCode(this, this.readFile())
  }

  get dependencies() {
    return this.tsCode.dependencies
  }
}
