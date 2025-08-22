import fs from 'fs'
import path from '@mono/path'
import { AbstractBase } from '../common/AbstractBase'
import { Inspector, Parenting } from '@mono/composition'
import { lazyProp } from '@mono/decorators'
import type { Stats } from 'fs'
import { Workspace } from '../repo/Workspace'
import { hasExtnamePrefix } from '../util/hasExtnamePrefix'
import { SemanticExtnamePrefix } from '../util/SemanticExtnamePrefix'

@Parenting.compose
/**
 * Represents a file in a workspace with various utility methods to check file types and read contents.
 *
 * @template P - The type of parent workspace this file belongs to, extends Workspace by default
 */
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
    return hasExtnamePrefix(this.path, SemanticExtnamePrefix.examples)
  }
  get isDeclaration() {
    return hasExtnamePrefix(this.path, SemanticExtnamePrefix.d)
  }
  get isTest() {
    return hasExtnamePrefix(this.path, SemanticExtnamePrefix.test)
  }
  get isIndexFile() {
    return path.parse(this.path).name === 'index'
  }

  get isSourceFile() {
    return path.hasParentDirname(this.path, 'src') && !hasExtnamePrefix(this.path)
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
