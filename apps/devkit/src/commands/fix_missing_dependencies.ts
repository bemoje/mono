/* eslint-disable complexity */
/* eslint-disable max-depth */
import type { Logger } from '@mono/node'
import { confirmPrompt } from '../lib/confirmPrompt'
import cp from 'child_process'
import fs from 'fs-extra'
import { getImportsRecursively } from '@mono/monorepo'

/**
 * Checks for missing dependencies in the workspace and suggests commands to add them.
 * It scans the 'libs' and 'apps' directories for entry points (main.ts or index.ts) and analyzes their imports.
 * If it finds any missing dependencies that are not listed in package.json, it prompts the user to run the suggested commands to add them.
 */
export async function fixMissingDependencies(opts: { yes?: boolean }, { logger }: { logger: Logger }) {
  // const target = new Map<string, Map<string, Array<string>>>()

  const commands = [] as string[]
  const addCommand = (cmd: string) => {
    logger.log(cmd)
    commands.push(cmd)
  }

  const dirs = ['libs', 'apps']

  for (const dir of dirs) {
    const basename = dir === 'apps' ? 'main.ts' : 'index.ts'

    for (const ws of fs.readdirSync(dir)) {
      if (ws === 'playground') {
        continue
      }

      const entryPoint = `${dir}/${ws}/src/${basename}`

      const imports = await getImportsRecursively([entryPoint])
      // const usesBuiltin = imports.recursive.builtin.length > 0
      const external =
        imports.local.external?.length ? JSON.parse(`{${imports.local.external.join('').slice(0, -1)}}`) : {}
      const internal = imports.local.internal ?? []

      const pkg = fs.readJsonSync(`${dir}/${ws}/package.json`)

      for (let dep of internal) {
        dep = dep.split('/').slice(0, 2).join('/')
        if (!pkg.dependencies?.[dep] && !pkg.devDependencies?.[dep]) {
          addCommand(`yarn workspace ${pkg.name} add ${dep} -D`)
        }
      }

      for (const dep of Object.keys(external)) {
        if (!pkg.dependencies?.[dep] && !pkg.devDependencies?.[dep]) {
          if (dep.startsWith('@types/') || dep === 'type-fest') {
            addCommand(`yarn workspace ${pkg.name} add ${dep}@${external[dep]} -D`)
          } else {
            addCommand(`yarn workspace ${pkg.name} add ${dep}@${external[dep]}`)
          }
        }
      }
    }

    if (opts.yes || (await confirmPrompt('Run the above commands to fix missing dependencies?'))) {
      for (const cmd of commands) {
        cp.execSync(cmd, { stdio: 'inherit' })
      }
    }
  }
}
