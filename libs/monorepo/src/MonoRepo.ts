import { AbstractBase } from './common/AbstractBase'
import type { CompilerOptions } from 'typescript'
import { Inspector } from '@mono/composition'
import type { PackageJson } from '@mono/types'
import { Parenting } from '@mono/composition'
import type { SetFieldType } from 'type-fest'
import type { TsConfigJson } from 'type-fest'
import { Workspace } from './repo/Workspace'
import fs from 'node:fs'
import { getRepoRootDirpath } from './util/getRepoRootDirpath'
import { lazyProp } from '@mono/decorators'
import path from 'upath'
import { readJsonSync } from 'fs-extra/esm'

/**
 * Represents a monorepo with workspace management, TypeScript configuration, and dependency analysis capabilities.
 */
@Parenting.compose
export class MonoRepo<P extends null = null> extends AbstractBase<P> {
  static readonly inspector = Inspector.compose(MonoRepo, { keys: ['name', 'workspaces'] })
  static instances = new Map<string, MonoRepo>()

  readonly path!: string

  constructor() {
    const oPath = getRepoRootDirpath()
    if (MonoRepo.instances.has(oPath)) {
      return MonoRepo.instances.get(oPath) as MonoRepo<P>
    }
    super(null as P)
    this.path = oPath
    MonoRepo.instances.set(this.path, this)
  }

  get monoRepo(): MonoRepo {
    return this
  }

  get packageJsonPath(): string {
    return path.join(this.path, 'package.json')
  }

  get tsconfigBaseJsonPath(): string {
    return path.join(this.path, 'tsconfig.json')
  }

  @lazyProp(5000)
  get tsconfigBase() {
    const o = readJsonSync(this.tsconfigBaseJsonPath) as TsConfigJson
    if (!o.compilerOptions) {
      o.compilerOptions = {}
    }
    o.compilerOptions.paths = o.compilerOptions.paths || this.tsconfigBasePaths

    return o as SetFieldType<
      TsConfigJson,
      'compilerOptions',
      TsConfigJson['compilerOptions'] & { paths: CompilerOptions['paths'] }
    >
  }

  get tsconfigBasePathsJsonPath(): string {
    return path.join(this.path, 'tsconfig.paths.json')
  }

  @lazyProp(5000)
  get tsconfigBasePaths(): Record<string, string[]> {
    if (!fs.existsSync(this.tsconfigBasePathsJsonPath)) {
      return {}
    }
    return readJsonSync(this.tsconfigBasePathsJsonPath).compilerOptions?.paths ?? {}
  }

  @lazyProp(5000)
  get packageJson(): PackageJson {
    return readJsonSync(this.packageJsonPath)
  }

  get name(): string {
    if (!this.packageJson.name) {
      throw new Error(`MonoRepo package.json missing 'name' field: ${this.packageJsonPath}`)
    }
    return this.packageJson.name
  }

  get workspacesRootPaths(): string[] {
    if (!this.packageJson.workspaces) {
      throw new Error(`MonoRepo package.json missing 'workspaces' field: ${this.packageJsonPath}`)
    }
    return this.packageJson.workspaces.map((workspacePath: string) => {
      return path.join(this.path, workspacePath.replace(/\*$/, ''))
    })
  }

  @lazyProp(5000)
  get workspacePaths() {
    return this.workspacesRootPaths
      .flatMap((workspacePath: string) => {
        return fs
          .readdirSync(workspacePath, { withFileTypes: true })
          .filter((dirent: fs.Dirent) => {
            return dirent.isDirectory()
          })
          .map((dirent: fs.Dirent) => {
            return path.join(workspacePath, dirent.name)
          })
      })
  }

  @lazyProp
  get workspaces(): Workspace[] {
    return this.workspacePaths.map((dirpath) => {
      return new Workspace(this, dirpath)
    })
  }
}
