import { cliExecSync } from '../lib/cliExec'
import fs from 'fs-extra'
import { repoRootPackageJsonPath } from '../core/constants/paths'
import { templates } from '../core/templates/templates'
import { tsconfigBasePathsJsonPath } from '../core/constants/paths'
import upath from 'upath'

export interface CreateWorkspaceOptions {
  yes?: boolean
  dryRun?: boolean
  quiet?: boolean
  silent?: boolean
  debug?: boolean
}

/**
 * Create a new library in the libs folder.
 *
 * @param workspaceName - The name of the library to create.
 */
export function createLibsWorkspaceAction(workspaceName: string, options: CreateWorkspaceOptions = {}) {
  // lib dirpaths
  const CWD = upath.normalize(process.cwd())
  const rootPath = upath.join(CWD, 'libs', workspaceName)
  const srcPath = upath.join(rootPath, 'src')

  // lib filepaths
  const eslintConfigJsPath = upath.join(rootPath, 'eslint.config.mjs')
  const packageJsonPath = upath.join(rootPath, 'package.json')
  const esbuildMjsPath = upath.join(rootPath, 'esbuild.mjs')
  const readmeMdPath = upath.join(rootPath, 'README.md')
  const tsconfigJsonPath = upath.join(rootPath, 'tsconfig.json')
  const indexTsPath = upath.join(srcPath, 'index.ts')

  // get scoped library name
  const repoRootPackageJson = fs.readJsonSync(repoRootPackageJsonPath)
  const repoScope = repoRootPackageJson.name
  const scopedLibraryName = `@${repoScope}/${workspaceName}`

  // Add path to tsconfig.json
  const tsconfigBasePathsJson = fs.readJsonSync(tsconfigBasePathsJsonPath)
  tsconfigBasePathsJson.compilerOptions.paths[scopedLibraryName] = [`./libs/${workspaceName}/src/index.ts`]
  fs.outputJsonSync(tsconfigBasePathsJsonPath, tsconfigBasePathsJson, { spaces: 2 })

  // Create src folder
  fs.mkdirSync(srcPath, { recursive: true })

  // Create eslint.config.mjs
  fs.outputFileSync(
    eslintConfigJsPath, //
    templates.files.eslintConfigJs.renderString(),
  )

  // Create package.json
  fs.outputFileSync(
    packageJsonPath, //
    templates.files.packageJson.renderString({ libraryName: scopedLibraryName }),
  )

  // Create esbuild.mjs
  fs.outputFileSync(
    esbuildMjsPath, //
    templates.files.esbuild.renderString({}),
  )

  // Create README.md
  fs.outputFileSync(
    readmeMdPath, //
    templates.files.readmeMd.renderString({ libraryName: scopedLibraryName }),
  )

  // Create tsconfig.json
  fs.outputFileSync(
    tsconfigJsonPath, //
    templates.files.tsconfigJson.renderString(),
  )

  // Create index.ts
  fs.outputFileSync(
    indexTsPath, //
    templates.files.indexTs.renderString(),
  )

  cliExecSync(`yarn install`, { ...options, cwd: rootPath })
  cliExecSync(`yarn install`, { ...options, cwd: CWD })
}
