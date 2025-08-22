import { getRepoRootDirpath } from '@mono/monorepo'
import upath from 'upath'

// repo dirpaths
export const repoRootPath = getRepoRootDirpath()

// repo basenames
export const repoRootPackageJsonBasename = 'package.json'
export const tsconfigBaseJsonBasename = 'tsconfig.json'
export const tsconfigBasePathsJsonBasename = 'tsconfig.paths.json'

// repo filepaths
export const repoRootPackageJsonPath = upath.join(repoRootPath, repoRootPackageJsonBasename)
export const tsconfigBaseJsonPath = upath.join(repoRootPath, tsconfigBaseJsonBasename)
export const tsconfigBasePathsJsonPath = upath.join(repoRootPath, tsconfigBasePathsJsonBasename)
