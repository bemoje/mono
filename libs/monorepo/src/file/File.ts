import fs from 'fs'
import path from '@mono/path'
import { AbstractBase } from '../common/AbstractBase'
import { Inspector, Parenting } from '@mono/composition'
import { lazyProp } from '@mono/decorators'
import type { Stats } from 'fs'
import { Workspace } from '../repo/Workspace'

@Parenting.compose
export class File<P extends Workspace = Workspace> extends AbstractBase<P> {
  static readonly inspector = Inspector.compose(File, {
    keys: ['relative'],
  })

  readonly path: string

  constructor(parent: P, filepath: string) {
    super(parent)
    this.path = path.normalize(filepath)
  }

  @lazyProp(1000)
  get stats(): Stats {
    const stats = Reflect.get(this, 'stats')
    if (stats) return stats
    return fs.statSync(this.path)
  }

  get isTs() {
    return path.hasExtname(this.path, ['ts', 'mts', 'tsx'])
  }
  get isDotTs() {
    return path.hasExtname(this.path, 'ts')
  }
  get isDotTsx() {
    return path.hasExtname(this.path, 'tsx')
  }
  get isExample() {
    return path.hasExtnamePrefix(this.path, path.SemanticExtnamePrefix.examples)
  }
  get isDeclaration() {
    return path.hasExtnamePrefix(this.path, path.SemanticExtnamePrefix.d)
  }
  get isTest() {
    return path.hasExtnamePrefix(this.path, [path.SemanticExtnamePrefix.test, path.SemanticExtnamePrefix.spec])
  }
  get isIndexFile() {
    return path.parse(this.path).name === 'index'
  }

  get isSourceFile() {
    return path.hasParentDirname(this.path, 'src') && !path.hasExtnamePrefix(this.path)
  }

  /**
   * Read the file contents.
   */
  protected readFile() {
    if (!fs.existsSync(this.path)) {
      throw new Error(`File not found: ${this.path}`)
    }
    return fs.readFileSync(this.path, 'utf8')
  }
}
