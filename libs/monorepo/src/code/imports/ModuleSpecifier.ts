import { builtinModules } from 'module'
import { CodeBlock } from '../CodeBlock'
import { ImportStatement } from './ImportStatement'
import { Inspector, Parenting } from '@mono/composition'
import { MonoRepo } from '../../repo/MonoRepo'
import { Workspace } from '../../repo/Workspace'

@Parenting.compose
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
    if (!this.isDependency) return undefined
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
    return this.code.startsWith('@' + this.getParentDeep(MonoRepo).name + '/')
  }

  /**
   * Returns whether import is an other, but local workspace in the monorepo.
   */
  get isOtherRepoWorkspace() {
    return this.getParentDeep(MonoRepo)
      .workspaces.map((ws) => ws.name)
      .filter((name) => name !== this.getParentDeep(Workspace).name)
      .some((name) => this.code.includes(name))
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
