import { cliExec } from '../lib/cliExec'
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
export async function createLibsWorkspaceAction(workspaceName: string, options: CreateWorkspaceOptions = {}) {
  // lib dirpaths
  const CWD = upath.normalize(process.cwd())
  const rootPath = upath.join(CWD, 'libs', workspaceName)
  const srcPath = upath.join(rootPath, 'src')

  // lib filepaths
  const tsupConfigMjsPath = upath.join(rootPath, 'tsup.config.mjs')
  const packageJsonPath = upath.join(rootPath, 'package.json')
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

  // Create tsup.config.mjs
  fs.outputFileSync(
    tsupConfigMjsPath, //
    templates.files.tsup.renderString()
  )

  // Create package.json
  fs.outputFileSync(
    packageJsonPath, //
    templates.files.packageJson.renderString({ libraryName: scopedLibraryName })
  )

  // Create README.md
  fs.outputFileSync(
    readmeMdPath, //
    templates.files.readmeMd.renderString({ libraryName: scopedLibraryName })
  )

  // Create tsconfig.json
  fs.outputFileSync(
    tsconfigJsonPath, //
    templates.files.tsconfigJson.renderString()
  )

  // Create index.ts
  fs.outputFileSync(
    indexTsPath, //
    templates.files.indexTs.renderString()
  )

  cliExec(`yarn install`, { ...options, cwd: rootPath })
  cliExec(`yarn install`, { ...options, cwd: CWD })
}
