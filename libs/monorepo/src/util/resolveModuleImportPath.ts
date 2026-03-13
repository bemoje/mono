import { createCompilerHost } from 'typescript'
import fs from 'fs-extra/esm'
import { getRepoRootDirpath } from './getRepoRootDirpath'
import { resolveModuleName } from 'typescript'
import upath from 'upath'

/**
 * Returns the resolved import path (relative from repo root)
 */
export function resolveModuleImportPath(filepath: string, importFrom: string) {
  const rootdir = getRepoRootDirpath()
  const result = resolveModuleName(
    importFrom,
    filepath,
    {
      paths: fs.readJsonSync(upath.joinSafe(rootdir, 'tsconfig.paths.json')).compilerOptions.paths,
      allowJs: true,
      allowArbitraryExtensions: true,
      allowImportingTsExtensions: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      strict: false,
    },
    createCompilerHost({}, true)
  )
  const f = result.resolvedModule?.resolvedFileName
  if (f) {
    result.resolvedModule.resolvedFileName = upath.relative(rootdir, f)
  }
  return result.resolvedModule
}
