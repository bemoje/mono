import { File } from './File'
import { Inspector, Parenting } from '@mono/composition'
import { lazyProp } from '@mono/decorators'
import { TsCode } from '../code/TsCode'
import { Workspace } from '../repo/Workspace'

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
