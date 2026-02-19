import { Command } from 'commander'
import fs from 'fs-extra'
import cp from 'node:child_process'
import { setTimeout } from 'timers/promises'
import { timer } from '@mono/node'
import { getRepoRootDirpath } from '../../lib/getRepoRootDirpath'
import { getRepoPackageJson, getRepoPackageJsonPath } from '../../lib/getRepoPackageJson'

export function publishCommands() {
  return new Command('publish').alias('p').description('Publish a library to npm.').addCommand(publishLib())
}

function publishLib() {
  return new Command('lib')
    .description('Publish a library from .dist to npm and update root package.json.')
    .argument('<dirname>', 'Directory name of the library under libs/')
    .action(async (wsLibDirName: string) => {
      await timer(['publish', 'npm publish library'], async (log) => {
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
          log.warn('local version is unchanged, skipping publish and exiting...')
          return
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
        } catch {
          log.info('waiting 15 seconds...')
          await setTimeout(15000)

          log.info('yarn install (retry)...')
          cp.execSync('yarn install', { stdio: 'inherit', cwd: REPO_ROOT })
        }
      })
    })
}
