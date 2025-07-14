import { Results } from 'depcheck'
import { exec } from 'child_process'
import { promisify } from 'util'
import { readJsonSync } from 'fs-extra/esm'
import path from 'upath'
import { AbstractBase } from '../common/AbstractBase'
import { difference, union } from 'lodash-es'
import { Inspector, Parenting } from '@mono/composition'
import { lazyProp } from '@mono/decorators'
import { MonoRepo } from './MonoRepo'
import { PackageJson } from '@mono/types'
import { removeDuplicates } from '@mono/array'
import { TestFile } from '../file/TestFile'
import { TsFile } from '../file/TsFile'
import { walkDirectory } from '@mono/fs'
import commandExists from 'command-exists'
import { resolveModuleImportPath } from '../util/resolveModuleImportPath'
import { hasExtnamePrefix, hasParentDirname, SemanticExtnamePrefix } from '@mono/path'

@Parenting.compose
export class Workspace<P extends MonoRepo = MonoRepo> extends AbstractBase<P> {
  static readonly inspector = Inspector.compose(Workspace, {
    keys: ['name', 'tsFiles', 'testFiles'],
  })

  /**
   * The workspace's origin directory name, eg. 'libs', 'apps', etc.
   */
  readonly origin: string

  /**
   * The workspace's root directory path.
   */
  readonly path: string

  constructor(parent: P, dirpath: string) {
    super(parent)
    this.path = path.normalize(dirpath)
    this.origin = path.basename(path.dirname(this.path))
  }

  /**
   * The workspace's package.json filepath.
   */
  get packageJsonPath() {
    return path.join(this.path, 'package.json')
  }

  /**
   * The workspace's package.json file as an object.
   */
  @lazyProp(1000)
  get packageJson(): PackageJson {
    return readJsonSync(this.packageJsonPath)
  }

  /**
   * The workspace's name from the package.json file.
   */
  get name(): string {
    if (!this.packageJson.name) {
      throw new Error(`Workspace package.json missing 'name' field: ${this.packageJsonPath}`)
    }
    return this.packageJson.name
  }

  /**
   * Reads the workspace's package.json file and returns the 'dependencies' field as a sorted array of strings.
   */
  get installedDependencies(): string[] {
    const deps = this.packageJson.dependencies ?? {}
    return Object.keys(deps).sort()
  }

  /**
   * Reads the workspace's package.json file and returns the 'devDependencies' field as a sorted array of strings.
   */
  get installedDevDependencies(): string[] {
    const deps = this.packageJson.devDependencies ?? {}
    return Object.keys(deps).sort()
  }

  /**
   * Get the source files in the workspace's 'src' directory.
   * Test files are not included.
   */
  @lazyProp(5000)
  get tsFiles(): TsFile[] {
    return walkDirectory(this.path, {
      stats: true,
      only: 'files',
      filter: (_dirpath, basename) => {
        if (basename === 'node_modules') return false
        if (basename === 'coverage') return false
        if (basename.startsWith('.')) return false
        return true
      },
    })
      .filter(([fspath]) => {
        return hasParentDirname(fspath, 'src') && !hasExtnamePrefix(fspath)
      })
      .map(([fspath]) => {
        return new TsFile(this, fspath)
      })
  }

  /**
   * Get the test files in the workspace's 'src' directory.
   */
  @lazyProp(5000)
  get testFiles(): TsFile[] {
    return walkDirectory(this.path, {
      stats: true,
      only: 'files',
      filter: (_dirpath, basename) => {
        if (basename === 'node_modules') return false
        if (basename === 'coverage') return false
        if (basename.startsWith('.')) return false
        return true
      },
    })
      .filter(([fspath]) => {
        return (
          hasParentDirname(fspath, 'src') &&
          !hasExtnamePrefix(fspath, [SemanticExtnamePrefix.spec, SemanticExtnamePrefix.test])
        )
      })
      .map(([fspath]) => {
        return new TestFile(this, fspath)
      })
  }

  get files(): (TsFile | TestFile)[] {
    return [...this.tsFiles, ...this.testFiles]
  }

  /**
   * Get imported non-relative dependencies for each source file in the workspace, grouped by file.
   */
  @lazyProp(1000)
  get importedDependenciesByFile(): Map<string, string[]> {
    return new Map(
      this.tsFiles.map((file) => {
        return [path.relative(process.cwd(), file.path), file.dependencies]
      }),
    )
  }

  /**
   * Get imported non-relative dependencies for each test file in the workspace, grouped by file.
   */
  @lazyProp(1000)
  get importedTestDependenciesByFile(): Map<string, string[]> {
    return new Map(
      this.testFiles.map((file) => {
        return [path.relative(process.cwd(), file.path), file.dependencies]
      }),
    )
  }

