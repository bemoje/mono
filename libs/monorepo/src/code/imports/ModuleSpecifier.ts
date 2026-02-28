import { CodeBlock } from '../CodeBlock'
import { ImportStatement } from './ImportStatement'
import { Inspector } from '@mono/composition'
import { MonoRepo } from '../../MonoRepo'
import { Parenting } from '@mono/composition'
import { Workspace } from '../../repo/Workspace'
import { builtinModules } from 'module'

@Parenting.compose
/**
 * Represents a module specifier in an import statement.
 * Module specifiers are the strings that indicate where to import from, such as './path/to/file', '@scope/package', etc.
 *
 * @template P - The type of the parent import statement, defaults to ImportStatement
 */
export class ModuleSpecifier<P extends ImportStatement = ImportStatement> extends CodeBlock<P> {
  static readonly inspector = Inspector.compose(ModuleSpecifier, {
    keys: ['from'],
  })

  /**
   * Alias for the `code` property.
   */
  get from() {
    return this.code
  }

  get dependency(): string | undefined {
    if (!this.isDependency) {
      return undefined
    }
    return this.code
      .split('/')
      .slice(0, this.isScoped ? 2 : 1)
      .join('/')
  }

  get isBuiltin() {
    return builtinModules.includes(this.code.replace(/^node:/i, ''))
  }

  get isScoped() {
    return this.code.startsWith('@')
  }

  get isRepoScoped() {
    return this.code.startsWith(`@${this.getParentDeep(MonoRepo).name}/`)
  }

  /**
   * Returns whether import is an other, but local workspace in the monorepo.
   */
  get isOtherRepoWorkspace() {
    return this.getParentDeep(MonoRepo)
      .workspaces.map((ws) => {
        return ws.name
      })
      .filter((name) => {
        return name !== this.getParentDeep(Workspace).name
      })
      .some((name) => {
        return this.code.includes(name)
      })
  }

  get isRelative() {
    return this.code.startsWith('.')
  }

  get isFromRepoRoot() {
    return this.code.startsWith('/')
  }

  get isExternal() {
    return !this.isBuiltin && !this.isRepoScoped && !this.isRelative
  }

  get isDependency() {
    return this.isExternal || this.isRepoScoped
  }
}
