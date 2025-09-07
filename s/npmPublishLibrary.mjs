/**
 * Publish a library from .dist to npm and update the root package.json with the new version.
 *
 * This script takes one command-line argument:
 * 1. The directory name of the library to publish (e.g., 'cli' for the '@bemoje/cli' package)
 *
 * The script:
 * - Changes the working directory to the repository root
 * - Publishes the specified library from the .dist directory to npm with public access
 * - Reads the published package.json to get the new version
 * - Updates the root package.json dependencies to use the new version of the published library
 * - Formats the updated package.json using Prettier
 */
import { getRepoRootDirpath } from './util/getRepoRootDirpath.mjs'
import { timer } from './util/timer.mjs'
import fs from 'fs-extra'
import { getRepoPackageJson } from './util/getRepoPackageJson.mjs'
import { getRepoPackageJsonPath } from './util/getRepoPackageJsonPath.mjs'
import cp from 'child_process'
import upath from 'upath'
import { setTimeout } from 'timers/promises'

const filename = upath.parse(import.meta.filename).name

// import { Command } from '@bemoje/cli'
// const cli = new Command(filename)
//   .version('1.0.0')
//   .argument('<dirname>', 'workspace dirname in ./libs/<dirname>')
//   .options('-V, --version', 'Display version')
//   .option('-h, --help', 'Display help')

// const parsed = cli.parse(process.argv.slice(2))
// const args = parsed.arguments
// const options = parsed.options

// if (options.help) {
//   console.log(cli.renderHelp())
//   process.exit(0)
// }
// const [wsLibDirName] = args

await timer([filename, 'npm publish library'], async (log) => {
  const [wsLibDirName] = process.argv.slice(2)

  const REPO_ROOT = getRepoRootDirpath()
  const wsDistDirpath = '.dist/libs/' + wsLibDirName
  const wsDistPkgFilepath = wsDistDirpath + '/package.json'

  log.info('getting latest npm published version...')
  const currentVersion = cp.execSync('npm view @bemoje/cli version', { encoding: 'utf8', cwd: REPO_ROOT })
  log.info('->', currentVersion)

  log.info('getting local version...')
  const wsDistPkg = await fs.readJson(wsDistPkgFilepath)
  const wsDistPkgVersion = wsDistPkg.version
  log.info('->', wsDistPkgVersion)

  if (wsDistPkgVersion === currentVersion) {
    return log.warn('local version is unchanged, skipping publish and exiting...')
  }

  log.info('publishing to npm...')
  cp.execSync('npm publish --access public', { stdio: 'inherit', cwd: wsDistDirpath })

  log.info('updating repo package.json dependencies with new version...')
  const repoPkg = await getRepoPackageJson()
  repoPkg.dependencies[wsDistPkg.name] = `^${wsDistPkgVersion}`
  await fs.outputJson(getRepoPackageJsonPath(), repoPkg, { spaces: 2 })

  log.info('formating package.json...')
  cp.execSync('yarn prettier -w package.json', { stdio: 'inherit', cwd: REPO_ROOT })

  try {
    log.info('waiting 15 seconds...')
    await setTimeout(15000)

    log.info('yarn install...')
    cp.execSync('yarn install', { stdio: 'inherit', cwd: REPO_ROOT })
  } catch (error) {
    log.info('waiting 15 seconds...')
    await setTimeout(15000)

    log.info('yarn install (retry)...')
    cp.execSync('yarn install', { stdio: 'inherit', cwd: REPO_ROOT })
  }
})
