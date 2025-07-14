import { Inspector, Parenting } from '@mono/composition'
import { lazyProp } from '@mono/decorators'
import { TsCode } from '../code/TsCode'
import { TsFile } from './TsFile'
import { Workspace } from '../repo/Workspace'

/**
 * Represents a test file in the monorepo with TypeScript code analysis capabilities.
 */
@Parenting.compose
export class TestFile<P extends Workspace = Workspace> extends TsFile<P> {
  static readonly inspector = Inspector.compose(TsFile, {})

  @lazyProp(5000)
  get tsCode(): TsCode {
    return new TsCode(this, this.readFile())
  }

  get dependencies() {
    return this.tsCode.dependencies
  }
}
