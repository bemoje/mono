import fs from 'fs-extra'
import upath from 'path'
import { addDefaultsOptions, DefaultOptions } from '../common/addDefaultsOptions'
import { cliExecSync } from '../common/cliExec'
import { Command } from 'commander'
import { repoRootPackageJsonPath, tsconfigBasePathsJsonPath } from '../../core/constants/paths'
import { templates } from '../../core/templates/templates'

/**
 * Command for @see action
 */
export function createLib() {
  const cmd = new Command('create')
  cmd.description('Create a new library in the libs folder.')
  cmd.argument('<workspaceName>', 'The name of the library to create.')

  addDefaultsOptions(cmd)
  cmd.action(action)
  return cmd
}

/**
 * Create a new library in the libs folder.
 *
 * @param workspaceName - The name of the library to create.
 * @param scope - The scope of the library. Defaults to the repo root package.json 'name' property.
 */
function action(workspaceName: string, options: DefaultOptions = {}) {
  // lib dirpaths
  const CWD = upath.normalize(process.cwd())
  const rootPath = upath.join(CWD, 'libs', workspaceName)
  const srcPath = upath.join(rootPath, 'src')

  // lib filepaths
  const eslintConfigJsPath = upath.join(rootPath, 'eslint.config.js')
  const packageJsonPath = upath.join(rootPath, 'package.json')
  const esbuildMjsPath = upath.join(rootPath, 'esbuild.mjs')
  const readmeMdPath = upath.join(rootPath, 'README.md')
  const tsconfigJsonPath = upath.join(rootPath, 'tsconfig.json')
  const indexTsPath = upath.join(srcPath, 'index.ts')

  // get scoped library name
  const repoRootPackageJson = fs.readJsonSync(repoRootPackageJsonPath)
  const repoScope = repoRootPackageJson.name
  const libScope = '@' + repoScope
  const scopedLibraryName = libScope + (libScope ? '/' : '') + workspaceName

  // Add path to tsconfig.json
  const tsconfigBasePathsJson = fs.readJsonSync(tsconfigBasePathsJsonPath)
  tsconfigBasePathsJson.compilerOptions.paths[scopedLibraryName] = [`./libs/${workspaceName}/src/index.ts`]
  fs.outputJsonSync(tsconfigBasePathsJsonPath, tsconfigBasePathsJson, { spaces: 2 })

  // Create src folder
  fs.mkdirSync(srcPath, { recursive: true })

  // Create eslint.config.js
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