  /**
   * Get imported non-relative dependencies for each source file in the workspace in a flat array.
   */
  get importedDependencies(): string[] {
    return removeDuplicates(Array.from(this.importedDependenciesByFile.values()).flat())
  }

  /**
   * Get imported non-relative dependencies for each test file in the workspace in a flat array.
   */
  get importedTestDependencies(): string[] {
    return removeDuplicates(Array.from(this.importedTestDependenciesByFile.values()).flat())
  }

  /**
   * Get dependencies that are imported but not listed in the workspace's package.json under 'dependencies'.
   */
  get missingDependencies(): string[] {
    return difference(this.importedDependencies, this.installedDependencies)
      .filter((dep) => !this.parent.packageJson.dependencies?.[dep])
      .filter((dep) => !this.parent.tsconfigBasePaths?.[dep])
  }

  /**
   * Get dependencies that are imported but not listed in the workspace's package.json under 'devDependencies'.
   */
  get missingDevDependencies(): string[] {
    return difference(
      this.importedTestDependencies,
      union(this.installedDependencies, this.installedDevDependencies),
    )
      .filter((dep) => !this.parent.packageJson.devDependencies?.[dep])
      .filter((dep) => !this.parent.packageJson.dependencies?.[dep])
      .filter((dep) => !this.parent.tsconfigBasePaths?.[dep])
  }

  /**
   * Get dependencies that are listed in the workspace's package.json but not imported in any source file (excl. test files).
   */
  get unusedDependencies(): string[] {
    return difference(this.installedDependencies, this.importedDependencies)
  }

  /**
   *
   */
  get incorrectlyImportedRepoWorkspaces(): IncorrectlyImportedRepoWorkspace[] {
    const results: IncorrectlyImportedRepoWorkspace[] = []

    for (const file of this.files) {
      for (const imp of file.tsCode.imports) {
        if (imp.module.from === this.name) {
          const resolvedFileName = resolveModuleImportPath(file.path, imp.module.from)?.resolvedFileName
          if (resolvedFileName) {
            results.push({
              filepath: file.path,
              replaceValue: imp.module.from,
              withValue: resolvedFileName.endsWith('index.ts')
                ? './' + imp.specifiers?.importedNamesArray[0]
                : './' + path.relative(path.dirname(file.path), resolvedFileName),
            })
          }
        }
      }
    }
    return results
  }

  /**
   * Returns an object with found dependency problems for the workspace or undefined if no problems were found.
   * @see WorkspaceDependencyProblems
   */
  get dependencyProblems(): WorkspaceDependencyProblems | undefined {
    const result = {
      origin: this.origin,
      workspace: this.name,
      unused: this.unusedDependencies,
      missing: this.missingDependencies,
      missingDev: this.missingDevDependencies,
      imports: this.incorrectlyImportedRepoWorkspaces,
    }
    if (!result.unused.length && !result.missing.length && !result.missingDev.length) {
      return undefined
    }
    for (const [key, value] of Object.entries(result)) {
      if (!value.length) {
        delete result[key as keyof WorkspaceDependencyProblems]
      }
    }
    return result as WorkspaceDependencyProblems
  }

  async depcheck() {
    try {
      if (!(await commandExists('depcheck'))) {
        throw new Error('"depcheck" optional dependency not installed.')
      }
      const rootPkg = this.parent.packageJson
      const dependencies = rootPkg.dependencies || {}
      const devDependencies = rootPkg.devDependencies || {}
      const ignores = Object.keys({ ...devDependencies, ...dependencies }).concat('@mono/*')
      const ignoresFlag = '--ignores "' + ignores.join(',') + '"'
      const cmd = `yarn depcheck ${this.path} ${ignoresFlag} --json`
      const execPromise = promisify(exec)
      const res = await execPromise(cmd)

      return JSON.parse(res.stdout.toString()) as Results
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = error! as any
      if (res.stdout) {
        return JSON.parse(res.stdout.toString()) as Results
      }

      console.error(error)
      return {
        dependencies: [],
        devDependencies: [],
        using: {},
        missing: {},
        invalidFiles: {},
        invalidDirs: {},
      } as Results
    }
  }

  /**
   * Returns the workspace's cwd-relative path.
   */
  toString(): string {
    return path.relative(process.cwd(), this.path)
  }
}

export interface WorkspaceDependencyProblems {
  origin: string
  workspace: string
  unused?: string[]
  missing?: string[]
  missingDev?: string[]
  imports?: IncorrectlyImportedRepoWorkspace[]
}

export interface IncorrectlyImportedRepoWorkspace {
  filepath: string
  replaceValue: string
  withValue: string
}
