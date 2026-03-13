/* eslint-disable complexity */
/* eslint-disable max-depth */

import { DefaultMap } from 'mnemonist'
import { MonoRepo } from '../MonoRepo'
import type { TsFile } from '../file/TsFile'
import fs from 'fs-extra'
import { getAllWorkspacePackageJsonPaths } from './getAllWorkspacePackageJsonPaths'
import { getRepoPackageJson } from './getRepoPackageJson'
import { resolveModuleImportPath } from '../util/resolveModuleImportPath'
import { toCwdRelative } from '@mono/path'
import upath from 'upath'

/**
 * Recursively retrieves all imports for the given entry points, categorizing them into external, builtin, and internal dependencies.
 *
 * @param entryPoints - An array of entry point file paths to analyze.
 * @returns An object containing the file paths of all imports and categorized dependencies.
 */
export async function getImportsRecursively(entryPoints: string[]): Promise<Result> {
  const entryPointWsDirpaths = new Set(
    entryPoints.map((ep) => {
      return ep.split('/').slice(0, 2).join('/')
    })
  )
  if (entryPointWsDirpaths.size !== 1) {
    throw new Error(`All entry points must be in the same workspace. Got: ${[...entryPointWsDirpaths].join(', ')}`)
  }
  const wsDirpath = Array.from(entryPointWsDirpaths)[0]

  const rootPkg = await getRepoPackageJson()
  const allPkgJsonPaths = await getAllWorkspacePackageJsonPaths()
  const allPkgJsons = allPkgJsonPaths.map((p) => {
    return fs.readJsonSync(p)
  })

  const files = new Map<string, TsFile>()
  const repo = new MonoRepo()
  repo.workspaces.forEach((ws) => {
    ws.tsFiles.forEach((ts) => {
      if (ts.isSourceFile) {
        const filepath = toCwdRelative(ts.path)

        files.set(filepath, ts)
      }
    })
  })

  const wsFilenames = new DefaultMap(() => {
    return new DefaultMap<string, Set<string>>(() => {
      return new Set<string>()
    })
  })

  Array.from(files.keys()).forEach((filepath) => {
    return wsFilenames
      .get(filepath.split('/').slice(0, 2).join('/'))
      .get(upath.basename(filepath).replace(/\.ts$/, ''))
      .add(filepath)
  })

  const seen = new Set<string>()

  const externalsLocal = new Set<string>()
  const builtinsLocal = new Set<string>()
  const internalsLocal = new Set<string>()

  const externalsRecursive = new Set<string>()
  const builtinsRecursive = new Set<string>()
  const internalsRecursive = new Set<string>()

  const sort = (s: Set<string>) => {
    return Array.from(s).sort()
  }

  function recurse(curFilepath: string, wsDirpath: string) {
    if (seen.has(curFilepath)) {
      seen.add(`[CIRCULAR]: ${curFilepath}`)
      return
    }
    seen.add(curFilepath)

    const filepathWsDirpath = curFilepath.split('/').slice(0, 2).join('/')
    const isLocalWorkspace = filepathWsDirpath === wsDirpath

    const externals = isLocalWorkspace ? externalsLocal : externalsRecursive
    const builtins = isLocalWorkspace ? builtinsLocal : builtinsRecursive
    const internals = isLocalWorkspace ? internalsLocal : internalsRecursive

    const entryPointFile = files.get(curFilepath)
    if (!entryPointFile) {
      return
    }
    const wsName = entryPointFile.parent.name
    internals.add(wsName)

    for (const i of entryPointFile.tsCode.imports) {
      if (i.module.isBuiltin) {
        builtins.add(i.module.from)
        continue
      }

      const moduleFrom = i.module.from.startsWith('.')
        ? i.module.from
        : i.module.from
            .split('/')
            .slice(0, i.module.from.startsWith('@') ? 2 : 1)
            .join('/')

      const resolvedModule = resolveModuleImportPath(i.parent.parent.path, moduleFrom)

      const resolvedFilepath = resolvedModule?.resolvedFileName

      if (resolvedFilepath) {
        if (i.module.isRelative) {
          recurse(resolvedFilepath, wsDirpath)
        } else if (i.module.isRepoScoped && resolvedFilepath.endsWith('src/index.ts')) {
          internals.add(moduleFrom)
          const resolvedWsDirpath = resolvedFilepath.split('/').slice(0, 2).join('/')
          const map = wsFilenames.get(resolvedWsDirpath)
          for (const name of i.specifiers?.importedNamesArray || []) {
            if (map.has(name)) {
              const filepaths = map.get(name)!
              for (const filepath of filepaths) {
                const lines = fs.readFileSync(filepath, 'utf-8').split('\n')
                for (const line of lines) {
                  if (line.startsWith('export ') && line.includes(` ${name}`)) {
                    recurse(filepath, wsDirpath)
                  }
                }
              }
            }
          }
        } else {
          const depName = moduleFrom
          const pkgName = resolvedModule?.packageId?.name
          let version = resolvedModule?.packageId?.version || ''
          version = version ? `^${version}` : ''
          externals.add(`"${pkgName}": "${version}",`)
          if (depName !== pkgName) {
            const found = allPkgJsons.find((p) => {
              return p.dependencies?.[depName] || p.devDependencies?.[depName]
            })
            const depVersion =
              rootPkg.dependencies?.[depName] ||
              rootPkg.devDependencies?.[depName] ||
              found?.dependencies?.[depName] ||
              found?.devDependencies?.[depName]
            if (depVersion) {
              externals.add(`"${depName}": "${depVersion}",`)
            } else {
              throw new Error(`Could not find version for dependency "${depName}" imported in ${curFilepath}`)
            }
          }
        }
      } else {
        throw new Error(`Could not resolve import "${moduleFrom}" in ${curFilepath}`)
      }
    }

    if (isLocalWorkspace) {
      internals.delete(wsName)
    }
  }

  for (const entryPoint of entryPoints) {
    if (upath.basename(entryPoint) !== 'index.ts') {
      recurse(toCwdRelative(entryPoint), wsDirpath)
      continue
    }

    const code = await fs.readFile(entryPoint, 'utf8')
    const lines = code.split('\n').filter((line) => {
      return line.startsWith('export * from ')
    })
    for (const line of lines) {
      const moduleFrom = line
        .split('export * from ')[1]!
        .slice(1)
        .replaceAll(/["';]+$/g, '')
      const resolvedModule = resolveModuleImportPath(entryPoint, moduleFrom)
      const resolvedFilepath = resolvedModule?.resolvedFileName
      if (!resolvedFilepath) {
        throw new Error(`Could not resolve export "${moduleFrom}" in ${entryPoint}`)
      }
      recurse(toCwdRelative(resolvedFilepath), wsDirpath)
    }
  }

  externalsLocal.forEach((v) => {
    return externalsRecursive.add(v)
  })
  builtinsLocal.forEach((v) => {
    return builtinsRecursive.add(v)
  })
  internalsLocal.forEach((v) => {
    return internalsRecursive.add(v)
  })

  const result: Result = {
    filepaths: Array.from(seen),
    recursive: {
      external: sort(externalsRecursive),
      builtin: sort(builtinsRecursive),
      internal: sort(internalsRecursive),
    },
    local: { external: sort(externalsLocal), builtin: sort(builtinsLocal), internal: sort(internalsLocal) },
  }

  return result
}

type Result = {
  /**
   * All file paths of the imports found recursively, in discovery order, starting from the entry points, including circular reference stops.
   */
  filepaths: string[]
  /**
   * All workspace imports found recursively. Includes all `local` imports plus for any other worksapce imports discovered.
   */
  recursive: {
    /** External dependencies */
    external: string[]
    /** Built-in node dependencies */
    builtin: string[]
    /** Other repo workspaces */
    internal: string[]
  }
  /**
   * Only workspace imports found in the same workspace as the entry points.
   */
  local: {
    /** External dependencies */
    external: string[]
    /** Built-in node dependencies */
    builtin: string[]
    /** Other repo workspaces */
    internal: string[]
  }
}
